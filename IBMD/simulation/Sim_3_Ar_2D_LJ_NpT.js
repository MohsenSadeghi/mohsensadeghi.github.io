// Molecular dynamics codes for simulation case 3: Ar.2D.LJ.NpT
// In-Browser Molecular Dynamics (IBMD)
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
// but WITHOUT ANY WARRANTY, without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with IBMD.  If not, see <http://www.gnu.org/licenses/>.

		
Sim.Init = function (_N, _Box_Len, _Setpoint_Temperature, _Setpoint_Pressure)
{
	this.Is_3D = false;
	
	this.N = _N;
	this.Box_Len = _Box_Len;
	this.Box_Half_Len = 0.5 * this.Box_Len;
	this.Box_Thickness = PP_Table.Ar.Sig;
	this.Volume = this.Box_Len * this.Box_Len * this.Box_Thickness;
	
	this.dt = 20.0;
	this.dt2 = this.dt * this.dt;
	
	this.Berendsen_Time_Const = 1000.0;
	
	this.Time = 0.0;
	this.Temperature = 0.0;
	this.Vir = 0.0;
	this.Kin_Energy = 0.0;
	this.Pot_Energy = 0.0;
	this.Internal_Energy = 0.0;
	this.PV = 0.0;
	this.Pressure = 0.0;
	
	this.Setpoint_Temperature = _Setpoint_Temperature;
	this.Setpoint_Pressure = _Setpoint_Pressure;
	
	var T0 = this.Setpoint_Temperature;
	var V_p = Math.sqrt(2.0 * kB * T0 / (PP_Table.Ar.Mass * amu)) * 1.0e-6;
	var theta;
	
	var i = 0;
		
	var col = 0, row = 0;
	var N_in_row = Math.ceil(Math.sqrt(this.N));
	
	for (i = 0; i < this.N; i ++)
	{
		row = Math.floor(i / N_in_row);
		col = i % N_in_row;
		theta = Random(0.0, 2.0 * Math.PI);
		
		this.Atom[i] = new Particle();
		this.Atom[i].SetProperties('Ar');
		
		this.Atom[i].x = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (col + 1);
		this.Atom[i].y = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (row + 1);
		this.Atom[i].vx = V_p * Math.cos(theta);
		this.Atom[i].vy = V_p * Math.sin(theta);
	}

	this.ZeroCOMVelocity ();
};

Sim.SetAvailableData = function (Data_Manager)
{
	Data_Manager.Available_Data.Time = true;
	Data_Manager.Available_Data.Setpoint_Temperature = true;
	Data_Manager.Available_Data.Temperature = true;
	Data_Manager.Available_Data.Setpoint_Pressure = true;
	Data_Manager.Available_Data.Internal_Energy = true;
	Data_Manager.Available_Data.Pressure = true;
	Data_Manager.Available_Data.Enthalpy = true;
};

Sim.SetAvailablePlots = function (Plot_Manager)
{
	Plot_Manager.Available_Plots.Speed_Distribution = true;
	Plot_Manager.Available_Plots.RDF = true;
	Plot_Manager.Available_Plots.Volume = true;
	Plot_Manager.Available_Plots.Temperature = true;
	Plot_Manager.Available_Plots.Kin_Energy = true;
	Plot_Manager.Available_Plots.Pot_Energy = true;
	Plot_Manager.Available_Plots.Internal_Energy = true;
	Plot_Manager.Available_Plots.Pressure = true;
	Plot_Manager.Available_Plots.Enthalpy = true;
	
	Plot_Manager.Default_Plot = 'Volume';
};

Sim.Force = function (i, j)
{
	var Dist = this.ParticleDistance2D(i, j);
	
	var r6 = Dist.r2 * Dist.r2 * Dist.r2;
	var r8 = r6 * Dist.r2;
	var r12 = r6 * r6;
	var r14 = r12 * Dist.r2;
	
	var Evdw = 4.0 * PP_Table.Ar.Eps * (PP_Table.Ar.Sig12 / r12 - PP_Table.Ar.Sig6 / r6);
	var Fvdw = 24.0 * PP_Table.Ar.Eps * (2.0 * PP_Table.Ar.Sig12 / r14 - PP_Table.Ar.Sig6 / r8);
				
	var Out = {	En : Evdw,
				Fx : Fvdw * Dist.dx,
				Fy : Fvdw * Dist.dy,
				Vir: Fvdw * Dist.r2};

	return Out;
};

