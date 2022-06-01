// Display Manager for In-Browser Molecular Dynamics (IBMD)
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

Obj_3D = function ()
{
	this.Vertices_Position_Buffer = 0;
	this.Vertices_Normal_Buffer = 0;
	this.Vertices_Color_Buffer = 0;
	this.Vertices_Index_Buffer = 0;
	this.N_Triangles = 0;
};

var Display_Manager =
	{
		Busy : false,
		
		Canvas_Handle: null,
		Canvas_Context: null,
		Canvas_Size: 0,
		Canvas_Center_X: 0,
		Canvas_Center_Y: 0,
		
		GL : null,
		Is_WebGL : false,
		Shader_Program : null,
		
		Camera_Position : [],
		Camera_Phi : 0.0,
		Camera_Theta : 0.0,
		
		Drag_Event : false,
		Drag_Start_X : 0,
		Drag_Start_Y : 0,
		
		Perspective_Matrix : null,
		Camera_Matrix : null,
		Model_View_Matrix : null,
		Normal_Matrix : null,
		
		Vertex_Position_Attribute : null,
		Vertex_Normal_Attribute : null,
		//Vertex_Color_Attribute : null,
		
		Sphere : new Obj_3D(),
		Box : new Obj_3D(),
		Cylinder : new Obj_3D()
		
	};

Display_Manager.Init = function (Canvas_Element_Id)
{
	this.Canvas_Handle = document.getElementById(Canvas_Element_Id);
	this.Canvas_Context = this.Canvas_Handle.getContext('2d');
}

Display_Manager.Lock = function ()
{
	Busy = true;
}

Display_Manager.Unlock = function ()
{
	Busy = false;
}

