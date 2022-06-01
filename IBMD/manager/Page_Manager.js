// Page Manager for In-Browser Molecular Dynamics (IBMD)
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

var Page_Manager = {};

Page_Manager.Init = function ()
{
};

Page_Manager.FrameResize = function (Display_Manager, Plot_Manager)
{
	
	var Head_Frame_Handle = document.getElementById('Head_Frame');
	var Middle_Frame_Handle = document.getElementById('Middle_Frame');
	var Bottom_Frame_Handle = document.getElementById('Bottom_Frame');
	var Data_Panel_Handle = document.getElementById('Data_Panel_Container');
	var Control_Panel_Handle = document.getElementById('Control_Panel_Container');
	var Camera_Panel_Handle = document.getElementById('Camera_Panel_Container');
	var Plot_Options_Handle = document.getElementById('Plot_Options_Container');

	var Head_Frame_Text_Handle = document.getElementById('Head_Frame_Text');

	var Split_Size = 8;

	var Page_Frame_Handle = document.getElementById('Page_Frame');

	var Page_Width = window.innerWidth;
	var Page_Height = window.innerHeight;
	
	var Head_Frame_Height = Math.floor(0.2 * Page_Height);
	var Bottom_Frame_Height = Math.floor(0.08 * Page_Height);
	var Middle_Frame_Height = Page_Height - Head_Frame_Height - Bottom_Frame_Height - 4 * Split_Size;
	
	Head_Frame_Handle.style.position = 'absolute';
	Head_Frame_Handle.style.top = Split_Size + 'px';
	Head_Frame_Handle.style.left = Split_Size + 'px';
	Head_Frame_Handle.style.width = Page_Width - 2 * Split_Size + 'px';
	Head_Frame_Handle.style.height = Head_Frame_Height + 'px';
		
	Middle_Frame_Handle.style.position = 'absolute';
	Middle_Frame_Handle.style.top = Head_Frame_Height + 2 * Split_Size + 'px';
	Middle_Frame_Handle.style.left = Split_Size + 'px';
	Middle_Frame_Handle.style.width = Page_Width - 2 * Split_Size + 'px';
	Middle_Frame_Handle.style.height = Middle_Frame_Height + 'px';

	Bottom_Frame_Handle.style.position = 'absolute';
	Bottom_Frame_Handle.style.top = Page_Height - Bottom_Frame_Height - Split_Size + 'px';
	Bottom_Frame_Handle.style.left = Split_Size + 'px';
	Bottom_Frame_Handle.style.width = Page_Width - 2 * Split_Size + 'px';
	Bottom_Frame_Handle.style.height = Bottom_Frame_Height + 'px';
	
	var Panel_Width = Math.floor(0.4 * Page_Width);
	var Panel_Height = Math.floor(0.5 * Middle_Frame_Height);
	var Edge_Margin = Math.floor(0.03 * Page_Width);
	
	var Vis_Canvas_Size = Math.min(Math.floor(0.4 * Page_Width), Middle_Frame_Height - 2 * Split_Size);
	var Camera_Panel_Width = 100;
	
	Display_Manager.Position(Vis_Canvas_Size, Split_Size, Edge_Margin);
	
	var Current_Y = Split_Size;
	
	Data_Panel_Handle.style.width = Panel_Width + 'px';
	Data_Panel_Handle.style.height = Panel_Height + 'px';
	Data_Panel_Handle.style.position = 'absolute';
	Data_Panel_Handle.style.top = Current_Y + 'px';
	Data_Panel_Handle.style.left = Edge_Margin + 'px';
	
	Current_Y += Data_Panel_Handle.offsetHeight;
	
	Control_Panel_Handle.style.width = Panel_Width + 'px';
	Control_Panel_Handle.style.height = '60px';
	Control_Panel_Handle.style.position = 'absolute';
	Control_Panel_Handle.style.top = Current_Y + 'px';
	Control_Panel_Handle.style.left = Edge_Margin + 'px';

	Current_Y += Control_Panel_Handle.offsetHeight + Split_Size;

	var Plot_Canvas_Width = Math.floor(0.27 * Page_Width);
	var Plot_Canvas_Height =  Middle_Frame_Height - Current_Y - Split_Size;
	var Plot_Canvas_Top = Current_Y;
	var Plot_Canvas_Left = Edge_Margin + Panel_Width - Plot_Canvas_Width;
	
	Plot_Manager.Position(Plot_Canvas_Width, Plot_Canvas_Height, Plot_Canvas_Top, Plot_Canvas_Left);
	
	Plot_Options_Handle.style.width = Panel_Width - Plot_Canvas_Width - Split_Size + 'px';
	Plot_Options_Handle.style.height = Plot_Canvas_Height + 'px';
	Plot_Options_Handle.style.position = 'absolute';
	Plot_Options_Handle.style.top = Plot_Canvas_Top + 'px';
	Plot_Options_Handle.style.left = Edge_Margin + 'px';

	Camera_Panel_Handle.style.width = Camera_Panel_Width + 'px';
	Camera_Panel_Handle.style.height = Vis_Canvas_Size + 2 + 'px';
	Camera_Panel_Handle.style.position = 'absolute';
	Camera_Panel_Handle.style.top = Split_Size + 'px';
	Camera_Panel_Handle.style.right = Edge_Margin + Vis_Canvas_Size + Split_Size + 'px';
	
	Head_Frame_Handle.style.visibility = 'visible';
	Middle_Frame_Handle.style.visibility = 'visible';
	Bottom_Frame_Handle.style.visibility = 'visible';
};
