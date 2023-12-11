const userCitySearchButton = document.getElementById('userCitySearchButton')
const searchHistory = []
userCitySearchButton.addEventListener('click', function () {

    const userCityInput = document.getElementById('userCityInput')
    const apiKey = '913f91851f3bfa2fdce45106f3702a7c'
    const citySearched = userCityInput.value
    const cityWeatherCall = `https://api.openweathermap.org/data/2.5/weather?q=${citySearched}&appid=${apiKey}&units=imperial`

    fetch(cityWeatherCall)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data2) {
            console.log(data2)
            const lat = data2.coord.lat
            const lon = data2.coord.lon
            const displayArea = document.getElementById("currentWeather")
            while (displayArea.hasChildNodes()) {
                displayArea.removeChild(displayArea.firstChild)
            }
            //add title for section
            for (const [key, value] of Object.entries(data2.main)) {
                const currentWeather = document.createElement("p");
                const textCurrentWeather = document.createTextNode(`${key}: ${value}`);
                currentWeather.appendChild(textCurrentWeather);
                displayArea.appendChild(currentWeather);

            }
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    console.log(data)
                    const forecastDisplayArea = document.getElementById("forcastDays")
                    while (forecastDisplayArea.hasChildNodes()) {
                        forecastDisplayArea.removeChild(forecastDisplayArea.firstChild);
                    }
                    for (let i = 0; i < data.list.length; i++) {
                        const date = data.list[i].dt_txt.split(" ")
                        if (date[1] == '12:00:00') {
                            const eachDay = document.createElement("ul");
                            const eachDayText = document.createTextNode(`${date[0]}`);
                            eachDay.appendChild(eachDayText);
                            forecastDisplayArea.appendChild(eachDay);
                            const a = document.createElement("li");
                            const b = document.createTextNode(`wind speed: ${data.list[i].wind.speed}`);
                            a.appendChild(b);
                            eachDay.appendChild(a);
                            for (const [key, value] of Object.entries(data.list[i].main)) {
                                const weatherForcast = document.createElement("li");
                                const textWeatherForcast = document.createTextNode(`${key}: ${value}`);
                                weatherForcast.appendChild(textWeatherForcast);
                                if (key == "temp" || key == "humidity") {
                                    eachDay.appendChild(weatherForcast);
                                }
                            }
                        }
                    }
                })
        })
    searchHistory.push(userCityInput.value)
    console.log(searchHistory)
});