<!DOCTYPE html>

<html>

<head>
	<meta http-equiv = "Content-Type" content="text/html; charset=utf-8" />
	<meta name = "description" content = "In-Browser Molecular Dynamics Simulation" />

	<link rel = "stylesheet" type = "text/css" href = "css/Simulation_Page_Style.css" />
	<link rel = "stylesheet" type = "text/css" href = "css/Info_Window_Style.css" />
	
	<base target = "_top" />

	<script>
	  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
	  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
	  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

	  ga('create', 'UA-24664845-2', 'auto');
	  ga('send', 'pageview');

	</script>
		
	<script type = "text/javascript" src = "include/sylvester.js"></script>
	<script type = "text/javascript" src = "include/glUtils.js"></script>
	<script type = "text/javascript" src = "include/Numeric_Utilities.js"></script>

	<script type = "text/javascript" src = "simulation/Sim_Constants.js"></script>
	<script type = "text/javascript" src = "simulation/Sim_Model.js"></script>
	<script type = "text/javascript" src = "simulation/Sim_General.js"></script>
	
	<?php
		if (isset($_GET['sim_case']))
		{
			$Sim_Case = $_GET['sim_case'];
		}
		else
		{
			$Sim_Case = 1;
		}
		
		switch ($Sim_Case)
		{
		case 1:
			echo '<script type = "text/javascript" src = "simulation/Sim_1_Ar_2D_LJ_NVE.js"></script>'.PHP_EOL;
			break;
		case 2:	
			echo '<script type = "text/javascript" src = "simulation/Sim_2_Ar_2D_LJ_NVT.js"></script>'.PHP_EOL;
			break;
		case 3:	
			echo '<script type = "text/javascript" src = "simulation/Sim_3_Ar_2D_LJ_NpT.js"></script>'.PHP_EOL;
			break;
		case 4:	
			echo '<script type = "text/javascript" src = "simulation/Sim_4_Ar-Ne_2D_LJ_NVT.js"></script>'.PHP_EOL;
			break;
		case 5:	
			echo '<script type = "text/javascript" src = "simulation/Sim_5_NaCl_2D_LJ-EL_NVT.js"></script>'.PHP_EOL;
			break;
		case 6:
			echo '<script type = "text/javascript" src = "simulation/Sim_6_Ar-Ne_3D_LJ_NVT.js"></script>'.PHP_EOL;
			break;
		case 7:
			echo '<script type = "text/javascript" src = "simulation/Sim_7_Wt_3D_SPCFw_NVT.js"></script>'.PHP_EOL;
			break;
		case 8:
			echo '<script type = "text/javascript" src = "simulation/Sim_8_Ne@C60_3D_AMBER-LJ_NVT.js"></script>'.PHP_EOL;
			break;
		case 9:
			echo '<script type = "text/javascript" src = "simulation/Sim_9_Wt-Gr_3D_AMBER-SPCFw-LJ_NVT.js"></script>'.PHP_EOL;
			break;
		}
	?>
	
	<script type = "text/javascript" src = "manager/Page_Manager.js"></script>
	<script type = "text/javascript" src = "manager/Display_Manager.js"></script>
	<script type = "text/javascript" src = "manager/Data_Manager.js"></script>
	<script type = "text/javascript" src = "manager/Plot_Manager.js"></script>
	<script type = "text/javascript" src = "manager/Plot_Operator.js"></script>
	
	<?php
	
		function InitSimulation ($_Sim_Case)
		{
				switch ($_Sim_Case)
				{
				case 1:
					echo 'Sim.Init(_N, _Box_Len);'.PHP_EOL;
					break;
				case 2:	
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature);'.PHP_EOL;
					break;
				case 3:	
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature, _Setpoint_Pressure);'.PHP_EOL;
					break;
				case 4:	
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature, _Mixing_Ratio);'.PHP_EOL;
					break;
				case 5:	
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature);'.PHP_EOL;
					break;
				case 6:
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature, _Mixing_Ratio);'.PHP_EOL;
					break;
				case 7:
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature);'.PHP_EOL;
					break;
				case 8:
					echo 'Sim.Init(_N, _Box_Len, _Setpoint_Temperature);'.PHP_EOL;
					break;
				case 9:
					echo 'Sim.Init(_N, _Setpoint_Temperature);'.PHP_EOL;
					break;
				}
		}
	?>

	
	<script type = "text/javascript">
				
		var Initialized = false;
		var Info_Window_Shown = false;
		
		<?php

			switch ($Sim_Case)
			{
			case 1:
				echo '		var _N = 225'.PHP_EOL;
				echo '		var _Box_Len = 20.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				break;
			case 2:	
				echo '		var _N = 225'.PHP_EOL;
				echo '		var _Box_Len = 20.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				break;
			case 3:	
				echo '		var _N = 225'.PHP_EOL;
				echo '		var _Box_Len = 20.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				echo '		var _Setpoint_Pressure = 30.0'.PHP_EOL;
				break;
			case 4:	
				echo '		var _N = 225'.PHP_EOL;
				echo '		var _Box_Len = 10.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				echo '		var _Mixing_Ratio = 0.3'.PHP_EOL;
				break;
			case 5:	
				echo '		var _N = 256'.PHP_EOL;
				echo '		var _Box_Len = 10.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				break;
			case 6:	
				echo '		var _N = 216'.PHP_EOL;
				echo '		var _Box_Len = 5.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				echo '		var _Mixing_Ratio = 0.3'.PHP_EOL;
				break;
			case 7:	
				echo '		var _N = 75'.PHP_EOL;
				echo '		var _Box_Len = 3.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 400.0'.PHP_EOL;
				break;
			case 8:	
				echo '		var _N = 6'.PHP_EOL;
				echo '		var _Box_Len = 3.0'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				break;
			case 9:	
				echo '		var _N = 25'.PHP_EOL;
				echo '		var _Max_N_Sample = 100'.PHP_EOL;
				echo '		var _Setpoint_Temperature = 300.0'.PHP_EOL;
				break;
			}
		?>				

		var Sim_Interval_Handle, Draw_Interval_Handle, Data_Interval_Handle, Plot_Interval_Handle;
		var Plot_Check_Box_Handle, Plot_Selector_Handle;
		var Info_Window_Handle;
		
		var Ajax_Handle;
		
		window.onresize = function(event) { Page_Manager.FrameResize(Display_Manager, Plot_Manager); };

		function StartSimulation ()
		{
			if (!Sim.Started)
			{
				Sim_Interval_Handle = window.setInterval(function() { Sim.SimulateOneStep(); }, 1);
				
				Draw_Interval_Handle = window.setInterval(function()
																{<?php
																	switch ($Sim_Case)
																	{
																	case 1:
																	case 2:	
																	case 3:	
																		echo "Display_Manager.DisplayAtoms(Sim);".PHP_EOL;
																		break;
																	case 4:	
																		echo "Display_Manager.DisplayAtoms(Sim);".PHP_EOL;
																		echo "Display_Manager.DisplayLegend(Sim, ['Ar', 'Ne'], [0, 224]);".PHP_EOL;
																		break;
																	case 5:	
																		echo "Display_Manager.DisplayAtoms(Sim);".PHP_EOL;
																		echo "Display_Manager.DisplayLegend(Sim, ['Na'+'\u207A', 'Cl'+'\u207B'], [0, 1]);".PHP_EOL;
																		break;
																	case 6:	
																	case 7:	
																	case 8:	
																	case 9:	
																		echo "Display_Manager.DisplayAtoms3D(Sim);".PHP_EOL;
																		break;
																	}
																?>}, 100);
				
				Data_Interval_Handle = window.setInterval(function() { Data_Manager.DisplayData(Sim); }, 1000);
				
				Plot_Interval_Handle = window.setInterval(function() { if (Plot_Check_Box_Handle.checked) { Plot_Manager.Plot(Sim); } }, 200);
				
				Sim.Start();
			}
		}

		function ResetSimulation ()
		{
			<?php
				InitSimulation($Sim_Case);
			?>				

			RefreshPlot();
		}
		
		function StopSimulation ()
		{
			window.clearInterval(Sim_Interval_Handle);
			window.clearInterval(Draw_Interval_Handle);
			window.clearInterval(Data_Interval_Handle);
			window.clearInterval(Plot_Interval_Handle);
			
			Sim.Stop();
		}
			
		function RefreshPlot ()
		{
			Plot_Manager.ChangePlotType(Plot_Selector_Handle.options[Plot_Selector_Handle.selectedIndex].value);
		}		
		
		function ToggleInfoWindow ()
		{
			if (!Info_Window_Shown)
			{
				Info_Window_Handle.innerHTML = 	'<table class = "Text_Format_Table">' +
												'	<tr>' +
												'		<td>' +
												'			<span class = "Info_Message">' +
												'				Loading <br/> <img src = "images/loading_bar.gif" border = "0" alt = "-----"/>' +
												'			</span>' +
												'		</td>' +
												'	</tr>' +
												'</table>';
				
				<?php
					echo "Ajax_Handle.open('GET', 'info/Info_Case_".$Sim_Case.".html', true);".PHP_EOL;
				?>
		
				Ajax_Handle.setRequestHeader("pragma", "no-cache");
				Ajax_Handle.send();

				Info_Window_Handle.style.visibility = 'visible';
				
				Info_Window_Shown = true;
			}
			else
			{
				Info_Window_Handle.style.visibility = 'hidden';
				Info_Window_Shown = false;
			}
		}
		
		function FillInfoWindow()
		{
			var Response_Data = Ajax_Handle.responseText;
			
			Info_Window_Handle.innerHTML = Response_Data;
		}

		function InitAjax()
		{
			var i = 0;
			
			if (window.XMLHttpRequest)
			{// code for IE7+, Firefox, Chrome, Opera, Safari
				Ajax_Handle = new XMLHttpRequest();
			}
			else
			{// code for IE6, IE5
				Ajax_Handle = new ActiveXObject("Microsoft.XMLHTTP");
			}

			Ajax_Handle.onreadystatechange = function() { 

				if (this.readyState == 4 && this.status == 200)
				{
					FillInfoWindow();
				}
			}
		}
		
		function Initialize ()
		{
			if (!Initialized)
			{
				InitAjax();
				
				Plot_Check_Box_Handle = document.getElementById('Plot_Check_Box');
				Plot_Selector_Handle = document.getElementById('Plot_Selector');
				Info_Window_Handle = document.getElementById('Info_Window');

				Page_Manager.Init();
				
				<?php
					if ($Sim_Case < 6 )
					{
						echo "Display_Manager.Init('Vis_Canvas');".PHP_EOL;
					}
					else
					{
						echo "Display_Manager.InitWebGL('Vis_Canvas');".PHP_EOL;
					}
				?>
				
				Plot_Manager.Init('Plot_Canvas');
				Plot_Operator.Init(_Max_N_Sample);

				<?php
					if ($Sim_Case == 7 )
					{
						echo "Plot_Operator.SetSpeedMax(4.5e-3);".PHP_EOL;
					}
				?>
				
				Data_Manager.Init();
				
				Sim.SetAvailableData(Data_Manager);
				Sim.SetAvailablePlots(Plot_Manager);
				
				Data_Manager.BuildDataPanel('Data_Panel_Container');
				Plot_Manager.BuildPlotSelector('Plot_Selector');
				
				<?php
					InitSimulation($Sim_Case);
				?>				
				
				Plot_Check_Box_Handle.addEventListener('change', function () { RefreshPlot(); });

				Plot_Selector_Handle.addEventListener('change', function () { RefreshPlot();  });
				
				Page_Manager.FrameResize(Display_Manager, Plot_Manager);
				
				if (Sim.Is_3D)
				{
					document.getElementById('Camera_Panel_Container').style.visibility = 'visible';
				}
				
				Initialized = true;
			}
		}
		
		function KeyPress(event)
		{	
			//alert(event.keyCode);
			
			switch (event.keyCode)
			{
				case 87:  /* W */
				case 119: /* w */
					Display_Manager.CameraForward();
					break;
				case 83:  /* S */
				case 115: /* s */
					Display_Manager.CameraBackward();
					break;
				case 65:  /* A */
				case 97:  /* a */
					Display_Manager.CameraLeft();
					break;
				case 68:  /* D */
				case 100: /* d */
					Display_Manager.CameraRight();
					break;
				case 82:  /* R */
				case 114: /* r */
					Display_Manager.CameraReset();
					break;
				case 82:  /* Q */
				case 113: /* q */
					Display_Manager.CameraUp();
					break;
				case 69:  /* E */
				case 101: /* e */
					Display_Manager.CameraDown();
					break;
			}
		}
		
	</script>

	<title>
		IBMD
	</title>
	
