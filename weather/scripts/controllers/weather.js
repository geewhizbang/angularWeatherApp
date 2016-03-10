'use strict';

/**
 * @ngdoc overview
 * @name weatherApp
 * @description
 * # weatherApp
 *
 * Main module of the application.
 */
var weatherApp = angular
	.module('weatherApp', [])
	.controller(
		'weather',
		function ($scope, $http) {

		    $scope.zip = "";
		    $scope.forecast = [];
		    $scope.errorMessage = "Enter a Zip Code";
		    $scope.showResults = false;

		    $scope.captureEnter = function (e, onEnter) {
		        if (e.which === 13) {
		            onEnter();
		        }
		    }

		    function errorCallback(response) {
		        $scope.showResults = false;
		        $scope.errorMessage = "Unexpected Error";
		    }
		    function showError() {
		        $scope.showResults = false;
		        $scope.errorMessage = response.data.response.error.description;
		    }

		    $scope.setZip = function () {
		        $scope.zip = $scope.zip.replace(/[^0-9.]/gi, "");
		        if ($scope.zip.length == 5) {

		            $http({
		                method: 'GET',
		                url: 'http://api.wunderground.com/api/591b91ac5d84337d/conditions/q/' + $scope.zip + ".json"
		            }).then(function successCallback(response) {

		                if (response.data.current_observation) {

		                    var location = response.data.current_observation.display_location.full;

		                    $http({
		                        method: 'GET',
		                        url: 'http://api.wunderground.com/api/591b91ac5d84337d/forecast/q/' + $scope.zip + ".json"
		                    }).then(function successCallback(response) {

		                        if (response.data.forecast) {
		                            $scope.showResults = true;
		                            $scope.errorMessage = "";
		                            var forecast = [];
		                            for (var i = 0; i < 4; i++) {
		                                var day = response.data.forecast.simpleforecast.forecastday[i];
		                                forecast[i] = {
		                                    city: location,
		                                    name: i == 0 ? "Today" : day.date.weekday,
		                                    icon_url: day.icon_url,
		                                    isFirst: i == 0,
		                                    temperature: day.high.fahrenheit,
		                                    description: i == 0 ? day.conditions : ""
		                                }
		                            }

		                            $scope.forecast = forecast;

		                        } else {
		                            showError();
		                        }

		                    }, errorCallback);
		                } else {
		                    showError();
		                }
		            }, errorCallback);
		        }
		    }
		}
    );
