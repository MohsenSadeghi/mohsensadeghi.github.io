// Plot Manager for In-Browser Molecular Dynamics (IBMD)
//
// Copyright (c) 2015 Mohsen Sadeghi (MohsenSadeghi@alum.sharif.edu)
//
// This file is part of the In-Browser Molecular Dynamics (IBMD)
// web application.
//
// IBMD is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// IBMD is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with IBMD.  If not, see <http://www.gnu.org/licenses/>.

var Plot_Manager =
	{
		Plot_Types :
		[
			'RDF',
			'Speed_Distribution',
			'Volume',
			'Temperature',
			'Kin_Energy',
			'Pot_Energy',
			'Internal_Energy',
			'Pressure',
			'Enthalpy'
		],

		Plot_Types_Label :
		[
			'Radial Distribution Function',
			'Speed Distribution',
			'Volume',
			'Temperature',
			'Kinetic Energy',
			'Potential Energy',
			'Internal Energy',
			'Pressure',
			'Enthalpy'
		],		

		Available_Plots : {},
		
		Default_Plot : 'Radial Distribution Function',
		
		Busy : false,

		Canvas_Handle : {},
		Canvas_Context : {},
		Canvas_Height : 0,
		Canvas_Width : 0,
		
		Current_Plot:
			{
				Type_Ind : 0,
				Update_Function : function () {},
				N_Points : 0,
				Max_N_Points : 100,
				X_Value : [],
				Y_Value : [],
				Min_X : 0.0,
				Min_Y : 0.0,
				Max_X : 1.0,
				Max_Y : 1.0,
				Label_X : '',
				Label_Y : '',
				Precision_X : 1,
				Precision_Y : 1,
				Line_Color : '#AA0000'
			}
	};

Plot_Manager.Init = function (Canvas_Element_Id)
{
	this.Canvas_Handle = document.getElementById(Canvas_Element_Id);
	this.Canvas_Context = this.Canvas_Handle.getContext('2d');
	
	var i = 0;
	
	for (i = 0; i < this.Plot_Types.length; i ++)
	{
		this.Available_Plots[this.Plot_Types[i]] = false;
	}
	
};

Plot_Manager.Lock = function ()
{
	Plot_Manager.Busy = true;
};

Plot_Manager.Unlock = function ()
{
	Plot_Manager.Busy = false;
};

Plot_Manager.Position = function (_Canvas_Width, _Canvas_Height, _Canvas_Top, _Canvas_Left)
{
	this.Canvas_Width = _Canvas_Width;
	this.Canvas_Height = _Canvas_Height;
	
	this.Canvas_Handle.width = this.Canvas_Width;
	this.Canvas_Handle.height = this.Canvas_Height;
	
	this.Canvas_Handle.style.position = 'absolute';
	this.Canvas_Handle.style.top = _Canvas_Top + 'px';	
	this.Canvas_Handle.style.left = _Canvas_Left + 'px';	
};

Plot_Manager.BuildPlotSelector = function (Container_Element_Id)
{

	var Container_Handle = document.getElementById(Container_Element_Id);
	
	var Str = '';

	var i = 0;
	
	var Default_Plot_Index = 0;
	var N_Select_Options = 0;
	
	for (i = 0; i < this.Plot_Types.length; i ++)
	{
		if (this.Available_Plots[this.Plot_Types[i]])
		{
			Str += '<option class = "SelectBoxOption">';
			Str += this.Plot_Types_Label[i];
			Str += '</option>';
			
			if (this.Plot_Types_Label[i] == this.Default_Plot)
			{
				Default_Plot_Index = N_Select_Options;
			}
			
			N_Select_Options ++;
		}
	}

	Container_Handle.innerHTML = Str;
	
	Container_Handle.selectedIndex = Default_Plot_Index;

	this.ChangePlotType (this.Default_Plot);
	
	/*
	for (i = 0; i < this.Plot_Types.length; i ++)
	{
		if (this.Available_Plots[this.Plot_Types[i]])
		{
			this.ChangePlotType (this.Plot_Types_Label[i]);
			break;
		}
	}
	*/
};