Sim.SimulateOneStep = function ()
{
	if (!this.Busy)
	{
		this.Lock();
		
		var i = 0, j = 0;
		var Out;
		
		for (i = 0; i < this.N; i ++)
		{
			this.Atom[i].x += this.dt * this.Atom[i].vx + 0.5 * this.dt2 * this.Atom[i].ax;
			this.Atom[i].y += this.dt * this.Atom[i].vy + 0.5 * this.dt2 * this.Atom[i].ay;
			
			this.Wrap2D(i);

			this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
			this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;

			this.Atom[i].ax = 0.0;
			this.Atom[i].ay = 0.0;
		}
		
		this.Pot_Energy = 0.0;
		this.Vir = 0.0;
		
		for (i = 0; i < this.N - 1; i ++)
		{					
			for (j = i + 1; j < this.N; j ++)
			{
				Out = this.Force(i, j);
				
				this.Pot_Energy += Out.En;
				
				this.Atom[i].ax += Out.Fx;
				this.Atom[i].ay += Out.Fy;

				this.Atom[j].ax -= Out.Fx;
				this.Atom[j].ay -= Out.Fy;
				
				this.Vir += Out.Vir;
			}
		}
		
		this.Kin_Energy = 0.0;

		for (i = 0; i < this.N; i ++)
		{
			this.Atom[i].ax /= this.Atom[i].mass;
			this.Atom[i].ay /= this.Atom[i].mass;
								
			this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
			this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;
			
			this.Kin_Energy += 0.5 * this.Atom[i].mass * (this.Atom[i].vx * this.Atom[i].vx + this.Atom[i].vy * this.Atom[i].vy);
		}
		
		this.Time += this.dt * 1.0e-6;
		this.Internal_Energy = (this.Kin_Energy + this.Pot_Energy) / this.N * Energy_Factor * Av_Num / 1000.0;
		this.Temperature = this.Kin_Energy * Energy_Factor / (kB * this.N);
		this.PV = this.N * kB * this.Temperature + 0.5 * this.Vir * Energy_Factor;
		this.Pressure = this.PV / (this.Volume * 1.0e-27) * 1.0e-5;
		this.Enthalpy = this.Internal_Energy + this.PV / this.N * Av_Num / 1000.0;
		
		this.Kin_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
		this.Pot_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
		
		if (this.Temperature > 80.0)
		{
			this.Isothermal_Compressibility = 1.0 / this.Pressure;	
		}
		else
		{
			this.Isothermal_Compressibility = 0.001;
		}
			
		this.Thermostat2D ();
		this.Barostat2D ();
		
		this.Unlock();
	}
};

Sim.BoxClick = function (nx, ny)
{
	if (!this.Busy && this.Started)
	{
		this.Lock();
				
		var i = 0, dx, dy, Dist2, Dist2_min = this.Box_Len, Ind_min;
		var Dist2_Safe = (1.01 * PP_Table.Ar.Sig) * (1.01 * PP_Table.Ar.Sig);
		var Dist2_Inside = (0.5 * PP_Table.Ar.Sig) * (0.5 * PP_Table.Ar.Sig);
		
		for (i = 0; i < this.N; i ++)
		{
			dx = this.Atom[i].x - nx;
			dy = this.Atom[i].y - ny;
			
			Dist2 = dx * dx + dy * dy;
			
			if (Dist2 < Dist2_min)
			{
				Dist2_min = Dist2;
				Ind_min = i;
			}
		}

		if (Dist2_min > Dist2_Safe)
		{
			var V_p = Math.sqrt(2.0 * kB * this.Temperature / (PP_Table.Ar.Mass * amu)) * 1.0e-6;
			var theta = Random(0.0, 2.0 * Math.PI);
			
			this.Atom[this.N] = new Particle();
			this.Atom[i].SetProperties('Ar');
			
			this.Atom[this.N].x = nx;
			this.Atom[this.N].y = ny;
			this.Atom[this.N].vx = V_p * Math.cos(theta);
			this.Atom[this.N].vy = V_p * Math.sin(theta);
			this.Atom[this.N].color = '#00AABB';

			this.N ++;
			
		}
		else if (Dist2_min < Dist2_Inside)
		{
			this.Atom.splice(Ind_min, 1);
			this.N --;
		}
		
		this.Unlock();
	}
};