Display_Manager.HexToRGB = function (hex)
{
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

Display_Manager.InitWebGL = function (Canvas_Element_Id)
{
	this.Is_WebGL = false;
	
	this.Canvas_Handle = document.getElementById(Canvas_Element_Id);
	
	try
	{
		this.GL = this.Canvas_Handle.getContext('webgl') || this.Canvas_Handle.getContext('experimental-webgl');
	}
	catch (err)
	{
		alert ('Sorry! Your browser does not supper WebGL! Try upgrading to a new version.');
	}
	
	if (this.GL)
	{
		this.Is_WebGL = true;
		
		this.GL.viewport(0, 0, this.Canvas_Handle.width, this.Canvas_Handle.height);
		
		this.GL.enable(this.GL.DEPTH_TEST);
		this.GL.depthFunc(this.GL.LEQUAL);

		var Fragment_Shader_Src = 	'varying highp vec4 vColor;' +
									'varying highp vec3 vLighting;' +
									
									
									'void main(void) {' +
									'	gl_FragColor = vec4(vColor.rgb * vLighting, vColor.a);' +
									'}';
/*									
		var Vertex_Shader_Src = 	'attribute highp vec3 aVertexPosition;' +
									'attribute highp vec3 aVertexNormal;' + 
									'attribute highp vec4 aVertexColor;' +

									'uniform highp mat4 uNormalMatrix;' +
									'uniform highp mat4 uMVMatrix;' +
									'uniform highp mat4 uPMatrix;' +

									'varying highp vec4 vColor;' +
									'varying highp vec3 vLighting;' +

									'void main(void) {' +
									'	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);' +

									'	highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);' +
									'	highp vec3 pointLightColor = vec3(1.0, 1.0, 1.0);' +
									'	highp vec3 pointLightPosition = vec3(0.4, 0.4, 0.4);' +
									'	highp vec4 pointLightActualPosition = uPMatrix * uMVMatrix * vec4(pointLightPosition, 1.0);' +
									'	highp vec3 pointLightVector = normalize(pointLightActualPosition.xyz - gl_Position.xyz);' +

									'	highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);' +

									'	highp float pointLightIntensity = max(dot(transformedNormal.xyz, pointLightVector), 0.0);' +
									'	vLighting = ambientLight + (pointLightColor * pointLightIntensity);' +
									'	vColor = aVertexColor;' +
									'}';
*/
		var Vertex_Shader_Src = 	'attribute highp vec3 aVertexPosition;' +
									'attribute highp vec3 aVertexNormal;' + 
									'/*attribute highp vec4 aVertexColor;*/' +

									'uniform highp mat4 uNormalMatrix;' +
									'uniform highp mat4 uMVMatrix;' +
									'uniform highp mat4 uPMatrix;' +
									'uniform highp vec4 allVertexColor;' +
									
									'varying highp vec4 vColor;' +
									'varying highp vec3 vLighting;' +

									'void main(void) {' +
									'	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);' +

									'	highp vec3 ambientLight = vec3(0.3, 0.3, 0.2);' +
									'	highp vec3 dirLight1Color = vec3(0.70, 0.70, 0.60);' +
									'	highp vec3 dirLight1Vector = vec3(-0.577, -0.577, 0.577);' +
									'	highp vec3 dirLight2Color = vec3(0.60, 0.70, 0.70);' +
									'	highp vec3 dirLight2Vector = vec3(0.577, 0.577, 0.577);' +

									'	highp vec4 trNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);' +
									'	highp vec4 trDirL1Vec = uNormalMatrix * vec4(dirLight1Vector, 1.0);' +
									'	highp vec4 trDirL2Vec = uNormalMatrix * vec4(dirLight2Vector, 1.0);' +

									'	highp float dirLight1Intensity = max(dot(trNormal.xyz, trDirL1Vec.xyz), 0.0);' +
									'	highp float dirLight2Intensity = max(dot(trNormal.xyz, trDirL2Vec.xyz), 0.0);' +
									'	vLighting = ambientLight + (dirLight1Color * dirLight1Intensity + dirLight2Color * dirLight2Intensity);' +
									'	vColor = allVertexColor;' +
									'}';

		var Fragment_Shader = this.GL.createShader(this.GL.FRAGMENT_SHADER);
		var Vertex_Shader = this.GL.createShader(this.GL.VERTEX_SHADER);
		
		this.GL.shaderSource(Fragment_Shader, Fragment_Shader_Src);
		this.GL.compileShader(Fragment_Shader);

		this.GL.shaderSource(Vertex_Shader, Vertex_Shader_Src);
		this.GL.compileShader(Vertex_Shader);  

		this.Shader_Program = this.GL.createProgram();

		this.GL.attachShader(this.Shader_Program, Vertex_Shader);
		this.GL.attachShader(this.Shader_Program, Fragment_Shader);
		this.GL.linkProgram(this.Shader_Program);

		this.GL.useProgram(this.Shader_Program);

		this.Vertex_Position_Attribute = this.GL.getAttribLocation(this.Shader_Program, 'aVertexPosition');
		this.GL.enableVertexAttribArray(this.Vertex_Position_Attribute);

		this.Vertex_Normal_Attribute = this.GL.getAttribLocation(this.Shader_Program, 'aVertexNormal');
		this.GL.enableVertexAttribArray(this.Vertex_Normal_Attribute);

		//this.Vertex_Color_Attribute = this.GL.getAttribLocation(this.Shader_Program, 'allVertexColor');
		//this.GL.enableVertexAttribArray(this.Vertex_Color_Attribute);
		
		this.CameraReset ();
		
		this.PrepareBuffers ();
	}
	else
	{
		alert ('WebGL is not supported on you browser!');
	}

};

Display_Manager.Position = function (_Canvas_Size, _Canvas_Top, _Canvas_Right)
{
	this.Canvas_Size = _Canvas_Size;
	
	this.Canvas_Handle.width = this.Canvas_Size;
	this.Canvas_Handle.height = this.Canvas_Size;
	
	this.Canvas_Handle.style.position = 'absolute';
	this.Canvas_Handle.style.top = _Canvas_Top + 'px';	
	this.Canvas_Handle.style.right = _Canvas_Right + 'px';	

	this.Canvas_Center_X = Math.floor(this.Canvas_Size / 2);
	this.Canvas_Center_Y = Math.floor(this.Canvas_Size / 2);
	
	if (this.Is_WebGL)
	{
		this.Is_WebGL = true;
		
		this.GL.viewport(0, 0, this.Canvas_Size, this.Canvas_Size);
		
		this.GL.clearColor(0.0, 0.0, 0.0, 1.0);
		this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
	}

};

Display_Manager.PrepareBuffers = function ()
{
	var i = 0, j = 0, k = 0;
	var N_Div = 20;
	var Theta = 0.0;
	var Phi = 0.0;
		
	var Rad = 1.0, ind = 0;
	
	var Vertices = [];
	var Normals = [];
	var Colors = [];
	var Indices = [];
	
	var ind1, ind2, ind3;
	
	for (i = 0; i < N_Div + 1; i ++)
	{
		Theta = Math.PI * i / N_Div;
		
		for (j = 0; j < 2 * (N_Div + 1); j ++)
		{
			Phi = Math.PI * j / N_Div;
			
			ind = j + i * (2 * N_Div + 2);
			
			Vertices[ind * 3	] = Rad * Math.sin(Theta) * Math.cos(Phi);
			Vertices[ind * 3 + 1] = Rad * Math.sin(Theta) * Math.sin(Phi);
			Vertices[ind * 3 + 2] = Rad * Math.cos(Theta);

			Normals[ind * 3		] = Math.sin(Theta) * Math.cos(Phi);
			Normals[ind * 3 + 1	] = Math.sin(Theta) * Math.sin(Phi);
			Normals[ind * 3 + 2	] = Math.cos(Theta);
			
			Colors[ind * 4		] = 0.0;
			Colors[ind * 4 + 1	] = 0.9;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;
		}
	}
	
	for (i = 0; i < N_Div; i ++)
	{
		for (j = 0; j < 2 * N_Div; j ++)
		{
			ind = j + i * (2 * N_Div);
			ind1 = j + i * (2 * N_Div + 2);
						
			Indices[ind * 6		] = ind1;
			Indices[ind * 6 + 1	] = ind1 + (2 * N_Div + 2);
			Indices[ind * 6 + 2	] = ind1 + 1;
			Indices[ind * 6 + 3	] = ind1 + 1;
			Indices[ind * 6 + 4	] = ind1 + 1 + (2 * N_Div + 2);
			Indices[ind * 6 + 5	] = ind1 + (2 * N_Div + 2);
		}
	}

	this.Sphere.N_Triangles = Indices.length / 3;
	
	this.Sphere.Vertices_Position_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Position_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Vertices), this.GL.STATIC_DRAW);
	
	this.Sphere.Vertices_Normal_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Normal_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Normals), this.GL.STATIC_DRAW);	
	
	this.Sphere.Vertices_Color_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Color_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Colors), this.GL.STATIC_DRAW);
	
	this.Sphere.Vertices_Index_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Sphere.Vertices_Index_Buffer);
	this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Indices), this.GL.STATIC_DRAW);
	
	N_Div = 20;
	var N_Divp = N_Div + 1;
	var N_Div2 = N_Div * N_Div;
	var N_Divp2 = (N_Div + 1) * (N_Div + 1);
	
	Vertices = [];
	Colors = [];
	Normals = [];
	Indices = [];
	
	var u, v, ind1;
	
	for (i = 0; i < N_Divp; i ++)
	{
		u = i / N_Div;

		for (j = 0; j < N_Divp; j ++)
		{
			ind = j + i * N_Divp;
				
			v = j / N_Div;
			
			Vertices[ind * 3	] = 0.5;
			Vertices[ind * 3 + 1] = -0.5 + v;
			Vertices[ind * 3 + 2] = -0.5 + u;
			
			Normals[ind * 3		] = -1.0;
			Normals[ind * 3 + 1	] = 0.0;
			Normals[ind * 3 + 2	] = 0.0;
			
			Colors[ind * 4		] = 1.0;
			Colors[ind * 4 + 1	] = 1.0;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;

			ind += N_Divp2;
			
			Vertices[ind * 3	] = 0.5 - v;
			Vertices[ind * 3 + 1] = 0.5;
			Vertices[ind * 3 + 2] = -0.5 + u;
			
			Normals[ind * 3	] = 0.0;
			Normals[ind * 3 + 1] = -1.0;
			Normals[ind * 3 + 2] = 0.0;

			Colors[ind * 4		] = 1.0;
			Colors[ind * 4 + 1	] = 1.0;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;

			ind += N_Divp2;

			Vertices[ind * 3	] = -0.5;
			Vertices[ind * 3 + 1] = 0.5 - v;
			Vertices[ind * 3 + 2] = -0.5 + u;

			Normals[ind * 3	] = 1.0;
			Normals[ind * 3 + 1] = 0.0;
			Normals[ind * 3 + 2] = 0.0;
			
			Colors[ind * 4		] = 1.0;
			Colors[ind * 4 + 1	] = 1.0;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;

			ind += N_Divp2;

			Vertices[ind * 3	] = -0.5 + v;
			Vertices[ind * 3 + 1] = -0.5;
			Vertices[ind * 3 + 2] = -0.5 + u;

			Normals[ind * 3	] = 0.0;
			Normals[ind * 3 + 1] = 1.0;
			Normals[ind * 3 + 2] = 0.0;
			
			Colors[ind * 4		] = 1.0;
			Colors[ind * 4 + 1	] = 1.0;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;

			ind += N_Divp2;

			Vertices[ind * 3	] = 0.5 - u;
			Vertices[ind * 3 + 1] = -0.5 + v;
			Vertices[ind * 3 + 2] = -0.5;
			
			Normals[ind * 3	] = 0.0;
			Normals[ind * 3 + 1] = 0.0;
			Normals[ind * 3 + 2] = 1.0;

			Colors[ind * 4		] = 1.0;
			Colors[ind * 4 + 1	] = 1.0;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;
			
			ind += N_Divp2;

			Vertices[ind * 3	] = 0.5 - u;
			Vertices[ind * 3 + 1] = -0.5 + v;
			Vertices[ind * 3 + 2] = 0.5;

			Normals[ind * 3	] = 0.0;
			Normals[ind * 3 + 1] = 0.0;
			Normals[ind * 3 + 2] = -1.0;

			Colors[ind * 4		] = 1.0;
			Colors[ind * 4 + 1	] = 1.0;
			Colors[ind * 4 + 2	] = 1.0;
			Colors[ind * 4 + 3	] = 1.0;
		}
	}
	/*	
	for (i = 0; i < N_Div; i ++)
	{
		for (j = 0; j < N_Div; j ++)
		{
			ind = j + i * N_Div;
			ind1 = j + i * N_Divp;
			
			for (k = 0; k < 6; k ++)
			{
				Indices[ind * 6		] = ind1;
				Indices[ind * 6 + 1	] = ind1 + 1;
				Indices[ind * 6 + 2	] = ind1 + 1 + N_Divp;

				Indices[ind * 6 + 3	] = ind1;
				Indices[ind * 6 + 4	] = ind1 + 1 + N_Divp;
				Indices[ind * 6 + 5	] = ind1 + N_Divp;
				
				ind += N_Div2;
				ind1 += N_Divp2;
			}
		}
	}
	
	this.Box.N_Triangles = Indices.length / 3;
	*/
	
	for (i = 0; i < N_Div; i ++)
	{
		for (j = 0; j < N_Div; j ++)
		{
			ind = j + i * N_Div;
			ind1 = j + i * N_Divp;
			
			
			for (k = 0; k < 6; k ++)
			{
				Indices[ind * 8		] = ind1;
				Indices[ind * 8 + 1	] = ind1 + 1;
				
				Indices[ind * 8 + 2	] = ind1 + 1;
				Indices[ind * 8 + 3	] = ind1 + 1 + N_Divp;

				Indices[ind * 8 + 4	] = ind1 + 1 + N_Divp;
				Indices[ind * 8 + 5	] = ind1 + N_Divp;

				Indices[ind * 8 + 6	] = ind1 + N_Divp;
				Indices[ind * 8 + 7	] = ind1;
				
				ind += N_Div2;
				ind1 += N_Divp2;
			}
		}
	}
	this.Box.N_Triangles = Indices.length / 2;
	
	
	this.Box.Vertices_Position_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Position_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Vertices), this.GL.STATIC_DRAW);
	
	this.Box.Vertices_Normal_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Normal_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Normals), this.GL.STATIC_DRAW);	
	
	this.Box.Vertices_Color_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Color_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Colors), this.GL.STATIC_DRAW);
	
	this.Box.Vertices_Index_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Box.Vertices_Index_Buffer);
	this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Indices), this.GL.STATIC_DRAW);

	 N_Div = 20;
		
	 Rad = 1.0;
	 var Height = 1.0;
	
	 Vertices = [];
	 Normals = [];
	 Colors = [];
	 Indices = [];
		
	for (i = 0; i < (N_Div + 1); i ++)
	{
		for (j = 0; j < (N_Div + 1); j ++)
		{
			Theta = 2.0 * Math.PI * j / N_Div;
			
			ind = j + i * (N_Div + 1);
			
			Vertices[ind * 3	] = Rad * Math.cos(Theta);
			Vertices[ind * 3 + 1] = Rad * Math.sin(Theta);
			Vertices[ind * 3 + 2] = Height / N_Div * i;

			Normals[ind * 3		] = Math.cos(Theta);
			Normals[ind * 3 + 1	] = Math.sin(Theta);
			Normals[ind * 3 + 2	] = 0.0;
		}
	}
	
	for (i = 0; i < N_Div; i ++)
	{
		for (j = 0; j < N_Div; j ++)
		{
			ind = j + i * N_Div;
			ind1 = j + i * (N_Div + 1);
						
			Indices[ind * 6		] = ind1;
			Indices[ind * 6 + 1	] = ind1 + (N_Div + 1);
			Indices[ind * 6 + 2	] = ind1 + 1;
			Indices[ind * 6 + 3	] = ind1 + 1;
			Indices[ind * 6 + 4	] = ind1 + 1 + (N_Div + 1);
			Indices[ind * 6 + 5	] = ind1 + (N_Div + 1);
		}
	}

	this.Cylinder.N_Triangles = Indices.length / 3;
	
	this.Cylinder.Vertices_Position_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Position_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Vertices), this.GL.STATIC_DRAW);
	
	this.Cylinder.Vertices_Normal_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Normal_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Normals), this.GL.STATIC_DRAW);	
	
	this.Cylinder.Vertices_Color_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Color_Buffer);
	this.GL.bufferData(this.GL.ARRAY_BUFFER, new Float32Array(Colors), this.GL.STATIC_DRAW);
	
	this.Cylinder.Vertices_Index_Buffer = this.GL.createBuffer();
	this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Cylinder.Vertices_Index_Buffer);
	this.GL.bufferData(this.GL.ELEMENT_ARRAY_BUFFER, new Uint16Array(Indices), this.GL.STATIC_DRAW);	
};