Plot_Manager.ChangePlotType = function (Plot_Type_Str)
{
	this.Lock();
	
	this.Current_Plot.Type_Ind = this.Plot_Types_Label.indexOf(Plot_Type_Str);
	
	this.Current_Plot.N_Points = 0;
	this.Current_Plot.X_Value = [];
	this.Current_Plot.Y_Value = [];
	
	Plot_Operator.ResetSampling();
	
	// Radial Distribution Function
	if (this.Current_Plot.Type_Ind == 0)
	{
		this.Current_Plot.Max_N_Points = 100;
		this.Current_Plot.Line_Color = '#AA0000';

		
		this.Current_Plot.Update_Function = function (_Sim, _Plot_Manager)
											{
												Plot_Operator.PrepareRDFPlot(_Sim, _Plot_Manager);
											};
	}

	// Speed distribution
	if (this.Current_Plot.Type_Ind == 1)
	{
		this.Current_Plot.Max_N_Points = 100;
		this.Current_Plot.Line_Color = '#AA0000';

		
		this.Current_Plot.Update_Function = function (_Sim, _Plot_Manager)
											{
												Plot_Operator.PrepareSpeedDistPlot(_Sim, _Plot_Manager);
											};
	}

	if (this.Current_Plot.Type_Ind > 1)
	{
		this.Current_Plot.Max_N_Points = 100;
		this.Current_Plot.Line_Color = '#00AA00';

		this.Current_Plot.Update_Function = function (_Sim, _Plot_Manager)
											{
												Plot_Operator.PreparePropertyPlot(_Sim, _Plot_Manager);
											};
	}
	
	this.Unlock();

};

