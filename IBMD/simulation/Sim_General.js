// General codes for molecular dynamics simulations
// In-Browser Molecular Dynamics (IBMD)
//
// Copyright (c) 2015 Mohsen Sadeghi (MohsenSadeghi@alum.sharif.edu)
//
// This file is part of the In-Browser Molecular Dynamics (IBMD)
// web application.
//
// IBMD is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 3 of the License; or
// (at your option) any later version.
//
// IBMD is distributed in the hope that it will be useful;
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with IBMD.  If not; see <http://www.gnu.org/licenses/>.
	
function Particle ()
{
	this.x = 0.0;
	this.y = 0.0;
	this.z = 0.0;
	
	this.vx = 0.0;
	this.vy = 0.0;
	this.vz = 0.0;
	
	this.ax = 0.0;
	this.ay = 0.0;
	this.az = 0.0;
	
	this.Fx = 0.0;
	this.Fy = 0.0;
	this.Fz = 0.0;
	
	this.mass = 0.0;
	this.charge = 0.0;
	this.rad = 0.0;
	this.color = '#00EEFF';
	
	this.Eps = 0.0;
	this.Sig = 0.0;

	this.Eps_Sqrt = 0.0;
	this.Sig_Half = 0.0;
	this.Sig6 = 0.0;
	this.Sig12 = 0.0;
};

Particle.prototype.SetRandomVelocity = function (V)
{
	var theta = Random(0.0, Math.PI);
	var phi = Random(0.0, 2.0 * Math.PI);
	
	this.vx = V * Math.sin(theta) * Math.cos(phi);
	this.vy = V * Math.sin(theta) * Math.sin(phi);
	this.vz = V * Math.cos(theta);
};

Particle.prototype.SetPosition = function (_x, _y, _z)
{
	this.x = _x;
	this.y = _y;
	this.z = _z;
};

Particle.prototype.SetProperties = function (Designation)
{
	this.mass = PP_Table[Designation].Mass;
	this.charge = PP_Table[Designation].Charge;
	this.rad = PP_Table[Designation].Rad;
	this.color = PP_Table[Designation].Color;
	this.Eps = PP_Table[Designation].Eps;
	this.Sig = PP_Table[Designation].Sig;
	
	this.Eps_Sqrt = Math.sqrt(this.Eps);
	this.Sig_Half = 0.5 * this.Sig;
};

function MolBond ()
{
	this.Atom_Ind1 = 0;
	this.Atom_Ind2 = 0;
	
	this.r_eq = 0.0;
	this.K_stretch = 0.0;
};

function MolAngle ()
{
	this.Atom_Ind0 = 0;
	this.Atom_Ind1 = 0;
	this.Atom_Ind2 = 0;
	
	this.th_eq = 0.0;
	this.K_bend = 0.0;
};

function MolNonbonded ()
{
	this.Atom_Ind1 = 0;
	this.Atom_Ind2 = 0;
	
	this.Eps = 0.0;
	this.Sig = 0.0;
};

function Molecule ()
{
	this.N_Atoms = 0;
	this.Atom_Ind = [];
	
	this.N_Bonds = 0;
	this.Bond = [];
		
	this.N_Angles = 0;
	this.Angle = [];
		
	this.N_Nonbondeds = 0;
	this.Nonbonded = [];
}; 

Molecule.prototype.AddAtom = function (_Atom_Ind)
{
	this.Atom_Ind[this.N_Atoms] = _Atom_Ind;
	this.N_Atoms ++;
};

Molecule.prototype.AddBond = function (_Atom_Ind1, _Atom_Ind2, _r_eq, _K_stretch)
{
	this.Bond[this.N_Bonds] = new MolBond ();
	this.Bond[this.N_Bonds].Atom_Ind1 = _Atom_Ind1;
	this.Bond[this.N_Bonds].Atom_Ind2 = _Atom_Ind2;
	this.Bond[this.N_Bonds].r_eq = _r_eq;
	this.Bond[this.N_Bonds].K_stretch = _K_stretch;

	this.N_Bonds ++;
};

