<?php
	class Webradio
	{
		public static function init()
		{
			return self::readConfig();
		}

		public static function play($name, $url)
		{
			$config = self::readConfig();
                        $config["current"] = $name;
			self::publishMqtt("station", $url);
			self::writeConfig($config);
		}
		public static function stop()
		{
			self::publishMqtt("playing", "0");
		}

		public static function volume($change)
		{
			$config = self::readConfig();
			$config["volume"] += $change;
			self::publishMqtt("volume", (string)$config["volume"]);
			self::writeConfig($config);
		}

		public static function search($query)
		{
			$req = curl_init("http://api.dirble.com/v2/search?token=" . DIRBLE_TOKEN);
			curl_setopt($req, CURLOPT_POSTFIELDS, json_encode(array("query" => $query)));
			curl_setopt($req, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
			curl_setopt($req, CURLOPT_RETURNTRANSFER, true);

			$body = curl_exec($req);
			curl_close($req);

			$result = array();
			$stations = json_decode($body, true);
			foreach($stations as $station)
			{
				$result[$station["name"]] = array(
					"image" => $station["image"]["url"],
					"url" => $station["streams"][0]["stream"]
				);
			}

			return $result;
		}

		public static function favor($name, $image, $url)
		{
			$config = self::readConfig();
			$config["favourites"][$name] = array(
				"image" => $image,
				"url" => $url
			);
			self::writeConfig($config);
		}
		public static function unfavor($name)
		{
			$config = self::readConfig();
			unset($config["favourites"][$name]);
			self::writeConfig($config);
		}

		private static function readConfig()
		{
			$stationJson = file_get_contents(PHP_PATH . "data.json");
			return json_decode($stationJson, true);
		}
		private static function writeConfig($config)
		{
			file_put_contents(PHP_PATH . "data.json", json_encode($config));
		}

		private static function publishMqtt($topic, $content)
		{
			$mqtt = new MQTT(MQTT_HOST, MQTT_PORT, MQTT_CLIENT_ID);
			$mqtt->connect();
			$mqtt->publish(MQTT_TOPIC . $topic, $content);
			$mqtt->close();
		}
	}

?>