Plot_Manager.Plot = function (Sim)
{
	if (!this.Busy)
	{
	
		this.Lock();
		
		this.Current_Plot.Update_Function(Sim, this);
		
		var px = 0.0, py = 0.0;
		var cx = 0, cy = 0;
		
		var Axis_Padding_1 = 25;
		var Axis_Padding_2 = 20;
		var Plot_Width = this.Canvas_Width - (Axis_Padding_1 + Axis_Padding_2);
		var Plot_Height = this.Canvas_Height - (Axis_Padding_1 + Axis_Padding_2);
		
		
		this.Canvas_Context.fillStyle = '#FAFAFA';
		this.Canvas_Context.fillRect(0, 0, this.Canvas_Width, this.Canvas_Height);

		this.Canvas_Context.strokeStyle = '#000000';
		
		this.Canvas_Context.beginPath();
		
		this.Canvas_Context.lineWidth = 2;
		
		// Draw axes

		this.Canvas_Context.lineWidth = 1;
		
		this.Canvas_Context.moveTo(Axis_Padding_1, this.Canvas_Height - Axis_Padding_1);
		this.Canvas_Context.lineTo(this.Canvas_Width - Axis_Padding_2, this.Canvas_Height - Axis_Padding_1);

		this.Canvas_Context.stroke();

		this.Canvas_Context.beginPath();
		
		this.Canvas_Context.moveTo(Axis_Padding_1, this.Canvas_Height - Axis_Padding_1);
		this.Canvas_Context.lineTo(Axis_Padding_1, Axis_Padding_2);

		this.Canvas_Context.stroke();
		
		// Draw diagram
		this.Canvas_Context.strokeStyle = this.Current_Plot.Line_Color;
		
		/*
		this.Canvas_Context.shadowBlur = 10;
		this.Canvas_Context.shadowColor = '#787878';
		this.Canvas_Context.shadowOffsetX = 1;
		this.Canvas_Context.shadowOffsetY = 1;
		*/
		
		this.Canvas_Context.lineWidth = 2;
		this.Canvas_Context.lineJoin = 'round';

		this.Canvas_Context.beginPath();

		var Range_X = this.Current_Plot.Max_X - this.Current_Plot.Min_X;
		var Range_Y = this.Current_Plot.Max_Y - this.Current_Plot.Min_Y;

		px = (this.Current_Plot.X_Value[0] - this.Current_Plot.Min_X) / Range_X;
		py = (this.Current_Plot.Y_Value[0] - this.Current_Plot.Min_Y) / Range_Y;
		
		cx = px * Plot_Width + Axis_Padding_1;
		cy = this.Canvas_Height - Axis_Padding_1 - py * Plot_Height;

		this.Canvas_Context.moveTo(cx, cy);
		
		for (i = 1; i < this.Current_Plot.N_Points; i ++)
		{
			px = (this.Current_Plot.X_Value[i] - this.Current_Plot.Min_X) / Range_X;
			py = (this.Current_Plot.Y_Value[i] - this.Current_Plot.Min_Y) / Range_Y;
			
			cx = px * Plot_Width + Axis_Padding_1;
			cy = this.Canvas_Height - Axis_Padding_1 - py * Plot_Height;
			
			this.Canvas_Context.lineTo(cx, cy);
		}

		this.Canvas_Context.stroke();
		/*
		this.Canvas_Context.shadowBlur = 0;
		this.Canvas_Context.shadowColor = '';
		this.Canvas_Context.shadowOffsetX = 0;
		this.Canvas_Context.shadowOffsetY = 0;
		*/
		
		// Plot title and spans
		var Label_Font_Size = Math.floor(0.45 * Axis_Padding_1);
		var Number_Font_Size = Math.floor(0.4 * Axis_Padding_1);
		
		this.Canvas_Context.fillStyle = '#787878';

		this.Canvas_Context.textAlign = 'end';
		this.Canvas_Context.textBaseline = 'hanging';
		this.Canvas_Context.font = '14px Arial';
		this.Canvas_Context.fillText(this.Plot_Types_Label[this.Current_Plot.Type_Ind], this.Canvas_Width - Axis_Padding_2, Axis_Padding_2);

		this.Canvas_Context.fillStyle = '#666666';
		this.Canvas_Context.font = 'bold ' + Label_Font_Size + 'px Arial';

		this.Canvas_Context.textBaseline = 'bottom';
		this.Canvas_Context.textAlign = 'center';
		this.Canvas_Context.fillText(this.Current_Plot.Label_X, Math.floor(this.Canvas_Width / 2), this.Canvas_Height);
		
		this.Canvas_Context.font = 'normal ' + Number_Font_Size + 'px Arial';

		this.Canvas_Context.textBaseline = 'top';
		this.Canvas_Context.textAlign = 'end';
		this.Canvas_Context.fillText(FormatNumber(this.Current_Plot.Max_X, this.Current_Plot.Precision_X),
													this.Canvas_Width - Axis_Padding_2, this.Canvas_Height - Axis_Padding_1);
		this.Canvas_Context.textAlign = 'start';
		this.Canvas_Context.fillText(FormatNumber(this.Current_Plot.Min_X, this.Current_Plot.Precision_X),
													Axis_Padding_1, this.Canvas_Height - Axis_Padding_1);

		this.Canvas_Context.rotate(-Math.PI / 2.0);
		
		this.Canvas_Context.font = 'bold ' + Label_Font_Size + 'px Arial';

		this.Canvas_Context.textBaseline = 'top';
		this.Canvas_Context.textAlign = 'center';
		this.Canvas_Context.fillText(this.Current_Plot.Label_Y, -Math.floor(this.Canvas_Height / 2.0), 0);

		this.Canvas_Context.font = 'normal ' + Number_Font_Size + 'px Arial';

		this.Canvas_Context.textBaseline = 'bottom';
		this.Canvas_Context.textAlign = 'end';
		this.Canvas_Context.fillText(FormatNumber(this.Current_Plot.Max_Y, this.Current_Plot.Precision_Y), -Axis_Padding_2, Axis_Padding_1);
		this.Canvas_Context.textAlign = 'start';
		this.Canvas_Context.fillText(FormatNumber(this.Current_Plot.Min_Y, this.Current_Plot.Precision_Y), -this.Canvas_Height + Axis_Padding_1, Axis_Padding_1);
		
		this.Canvas_Context.rotate(Math.PI / 2.0);	
		//this.Canvas_Context.setTransform();
		
		this.Unlock();
		
	}
			
};
