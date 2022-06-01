// Molecular dynamics codes for simulation case 8: Ne@C60.3D.AMBER-LJ.NVT
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
		
Sim.Init = function (_N, _Box_Len, _Setpoint_Temperature)
{
	var N_C60 = _N;
	
	this.Is_3D = true;
	
	this.N_Mol = 0;
	this.N = 0;

	this.Box_Len = _Box_Len;
	this.Box_Half_Len = 0.5 * this.Box_Len;
	this.Volume = this.Box_Len * this.Box_Len * this.Box_Len;
	
	this.dt = 2.0;
	this.dt2 = this.dt * this.dt;
	
	this.Berendsen_Time_Const = 100.0;
	
	this.Time = 0.0;
	this.Temperature = 0.0;
	this.Vir = 0.0;
	this.Kin_Energy = 0.0;
	this.Pot_Energy = 0.0;
	this.Internal_Energy = 0.0;
	this.PV = 0.0;
	this.Pressure = 0.0;
	
	this.Setpoint_Temperature = _Setpoint_Temperature;
	this.Isothermal_Compressibility = 0.001;
	
	var T0 = this.Setpoint_Temperature;
	var V_p = 2.0 * Math.sqrt(2.0 * kB * T0 / (PP_Table.C.Mass * 60.0 * amu)) * 1.0e-6;
	
	var i = 0;
	
	var sx = 0.0;
	var sy = 0.0;
	var sz = 0.0;
	
	var col = 0, row = 0, depth = 0;
	var N_in_row = Math.ceil(Math.pow(N_C60, 1.0 / 3.0));
	var N_in_plane = N_in_row * N_in_row;
		
	for (i = 0; i < N_C60; i ++)
	{
		depth = Math.floor(i / N_in_plane);
		row = Math.floor((i - depth * N_in_plane) / N_in_row);
		col = (i - depth * N_in_plane) % N_in_row;
		
		sx = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (col + 1);
		sy = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (row + 1);
		sz = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (depth + 1);
		
		this.Mol[this.N_Mol] = new Molecule ();
		
		Model_Builder.AddC60(Sim, this.N_Mol, sx, sy, sz, 0.0);
		Model_Builder.DetectBonds(Sim, this.N_Mol, CG_CG_Bond_Length, CG_CG_kr);
		Model_Builder.DetectAngles(Sim, this.N_Mol, 120.0 * Math.PI / 180.0, CG_CG_CG_kth);
		this.Mol[this.N_Mol].SetLinearVelocity(this, Random(-V_p, V_p), Random(-V_p, V_p), Random(-V_p, V_p));
		this.Mol[this.N_Mol].SetAngularVelocity(this, 2.5e-3 * Random(-1.0, 1.0), 0.5e-3 * Random(-1.0, 1.0), 1.0e-3 * Random(-1.0, 1.0));
		
		
		this.N_Mol ++;

		this.Mol[this.N_Mol] = new Molecule ();

		this.Atom[this.N] = new Particle();
		this.Atom[this.N].SetProperties('Ne');
		this.Atom[this.N].SetPosition(sx, sy, sz);

		this.Mol[this.N_Mol].AddAtom(this.N);

		this.N ++;
		this.N_Mol ++;
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

	Plot_Manager.Default_Plot = 'Temperature';
};

Sim.SimulateOneStep = function ()
{

	if (!this.Busy)
	{
		this.Lock();
		
		this.VelocityVerletFirst ();
				
		this.CalcForces ();
		
		this.VelocityVerletSecond ();
		
		this.CalcPhysProperties ();
		
		if (this.Pressure > 0.0)
		{
			//this.Isothermal_Compressibility = 1.0 / this.Pressure;
		}
		
		//this.Barostat ();
		this.Thermostat ();

		this.Unlock();
	}
};