Molecule.prototype.AddAngle = function (_Atom_Ind0, _Atom_Ind1, _Atom_Ind2, _th_eq, _K_bend)
{
	this.Angle[this.N_Angles] = new MolAngle ();
	this.Angle[this.N_Angles].Atom_Ind0 = _Atom_Ind0;
	this.Angle[this.N_Angles].Atom_Ind1 = _Atom_Ind1;
	this.Angle[this.N_Angles].Atom_Ind2 = _Atom_Ind2;
	this.Angle[this.N_Angles].th_eq = _th_eq;
	this.Angle[this.N_Angles].K_bend = _K_bend;

	this.N_Angles ++;
};

Molecule.prototype.AddNonbonded = function (_Atom_Ind1, _Atom_Ind2, _Eps, _Sig)
{
	this.Nonbonded[this.N_Nonbondeds] = new MolNonbonded ();
	this.Nonbonded[this.N_Nonbondeds].Atom_Ind1 = _Atom_Ind1;
	this.Nonbonded[this.N_Nonbondeds].Atom_Ind2 = _Atom_Ind2;
	this.Nonbonded[this.N_Nonbondeds].Eps = _Eps;
	this.Nonbonded[this.N_Nonbondeds].Sig = _Sig;

	this.N_Nonbondeds ++;
};

Molecule.prototype.SetLinearVelocity = function (_Sim, _Vx, _Vy, _Vz)
{
	var i = 0, ind = 0;
	
	for (i = 0; i < this.N_Atoms; i ++)
	{
		ind = this.Atom_Ind[i];
		
		_Sim.Atom[ind].vx = _Vx;
		_Sim.Atom[ind].vy = _Vy;
		_Sim.Atom[ind].vz = _Vz;
	}
};

Molecule.prototype.SetRandomLinearVelocity = function (_Sim, _V)
{
	var theta = Random(0.0, Math.PI);
	var phi = Random(0.0, 2.0 * Math.PI);
	var i = 0, ind = 0;
	
	for (i = 0; i < this.N_Atoms; i ++)
	{
		ind = this.Atom_Ind[i];
		
		_Sim.Atom[ind].vx = _V * Math.sin(theta) * Math.cos(phi);
		_Sim.Atom[ind].vy = _V * Math.sin(theta) * Math.sin(phi);
		_Sim.Atom[ind].vz = _V * Math.cos(theta);
	}
};

Molecule.prototype.SetAngularVelocity = function (_Sim, _Wx, _Wy, _Wz)
{
	var i = 0, ind = 0;
	var x_com = 0.0, y_com = 0.0, z_com = 0.0;
	var dx, dy, dz;
	var mass = 0.0;
	
	for (i = 0; i < this.N_Atoms; i ++)
	{
		ind = this.Atom_Ind[i];
		x_com += _Sim.Atom[ind].x * _Sim.Atom[ind].mass;
		y_com += _Sim.Atom[ind].y * _Sim.Atom[ind].mass;
		z_com += _Sim.Atom[ind].z * _Sim.Atom[ind].mass;
		mass += _Sim.Atom[ind].mass;
	}
	
	x_com /= mass;
	y_com /= mass;
	z_com /= mass;
	
	for (i = 0; i < this.N_Atoms; i ++)
	{
		ind = this.Atom_Ind[i];
		
		dx = _Sim.Atom[i].x - x_com;
		dy = _Sim.Atom[i].y - y_com;
		dz = _Sim.Atom[i].z - z_com;

		if (dx > _Sim.Box_Half_Len) { dx -= _Sim.Box_Len; }
		else if (dx < -_Sim.Box_Half_Len) { dx += _Sim.Box_Len; }

		if (dy > _Sim.Box_Half_Len) { dy -= _Sim.Box_Len; }
		else if (dy < -_Sim.Box_Half_Len) { dy += _Sim.Box_Len; }

		if (dz > _Sim.Box_Half_Len) { dz -= _Sim.Box_Len; }
		else if (dz < -_Sim.Box_Half_Len) { dz += _Sim.Box_Len; }
		
		_Sim.Atom[ind].vx += _Wy * dz - _Wz * dy;
		_Sim.Atom[ind].vy += _Wz * dx - _Wx * dz;
		_Sim.Atom[ind].vz += _Wx * dy - _Wy * dx;
	}
};