Display_Manager.DisplayAtoms = function (Sim)
{
	if (!Sim.Busy && !this.Busy)
	{
		this.Lock();
		Sim.Lock();
		
		this.Canvas_Context.fillStyle = '#FFFFFF';
		this.Canvas_Context.fillRect(0, 0, this.Canvas_Size, this.Canvas_Size);

		var Scale = this.Canvas_Size / Sim.Box_Len;

		var i = 0, cx = 0, cy = 0;
		
		this.Canvas_Context.font = 'bold 11px Arial';
		
		for (i = 0; i < Sim.N; i ++)
		{
			this.Canvas_Context.beginPath();
			
			cx = Math.floor(this.Canvas_Center_X + Sim.Atom[i].x * Scale);
			cy = Math.floor(this.Canvas_Center_Y - Sim.Atom[i].y * Scale);
			
			this.Canvas_Context.fillStyle = Sim.Atom[i].color;
			this.Canvas_Context.arc(cx, cy, Math.max(Sim.Atom[i].rad * Scale, 1.0), 0, 2 * Math.PI);
			this.Canvas_Context.fill();

		}
		
		this.Canvas_Context.fillStyle = '#000000';
		this.Canvas_Context.fillRect(20, this.Canvas_Size - 20, 2.0 * Scale, 5);
		this.Canvas_Context.textBaseline = 'bottom';
		this.Canvas_Context.fillText('2 nm', 25, this.Canvas_Size - 24);
						
		Sim.Unlock();
		this.Unlock();
	}
};

