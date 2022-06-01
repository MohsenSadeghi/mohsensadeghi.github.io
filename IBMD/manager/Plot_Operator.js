// Plot Operator for In-Browser Molecular Dynamics (IBMD)
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

var Plot_Operator =
	{
		Max_N_Sample : 1,
		N_Sample : 0,
		Speed_Dist_Value : [],
		RDF_Value : [],
		
		Speed_max : 1.516e-3
	};

Plot_Operator.Init = function (_Max_N_Sample)
{
	this.Max_N_Sample = _Max_N_Sample;
};

Plot_Operator.ResetSampling = function ()
{
	this.N_Sample = 0;
};

Plot_Operator.SetSpeedMax = function (_Speed_max)
{
	this.Speed_max = _Speed_max;
};

Plot_Operator.PrepareSpeedDistPlot = function (Sim, Plot_Manager)
{
	if (!Sim.Busy)
	{
		Sim.Lock();
		
		if (this.N_Sample < this.Max_N_Sample)
		{
			this.N_Sample ++;
		}
		else
		{
			this.Speed_Dist_Value.shift();
		}

		this.Speed_Dist_Value[this.N_Sample] = [];

		var i = 0, ind = 0, ind_f = 0.0, del = 0.0;
		var N_Div = Plot_Manager.Current_Plot.Max_N_Points;
		var Vel = [], Vel_max = -1.0;
		
		for (i = 0; i < N_Div; i ++)
		{
			this.Speed_Dist_Value[this.N_Sample][i] = 0;
		}

		for (i = 0; i < Sim.N; i ++)
		{
			Vel[i] = Math.sqrt(Sim.Atom[i].vx * Sim.Atom[i].vx + Sim.Atom[i].vy * Sim.Atom[i].vy + Sim.Atom[i].vz * Sim.Atom[i].vz);
		}
		
		Vel_max = this.Speed_max;
		
		var dV = Vel_max / N_Div * 1.0e6;
		
		for (i = 0; i < Sim.N; i ++)
		{
			ind_f = Vel[i] / Vel_max * N_Div;
			
			ind = Math.round(ind_f);
			//del = ind_f - ind;
			
			if (ind < N_Div)
			{
				this.Speed_Dist_Value[this.N_Sample][ind] += 1.0 / (Sim.N * dV);
			}
			
			//Prob_Dist[ind] += (1.0 - del) / (Sim.N * dV);
			
		}
		
		Plot_Manager.Current_Plot.N_Points = N_Div;
		
		for (i = 0; i < N_Div; i ++)
		{
			Plot_Manager.Current_Plot.X_Value[i] = Vel_max * 1.0e6 * i / N_Div;
			
			Plot_Manager.Current_Plot.Y_Value[i] = 0.0;
			
			for (j = 1; j < this.N_Sample; j ++)
			{
				Plot_Manager.Current_Plot.Y_Value[i] += this.Speed_Dist_Value[j][i];
			}
			
			Plot_Manager.Current_Plot.Y_Value[i] /= this.N_Sample;
		}
		
		Plot_Manager.Current_Plot.Min_X = 0.0;
		Plot_Manager.Current_Plot.Min_Y = 0.0;

		Plot_Manager.Current_Plot.Max_X = Plot_Manager.Current_Plot.X_Value[N_Div - 1];
		Plot_Manager.Current_Plot.Max_Y = ArrayMax(Plot_Manager.Current_Plot.Y_Value) * 1.2;
		
		Plot_Manager.Current_Plot.Label_X = 'Speed (m/s)';
		Plot_Manager.Current_Plot.Label_Y = 'Prob. Density (s/m)';
		
		Plot_Manager.Current_Plot.Precision_X = -1;
		Plot_Manager.Current_Plot.Precision_Y = 4;
		
		Sim.Unlock();
		
	}
	
};