var Sim =
	{
		Busy : false,
		Started : false,
		Is_3D : false,
		
		N : 0,
		N_Mol : 0,
		dt: 0.0, dt2: 0.0,
		Box_Len: 0.0, Box_Half_Len: 0.0, Box_Thickness: 0.0, Volume: 0.0,
		Time: 0.0,
		Vir: 0.0, PV: 0.0, Kin_Energy: 0.0, Pot_Energy: 0.0,
		Internal_Energy: 0.0, Temperature: 0.0, Pressure: 0.0, Enthalpy: 0.0,
		Setpoint_Temperature: 0.0, Setpoint_Pressure: 0.0,
		
		Berendsen_Time_Const: 0.0,
		Isothermal_Compressibility: 0.0,
		
		Atom : [],
		Mol : [],
		
		Start : function ()
		{
			this.Started = true;
		},

		Stop : function ()
		{
			this.Started = false;
		},

		Lock : function ()
		{
			this.Busy = true;
		},

		Unlock : function ()
		{
			this.Busy = false;
		}
	};

Sim.ParticleDistance2D = function (i, j)
{
	var _dx = this.Atom[i].x - this.Atom[j].x;
	var _dy = this.Atom[i].y - this.Atom[j].y;
	
	if (_dx > this.Box_Half_Len) { _dx -= this.Box_Len; }
	else if (_dx < -this.Box_Half_Len) { _dx += this.Box_Len; }

	if (_dy > this.Box_Half_Len) { _dy -= this.Box_Len; }
	else if (_dy < -this.Box_Half_Len) { _dy += this.Box_Len; }
	
	var Out =
		{
			dx : _dx,
			dy : _dy,
			r2 : _dx * _dx + _dy * _dy
		};
		
	return Out;
};

Sim.ParticleDistance = function (i, j)
{
	var _dx = this.Atom[i].x - this.Atom[j].x;
	var _dy = this.Atom[i].y - this.Atom[j].y;
	var _dz = this.Atom[i].z - this.Atom[j].z;
	
	if (_dx > this.Box_Half_Len) { _dx -= this.Box_Len; }
	else if (_dx < -this.Box_Half_Len) { _dx += this.Box_Len; }

	if (_dy > this.Box_Half_Len) { _dy -= this.Box_Len; }
	else if (_dy < -this.Box_Half_Len) { _dy += this.Box_Len; }

	if (_dz > this.Box_Half_Len) { _dz -= this.Box_Len; }
	else if (_dz < -this.Box_Half_Len) { _dz += this.Box_Len; }
	
	var Out =
		{
			dx : _dx,
			dy : _dy,
			dz : _dz,
			r2 : _dx * _dx + _dy * _dy + _dz * _dz
		};
		
	return Out;
};

Sim.Wrap = function (i)
{
	if (this.Atom[i].x > this.Box_Half_Len) 	{	this.Atom[i].x -= this.Box_Len;}
	if (this.Atom[i].x < -this.Box_Half_Len)	{	this.Atom[i].x += this.Box_Len;}
	if (this.Atom[i].y > this.Box_Half_Len)		{	this.Atom[i].y -= this.Box_Len;}
	if (this.Atom[i].y < -this.Box_Half_Len)	{	this.Atom[i].y += this.Box_Len;}
	if (this.Atom[i].z > this.Box_Half_Len)		{	this.Atom[i].z -= this.Box_Len;}
	if (this.Atom[i].z < -this.Box_Half_Len)	{	this.Atom[i].z += this.Box_Len;}
};

Sim.Wrap2D = function (i)
{
	if (this.Atom[i].x > this.Box_Half_Len) 	{	this.Atom[i].x -= this.Box_Len;}
	if (this.Atom[i].x < -this.Box_Half_Len)	{	this.Atom[i].x += this.Box_Len;}
	if (this.Atom[i].y > this.Box_Half_Len)		{	this.Atom[i].y -= this.Box_Len;}
	if (this.Atom[i].y < -this.Box_Half_Len)	{	this.Atom[i].y += this.Box_Len;}
};