</head>

<body id = "Page_Frame" onLoad = "Initialize();" onKeyPress = "KeyPress(event);">

	
	<div id = "Head_Frame">
		<table class = "Text_Format_Table">

			<col style = "width : 5%" />
			<col style = "width : 5%" />
			<col style = "width : 80%" />
			<col style = "width : 10%" />
			
			<tr>
				<td>
					<a href = "http://userpage.fu-berlin.de/sadeghi/IBMD" target = "_self">
						<img class = "Top_Icon" alt = "Back" title = "Back to selection page" src = "images/back.png" /><br />
						<span class = "Link_Label" title = "Back to selection page">Back</span>
					</a>
				</td>
				<td>
					<img class = "Top_Icon" alt = "Info" title = "Info" src = "images/info.png" onClick = "ToggleInfoWindow();" /><br />
					<span class = "Link_Label" title = "Info" onClick = "ToggleInfoWindow();">Info</span>
				</td>
				<td>
					<span id = "Head_Frame_Text">
						<b> In-Browser Molecular Dynamics Simulation</b> <br />
						<?php
						
							switch ($Sim_Case)
							{
							case 1:
								echo 'Case 1: Argon.2D.LJ.NVE'.PHP_EOL;
								break;
							case 2:	
								echo 'Case 2: Argon.2D.LJ.NVT'.PHP_EOL;
								break;
							case 3:	
								echo 'Case 3: Argon.2D.LJ.NpT'.PHP_EOL;
								break;
							case 4:	
								echo 'Case 4: Argon-Neon.2D.LJ.NVT'.PHP_EOL;
								break;
							case 5:	
								echo 'Case 5: NaCl.2D.LJ-EL.NVT'.PHP_EOL;
								break;
							case 6:	
								echo 'Case 6: Argon-Neon.3D.LJ.NVT'.PHP_EOL;
								break;
							case 7:	
								echo 'Case 7: Water.3D.SPC/Fw.NVT'.PHP_EOL;
								break;
							case 8:	
								echo 'Case 8: Ne@C60.3D.AMBER-LJ.NVT'.PHP_EOL;
								break;
							case 9:	
								echo 'Case 9: Water-Graphene.3D.AMBER-SPC/Fw-LJ.NVT'.PHP_EOL;
								break;
							}
						?>				
					</span>
				</td>
				<td>
				</td>
			</tr>
		</table>
	</div>
	
	<div id = "Middle_Frame">
		<div id = "Data_Panel_Container">
		</div>
	
		<div id = "Control_Panel_Container">
			<table id = "Control_Panel">
				<tr>
					<td>
						<?php
						
							switch ($Sim_Case)
							{
							case 1:
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▲" title = "Increase Temperature" onClick = "Sim.ChangeTemperature(1.1);" />'.PHP_EOL;
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▼" title = "Decrease Temperature" onClick = "Sim.ChangeTemperature(0.9);" />'.PHP_EOL;

								break;
							case 2:	
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▲" title = "Increase Temperature" onClick = "Sim.IncreaseTemperature(10, 800);" />'.PHP_EOL;
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▼" title = "Decrease Temperature" onClick = "Sim.DecreaseTemperature(10, 10);" />'.PHP_EOL;

								break;
							case 3:	
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▲" title = "Increase Temperature" onClick = "Sim.IncreaseTemperature(10, 800);" />'.PHP_EOL;
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▼" title = "Decrease Temperature" onClick = "Sim.DecreaseTemperature(10, 10);" />'.PHP_EOL;
									
								echo '<input class ="PushButtonSmall" type = "button" value = "p ▲" title = "Increase Pressure" onClick = "Sim.IncreasePressure();" />'.PHP_EOL;
								echo '<input class ="PushButtonSmall" type = "button" value = "p ▼" title = "Decrease Pressure" onClick = "Sim.DecreasePressure();" />'.PHP_EOL;

								break;
							case 4:	
							case 5:	
							case 6:
							case 7:
							case 8:
							case 9:
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▲" title = "Increase Temperature" onClick = "Sim.IncreaseTemperature(10, 800);" />'.PHP_EOL;
								echo '<input class ="PushButtonSmall" type = "button" value = "T ▼" title = "Decrease Temperature" onClick = "Sim.DecreaseTemperature(10, 10);" />'.PHP_EOL;

								break;
							}
						?>				
					</td>

					<td>
						<input class ="PushButton" id = "Start_Button" type = "button" title = "Start" value = "Start" onClick = "StartSimulation();" />
						<input class ="PushButton" id = "Stop_Button" type = "button" title = "Stop" value = "Stop" onClick = "StopSimulation();" />
						<input class ="PushButton" id = "Reset_Button" type = "button" title = "Reset" value = "Reset" onClick = "ResetSimulation();" />
					</td>
				</tr>
			</table>
		</div>

		<div id = "Camera_Panel_Container">
			<div class = "Camera_Subpanel">
				<img class = "Cam_B_Up" title = "Move Camera Up (Q)" src = "images/up.png" onClick = "Display_Manager.CameraUp();" />
				<img class = "Cam_B_Left" title = "Move Camera Left (A)" src = "images/left.png" onClick = "Display_Manager.CameraLeft();" />
				<img class = "Cam_B_Right" title = "Move Camera Right (D)" src = "images/right.png" onClick = "Display_Manager.CameraRight();" />
				<img class = "Cam_B_Down" title = "Move Camera Down (E)" src = "images/down.png" onClick = "Display_Manager.CameraDown();" />
			</div>
			
			<div class = "Camera_Subpanel">
				<img class = "Cam_B_Up" title = "Tilt Camera Up (Drag Down)" src = "images/rotate_up.png" onClick = "Display_Manager.CameraTiltUp();" />
				<img class = "Cam_B_Left" title = "Pan Camera Left (Drag Right)" src = "images/rotate_left.png" onClick = "Display_Manager.CameraPanLeft();" />
				<img class = "Cam_B_Right" title = "Pan Camera Right (Drag Left)" src = "images/rotate_right.png" onClick = "Display_Manager.CameraPanRight();" />
				<img class = "Cam_B_Down" title = "Tilt Camera Down (Drag Up)" src = "images/rotate_down.png" onClick = "Display_Manager.CameraTiltDown();" />
			</div>

			<div class = "Camera_Subpanel">
				<img class ="Cam_B_Down" title = "Reset Camera (R)" src = "images/reset.png" onClick = "Display_Manager.CameraReset();" />
				<img class ="Cam_B_Left" title = "Move Camera Forward (W)(Mouse Wheel Down)" src = "images/in.png" onClick = "Display_Manager.CameraForward();" />
				<img class ="Cam_B_Right" title = "Move Camera Backward (S)(Mouse Wheel Up)" src = "images/out.png" onClick = "Display_Manager.CameraBackward();" />
			</div>
		</div>

		<canvas id = "Vis_Canvas" onClick = "Display_Manager.CanvasClick(event, Sim);"
				onMouseDown = "Display_Manager.CanvasMouseDown(event);"
				onMouseUp = "Display_Manager.CanvasMouseUp(event);"
				onMouseMove = "Display_Manager.CanvasMouseMove(event);"
				onMouseOut = "Display_Manager.CanvasMouseOut(event);"
				onWheel = "Display_Manager.CanvasMouseWheel(event);">
		</canvas>

		<canvas id = "Plot_Canvas">
		</canvas>
		
		<div id = "Plot_Options_Container">
			<table id = "Plot_Options">
				<tr style = "vertical-align : middle">
					<td>
						<input class = "CheckBox" id = "Plot_Check_Box" type = "checkbox" checked />

						<span class = "TextLabel">					
							Real-time Plot
						</span>
					</td>
				</tr>

				<tr style = "vertical-align : top">
					<td>
						<select class = "SelectBox" id = "Plot_Selector">
						</select>
					</td>
				</tr>
			</table>
		</div>
	</div>


	<div id = "Bottom_Frame">
		<table class = "Text_Format_Table">
			<tr>
				<td>
					<span id = "Bottom_Frame_Text">
						Created by <a target = "_blank" href = "http://userpage.fu-berlin.de/sadeghi"> Mohsen Sadeghi</a>
					</span>
				</td>
			</tr>
		</table>
	</div>
	
	<div id = "Info_Window">
	</div>

</body>

</html>
