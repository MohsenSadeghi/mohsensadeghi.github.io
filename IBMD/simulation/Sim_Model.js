// Model builder for molecular dynamics simulations
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
	
Model_Builder = {
	Length_Tol : 1.0e-2,
	Angle_Tol : 1.0e-2
};

Model_Builder.Init = function ()
{
};

Model_Builder.AddWater_SPCFw = function (_Sim, _Mol_Ind, _px, _py, _pz)
{
	var ind = _Sim.N;
	
	_Sim.Atom[ind] = new Particle();
	_Sim.Atom[ind].SetProperties('SPCFw_O');
	_Sim.Atom[ind].SetPosition(_px, _py, _pz);
		
	_Sim.Atom[ind + 1] = new Particle();
	_Sim.Atom[ind + 1].SetProperties('SPCFw_H');
	_Sim.Atom[ind + 1].SetPosition(_px + SPCFw_rOH, _py, _pz);
		
	_Sim.Atom[ind + 2] = new Particle();
	_Sim.Atom[ind + 2].SetProperties('SPCFw_H');
	_Sim.Atom[ind + 2].SetPosition(_px + SPCFw_rOH * Math.cos(SPCFw_thHOH), _py + SPCFw_rOH * Math.sin(SPCFw_thHOH), _pz);
	
	_Sim.Mol[_Mol_Ind].AddAtom (ind);
	_Sim.Mol[_Mol_Ind].AddAtom (ind + 1);
	_Sim.Mol[_Mol_Ind].AddAtom (ind + 2);

	_Sim.Mol[_Mol_Ind].AddBond (ind, ind + 1, SPCFw_rOH, SPCFw_kr);
	_Sim.Mol[_Mol_Ind].AddBond (ind, ind + 2, SPCFw_rOH, SPCFw_kr);
	_Sim.Mol[_Mol_Ind].AddAngle (ind, ind + 1, ind + 2, SPCFw_thHOH, SPCFw_kth);
	
	_Sim.N += 3;
}

Model_Builder.AddGraphene = function (_Sim, _Mol_Ind, _px, _py, _pz, _W, _H)
{
	var Bond_Length = 0.1421;

	var W = 2 * _W;
	var H = 2 * _H;
	
	var i = 0, j = 0;
	var G = [];
	var c = Math.cos(Math.PI / 3);
	var s = Math.sin(Math.PI / 3);
	var ind = 0, d = 0;
	
	for (j = 0; j < W; j ++)
	{
		ind = H * j;
		
		G[ind * 3		] = -j % 2 * c;
		G[ind * 3 + 1	] = j * s;
		G[ind * 3 + 2	] = 0.0;

		for (i = 1; i < H; i ++)
		{
			if ((i + j) % 2 == 0)
			{
				d = 2.0;
			}
			else
			{
				d = 1.0;
			}
		
			ind = i + H * j;
			
			G[ind * 3		] = G[(ind - 1) * 3] + d;
			G[ind * 3 + 1	] = j * s;
			G[ind * 3 + 2	] = 0.0;
		}
	}
	
	for (i = 0; i < G.length / 3; i ++)
	{
		ind = i * 3;
		
		_Sim.Atom[_Sim.N] = new Particle();
		_Sim.Atom[_Sim.N].SetProperties('C');
		_Sim.Atom[_Sim.N].SetPosition(Bond_Length * G[ind] + _px, Bond_Length * G[ind + 1] + _py, Bond_Length * G[ind + 2] + _pz);
		_Sim.Mol[_Mol_Ind].AddAtom (_Sim.N);
		
		_Sim.N ++;
	}

}