Sim.ZeroCOMVelocity = function ()
{
	var i = 0;
	var MVx = 0.0; MVy = 0.0; MVz = 0.0;
	var Mtot = 0.0;
	
	for (i = 0; i < this.N; i ++)
	{
		Mtot += this.Atom[i].mass;
		
		MVx += this.Atom[i].mass * this.Atom[i].vx;
		MVy += this.Atom[i].mass * this.Atom[i].vy;
		MVz += this.Atom[i].mass * this.Atom[i].vz;
	}
	
	var COM_Vx = MVx / Mtot;
	var COM_Vy = MVy / Mtot;
	var COM_Vz = MVz / Mtot;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].vx -= COM_Vx;
		this.Atom[i].vy -= COM_Vy;
		this.Atom[i].vz -= COM_Vz;
	}
};

Sim.InterMolForce = function (m1, m2)
{
	var Atom_ind1 = 0, Atom_ind2 = 0;
	var ind1 = 0, ind2 = 0;
	var Eel = 0.0, Fel = 0.0, Evdw = 0.0, Fvdw = 0.0;
	var Sig = 0.0, Eps = 0.0;
	var Sig2 = 0.0, Sig2_r2 = 0.0, Sig6_r6 = 0.0, Sig6_r8 = 0.0;
	var Sig12_r12 = 0.0, Sig12_r14 = 0.0;
		
	for (Atom_ind1 = 0; Atom_ind1 < this.Mol[m1].N_Atoms; Atom_ind1 ++)
	{
		ind1 = this.Mol[m1].Atom_Ind[Atom_ind1];

		for (Atom_ind2 = 0; Atom_ind2 < this.Mol[m2].N_Atoms; Atom_ind2 ++)
		{
			ind2 = this.Mol[m2].Atom_Ind[Atom_ind2];
			
			Sig = this.Atom[ind1].Sig_Half + this.Atom[ind2].Sig_Half;
			Eps = this.Atom[ind1].Eps_Sqrt * this.Atom[ind2].Eps_Sqrt;
			
			Dist = this.ParticleDistance(ind1, ind2);
			
			if (Eps > 0.0)
			{
				Sig2 = Sig * Sig;
				
				Sig2_r2 = Sig2 / Dist.r2;
				Sig6_r6 = Sig2_r2 * Sig2_r2 * Sig2_r2;
				Sig6_r8 = Sig6_r6 / Dist.r2;
				Sig12_r12 = Sig6_r6 * Sig6_r6;
				Sig12_r14 = Sig12_r12 / Dist.r2;
						
				Evdw = 4.0 * Eps * (Sig12_r12 - Sig6_r6);
				Fvdw = 24.0 * Eps * (2.0 * Sig12_r14 - Sig6_r8);
			}
			else
			{
				Evdw = 0.0;
				Fvdw = 0.0;
			}
			
			r = Math.sqrt(Dist.r2);
			r3 = r * Dist.r2;

			Eel = kEl * this.Atom[ind1].charge * this.Atom[ind2].charge / r;
			Fel = kEl * this.Atom[ind1].charge * this.Atom[ind2].charge / r3;
			
			Ftot = Fel + Fvdw;
			Etot = Eel + Evdw;
			
			this.Atom[ind1].Fx += Ftot * Dist.dx;
			this.Atom[ind1].Fy += Ftot * Dist.dy;
			this.Atom[ind1].Fz += Ftot * Dist.dz;
			
			this.Atom[ind2].Fx -= Ftot * Dist.dx;
			this.Atom[ind2].Fy -= Ftot * Dist.dy;
			this.Atom[ind2].Fz -= Ftot * Dist.dz;

			this.Pot_Energy += Etot;
			this.Vir += Ftot * Dist.r2;
		}
	}

};

