$(function () {
	// API url
	var BaseUrl = "https://api.openweathermap.org/data/2.5/";
	// API key
	var APIKey = "115f418a44cb81c0cc424fa14d5ad0a5";
	// JQuery Selectors
	var searchBtnEl = $("#srch-btn");
	var clearBtnEl = $("#clear-btn")

	var searchClickHandler = function (event) {
		event.preventDefault();
		var locEl = $("#input-bx").val().trim();
		if (locEl) {
			retrieveWeather(locEl);
		} else {
			alert("Please enter city or Country");
		}
	};

	function addToSearchHistory(CT) {
		var searchList = $("#search-list");
		var savedSearch = $("<ul>").html('<button class=" mt-1 fw-lighter border border-success text-capitalize rounded-pill">' + CT + '</button>');
		savedSearch.on("click", function () {
			retrieveWeather(CT);
		})
		searchList.append(savedSearch);
		console.log(savedSearch)
		var oldSearches = JSON.parse(localStorage.getItem("storedSearches")) || [];
		oldSearches.push(CT)
		localStorage.setItem("storedSearches", JSON.stringify(oldSearches));
	}

	var storage = JSON.parse(localStorage.getItem("storedSearches")) || [];
	$(document).ready(function () {
		for (let i = 0; i < storage.length; i++) {
			var searchList = $("#search-list");
			var savedSearch = $("<ul>").html('<button class=" mt-1 fw-lighter border border-success text-capitalize rounded-pill">' + storage[i] + '</button>');
			savedSearch.on("click", function () {
				retrieveWeather(storage[i])
			})
			searchList.append(savedSearch);
			console.log(savedSearch)
			var oldSearches = JSON.parse(localStorage.getItem("storedSearches")) || [];
			oldSearches.push(storage[i])
		}
	})

	function retrieveWeather(enteredCtName) {
		var apiUrl = BaseUrl + "weather?q=" + enteredCtName + "&units=imperial" + "&appid=" + APIKey;
		fetch(apiUrl)
			.then(function (response) {
				if (response.ok) {
					addToSearchHistory(enteredCtName)
					return response.json();
				} else {
					alert("Please enter a valid city or country");
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
		var weatherIcon = data.weather[0].icon;
		var temp = data.main.temp;
		var lowTemp = data.main.temp_min;
		var highTemp = data.main.temp_max;
		var humidity = data.main.humidity;
		var tempFeel = data.main.feels_like;
		var windSpeed = data.wind.speed;
		var description = data.weather[0].description;

		var locEl = $('<h3>').addClass('fs-1 p-3').html(cityName);
		var dateEl = $('<h3>').addClass('').text("Today's Date: " + date);
		var iconEl = $("<img>").addClass('')
		iconEl.attr("class", "weather-icon ");
		iconEl.attr("src", "https://openweathermap.org/img/w/" + weatherIcon + ".png")
		var tempEl = $('<p>').addClass('').html("Temperature: " + temp + " &#8457;");
		var tempFeelEl = $('<p>').addClass('').html("Feels like: " + tempFeel + " &#8457;");
		var lowTempEl = $('<p>').addClass('').html("Low: " + lowTemp + " &#8457;");
		var highTempEl = $('<p>').addClass('').html("High: " + highTemp + " &#8457;")
		var humidityEl = $('<p>').addClass('').html("Humidity: " + humidity + "&#37")
		var windSpeedEl = $('<p>').addClass('').text("Wind Speed: " + windSpeed + " mph");
		var descriptionEl = $('<p>').addClass('').text("Condition: " + description);
		var weatherDetails = $("#weatherdetails");
		weatherDetails.empty();
		weatherDetails.append(locEl, dateEl, iconEl,  descriptionEl, tempEl, lowTempEl, highTempEl, tempFeelEl, humidityEl, windSpeedEl)
	}
	function retrieveForecast(enteredCtName) {
		var apiUrl = BaseUrl + "forecast?q=" + enteredCtName + "&units=imperial" + "&appid=" + APIKey;
		fetch(apiUrl)
			.then(function (response) {
				if (response.ok) {
					return response.json();
				} else {
					alert("Please enter a valid city or country");
					return;
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
		for (var i = 0; i < data.list.length; i += 8) {
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
			var forecastArea = $('<div>').addClass('forecast-area bg-secondary m-3 p-3');
			
			var forecastDateEl = $('<h4>').addClass('card-text').text(forecastDate);
			var forecastIconEl = $("<img>")
			forecastIconEl.attr("class", "weather-icon");
			forecastIconEl.attr("src", "https://openweathermap.org/img/w/" + forecastIcon + ".png")
			var forecastTempEl = $('<p>').addClass('card-text').html("Temperature: " + forecastTemp + " &#8457 ");
			var forecastLowTempEl = $('<p>').addClass('card-text').html("Low: " + forecastLowTemp + " &#8457 ");
			var forecastHighTempEl = $('<p>').addClass('card-text').html("High: " + forecastHighTemp + " &#8457 ");
			var forecastHumidityEl = $('<p>').addClass('card-text').html("Humidity: " + forecastHumidity + "&#37 ");
			var forecastTempFeelEl = $('<p>').addClass('card-text').html("Feels like: " + forecastTempFeel + " &#8457 ");
			var forecastWindSpeedEl = $('<p>').addClass('card-text').text("Wind Speed: " + forecastWindSpeed + " mph");
			var forecastDescriptionEl = $('<p>').addClass('card-text').text("Condition: " + forecastDescription);
			
			forecastArea.append(forecastDateEl, forecastIconEl,  forecastDescriptionEl, forecastTempEl, forecastLowTempEl, forecastHighTempEl, forecastTempFeelEl, forecastHumidityEl, forecastWindSpeedEl);
			theForecast.append(forecastArea);
		}
	}
	searchBtnEl.click(searchClickHandler);
	clearBtnEl.click(function () {
		localStorage.clear()
		location.reload()
	})
});