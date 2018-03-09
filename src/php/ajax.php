<?php
	require_once("config.php");

	if(!isset($_GET["do"]))
		die("Invalid action");

	$func = $_GET['do'];
	$param = array();
	foreach($_GET as $key => $value)
	{
		if(isset($value) && $key != "do" && $value != "")
		{
			$param[$key] = $value;
		}
	}

	$output = forward_static_call_array(array('Webradio', $func), $param);

	if(isset($output) && $output !== false)
		echo(json_encode($output));
?>
