// Molecular dynamics codes for simulation case 9: Wt-Gr.3D.AMBER-SPCFw-LJ.NVT
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
		
Sim.Init = function (_N, _Setpoint_Temperature)
{
	var N_Wt = _N;
	
	this.Is_3D = true;
	
	this.N_Mol = 0;
	this.N = 0;

	this.Box_Len = 2.94;
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
	var V_p = 2.0 * Math.sqrt(2.0 * kB * T0 / (PP_Table.SPCFw_O.Mass * amu)) * 1.0e-6;
	
	this.Mol[this.N_Mol] = new Molecule ();
	
	Model_Builder.AddGraphene(Sim, this.N_Mol, -this.Box_Half_Len, -this.Box_Half_Len, -this.Box_Half_Len + 0.3 * this.Box_Len, 12, 7);
	Model_Builder.DetectBonds(Sim, this.N_Mol, CG_CG_Bond_Length, CG_CG_kr);
	Model_Builder.DetectAngles(Sim, this.N_Mol, 120.0 * Math.PI / 180.0, CG_CG_CG_kth);
	this.Mol[this.N_Mol].SetLinearVelocity(this, Random(-V_p, V_p), Random(-V_p, V_p), Random(-V_p, V_p));
	this.N_Mol ++;
		
	var i = 0;
	
	var sx = 0.0;
	var sy = 0.0;
	var sz = 0.0;
	
	var col = 0, row = 0;
	var N_in_row = Math.ceil(Math.sqrt(N_Wt));

	for (i = 0; i < N_Wt; i ++)
	{
		row = Math.floor(i / N_in_row);
		col = i % N_in_row;
		
		sx = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (col + 1);
		sy = -this.Box_Half_Len + this.Box_Len / (N_in_row + 1) * (row + 1);
		sz = -this.Box_Half_Len + 0.42 * this.Box_Len;

		this.Mol[this.N_Mol] = new Molecule ();
		Model_Builder.AddWater_SPCFw (this, this.N_Mol, sx, sy, sz);
		
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
		
		this.Thermostat ();

		this.Unlock();
	}
};