Sim.IntraMolForce_Bond = function (m)
{
	var bond_ind = 0;
	var ind1 = 0, ind2 = 0;
	var r = 0.0, dr = 0.0;
	var Fr = 0.0, Er = 0.0;
	
	for (bond_ind = 0; bond_ind < this.Mol[m].N_Bonds; bond_ind ++)
	{
		ind1 = this.Mol[m].Bond[bond_ind].Atom_Ind1;
		ind2 = this.Mol[m].Bond[bond_ind].Atom_Ind2;
		
		Dist = this.ParticleDistance (ind1, ind2);
		
		r = Math.sqrt(Dist.r2);
		dr = r - this.Mol[m].Bond[bond_ind].r_eq;
		
		Fr = -this.Mol[m].Bond[bond_ind].K_stretch * dr / r;
		Er = 0.5 * this.Mol[m].Bond[bond_ind].K_stretch * dr * dr;
	
		this.Atom[ind1].Fx += Fr * Dist.dx;
		this.Atom[ind1].Fy += Fr * Dist.dy;
		this.Atom[ind1].Fz += Fr * Dist.dz;
		
		this.Atom[ind2].Fx -= Fr * Dist.dx;
		this.Atom[ind2].Fy -= Fr * Dist.dy;
		this.Atom[ind2].Fz -= Fr * Dist.dz;
		
		this.Vir += Fr * Dist.r2;
		
		this.Pot_Energy += Er;
	}
};

Sim.IntraMolForce_Angle = function (m)
{
	var j = 0;
	var angle_ind = 0;
	var ind0 = 0, ind1 = 0, ind2 = 0;
	var r1 = 0.0, r2 = 0.0, r12 = 0.0, r22 = 0.0, r1_2 = 0.0, r2_2 = 0.0, dot = 0.0;
	var cos_th = 0.0, sin_th = 0.0, cot_th = 0.0, th = 0.0, dth = 0.0, fac = 0.0;
	var Eth = 0.0, Fth = 0.0;
	
	var A = [];
	var B = [];
	var C = [];
	var D = [];
	var th_diff = [];
	
	for (angle_ind = 0; angle_ind < this.Mol[m].N_Angles; angle_ind ++)
	{
		ind0 = this.Mol[m].Angle[angle_ind].Atom_Ind0;
		ind1 = this.Mol[m].Angle[angle_ind].Atom_Ind1;
		ind2 = this.Mol[m].Angle[angle_ind].Atom_Ind2;
		
		Dist1 = this.ParticleDistance (ind0, ind1);
		Dist2 = this.ParticleDistance (ind0, ind2);
		
		r12 = Dist1.r2;
		r22 = Dist2.r2;
		
		r1_2 = 1.0 / r12;
		r2_2 = 1.0 / r22;
		
		dot = Dist1.dx * Dist2.dx + Dist1.dy * Dist2.dy + Dist1.dz * Dist2.dz;
		
		r1 = Math.sqrt(r12);
		r2 = Math.sqrt(r22);
		
		cos_th = dot / (r1 * r2);
		th = Math.acos(cos_th);
		dth = th - this.Mol[m].Angle[angle_ind].th_eq;
		sin_th = Math.sin(th);
		cot_th = cos_th / sin_th;
		fac = 1.0 / (r1 * r2 * sin_th);
		
		A = [
			 r1_2 * Dist1.dx,  r1_2 * Dist1.dy,  r1_2 * Dist1.dz,
			-r1_2 * Dist1.dx, -r1_2 * Dist1.dy, -r1_2 * Dist1.dz,
			0.0, 0.0, 0.0
			];

		B = [
			 r2_2 * Dist2.dx,  r2_2 * Dist2.dy,  r2_2 * Dist2.dz,
			0.0, 0.0, 0.0,
			-r2_2 * Dist2.dx, -r2_2 * Dist2.dy, -r2_2 * Dist2.dz
			];
		
		C = [
			-Dist2.dx, -Dist2.dy, -Dist2.dz,
			 Dist2.dx,  Dist2.dy,  Dist2.dz,
			0.0, 0.0, 0.0
			];
		
		D = [
			-Dist1.dx, -Dist1.dy, -Dist1.dz,
			0.0, 0.0, 0.0,
			 Dist1.dx,  Dist1.dy,  Dist1.dz,
			];
		
		for (j = 0; j < 9; j ++)
		{
			th_diff[j] = (A[j] + B[j]) * cot_th + (C[j] + D[j]) * fac;
		}
		
		Eth = 0.5 * this.Mol[m].Angle[angle_ind].K_bend * dth * dth;
		Fth = -this.Mol[m].Angle[angle_ind].K_bend * dth;
		
		this.Atom[ind0].Fx += Fth * th_diff[0];
		this.Atom[ind0].Fy += Fth * th_diff[1];
		this.Atom[ind0].Fz += Fth * th_diff[2];

		this.Atom[ind1].Fx += Fth * th_diff[3];
		this.Atom[ind1].Fy += Fth * th_diff[4];
		this.Atom[ind1].Fz += Fth * th_diff[5];
		
		this.Atom[ind2].Fx += Fth * th_diff[6];
		this.Atom[ind2].Fy += Fth * th_diff[7];
		this.Atom[ind2].Fz += Fth * th_diff[8];

		this.Pot_Energy += Eth;
	}
};

