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
				if(!is_string($value))
					continue;
				if(strpos($value, $filter) !== false)
					$matches[$key] = $value;
					
			}
			return $matches;
		}
		
		public static function getStationData($name)
		{
			global $stationData;
			
			return $stationData[$name];
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