Model_Builder.AddC60 = function (_Sim, _Mol_Ind, _px, _py, _pz, _charge)
{
	var C60 = [
		2.226730, 0.594920, 2.684200,
		3.134080, 0.161810, 1.635440,
		1.342130, -0.311850, 3.256820,
		3.117650, -1.159560, 1.204400,
		3.216930, -1.462050, -0.213260,
		3.250250, 1.240130, 0.668290,
		3.345290, 0.950710, -0.688050,
		3.328380, -0.430390, -1.138540,
		-0.452190, 1.374270, 3.230230,
		0.472290, 2.321910, 2.631870,
		-0.027000, 0.086540, 3.535890,
		1.782170, 1.940950, 2.364960,
		2.414560, 2.339640, 1.119120,
		-0.264220, 3.118480, 1.665080,
		0.340880, 3.499990, 0.473170,
		1.709970, 3.101980, 0.194250,
		-2.141500, -0.846500, 2.686090,
		-2.585870, 0.499300, 2.366750,
		-0.890470, -1.048410, 3.257750,
		-1.759930, 1.585190, 2.632880,
		-1.643750, 2.662990, 1.665550,
		-3.332630, 0.442150, 1.121470,
		-3.221550, 1.473440, 0.196030,
		-2.358450, 2.608490, 0.474240,
		-0.506670, -2.998220, 1.803800,
		-1.814140, -2.787320, 1.206480,
		-0.054970, -2.148180, 2.806770,
		-2.613600, -1.735240, 1.637920,
		-3.349590, -0.938890, 0.670910,
		-1.714530, -3.090350, -0.211190,
		-2.418840, -2.328500, -1.136370,
		-3.254550, -1.228980, -0.685460,
		2.193000, -2.107290, 1.802560,
		1.720910, -2.995760, 0.754440,
		1.324810, -1.692910, 2.806120,
		0.400930, -3.431500, 0.755070,
		-0.345460, -3.488360, -0.490180,
		2.353890, -2.597090, -0.491290,
		1.639710, -2.651480, -1.682710,
		0.260190, -3.107130, -1.682110,
		-2.230680, -0.584280, -2.701320,
		-1.785970, -1.930080, -2.382100,
		-0.475910, -2.310710, -2.648970,
		-1.346280, 0.322850, -3.273640,
		-2.197990, 2.118350, -1.819620,
		-3.122300, 1.170370, -1.221530,
		-3.138380, -0.151090, -1.652660,
		-1.329630, 1.704060, -2.823020,
		0.501490, 3.010120, -1.820490,
		-0.406030, 3.443130, -0.771880,
		-1.725990, 3.007160, -0.771470,
		0.049970, 2.159870, -2.823390,
		2.137050, 0.858790, -2.702690,
		2.608990, 1.747420, -1.654660,
		1.809270, 2.799410, -1.223290,
		0.885930, 1.060390, -3.274220,
		0.448510, -1.362650, -3.246970,
		1.756120, -1.573340, -2.649740,
		2.581820, -0.487170, -2.383660,
		0.023000, -0.074940, -3.552420
	];
	
	var i = 0, ind = 0;
	
	for (i = 0; i < 60; i ++)
	{
		ind = i * 3;
		
		_Sim.Atom[_Sim.N] = new Particle();
		_Sim.Atom[_Sim.N].SetProperties('C');
		_Sim.Atom[_Sim.N].SetPosition(0.1 * C60[ind] + _px, 0.1 * C60[ind + 1] + _py, 0.1 * C60[ind + 2] + _pz);
		_Sim.Atom[_Sim.N].charge = _charge / 60.0;
		_Sim.Mol[_Mol_Ind].AddAtom (_Sim.N);
		
		_Sim.N ++;
	}
	
};

Model_Builder.AddC70 = function (_Sim, _Mol_Ind, _px, _py, _pz, _charge)
{
	var C70 = [
			3.235063,	0.000000,	2.401060,
			3.235063,	2.283544,	0.741969,
			-3.235063,	0.000000,	2.401060,
			3.235063,	1.411308,	-1.942498,
			-3.235063,	2.283544,	0.741969,
			-3.235063,	-2.283544,	0.741968,
			3.235063,	-1.411308,	-1.942499,
			-3.235063,	1.411308,	-1.942498,
			-3.235063,	-1.411308,	-1.942499,
			3.235063,	-2.283544,	0.741968,
			2.448852,	1.168233,	2.768451,	
			2.448852,	2.993957,	-0.255557,	
			-2.448852,	-1.168234,	2.768450,	
			-2.448852,	1.168233,	2.768451,	
			2.448852,	0.682134,	-2.926394,	
			-2.448852,	2.271949,	1.966555,	
			-2.448852,	2.993957,	-0.255557,	
			-2.448852,	-2.993957,	-0.255558,	
			2.448852,	-1.168234,	2.768450,	
			2.448852,	-2.572375,	-1.553054,	
			-2.448852,	2.572375,   -1.553053,	
			-2.448852,	0.682134,   -2.926394,	
			2.448852,	2.271949,	1.966555,	
			-2.448852,	-0.682133,	-2.926394,	
			2.448852,	-2.271949,	1.966554,	
			2.448852,	-2.993957,	-0.255558,	
			-2.448852,	-2.572375,	-1.553054,	
			2.448852,	2.572375,   -1.553053,	
			2.448852,	-0.682133,	-2.926394,	
			-2.448852,	-2.271949,	1.966554,	
			1.197366,	0.708677,	3.388131,	
			1.197366,	3.441297,	0.372998,	
			-1.197366,	-0.708678,	3.388131,	
			-1.197366,	0.708677,	3.388131,	
			1.197366,	1.418162,   -3.157605,	
			-1.197366,	3.003310,	1.720983,	
			-1.197366,	3.441297,	0.372998,	
			-1.197366,	-3.441297,	0.372997,	
			1.197366,	-0.708678,	3.388131,	
			1.197366,	-2.564825,   -2.324506,	
			-1.197366,	2.564826,   -2.324505,	
			-1.197366,	1.418162,   -3.157605,	
			1.197366,	3.003310,	1.720983,	
			-1.197366,	-1.418161,   -3.157606,	
			1.197366,	-3.003311,	1.720982,	
			1.197366,	-3.441297,	0.372997,	
			-1.197366,	-2.564825,	-2.324506,	
			1.197366,	2.564826,	-2.324505,	
			1.197366,	-1.418161,	-3.157606,	
			-1.197366,	-3.003311,	1.720982,	
			0.000000,	1.448698,	3.257909,	
			0.000000,	3.546127,	-0.371045,	
			0.000000,	-1.448699,	3.257908,	
			0.000000,	0.742929,   -3.487227,	
			0.000000,	2.650782,	2.384544,	
			0.000000,	-3.546127,	-0.371046,	
			0.000000,	-3.086972,	-1.784180,	
			0.000000,	3.086972,   -1.784179,	
			0.000000,	-0.742928,	-3.487227,	
			0.000000,	-2.650783,	2.384543,	
			3.982783,	0.000000,	1.242662,	
			3.982783,	1.181842,	0.384004,	
			-3.982783,	0.000000,	1.242662,	
			3.982783,	0.730419,   -1.005335,	
			-3.982783,	1.181842,	0.384004,	
			-3.982783,	-1.181842,	0.384004,	
			3.982783,	-0.730419,	-1.005335,	
			-3.982783,	0.730419,	-1.005335,	
			-3.982783,	-0.730419,	-1.005335,	
			3.982783,	-1.181842,	0.384004];
	
	var i = 0, ind = 0;
	
	for (i = 0; i < 70; i ++)
	{
		ind = i * 3;
		
		_Sim.Atom[_Sim.N] = new Particle();
		_Sim.Atom[_Sim.N].SetProperties('C');
		_Sim.Atom[_Sim.N].SetPosition(0.1 * C70[ind] + _px, 0.1 * C70[ind + 1] + _py, 0.1 * C70[ind + 2] + _pz);
		_Sim.Atom[_Sim.N].charge = _charge / 60.0;
		
		_Sim.Mol[_Mol_Ind].AddAtom (_Sim.N);
		
		_Sim.N ++;
	}
	
};