Display_Manager.CheckCameraPosition = function ()
{
	var i = 0;
	
	for (i = 0; i < 3; i ++)
	{
		if (this.Camera_Position[i] > 0.49)
		{
			this.Camera_Position[i] = 0.49;
		}
		if (this.Camera_Position[i] < -0.49)
		{
			this.Camera_Position[i] = -0.49;
		}
	}
};

Display_Manager.CameraForward = function ()
{
	this.Camera_Position[0] += 0.03 * Math.cos(this.Camera_Phi) * Math.cos(this.Camera_Theta);
	this.Camera_Position[1] += 0.03 * Math.cos(this.Camera_Phi) * Math.sin(this.Camera_Theta);
	this.Camera_Position[2] += 0.03 * Math.sin(this.Camera_Phi);
	
	this.CheckCameraPosition ();
};

Display_Manager.CameraBackward = function ()
{
	this.Camera_Position[0] -= 0.03 * Math.cos(this.Camera_Phi) * Math.cos(this.Camera_Theta);
	this.Camera_Position[1] -= 0.03 * Math.cos(this.Camera_Phi) * Math.sin(this.Camera_Theta);
	this.Camera_Position[2] -= 0.03 * Math.sin(this.Camera_Phi);
	
	this.CheckCameraPosition ();
};