Sim.IntraMolForce_Nonbonded = function (m)
{
	var Nonbonded_ind = 0, ind1 = 0, ind2 = 0;
	var q1q2 = 0.0;
	var Eel = 0.0, Fel = 0.0, Evdw = 0.0, Fvdw = 0.0;
	var Sig = 0.0, Eps = 0.0;
	var Sig2 = 0.0, Sig2_r2 = 0.0, Sig6_r6 = 0.0, Sig6_r8 = 0.0;
	var Sig12_r12 = 0.0, Sig12_r14 = 0.0;
	
	for (Nonbonded_ind = 0; Nonbonded_ind < this.Mol[m].N_Nonbondeds; Nonbonded_ind ++)
	{
		ind1 = this.Mol[m].Non_Bonded[Nonbonded_ind].Atom_Ind1;
		ind2 = this.Mol[m].Non_Bonded[Nonbonded_ind].Atom_Ind2;
		
		Sig = this.Mol[m].Non_Bonded[Nonbonded_ind].Sig;
		Eps = this.Mol[m].Non_Bonded[Nonbonded_ind].Eps;
		
		Dist = this.ParticleDistance(ind1, ind2);
		
		Sig2 = Sig * Sig;
		
		Sig2_r2 = Sig2 / Dist.r2;
		Sig6_r6 = Sig2_r2 * Sig2_r2 * Sig2_r2;
		Sig6_r8 = Sig6_r6 / Dist.r2;
		Sig12_r12 = Sig6_r6 * Sig6_r6;
		Sig12_r14 = Sig12_r12 / Dist.r2;
				
		Evdw = 4.0 * Eps * (Sig12_r12 - Sig6_r6);
		Fvdw = 24.0 * Eps * (2.0 * Sig12_r14 - Sig6_r8);
		
		q1q2 = this.Atom[ind1].charge * this.Atom[ind2].charge;
		
		if (Math.abs(q1q2) > 0.0)
		{
			r = Math.sqrt(Dist.r2);
			r3 = r * Dist.r2;

			Eel = kEl * this.Atom[ind1].charge * this.Atom[ind2].charge / r;
			Fel = kEl * this.Atom[ind1].charge * this.Atom[ind2].charge / r3;
		}
		else
		{
			Eel = 0.0;
			Fel = 0.0;
		}

		Ftot = Fel + Fvdw;
		Etot = Eel + Evdw;
		
		this.Atom[ind1].Fx += Ftot * Dist.dx;
		this.Atom[ind1].Fy += Ftot * Dist.dy;
		this.Atom[ind1].Fz += Ftot * Dist.dz;
		
		this.Atom[ind2].Fx -= Ftot * Dist.dx;
		this.Atom[ind2].Fy -= Ftot * Dist.dy;
		this.Atom[ind2].Fz -= Ftot * Dist.dz;

		this.Pot_Energy += Etot;
		this.Vir += Ftot * Dist.r2;
	}
};

Sim.CalcInterMolForces = function ()
{
	var m1 = 0, m2 = 0;
	
	for (m1 = 0; m1 < this.N_Mol - 1; m1 ++)
	{					
		for (m2 = m1 + 1; m2 < this.N_Mol; m2 ++)
		{
			this.InterMolForce (m1, m2);
		}
	}
		
};