Model_Builder.DetectBonds = function (_Sim, _Mol_Ind, _r_eq, _K_stretch)
{
	var i = 0, j = 0;
	var ind1, ind2, Dist;
	var r = 0.0;
	
	for (i = 0; i < _Sim.Mol[_Mol_Ind].N_Atoms; i ++)
	{
		ind1 = _Sim.Mol[_Mol_Ind].Atom_Ind[i];

		for (j = i + 1; j < _Sim.Mol[_Mol_Ind].N_Atoms; j ++)
		{
			ind2 = _Sim.Mol[_Mol_Ind].Atom_Ind[j];
			
			Dist = _Sim.ParticleDistance(ind1, ind2);
			
			r = Math.sqrt(Dist.r2);
			
			if ((r - _r_eq) < this.Length_Tol)
			{
				_Sim.Mol[_Mol_Ind].AddBond(ind1, ind2, _r_eq, _K_stretch);
			}
		}
	}
	
};

Model_Builder.DetectAngles = function (_Sim, _Mol_Ind, _th_eq, _K_bend)
{
	
	var i = 0, j = 0;
	var ind1, ind2, ind3, ind4, Dist1, Dist2;
	var r = 0.0;
	
	for (i = 0; i < _Sim.Mol[_Mol_Ind].N_Bonds; i ++)
	{
		ind1 = _Sim.Mol[_Mol_Ind].Bond[i].Atom_Ind1;
		ind2 = _Sim.Mol[_Mol_Ind].Bond[i].Atom_Ind2;

		for (j = i + 1; j < _Sim.Mol[_Mol_Ind].N_Bonds; j ++)
		{
			ind3 = _Sim.Mol[_Mol_Ind].Bond[j].Atom_Ind1;
			ind4 = _Sim.Mol[_Mol_Ind].Bond[j].Atom_Ind2;
			
			if (ind3 == ind1)
			{
				_Sim.Mol[_Mol_Ind].AddAngle(ind3, ind2, ind4, _th_eq, _K_bend);
			}
			else if (ind3 == ind2)
			{
				_Sim.Mol[_Mol_Ind].AddAngle(ind3, ind1, ind4, _th_eq, _K_bend);
			}
			else if (ind4 == ind1)
			{
				_Sim.Mol[_Mol_Ind].AddAngle(ind4, ind2, ind3, _th_eq, _K_bend);
			}
			else if (ind4 == ind2)
			{
				_Sim.Mol[_Mol_Ind].AddAngle(ind4, ind1, ind3, _th_eq, _K_bend);
			}
		}
	}
	
};
