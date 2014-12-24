<?php

	$stationJson = file_get_contents(PHP_PATH."data.json");
	$stationData = json_decode($stationJson, true);

	class Webradio
	{	
		public static function playFromUrl($url)
		{
			self::mpcCommand("clear");
			self::mpcCommand("add ".$url);
			self::mpcCommand("play");
		}
		
		public static function playByName($name)
		{
			$data = self::getStationData($name);
			self::playFromUrl($data['url']);
		}
		
		public static function stop()
		{
			self::mpcCommand("stop");
		}
		
		public static function volume($change)
		{
			self::mpcCommand("volume ".$change);
		}
		
		
		public static function getStations()
		{
			global $stationData;
			
			return $stationData;
		}
		public static function findStation($filter)
		{
			global $stationData;
			
			$matches = array();
			foreach($stationData as $key => $value)
			{
				$match = false;
				foreach($value as $key2 => $value2)
				{
					if(!is_string($value2))
						continue;

					if(strpos($value2, $filter) !== false)
					{
						$match = true;
						break;
					}
				}
				if($match)
				{
					$matches[$key] = $value;
				}
			}
			return $matches;
		}
		public static function getCurrentStation()
		{
			global $stationData;
			
			$url = self::mpcCommand("playlist");
			foreach($stationData as $key => $value)
			{
				if(isset($value) && $value["url"] == $url)
					return $key;
			}
			return false;
		}
		
		public static function getStationData($name)
		{
			global $stationData;
			
			return $stationData[$name];
		}

		public static function setStationData($name, $url, $img)
		{
			global $stationData;

			$url = str_replace("%and%", "&", $url);
				
			$data = array(
				"name" => $name,
				"url" => $url,
				"img" => $img
			);

			$stationData[$name] = $data;

			file_put_contents(PHP_PATH."data.json", json_encode($stationData));
		}
		
		
		
		private static function mpcCommand($command)
		{
			if(!isset($command))
				$command = "";
			
			echo('running "mpc '.$command.'"---');
			//return shell_exec("mpc ".$command);
		}
	}

?>