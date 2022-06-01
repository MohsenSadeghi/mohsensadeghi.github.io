<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">

	<style type = "text/css">
		body
		{
			background-color : rgb(100, 30, 40);
		}
		#Counter_Title
		{
			position : absolute;
			top : 2px;
			right : 5px;
			
			color : white;
			font-family : Arial;
			font-size : 14px;
			line-height : 12px;
			text-align : right;
		}
		#Counter_Number
		{
			position : absolute;
			bottom : 2px;
			right : 5px;

			color : white;
			font-family : Arial;
			font-size : 12px;
			font-weight : bold;
			line-height : 12px;
			text-align : right;
		}
	</style>
</head>

<body>
	<div id = "Counter_Title">
		Hit Counter <br>
	</div>
	
	<div id = "Counter_Number">
	<?php
		$ip = $_SERVER['REMOTE_ADDR'];

		$file_name_cr = "Temp/counter.txt";
		$file_name_ip = "Temp/ip_list.txt";
		$file_name_ip_dump = "Temp/ip_dump.txt";

		$handle_cr = fopen($file_name_cr, 'r');
		$counter_string = fgets($handle_cr);
		fclose($handle_cr);

		$handle_ip = fopen($file_name_ip, 'r');
		$previous_ip = fgets($handle_ip);
		fclose($handle_ip);
				
		if ($ip == $previous_ip)
		{
			$counter_num = ((int) $counter_string);
		} else {
			$counter_num = ((int) $counter_string) + 1;
			
			$handle_ip_dump = fopen($file_name_ip_dump, 'a');		
			fwrite($handle_ip_dump, $ip); 
			fwrite($handle_ip_dump, PHP_EOL); 
			fclose($handle_ip_dump);
		}
		
		echo $counter_num;

		$handle_cr = fopen($file_name_cr, 'w+');		
		fwrite($handle_cr, ((string) $counter_num)); 
		fclose($handle_cr);

		$handle_ip = fopen($file_name_ip, 'w+');		
		fwrite($handle_ip, $ip); 
		fclose($handle_ip);
	?>
	</div>
	
</body>

</html>
