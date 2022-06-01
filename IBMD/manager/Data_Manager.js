// Data Manager for In-Browser Molecular Dynamics (IBMD)
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

var Data_Manager = 
	{
		Phys_Properties :
		[
			'Time',
			'Setpoint_Temperature',
			'Temperature',
			'Setpoint_Pressure',
			'Pressure',
			'Volume',
			'Kin_Energy',
			'Pot_Energy',
			'Internal_Energy',
			'Enthalpy'
		],

		Phys_Properties_Label :
		[
			'Time',
			'Setpoint Temperature',
			'Temperature',
			'Setpoint Pressure',
			'Pressure',
			'Volume',
			'Kinetic Energy',
			'Potential Energy',
			'Internal Energy',
			'Enthalpy'
		],

		Phys_Properties_Unit :
		[
			'ns',
			'K',
			'K',
			'bar',
			'bar',
			'nm^3',
			'kJ/mol',
			'kJ/mol',
			'kJ/mol',
			'kJ/mol'
		],

		Available_Data : {},
		Data_Box_Handle : {}
	}

Data_Manager.Init = function ()
{
	var i = 0;
	
	for (i = 0; i < this.Phys_Properties.length; i ++)
	{
		this.Available_Data[this.Phys_Properties[i]] = false;
		this.Data_Box_Handle[this.Phys_Properties[i]] = {};
	}
}

Data_Manager.BuildDataPanel = function (Container_Element_Id)
{

	var Container_Handle = document.getElementById(Container_Element_Id);
	
	var Str = '<table id = "Data_Panel">';
	
	var i = 0;
	
	for (i = 0; i < this.Phys_Properties.length; i ++)
	{
		if (this.Available_Data[this.Phys_Properties[i]])
		{
			Str += '<tr>';
			Str += '<td>';
			Str += '<span class = "TextLabel"> ' + this.Phys_Properties_Label[i] + ': </span>';
			Str += '</td>';
			Str += '<td>';
			Str += '<input class ="TextBox" id = "' + this.Phys_Properties[i] + '_Box" type = "text" value = "-" readonly></input>';
			Str += '<span class = "TextLabel"> ' + this.Phys_Properties_Unit[i] + '</span>';
			Str += '</td>';
			Str += '</tr>';
		}
	}
	
	Str += '</table>';

	Container_Handle.innerHTML = Str;

	for (i = 0; i < this.Phys_Properties.length; i ++)
	{
		if (this.Available_Data[this.Phys_Properties[i]])
		{
			this.Data_Box_Handle[this.Phys_Properties[i]] = document.getElementById(this.Phys_Properties[i] + '_Box');
		}
	}

}

Data_Manager.DisplayData = function (Sim)
{
	for (i = 0; i < this.Phys_Properties.length; i ++)
	{
		if (this.Available_Data[this.Phys_Properties[i]])
		{
			this.Data_Box_Handle[this.Phys_Properties[i]].value = FormatNumber(Sim[this.Phys_Properties[i]], 3);
		}
	}
}