Display_Manager.CameraLeft = function ()
{
	this.Camera_Position[0] -= 0.03 * Math.sin(this.Camera_Theta);
	this.Camera_Position[1] += 0.03 * Math.cos(this.Camera_Theta);
	
	this.CheckCameraPosition ();
};

Display_Manager.CameraRight = function ()
{
	this.Camera_Position[0] += 0.03 * Math.sin(this.Camera_Theta);
	this.Camera_Position[1] -= 0.03 * Math.cos(this.Camera_Theta);
	
	this.CheckCameraPosition ();
};

Display_Manager.CameraUp = function ()
{
	this.Camera_Position[0] -= 0.03 * Math.sin(this.Camera_Phi) * Math.cos(this.Camera_Theta);
	this.Camera_Position[1] -= 0.03 * Math.sin(this.Camera_Phi) * Math.sin(this.Camera_Theta);
	this.Camera_Position[2] += 0.03 * Math.cos(this.Camera_Phi);
	
	this.CheckCameraPosition ();
};

Display_Manager.CameraDown = function ()
{
	this.Camera_Position[0] += 0.03 * Math.sin(this.Camera_Phi) * Math.cos(this.Camera_Theta);
	this.Camera_Position[1] += 0.03 * Math.sin(this.Camera_Phi) * Math.sin(this.Camera_Theta);
	this.Camera_Position[2] -= 0.03 * Math.cos(this.Camera_Phi);
	
	this.CheckCameraPosition ();
};

Display_Manager.CameraPanLeft = function ()
{
	this.Camera_Theta += 0.015 * Math.PI;
};

Display_Manager.CameraPanRight = function ()
{
	this.Camera_Theta -= 0.015 * Math.PI;
};

Display_Manager.CameraTiltUp = function ()
{
	this.Camera_Phi += 0.015 * Math.PI;
};

Display_Manager.CameraTiltDown = function ()
{
	this.Camera_Phi -= 0.015 * Math.PI;
};

Display_Manager.CameraReset = function ()
{
	this.Camera_Position[0] = -0.49;
	this.Camera_Position[1] = -0.49;
	this.Camera_Position[2] = 0.49;
	
	this.Camera_Theta = Math.PI / 4.0;
	this.Camera_Phi = -Math.PI / 8.0;
};

Display_Manager.ModelViewTranslate = function (v)
{
	this.Model_View_Matrix = this.Model_View_Matrix.x(Matrix.Translation($V([v[0], v[1], v[2]])));
};

Display_Manager.ModelViewRotateX = function (th)
{
	var Rot_Matrix = Matrix.RotateX(th);

	this.Model_View_Matrix = this.Model_View_Matrix.x(Rot_Matrix);
//	this.Normal_Matrix = this.Normal_Matrix.x(Rot_Matrix);
};

Display_Manager.ModelViewRotateZ = function (th)
{
	var Rot_Matrix = Matrix.RotateZ(th);
	
	this.Model_View_Matrix = this.Model_View_Matrix.x(Rot_Matrix);
//	this.Normal_Matrix = this.Normal_Matrix.x(Rot_Matrix);
};

Display_Manager.ModelViewScale = function (s)
{
	this.Model_View_Matrix = this.Model_View_Matrix.x(Matrix.Scale($V([s, s, s])));
};

Display_Manager.ModelViewScaleXYZ = function (v)
{
	this.Model_View_Matrix = this.Model_View_Matrix.x(Matrix.Scale($V([v[0], v[1], v[2]])));
};

Display_Manager.SetMatrixUniforms = function ()
{
	var pUniform = this.GL.getUniformLocation(this.Shader_Program, 'uPMatrix');
	this.GL.uniformMatrix4fv(pUniform, false, new Float32Array(this.Perspective_Matrix.flatten()));

	var mvUniform = this.GL.getUniformLocation(this.Shader_Program, 'uMVMatrix');
	this.GL.uniformMatrix4fv(mvUniform, false, new Float32Array(this.Model_View_Matrix.flatten()));

	this.Normal_Matrix = this.Normal_Matrix.inverse();
	this.Normal_Matrix = this.Normal_Matrix.transpose();
	
	var nUniform = this.GL.getUniformLocation(this.Shader_Program, 'uNormalMatrix');
	this.GL.uniformMatrix4fv(nUniform, false, new Float32Array(this.Normal_Matrix.flatten())); 
};

Display_Manager.SetColorUniform = function (c)
{
	var Color_Uniform = this.GL.getUniformLocation(this.Shader_Program, 'allVertexColor');
	this.GL.uniform4fv(Color_Uniform, new Float32Array(c));
}

