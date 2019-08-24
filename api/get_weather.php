<?php
// required headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// load the api key from a seperate (usually secure) file
require_once 'api_key.php';

if(!isset($api_key)) {

	// create a 401 reponse (unauthorised)
	http_response_code(401);
	die("API not found");
}

if(!isset($_GET["city_id"])) {

	// create a reponse 400 (bad param)
	http_response_code(400);
	die("No city id given");
}

$data = ["id" => $_GET["city_id"], "APPID" => $api_key];
$url = "api.openweathermap.org/data/2.5/forecast";

// add the city id and api key to the url query
$url = sprintf("%s?%s", $url, http_build_query($data));

// setup CURL to call the Open Weather API
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

$result = curl_exec($curl);
curl_close($curl);

// setup the data for our API response
$result = json_decode($result);

// create a reponse for the API
http_response_code(200);
echo json_encode($result->list);