Sim.CalcIntraMolForces = function ()
{
	var m = 0;
	
	for (m = 0; m < this.N_Mol; m ++)
	{
		this.IntraMolForce_Bond (m);
		this.IntraMolForce_Angle (m);
	}
};

Sim.CalcForces = function ()
{
	this.Pot_Energy = 0.0;
	this.Vir = 0.0;

	this.CalcInterMolForces ();
	this.CalcIntraMolForces ();
};

Sim.VelocityVerletFirst = function ()
{
	var i = 0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].x += this.dt * this.Atom[i].vx + 0.5 * this.dt2 * this.Atom[i].ax;
		this.Atom[i].y += this.dt * this.Atom[i].vy + 0.5 * this.dt2 * this.Atom[i].ay;
		this.Atom[i].z += this.dt * this.Atom[i].vz + 0.5 * this.dt2 * this.Atom[i].az;
		
		this.Wrap(i);
		
		this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
		this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;
		this.Atom[i].vz += 0.5 * this.dt * this.Atom[i].az;

		this.Atom[i].Fx = 0.0;
		this.Atom[i].Fy = 0.0;
		this.Atom[i].Fz = 0.0;
	}
};

Sim.VelocityVerletSecond = function ()
{
	var i = 0;
	
	this.Kin_Energy = 0.0;
	//this.Vir = 0.0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].ax = this.Atom[i].Fx / this.Atom[i].mass;
		this.Atom[i].ay = this.Atom[i].Fy / this.Atom[i].mass;
		this.Atom[i].az = this.Atom[i].Fz / this.Atom[i].mass;
							
		this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
		this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;
		this.Atom[i].vz += 0.5 * this.dt * this.Atom[i].az;
		
		this.Kin_Energy += 0.5 * this.Atom[i].mass * 
			(this.Atom[i].vx * this.Atom[i].vx + this.Atom[i].vy * this.Atom[i].vy + this.Atom[i].vz * this.Atom[i].vz);
			
		//this.Vir += this.Atom[i].x * this.Atom[i].Fx + this.Atom[i].y * this.Atom[i].Fy + this.Atom[i].z * this.Atom[i].Fz;
	}
};

Sim.VelocityVerletFirst2D = function ()
{
	var i = 0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].x += this.dt * this.Atom[i].vx + 0.5 * this.dt2 * this.Atom[i].ax;
		this.Atom[i].y += this.dt * this.Atom[i].vy + 0.5 * this.dt2 * this.Atom[i].ay;
		
		this.Wrap2D(i);
		
		this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
		this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;

		this.Atom[i].Fx = 0.0;
		this.Atom[i].Fy = 0.0;
	}
};

Sim.VelocityVerletSecond2D = function ()
{
	var i = 0;
	
	this.Kin_Energy = 0.0;
	this.Vir = 0.0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].ax = this.Atom[i].Fx / this.Atom[i].mass;
		this.Atom[i].ay = this.Atom[i].Fy / this.Atom[i].mass;
							
		this.Atom[i].vx += 0.5 * this.dt * this.Atom[i].ax;
		this.Atom[i].vy += 0.5 * this.dt * this.Atom[i].ay;
		
		this.Kin_Energy += 0.5 * this.Atom[i].mass * 
			(this.Atom[i].vx * this.Atom[i].vx + this.Atom[i].vy * this.Atom[i].vy);
			
		//this.Vir += this.Atom[i].x * this.Atom[i].Fx + this.Atom[i].y * this.Atom[i].Fy;
	}
};

Sim.CalcPhysProperties = function ()
{
	this.Time += this.dt * 1.0e-6;
	this.Internal_Energy = (this.Kin_Energy + this.Pot_Energy) / this.N * Energy_Factor * Av_Num / 1000.0;
	this.Temperature = this.Kin_Energy * Energy_Factor / (1.5 * kB * this.N);
	this.PV = this.N * kB * this.Temperature + this.Vir / 3.0 * Energy_Factor;
	this.Pressure = this.PV / (this.Volume * 1.0e-27) * 1.0e-5;
	this.Enthalpy = this.Internal_Energy + this.PV / this.N * Av_Num / 1000.0;
	
	this.Kin_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
	this.Pot_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
};

