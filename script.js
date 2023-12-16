const userCitySearchButton = document.getElementById('userCitySearchButton')
let searchHistory = []
if (localStorage.history){
    searchHistory = JSON.parse(localStorage.getItem("history"))
}
const historySection = document.getElementById('history')
const apiKey = '913f91851f3bfa2fdce45106f3702a7c'
const userCityInput = document.getElementById('userCityInput')
function generateImg(imgData, placement) {
    const img = document.createElement("img");
    const iconurl = `http://openweathermap.org/img/w/${imgData}.png`
    img.src = iconurl;
    placement.appendChild(img)
}
function apiCall(cityToSearch) {
    const cityWeatherCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${apiKey}&units=imperial`
    fetch(cityWeatherCall)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data2) {
            const lat = data2.coord.lat
            const lon = data2.coord.lon
            const displayArea = document.getElementById("currentWeather")
            while (displayArea.hasChildNodes()) {
                displayArea.removeChild(displayArea.firstChild)
            }
            const eachDay = document.createElement("p");
            const eachDayText = document.createTextNode(`Todays weather in ${cityToSearch}`);
            eachDay.appendChild(eachDayText)
            displayArea.appendChild(eachDay);
            generateImg(data2.weather[0].icon, displayArea)
            const windSection = document.createElement("p");
            const windSpeed = document.createTextNode(`wind speed: ${data2.wind.speed}`);
            windSection.appendChild(windSpeed);
            displayArea.appendChild(windSection);
            for (const [key, value] of Object.entries(data2.main)) {
                const currentWeatherSection = document.createElement("p");
                const textCurrentWeather = document.createTextNode(`current ${key}: ${value}`);
                currentWeatherSection.appendChild(textCurrentWeather);
                if (key == "temp" || key == "humidity") {
                    displayArea.appendChild(currentWeatherSection);
                }
            }

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
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
                            generateImg(data.list[i].weather[0].icon, eachDay)
                            const windSection = document.createElement("li");
                            const windSpeed = document.createTextNode(`wind speed: ${data.list[i].wind.speed}`);
                            windSection.appendChild(windSpeed);
                            eachDay.appendChild(windSection);
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
}
function history() {
    if (localStorage.history) {
        storedHistoryArray = JSON.parse(localStorage.getItem("history"))
        while (historySection.hasChildNodes()) {
            historySection.removeChild(historySection.firstChild)
        }
        for (let i = 0; i < storedHistoryArray.length; i++) {
            const historyButton = document.createElement("button");
            const searchedCity = document.createTextNode(storedHistoryArray[i]);
            historyButton.appendChild(searchedCity);
            historyButton.addEventListener('click', function () {
                apiCall(storedHistoryArray[i])
            })
            historySection.appendChild(historyButton)
        }
    }
}
history()
userCitySearchButton.addEventListener('click', function () {

    apiCall(userCityInput.value)
    if (searchHistory.includes(userCityInput.value) === false) {
        searchHistory.push(userCityInput.value)
        localStorage.setItem('history', JSON.stringify(searchHistory))
        history()
    }
});