Display_Manager.DisplayAtoms3D = function (Sim)
{
	if (!Sim.Busy && this.Is_WebGL && !this.Busy)
	{
		this.Lock();
		Sim.Lock();
		

		this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
		
		this.Perspective_Matrix = makePerspective(60.0, 1.0, 0.1, 100.0);
		
		var x, y, z;
		var Atom_Color = {};
		
		var Scale = 1.0 / Sim.Box_Len;
		
		var center = [
						this.Camera_Position[0] + Math.cos(this.Camera_Phi) * Math.cos(this.Camera_Theta),
						this.Camera_Position[1] + Math.cos(this.Camera_Phi) * Math.sin(this.Camera_Theta),
						this.Camera_Position[2] + Math.sin(this.Camera_Phi),
					];
		
		var up = [0.0, 0.0, 1.0];
		
		var Camera_Matrix = Matrix.I(4);
		
		this.Camera_Matrix = makeLookAt (	this.Camera_Position[0], this.Camera_Position[1], this.Camera_Position[2],
									center[0], center[1], center[2],
									up[0], up[1], up[2]);

		for (i = 0; i < Sim.N; i ++)
		{
			x = Sim.Atom[i].x * Scale;
			y = Sim.Atom[i].y * Scale;
			z = Sim.Atom[i].z * Scale;
			
			this.Model_View_Matrix = this.Camera_Matrix;
			this.Normal_Matrix = this.Camera_Matrix;
			
			this.ModelViewTranslate([x, y, z]);
			this.ModelViewScale(Sim.Atom[i].rad * Scale);

			this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Position_Buffer);
			this.GL.vertexAttribPointer(this.Vertex_Position_Attribute, 3, this.GL.FLOAT, false, 0, 0);

			this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Normal_Buffer);
			this.GL.vertexAttribPointer(this.Vertex_Normal_Attribute, 3, this.GL.FLOAT, false, 0, 0);

			//this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Color_Buffer);
			//this.GL.vertexAttribPointer(this.Vertex_Color_Attribute, 4, this.GL.FLOAT, false, 0, 0);
	  
			this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Sphere.Vertices_Index_Buffer);
			
			Atom_Color = this.HexToRGB(Sim.Atom[i].color);
			
			this.SetMatrixUniforms();
			this.SetColorUniform([Atom_Color.r / 255.5, Atom_Color.g / 255.5, Atom_Color.b / 255.5, 1.0]);
			
			this.GL.drawElements(this.GL.TRIANGLES, this.Sphere.N_Triangles * 3, this.GL.UNSIGNED_SHORT, 0);
		}
				

		this.Model_View_Matrix = this.Camera_Matrix;
		this.Normal_Matrix = this.Camera_Matrix;
		this.ModelViewScale(Sim.Box_Len * Scale);

		this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Position_Buffer);
		this.GL.vertexAttribPointer(this.Vertex_Position_Attribute, 3, this.GL.FLOAT, false, 0, 0);

		this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Normal_Buffer);
		this.GL.vertexAttribPointer(this.Vertex_Normal_Attribute, 3, this.GL.FLOAT, false, 0, 0);

		//this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Color_Buffer);
		//this.GL.vertexAttribPointer(this.Vertex_Color_Attribute, 4, this.GL.FLOAT, false, 0, 0);
  
		this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Box.Vertices_Index_Buffer);

		this.SetColorUniform([0.5, 0.7, 1.0, 1.0]);
		this.SetMatrixUniforms();
		
		//this.GL.drawElements(this.GL.TRIANGLES, this.Box.N_Triangles * 3, this.GL.UNSIGNED_SHORT, 0);
		this.GL.drawElements(this.GL.LINES, this.Box.N_Triangles * 2, this.GL.UNSIGNED_SHORT, 0);

		Sim.Unlock();
		this.Unlock();
	}
};