Sim.CalcPhysProperties2D = function ()
{
	this.Time += this.dt * 1.0e-6;
	this.Internal_Energy = (this.Kin_Energy + this.Pot_Energy) / this.N * Energy_Factor * Av_Num / 1000.0;
	this.Temperature = this.Kin_Energy * Energy_Factor / (kB * this.N);
	this.PV = this.N * kB * this.Temperature + this.Vir / 2.0 * Energy_Factor;
	this.Pressure = this.PV / (this.Volume * 1.0e-27) * 1.0e-5;
	this.Enthalpy = this.Internal_Energy + this.PV / this.N * Av_Num / 1000.0;
	
	this.Kin_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
	this.Pot_Energy *= Energy_Factor / this.N * Av_Num / 1000.0;
};

Sim.Thermostat = function ()
{
	var Xi = Math.sqrt(1.0 + (this.dt / this.Berendsen_Time_Const) * (this.Setpoint_Temperature / this.Temperature - 1.0));
	
	var i = 0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].vx *= Xi;
		this.Atom[i].vy *= Xi;
		this.Atom[i].vz *= Xi;
	}
};

Sim.Thermostat2D = function ()
{
	var Xi = Math.sqrt(1.0 + (this.dt / this.Berendsen_Time_Const) * (this.Setpoint_Temperature / this.Temperature - 1.0));
	
	var i = 0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].vx *= Xi;
		this.Atom[i].vy *= Xi;
	}
};

Sim.Barostat = function ()
{
	var Miu = Math.pow(1.0 - (this.dt * this.Isothermal_Compressibility / this.Berendsen_Time_Const) * (this.Setpoint_Pressure - this.Pressure), 1.0 / 3.0);
	
	this.Box_Len *= Miu;
	this.Box_Half_Len = 0.5 * this.Box_Len;
	
	var i = 0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].x *= Miu;
		this.Atom[i].y *= Miu;
		this.Atom[i].z *= Miu;
	}
	
	this.Volume = this.Box_Len * this.Box_Len * this.Box_Len;
};

Sim.Barostat2D = function ()
{	
	var Miu = Math.pow(1.0 - (this.dt * this.Isothermal_Compressibility / this.Berendsen_Time_Const) * (this.Setpoint_Pressure - this.Pressure), 1.0 / 3.0);
	
	this.Box_Len *= Miu;
	this.Box_Half_Len = 0.5 * this.Box_Len;
	
	var i = 0;
	
	for (i = 0; i < this.N; i ++)
	{
		this.Atom[i].x *= Miu;
		this.Atom[i].y *= Miu;
	}
	
	this.Volume = this.Box_Len * this.Box_Len * this.Box_Thickness;
};

Sim.IncreaseTemperature = function (Step, Max_Temperaure)
{
	if (this.Setpoint_Temperature < Max_Temperaure && this.Started)
	{
		this.Setpoint_Temperature += Step;
	}
};

Sim.DecreaseTemperature = function (Step, Min_Temperature)
{
	if (this.Setpoint_Temperature > Min_Temperature && this.Started)
	{
		this.Setpoint_Temperature -= Step;
	}
};

Sim.IncreasePressure = function ()
{
	if (this.Started)
	{
		if (this.Setpoint_Pressure < 1.0)
		{
			this.Setpoint_Pressure += 0.1;
		}
		else if (this.Setpoint_Pressure < 10.0)
		{
			this.Setpoint_Pressure += 1.0;
		}
		else if (this.Setpoint_Pressure < 1000.0)
		{
			this.Setpoint_Pressure += 10.0;
		}
	}
};

Sim.DecreasePressure = function ()
{
	if (this.Started)
	{
		if (this.Setpoint_Pressure > 10.0)
		{
			this.Setpoint_Pressure -= 10.0;
		}
		else if (this.Setpoint_Pressure > 1.0)
		{
			this.Setpoint_Pressure -= 1.0;
		}
		else if (this.Setpoint_Pressure >= 0.2)
		{
			this.Setpoint_Pressure -= 0.1;
		}
	}
};

Sim.BoxClick = function ()
{
};
