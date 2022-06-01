// Molecular dynamics codes for simulation case 4: Ar-Ne.2D.LJ.NVT
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
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with IBMD.  If not, see <http://www.gnu.org/licenses/>.
		
Sim.Init = function (_N, _Box_Len, _Setpoint_Temperature, _Mixing_Ratio)
{
	this.Is_3D = true;
	
	this.N = _N;
	this.Box_Len = _Box_Len;
	this.Box_Half_Len = 0.5 * this.Box_Len;
	this.Volume = this.Box_Len * this.Box_Len * this.Box_Len;
	
	this.dt = 10.0;
	this.dt2 = this.dt * this.dt;
	
	this.Berendsen_Time_Const = 500.0;
	
	this.Time = 0.0;
	this.Temperature = 0.0;
	this.Vir = 0.0;
	this.Kin_Energy = 0.0;
	this.Pot_Energy = 0.0;
	this.Internal_Energy = 0.0;
	this.PV = 0.0;
	this.Pressure = 0.0;
	
	this.Setpoint_Temperature = _Setpoint_Temperature;
	
	var T0 = this.Setpoint_Temperature;
	var V_p = Math.sqrt(2.0 * kB * T0 / (PP_Table.Ar.Mass * amu)) * 1.0e-6;
	var theta;
	
	var i = 0;
	
	var N_Argon_Atoms = _Mixing_Ratio * this.N;
	
	var col = 0, row = 0, depth = 0;
	var N_in_row = Math.ceil(Math.pow(this.N, 1.0 / 3.0));
	var N_in_plane = N_in_row * N_in_row;
	
	for (i = 0; i < this.N; i ++)
	{
		depth = Math.floor(i / N_in_plane);
		row = Math.floor((i - depth * N_in_plane) / N_in_row);
		col = (i - depth * N_in_plane) % N_in_row;
		
		theta = Random(0.0, Math.PI);
		phi = Random(0.0, 2.0 * Math.PI);
		
		this.Atom[i] = new Particle();
		
		this.Atom[i].x = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (col + 1);
		this.Atom[i].y = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (row + 1);
		this.Atom[i].z = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (depth + 1);
		this.Atom[i].vx = V_p * Math.sin(theta) * Math.cos(phi);
		this.Atom[i].vy = V_p * Math.sin(theta) * Math.sin(phi);
		this.Atom[i].vz = V_p * Math.cos(theta);

		if (i < N_Argon_Atoms)
		{
			this.Atom[i].SetProperties('Ar');
		}
		else
		{
			this.Atom[i].SetProperties('Ne');
		}
	}

	this.ZeroCOMVelocity ();
};

Sim.SetAvailableData = function (Data_Manager)
{
	Data_Manager.Available_Data.Time = true;
	Data_Manager.Available_Data.Setpoint_Temperature = true;
	Data_Manager.Available_Data.Temperature = true;
	Data_Manager.Available_Data.Internal_Energy = true;
	Data_Manager.Available_Data.Pressure = true;
	Data_Manager.Available_Data.Enthalpy = true;
};

Sim.SetAvailablePlots = function (Plot_Manager)
{
	Plot_Manager.Available_Plots.Speed_Distribution = true;
	Plot_Manager.Available_Plots.Temperature = true;
	Plot_Manager.Available_Plots.Kin_Energy = true;
	Plot_Manager.Available_Plots.Pot_Energy = true;
	Plot_Manager.Available_Plots.Internal_Energy = true;
	Plot_Manager.Available_Plots.Pressure = true;
	Plot_Manager.Available_Plots.Enthalpy = true;

	Plot_Manager.Default_Plot = 'Enthalpy';
};

Sim.Force = function (i, j)
{
	//Lorentz-Berholet mixing rule
	var Eps = this.Atom[i].Eps_Sqrt * this.Atom[j].Eps_Sqrt;
	var Sig = this.Atom[i].Sig_Half + this.Atom[j].Sig_Half;

	var Sig2 = Sig * Sig;

	var Dist = this.ParticleDistance(i, j);
	
	var Sig2_r2 = Sig2 / Dist.r2;
	var Sig6_r6 = Sig2_r2 * Sig2_r2 * Sig2_r2;
	var Sig6_r8 = Sig6_r6 / Dist.r2;
	var Sig12_r12 = Sig6_r6 * Sig6_r6;
	var Sig12_r14 = Sig12_r12 / Dist.r2;
		
	var Evdw = 4.0 * Eps * (Sig12_r12 - Sig6_r6);
	var Fvdw = 24.0 * Eps * (2.0 * Sig12_r14 - Sig6_r8);
				
	var Out = {	En : Evdw,
				Fx : Fvdw * Dist.dx,
				Fy : Fvdw * Dist.dy,
				Fz : Fvdw * Dist.dz,
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
			this.Atom[i].z += this.dt * this.Atom[i].vz + 0.5 * this.dt2 * this.Atom[i].az;
			
			this.Wrap(i);
			
			this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
			this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;
			this.Atom[i].vz += 0.5 * this.dt * this.Atom[i].az;

			this.Atom[i].ax = 0.0;
			this.Atom[i].ay = 0.0;
			this.Atom[i].az = 0.0;
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
				this.Atom[i].az += Out.Fz;

				this.Atom[j].ax -= Out.Fx;
				this.Atom[j].ay -= Out.Fy;
				this.Atom[j].az -= Out.Fz;
				
				this.Vir += Out.Vir;
			}
		}
		
		this.Kin_Energy = 0.0;

		for (i = 0; i < this.N; i ++)
		{
			this.Atom[i].ax /= this.Atom[i].mass;
			this.Atom[i].ay /= this.Atom[i].mass;
			this.Atom[i].az /= this.Atom[i].mass;
								
			this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
			this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;
			this.Atom[i].vz += 0.5 * this.dt * this.Atom[i].az;
			
			this.Kin_Energy += 0.5 * this.Atom[i].mass * 
				(this.Atom[i].vx * this.Atom[i].vx + this.Atom[i].vy * this.Atom[i].vy + this.Atom[i].vz * this.Atom[i].vz);
		}
		
		this.Time += this.dt * 1.0e-6;
		this.Internal_Energy = (this.Kin_Energy + this.Pot_Energy) / this.N * Energy_Factor * Av_Num / 1000.0;
		this.Temperature = this.Kin_Energy * Energy_Factor / (1.5 * kB * this.N);
		this.PV = this.N * kB * this.Temperature + this.Vir / 3.0 * Energy_Factor;
		this.Pressure = this.PV / (this.Volume * 1.0e-27) * 1.0e-5;
		this.Enthalpy = this.Internal_Energy + this.PV / this.N * Av_Num / 1000.0;
		
		this.Kin_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
		this.Pot_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
		
		this.Thermostat();
		
		this.Unlock();
	}
};