Plot_Operator.PrepareRDFPlot = function (Sim, Plot_Manager)
{
	if (!Sim.Busy)
	{
		Sim.Lock();
		
		var i = 0, j = 0, Ind = 0;
		var dx = 0.0, dy = 0.0, Radius = 0.0;
		var Radius_max = 4.0 * PP_Table.Ar.Sig;
		var N_Div = Plot_Manager.Current_Plot.Max_N_Points;
		var dR = Radius_max / N_Div;

		var Density = 1.0;
		
		if (Sim.Is_3D)
		{
			Density = Sim.N / (Sim.Box_Len * Sim.Box_Len * Sim.Box_Len);
		}
		else
		{
			Density = Sim.N / (Sim.Box_Len * Sim.Box_Len);
		}
		
		Plot_Manager.Current_Plot.N_Points = N_Div;
		
		if (this.N_Sample < this.Max_N_Sample)
		{
			this.N_Sample ++;
		}
		else
		{
			this.RDF_Value.shift();
		}

		this.RDF_Value[this.N_Sample] = [];
		
		for (i = 0; i < N_Div; i ++)
		{
			this.RDF_Value[this.N_Sample][i] = 0.0;
			Plot_Manager.Current_Plot.X_Value[i] = (i / N_Div) * Radius_max * 10.0;
		}
		
		for (i = 0; i < Sim.N; i ++)
		{
			for (j = 0; j < Sim.N; j ++)
			{
				if (i != j)
				{
					Out = Sim.ParticleDistance(i, j);
										
					Radius = Math.sqrt(Out.r2);
					
					Ind = Math.floor(Radius / Radius_max * N_Div);
					
					if (Sim.Is_3D)
					{
						this.RDF_Value[this.N_Sample][Ind] += 1.0 / (4.0 * Math.PI * Radius * Radius * dR * Density);
					}
					else
					{
						this.RDF_Value[this.N_Sample][Ind] += 1.0 / (2.0 * Math.PI * Radius * dR * Density);
					}
					
				}
			}
		}
				
		
		for (i = 0; i < N_Div; i ++)
		{
			Plot_Manager.Current_Plot.Y_Value[i] = 0.0;
			
			for (j = 1; j <= this.N_Sample; j ++)
			{		
				Plot_Manager.Current_Plot.Y_Value[i] += this.RDF_Value[j][i] / Sim.N;
			}

			Plot_Manager.Current_Plot.Y_Value[i] /= this.N_Sample;
			
		}
			
		Plot_Manager.Current_Plot.Max_Y = ArrayMax(Plot_Manager.Current_Plot.Y_Value) * 1.2;
		Plot_Manager.Current_Plot.Min_Y = 0.0;

		Plot_Manager.Current_Plot.Min_X = 0.0;
		Plot_Manager.Current_Plot.Max_X = Radius_max * 10.0;
		
		Plot_Manager.Current_Plot.Label_X = 'Radius (' + '\u212B' + ')';
		Plot_Manager.Current_Plot.Label_Y = 'RDF';
		
		Plot_Manager.Current_Plot.Precision_X = 3;
		Plot_Manager.Current_Plot.Precision_Y = 3;

		Sim.Unlock();
	}
};

Plot_Operator.PreparePropertyPlot = function (Sim, Plot_Manager)
{
	if (!Sim.Busy)
	{
		Sim.Lock();	
		
		var Property_Ind = Plot_Manager.Current_Plot.Type_Ind;
		var Property_Str = Plot_Manager.Plot_Types[Property_Ind];
		
		var Property_Label_Str = Plot_Manager.Plot_Types_Label[Property_Ind];
		var Property_Unit_Str = Data_Manager.Phys_Properties_Unit[Data_Manager.Phys_Properties.indexOf(Property_Str)];
		
		var Point_Ind = 0;
		
		if (Plot_Manager.Current_Plot.N_Points < Plot_Manager.Current_Plot.Max_N_Points)
		{
			Point_Ind = Plot_Manager.Current_Plot.N_Points;

			Plot_Manager.Current_Plot.N_Points ++;
		}
		else
		{
			Point_Ind = Plot_Manager.Current_Plot.Max_N_Points - 1;
			Plot_Manager.Current_Plot.N_Points = Plot_Manager.Current_Plot.Max_N_Points;
			
			Plot_Manager.Current_Plot.X_Value.shift();
			Plot_Manager.Current_Plot.Y_Value.shift();
		}
		
		Plot_Manager.Current_Plot.X_Value[Point_Ind] = Sim.Time;
		Plot_Manager.Current_Plot.Y_Value[Point_Ind] = Sim[Property_Str];
		
		Plot_Manager.Current_Plot.Min_X = Plot_Manager.Current_Plot.X_Value[0];
		
		if (Point_Ind > 0)
		{
			Plot_Manager.Current_Plot.Max_X = Plot_Manager.Current_Plot.X_Value[0]
										+ (Sim.Time - Plot_Manager.Current_Plot.X_Value[0]) / Point_Ind * Plot_Manager.Current_Plot.Max_N_Points;
		}
		else
		{
			Plot_Manager.Current_Plot.Max_X = Plot_Manager.Current_Plot.X_Value[0]
										+ (Sim.Time * 10.0) ;
		}
		
		var Min_Y_Value = ArrayMin(Plot_Manager.Current_Plot.Y_Value);
		var Max_Y_Value = ArrayMax(Plot_Manager.Current_Plot.Y_Value);
		var Range_Y_Value = Max_Y_Value - Min_Y_Value;
		
		Plot_Manager.Current_Plot.Min_Y = Min_Y_Value - 0.2 * Range_Y_Value;
		Plot_Manager.Current_Plot.Max_Y = Max_Y_Value + 0.2 * Range_Y_Value;
		
		Plot_Manager.Current_Plot.Label_X = 'Time (ns)';
		Plot_Manager.Current_Plot.Label_Y = Property_Label_Str + ' (' + Property_Unit_Str + ')';
		
		Plot_Manager.Current_Plot.Precision_X = 4;
		Plot_Manager.Current_Plot.Precision_Y = 3;
		
		Sim.Unlock();
	}
	
};