Display_Manager.DisplayMolecules3D = function (Sim)
{
	if (!Sim.Busy && this.Is_WebGL && !this.Busy)
	{
		this.Lock();
		Sim.Lock();

		this.GL.clear(this.GL.COLOR_BUFFER_BIT | this.GL.DEPTH_BUFFER_BIT);
		
		this.Perspective_Matrix = makePerspective(60.0, 1.0, 0.1, 100.0);
		
		var x, y, z;
		var x1, y1, z1;
		var x2, y2, z2;
		var dx, dy, dz;
		var th, phi, r, rho, sin_phi, cos_phi, sin_th, cos_th;
		
		var Atom_Color = {}, Bond_Color = {};
		var Atom_Rad = 0.04;
		var Bond_Rad = 0.02;
		var Bond_Length_max = 0.2;
		
		var Mol_Ind, Atom_Ind, Bond_Ind, ind, ind1, ind2;
		
		var Scale = 1.0 / Sim.Box_Len;
		
		var center = [
						this.Camera_Position[0] + Math.cos(this.Camera_Phi) * Math.cos(this.Camera_Theta),
						this.Camera_Position[1] + Math.cos(this.Camera_Phi) * Math.sin(this.Camera_Theta),
						this.Camera_Position[2] + Math.sin(this.Camera_Phi),
					];
		
		var up = [0.0, 0.0, 1.0];
		
		var Camera_Matrix = Matrix.I(4);
		
		this.Camera_Matrix = makeLookAt (	this.Camera_Position[0], this.Camera_Position[1], this.Camera_Position[2],
									center[0], center[1], center[2],
									up[0], up[1], up[2]);

		for (Mol_Ind = 0; Mol_Ind < Sim.N_Mol; Mol_Ind ++)
		{
			for (Atom_Ind = 0; Atom_Ind < Sim.Mol[Mol_Ind].N_Atoms; Atom_Ind ++)
			{
				ind = Sim.Mol[Mol_Ind].Atom_Ind[Atom_Ind];
				
				x = Sim.Atom[ind].x * Scale;
				y = Sim.Atom[ind].y * Scale;
				z = Sim.Atom[ind].z * Scale;
				
				this.Model_View_Matrix = this.Camera_Matrix;
				this.Normal_Matrix = this.Camera_Matrix;
				this.ModelViewTranslate([x, y, z]);
				this.ModelViewScale(Atom_Rad * Scale);

				this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Position_Buffer);
				this.GL.vertexAttribPointer(this.Vertex_Position_Attribute, 3, this.GL.FLOAT, false, 0, 0);

				this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Sphere.Vertices_Normal_Buffer);
				this.GL.vertexAttribPointer(this.Vertex_Normal_Attribute, 3, this.GL.FLOAT, false, 0, 0);
		  
				this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Sphere.Vertices_Index_Buffer);
				
				Atom_Color = this.HexToRGB(Sim.Atom[ind].color);
				
				this.SetMatrixUniforms();
				this.SetColorUniform([Atom_Color.r / 255.5, Atom_Color.g / 255.5, Atom_Color.b / 255.5, 1.0]);
				
				this.GL.drawElements(this.GL.TRIANGLES, this.Sphere.N_Triangles * 3, this.GL.UNSIGNED_SHORT, 0);
			}

			for (Bond_Ind = 0; Bond_Ind < Sim.Mol[Mol_Ind].N_Bonds; Bond_Ind ++)
			{
				ind1 = Sim.Mol[Mol_Ind].Bond[Bond_Ind].Atom_Ind1;
				ind2 = Sim.Mol[Mol_Ind].Bond[Bond_Ind].Atom_Ind2;
				
				x1 = Sim.Atom[ind1].x;
				y1 = Sim.Atom[ind1].y;
				z1 = Sim.Atom[ind1].z;
				
				x2 = Sim.Atom[ind2].x;
				y2 = Sim.Atom[ind2].y;
				z2 = Sim.Atom[ind2].z;
				
				dx = x2 - x1;
				dy = y2 - y1;
				dz = z2 - z1;
				
				r = Math.sqrt(dx * dx + dy * dy);
				rho = Math.sqrt(dx * dx + dy * dy + dz * dz);

				sin_phi = r / rho;
				cos_phi = dz / rho;
				
				sin_th = dx / r;
				cos_th = dy / r;
				
				phi = Math.atan2(sin_phi, cos_phi);
				th = Math.atan2(sin_th, cos_th);
				
				if (rho < Bond_Length_max)
				{
					this.Model_View_Matrix = this.Camera_Matrix;
					this.Normal_Matrix = this.Camera_Matrix;
					
					this.ModelViewTranslate([x1 * Scale, y1 * Scale, z1 * Scale]);
					this.ModelViewRotateZ(Math.PI + th);
					this.ModelViewRotateX(-phi);
					this.ModelViewScaleXYZ([Bond_Rad * Scale, Bond_Rad * Scale, 0.5 * rho * Scale]);

					this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Position_Buffer);
					this.GL.vertexAttribPointer(this.Vertex_Position_Attribute, 3, this.GL.FLOAT, false, 0, 0);

					this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Normal_Buffer);
					this.GL.vertexAttribPointer(this.Vertex_Normal_Attribute, 3, this.GL.FLOAT, false, 0, 0);
			  
					this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Cylinder.Vertices_Index_Buffer);
					
					Bond_Color = this.HexToRGB(Sim.Atom[ind1].color);
					
					this.SetMatrixUniforms();
					this.SetColorUniform([Bond_Color.r / 255.5, Bond_Color.g / 255.5, Bond_Color.b / 255.5, 1.0]);
					
					this.GL.drawElements(this.GL.TRIANGLES, this.Cylinder.N_Triangles * 3, this.GL.UNSIGNED_SHORT, 0);

					this.Model_View_Matrix = this.Camera_Matrix;
					this.Normal_Matrix = this.Camera_Matrix;
					
					this.ModelViewTranslate([x2 * Scale, y2 * Scale, z2 * Scale]);
					this.ModelViewRotateZ(th);
					this.ModelViewRotateX(Math.PI + phi);
					this.ModelViewScaleXYZ([Bond_Rad * Scale, Bond_Rad * Scale, 0.5 * rho * Scale]);

					this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Position_Buffer);
					this.GL.vertexAttribPointer(this.Vertex_Position_Attribute, 3, this.GL.FLOAT, false, 0, 0);

					this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Cylinder.Vertices_Normal_Buffer);
					this.GL.vertexAttribPointer(this.Vertex_Normal_Attribute, 3, this.GL.FLOAT, false, 0, 0);
			  
					this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Cylinder.Vertices_Index_Buffer);
					
					Bond_Color = this.HexToRGB(Sim.Atom[ind2].color);
					
					this.SetMatrixUniforms();
					this.SetColorUniform([Bond_Color.r / 255.5, Bond_Color.g / 255.5, Bond_Color.b / 255.5, 1.0]);
					
					this.GL.drawElements(this.GL.TRIANGLES, this.Cylinder.N_Triangles * 3, this.GL.UNSIGNED_SHORT, 0);
				}
			}

		}
		

		this.Model_View_Matrix = this.Camera_Matrix;
		this.Normal_Matrix = this.Camera_Matrix;
		this.ModelViewScale(Sim.Box_Len * Scale);

		this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Position_Buffer);
		this.GL.vertexAttribPointer(this.Vertex_Position_Attribute, 3, this.GL.FLOAT, false, 0, 0);

		this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Normal_Buffer);
		this.GL.vertexAttribPointer(this.Vertex_Normal_Attribute, 3, this.GL.FLOAT, false, 0, 0);

		//this.GL.bindBuffer(this.GL.ARRAY_BUFFER, this.Box.Vertices_Color_Buffer);
		//this.GL.vertexAttribPointer(this.Vertex_Color_Attribute, 4, this.GL.FLOAT, false, 0, 0);
  
		this.GL.bindBuffer(this.GL.ELEMENT_ARRAY_BUFFER, this.Box.Vertices_Index_Buffer);

		this.SetColorUniform([0.5, 0.7, 1.0, 1.0]);
		this.SetMatrixUniforms();
		
		//this.GL.drawElements(this.GL.TRIANGLES, this.Box.N_Triangles * 3, this.GL.UNSIGNED_SHORT, 0);
		this.GL.drawElements(this.GL.LINES, this.Box.N_Triangles * 2, this.GL.UNSIGNED_SHORT, 0);

		Sim.Unlock();
		this.Unlock();
	}
};

