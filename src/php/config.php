<?php

	define("PHP_PATH", "./");

	define("DIRBLE_TOKEN", "<DIRBLE TOKEN HERE>");

	define("MQTT_HOST", "localhost");
	define("MQTT_PORT", 1883);
	define("MQTT_TOPIC", "home/radio0/");
	define("MQTT_CLIENT_ID", "radio0_webinterface");

	require_once(PHP_PATH."mqtt.class.php");
	require_once(PHP_PATH."webradio.class.php");

?>
