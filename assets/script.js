$(document).ready(function () {
	// API url
	var BaseUrl = "https://api.openweathermap.org/data/2.5/";
	// API key
	var APIKey = "115f418a44cb81c0cc424fa14d5ad0a5";

	// JQuery Selectors
	var searchBtnEl = $("#srch-btn");
	var ctInputEl = $("#input-bx");
	var enteredCtName = $("#newlocdetails")


	var searchClickHandler = function (event) {
		event.preventDefault();

		var locEl = ctInputEl.val().trim();

		if (locEl) {
			retrieveWeather(locEl);
			setSearchLocation(locEl);
			addToSearchHistory(locEl);
		} else {
			alert("Please enter a location");
		}
	};
	function setSearchLocation(location) {
		localStorage.setItem("weatherLocation", location);
	}

	function getSearchLocation () {
		return localStorage.getItem("weatherLocation");
	}

	function addToSearchHistory(CT) {
		var searchList = $("#saved-search");
		var savedSearch = $("<li>").html(CT);
		searchList.append(savedSearch)
	}

	var savedSearch = getSearchLocation();
	if(savedSearch) {
		retrieveWeather(savedSearch);
		addToSearchHistory(savedSearch);
	}

	function retrieveWeather(enteredCtName) {
		var apiUrl = BaseUrl + "weather?q=" + enteredCtName + "&units=imperial" + "&appid=" + APIKey;

		fetch(apiUrl)
			.then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					alert("Please enter a valid city, zip code, or country");
				}
			})
			.then(function (data) {
				displayWeather(data, enteredCtName);
				retrieveForecast(enteredCtName);
			}).catch(function () {
				alert("Weather currently unavailable");
			});
	}
	function displayWeather(data, enteredCtName) {
		var cityName = enteredCtName;
		var date = new Date().toLocaleDateString("lan-en");
		var weatherIcon = data.weather.icon;
		var temp = data.main.temp;
		var lowTemp = data.main.temp_min;
		var highTemp = data.main.temp_max;
		var humidity = data.main.humidity;
		var tempFeel = data.main.feels_like;
		var windSpeed = data.wind.speed;
		var description = data.weather[0].description;

		var locEl = $('<ul class="list-group fs-1">').text(cityName);
		var dateEl = $('<li>').addClass('list-group-item list-group-item-success').text("Today's Date: " + date);
		var iconEl = $("<i>").addClass("fas fa-fw fa-10x weather-icon" + weatherIcon);
		var tempEl = $('<li>').addClass('list-group-item list-group-item-success').html("Temperature: " + temp + " &#8457;");
		var tempFeelEl = $('<li>').addClass('list-group-item list-group-item-success').html("Feels like: " + tempFeel + " &#8457;");
		var lowTempEl = $('<li>').addClass('list-group-item list-group-item-success').html("Low: " + lowTemp + " &#8457;");
		var highTempEl = $('<li>').addClass('list-group-item list-group-item-success').html("High: " + highTemp + " &#8457;")
		var humidityEl = $('<li>').addClass('list-group-item list-group-item-success').html("Humidity: " + humidity + "&#37")
		var windSpeedEl = $('<li>').addClass('list-group-item list-group-item-success').text("Wind Speed: " + windSpeed + " mph");
		var descriptionEl = $('<li>').addClass('list-group-item list-group-item-success').text(description);


		// If statement to add icon based on weather condition
		if (weatherIcon === "01d" || weatherIcon === "01n") {
			iconEl.addClass("fa-duotone fa-sun")
		} else if (weatherIcon === "02d" || weatherIcon === "02n") {
			iconEl.addClass("fa-duotone fa-cloud-sun")
		} else if (weatherIcon === "03d" || weatherIcon === "03n") {
			iconEl.addClass("fa-duotone fa-cloud")
		} else if (weatherIcon === "04d" || weatherIcon === "04n") {
			iconEl.addClass("fa-duotone fa-clouds")
		} else if (weatherIcon === "09d" || weatherIcon === "09n") {
			iconEl.addClass("fa-duotone fa-cloud-showers")
		} else if (weatherIcon === "10d" || weatherIcon === "10n") {
			iconEl.addClass("fa-duotone fa-cloud-rain")
		} else if (weatherIcon === "11d" || weatherIcon === "11n") {
			iconEl.addClass("fa-duotone fa-cloud-bolt")
		} else if (weatherIcon === "13d" || weatherIcon === "13n") {
			iconEl.addClass("fa-duotone fa-snowflake")
		} else if (weatherIcon === "50d" || weatherIcon === "50n") {
			iconEl.addClass("fa-duotone fa-fog")
		} else {
			iconEl.addClass("fa-duotone fa-cloud")
		}
		var newLocDetails = $("#newlocdetails");
		newLocDetails.empty();

		newLocDetails.append(locEl, iconEl, dateEl, descriptionEl, tempEl, lowTempEl, highTempEl, tempFeelEl, humidityEl, windSpeedEl)
	}
	function retrieveForecast(enteredCtName) {
		var apiUrl = BaseUrl + "forecast?q=" + enteredCtName + "&units=imperial" + "&appid=" + APIKey;

		fetch(apiUrl)
			.then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					throw new Error("Forecast currently unavailable");
				}
			}).then(function (data) {
				displayForecast(data);
			}).catch(function (error) {
				alert(error.message);
			});
	}
	function displayForecast(data) {
		var theForecast = $("#theforecast");
		theForecast.empty();

		for (var i = 1; i < data.list.length; i += 8) {
			var forecast = data.list[i];
			var forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
			var forecastIcon = forecast.weather[0].icon;
			var forecastTemp = forecast.main.temp;
			var forecastLowTemp = forecast.main.temp_min;
			var forecastHighTemp = forecast.main.temp_max;
			var forecastHumidity = forecast.main.humidity;
			var forecastTempFeel = forecast.main.feels_like;
			var forecastWindSpeed = forecast.wind.speed;
			var forecastDescription = forecast.weather[0].description;

			var forecastArea = $('<ul>').addClass("list group forecast-area row justify-content-center p-3");
			var forecastDateEl = $('<li>').addClass('list-group-item list-group-item-success').text(forecastDate);
			var forecastIconEl = $("<i>").addClass("d-flex justify-content-center fas weather-icon");
			var forecastTempEl = $('<li>').addClass('list-group-item list-group-item-success').html("Temperature: " + forecastTemp + " &#8457 ");
			var forecastLowTempEl = $('<li>').addClass('list-group-item list-group-item-success').html("Low: " + forecastLowTemp + " &#8457 ");
			var forecastHighTempEl = $('<li>').addClass('list-group-item list-group-item-success').html("High: " + forecastHighTemp + " &#8457 ");
			var forecastHumidityEl = $('<li>').addClass('list-group-item list-group-item-success').html("Humidity: " + forecastHumidity + "&#37 ");
			var forecastTempFeelEl = $('<li>').addClass('list-group-item list-group-item-success').html("Feels like: " + forecastTempFeel + " &#8457 ");
			var forecastWindSpeedEl = $('<li>').addClass('list-group-item list-group-item-success').text("Wind Speed: " + forecastWindSpeed + " mph");
			var forecastDescriptionEl = $('<li>').addClass('list-group-item list-group-item-success mt-3').text(forecastDescription);

			if (forecastIcon === "01d" || forecastIcon === "01n") {
				forecastIconEl.addClass("fa-duotone fa-sun");
			} else if (forecastIcon === "02d" || forecastIcon === "02n") {
				forecastIconEl.addClass("fa-duotone fa-cloud-sun");
			} else if (forecastIcon === "03d" || forecastIcon === "03n") {
				forecastIconEl.addClass("fa-duotone fa-cloud");
			} else if (forecastIcon === "04d" || forecastIcon === "04n") {
				forecastIconEl.addClass("fa-duotone fa-clouds");
			} else if (forecastIcon === "09d" || forecastIcon === "09n") {
				forecastIconEl.addClass("fa-duotone fa-cloud-showers");
			} else if (forecastIcon === "10d" || forecastIcon === "10n") {
				forecastIconEl.addClass("fa-duotone fa-cloud-sun-rain");
			} else if (forecastIcon === "11d" || forecastIcon === "11n") {
				forecastIconEl.addClass("fa-duotone fa-cloud-bolt");
			} else if (forecastIcon === "13d" || forecastIcon === "13n") {
				forecastIconEl.addClass("fa-duotone fa-snowflake");
			} else if (forecastIcon === "50d" || forecastIcon === "50n") {
				forecastIconEl.addClass("fa-duotone fa-fog");
			} else {
				forecastIconEl.addClass("fa-duotone fa-cloud");
			}

			forecastArea.append(forecastIconEl, forecastDescriptionEl, forecastDateEl, forecastTempEl, forecastLowTempEl, forecastHighTempEl, forecastTempFeelEl, forecastHumidityEl, forecastWindSpeedEl);
			theForecast.append(forecastArea);

		}
	}
	
	searchBtnEl.click(searchClickHandler);
});