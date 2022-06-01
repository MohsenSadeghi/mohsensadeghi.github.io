// Simulation constants for In-Browser Molecular Dynamics (IBMD)
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

// Physical constants
var amu = 1.66053892e-27; 	// Atomic mass unit in kilograms
var kB = 1.3806488e-23;		// Boltzmann constant
var Av_Num = 6.0221413e23;	// Avogadro's number
var qe = 1.602176487e-19; 	// Elementary charge
var ep0 = 8.854187817e-12; 	// Vacuum Permittivity

	// Units
	// Length:	nm  (1.0e-9)
	// Time:	fs  (1.0e-15)
	// Mass:	amu	 
	// Energy:	amu * nm ^ 2 / fs ^ 2
	// Charge:	qe 

var Energy_Factor = amu * 1.0e12;
var kEl = qe * qe / (4.0 * Math.PI * ep0) * 1.0e9 / Energy_Factor;

function Particle_Property (_Color, _Mass, _Rad, _Charge, _Eps, _Sig)
{
	this.Color = _Color;
	this.Mass = _Mass;
	this.Rad = _Rad;
	this.Charge = _Charge;
	this.Eps = _Eps;
	this.Sig = _Sig;
	this.Sig6 = Math.pow(_Sig, 6);
	this.Sig12 = this.Sig6 * this.Sig6;
};

function Particle_Property_Table ()
{
	this.Ar = new Particle_Property ('#00EEFF', 39.948, 0.3345 / 2.0, 0.0, 125.7 * kB / Energy_Factor, 0.3345);
	this.Ne = new Particle_Property ('#FF00EE', 20.1797, 0.2782 / 2.0, 0.0, 5.14859439e-22 / Energy_Factor, 0.2782);

	this.Cl_n = new Particle_Property ('#11CC11', 35.4527, 0.167, -1.0, 6.434 * kB / Energy_Factor, 0.483);
	this.Na_p = new Particle_Property ('#1111CC', 22.98977, 0.116, 1.0, 177.457 * kB / Energy_Factor, 0.2159);

	this.SPCFw_O = new Particle_Property ('#EE0000', 15.9994, 0.073, -0.82, 650.299455 / Av_Num / Energy_Factor, 0.3165492);
	this.SPCFw_H = new Particle_Property ('#FFFFFF', 1.00794, 0.038, 0.41, 0.0, 0.0);

	this.H = new Particle_Property ('#FFFFFF', 1.00794, 0.038, 0.0, 125.52 / Av_Num / Energy_Factor, 0.222);
	this.C = new Particle_Property ('#555555', 12.0107, 0.070, 0.0, 251.04 / Av_Num / Energy_Factor, 0.402);
	this.N = new Particle_Property ('#0000EE', 14.0067, 0.054, 0.0, 543.92 / Av_Num / Energy_Factor, 0.386);

	this.Li = new Particle_Property ('#FF00EE', 6.941, 0.145, 0.0, 0.48e-21 / Energy_Factor, 0.356);
	this.K = new Particle_Property ('#EE00EE', 39.0983, 0.220, 0.0, 0.48e-21 / Energy_Factor, 0.356);
	this.K_p = new Particle_Property ('#EE00EE', 39.0983, 0.220, 1.0, 0.48e-21 / Energy_Factor, 0.356);
	this.La = new Particle_Property ('#00CCFF', 138.90547, 0.187, 0.0, 0.48e-21 / Energy_Factor, 0.356);
};

var PP_Table = new Particle_Property_Table ();

var SPCFw_rOH = 0.1012;
var SPCFw_thHOH = 113.24 * Math.PI / 180.0;
var SPCFw_kr = 4.43153381e8 / Av_Num / Energy_Factor;
var SPCFw_kth = 3.175656e5 / Av_Num / Energy_Factor;

var C_C_Bond_Length = 0.1526;
var CG_CG_Bond_Length = 0.1421;
var C_H_Bond_Length = 0.1090;
var C_H_kr = 2.0 * 1.422560e8 / Av_Num / Energy_Factor;
var C_C_kr = 2.0 * 1.29704e8 / Av_Num / Energy_Factor;
var CG_CG_kr = 2.0 * 1.962296e8 / Av_Num / Energy_Factor;
var H_C_H_kth = 2.0 * 1.46440e5 / Av_Num / Energy_Factor;
var H_C_C_kth = 2.0 * 2.09200e5 / Av_Num / Energy_Factor;
var C_C_C_kth = 2.0 * 1.67360e5 / Av_Num / Energy_Factor;
var CG_CG_CG_kth = 2.0 * 2.63592e5 / Av_Num / Energy_Factor;
