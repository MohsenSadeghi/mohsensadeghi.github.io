// Numeric Utilities for In-Browser Molecular Dynamics (IBMD)
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

function Random (Min_Value, Max_Value)
{
	return ((Math.random() * (Max_Value - Min_Value)) + Min_Value);
}

function FormatNumber (a, Precision)
{
	var Str = a.toString();
	var Dot_Ind = Str.indexOf('.');
	var Out = "";
	
	if (Dot_Ind > 0)
	{
		Out = Str.slice(0, Str.indexOf('.') + Precision + 1);
	}
	else
	{
		Out = Str;
	}
	
	return Out;
}

function ArrayMin(a)
{
	var i = 0;
	var Min_Value = 1.0e20;
	
	for (i = 0; i < a.length; i ++)
	{
		if (a[i] < Min_Value)
		{
			Min_Value = a[i];
		}
	}
	
	return Min_Value;
}

function ArrayMax(a)
{
	var i = 0;
	var Max_Value = -1.0e20;
	var Len = a.length;
	
	if (Len > -1)
	{
		for (i = 0; i < Len; i ++)
		{
			if (a[i] > Max_Value)
			{
				Max_Value = a[i];
			}
		}
	}
	else
	{
		Max_Value = 0.0;
	}
	
	return Max_Value;
}