Display_Manager.DisplayLegend = function (Sim, Names_Str, Rep_Atoms_Ind)
{
	var i = 0, cx, cy;
	var Scale = this.Canvas_Size / Sim.Box_Len;
	
	this.Canvas_Context.fillStyle = '#FFFFFF';
	this.Canvas_Context.fillRect(this.Canvas_Size - 70, 20, 50, Names_Str.length * 20);

	this.Canvas_Context.strokeStyle = '#000000';
	this.Canvas_Context.lineWidth = 0.1;
	this.Canvas_Context.beginPath();
	this.Canvas_Context.rect(this.Canvas_Size - 70, 20, 50, Names_Str.length * 20);
	this.Canvas_Context.stroke();

	this.Canvas_Context.font = 'bold 12px Arial';
	this.Canvas_Context.textBaseline = 'middle';

	for (i = 0; i < Names_Str.length; i ++)
	{
		cx = this.Canvas_Size - 55;
		cy = 30 + i * 20;
		
		this.Canvas_Context.beginPath();
		this.Canvas_Context.fillStyle = Sim.Atom[Rep_Atoms_Ind[i]].color;
		this.Canvas_Context.arc(cx, cy, Math.max(Sim.Atom[Rep_Atoms_Ind[i]].rad * Scale, 1.0), 0, 2 * Math.PI);
		this.Canvas_Context.fill();

		this.Canvas_Context.fillStyle = '#000000';
		this.Canvas_Context.fillText(Names_Str[i], cx + 10, cy);
	}
};

Display_Manager.CanvasClick = function (event, Sim)
{
	var Canvas_Rect = this.Canvas_Handle.getBoundingClientRect();

	var Scale = Sim.Box_Len / this.Canvas_Size;
	
	var Canvas_X = event.clientX - Canvas_Rect.left;
	var Canvas_Y = event.clientY - Canvas_Rect.top;
	
	var nx = (Canvas_X - this.Canvas_Center_X) * Scale;
	var ny = (this.Canvas_Center_Y - Canvas_Y) * Scale;
	
	Sim.BoxClick(nx, ny);
};

Display_Manager.CanvasMouseDown = function (event)
{
	var Canvas_Rect = this.Canvas_Handle.getBoundingClientRect();

	this.Drag_Start_X = event.clientX - Canvas_Rect.left;
	this.Drag_Start_Y = event.clientY - Canvas_Rect.top;
	
	this.Drag_Event = true;
}

Display_Manager.CanvasMouseUp = function (event)
{
	this.Drag_Event = false;
}

Display_Manager.CanvasMouseOut = function (event)
{
	this.Drag_Event = false;
}

Display_Manager.CanvasMouseMove = function (event)
{
	if (this.Drag_Event)
	{
		var Canvas_Rect = this.Canvas_Handle.getBoundingClientRect();

		var Canvas_X = event.clientX - Canvas_Rect.left;
		var Canvas_Y = event.clientY - Canvas_Rect.top;
		
		this.Camera_Theta += (Canvas_X - this.Drag_Start_X) / this.Canvas_Size * Math.PI * 0.3;
		this.Camera_Phi += (Canvas_Y - this.Drag_Start_Y)  / this.Canvas_Size * Math.PI * 0.3;
		
		this.Drag_Start_X = Canvas_X;
		this.Drag_Start_Y = Canvas_Y;
	}
};

Display_Manager.CanvasMouseWheel = function (event)
{
	var Wheel_Delta = 0;
		
	switch (event.deltaMode)
	{
		case 0:
			Wheel_Delta = -event.deltaY / 120.0;
			break;
		case 1:
			Wheel_Delta = -event.deltaY / 10.0;
			break;
		case 2:
			Wheel_Delta = -event.deltaY;
			break;
	}
	
	this.Camera_Position[0] += 0.06 * Wheel_Delta * Math.cos(this.Camera_Phi) * Math.cos(this.Camera_Theta);
	this.Camera_Position[1] += 0.06 * Wheel_Delta * Math.cos(this.Camera_Phi) * Math.sin(this.Camera_Theta);
	this.Camera_Position[2] += 0.06 * Wheel_Delta * Math.sin(this.Camera_Phi);
	
	this.CheckCameraPosition ();
};
