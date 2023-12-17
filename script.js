const userCitySearchButton = document.getElementById('userCitySearchButton')
let searchHistory = []
if (localStorage.history){ // this pulls the history local storage cash if they have already visited the site, otherwise it will start as an empty array to store the history later
    searchHistory = JSON.parse(localStorage.getItem("history"))
}
const historySection = document.getElementById('history')
const apiKey = '913f91851f3bfa2fdce45106f3702a7c' // this is the api key needed for any call doen to the weather api
const userCityInput = document.getElementById('userCityInput')
function generateImg(imgData, placement) { //this generates the icons to indicate the weather in both the current and forcasted weather sections
    const img = document.createElement("img");
    const iconurl = `http://openweathermap.org/img/w/${imgData}.png`
    img.src = iconurl;
    placement.appendChild(img)
}
function apiCall(cityToSearch) { //this is a function so it can be called from the history buttons as well as the user search button
    const cityWeatherCall = `https://api.openweathermap.org/data/2.5/weather?q=${cityToSearch}&appid=${apiKey}&units=imperial`
    fetch(cityWeatherCall)// this first call gets the current weather and the coodinates needed for the second call for the forecast
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data2) {
            const lat = data2.coord.lat
            const lon = data2.coord.lon
            const displayArea = document.getElementById("currentWeather")
            while (displayArea.hasChildNodes()) { // this makes sure the display area for current weather is clean if multiple searches to get the old search out of the way
                displayArea.removeChild(displayArea.firstChild)
            }
            const eachDay = document.createElement("p"); // this block creates and appends the header with the city searched for the current weather section
            const eachDayText = document.createTextNode(`Todays weather in ${cityToSearch}`);
            eachDay.appendChild(eachDayText)
            displayArea.appendChild(eachDay);

            generateImg(data2.weather[0].icon, displayArea) //this calls the funtion to generate the icon for the current weather using data from the api call

            const windSection = document.createElement("p"); // this block creates the windspeed section of the current weather
            const windSpeed = document.createTextNode(`wind speed: ${data2.wind.speed}`);
            windSection.appendChild(windSpeed);
            displayArea.appendChild(windSection);

            for (const [key, value] of Object.entries(data2.main)) { //this for loop looks through all the different aspects of the weather and only creates and appends the desired keys which are the tempature and humidity 
                const currentWeatherSection = document.createElement("p");
                const textCurrentWeather = document.createTextNode(`current ${key}: ${value}`);
                currentWeatherSection.appendChild(textCurrentWeather);
                if (key == "temp" || key == "humidity") { // this only appends the desired keys of the complete weather forcast
                    displayArea.appendChild(currentWeatherSection);
                }
            }

            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`) // this takes latitude and longitude data from the first api call and gets the forcasted data for the next 5 days 
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    const forecastDisplayArea = document.getElementById("forcastDays")
                    while (forecastDisplayArea.hasChildNodes()) {//this removes the old search if multiple searches happen in one open session of the webpage
                        forecastDisplayArea.removeChild(forecastDisplayArea.firstChild);
                    }
                    for (let i = 0; i < data.list.length; i++) {// this for loop goes through the forcasted weather and returns each of the 5 days noontime forcast instead of every 3 hours that the api returns initially
                        const date = data.list[i].dt_txt.split(" ")
                        if (date[1] == '12:00:00') {// this is the statement that limits the data added to be only the noontime weather

                            const eachDay = document.createElement("ul");//this block creates and appends a ul element with the date of the forcasted day
                            const eachDayText = document.createTextNode(`${date[0]}`);
                            eachDay.appendChild(eachDayText);
                            forecastDisplayArea.appendChild(eachDay);

                            generateImg(data.list[i].weather[0].icon, eachDay)// this creates and appends the weather icon for the forcasted day

                            const windSection = document.createElement("li");// this block creates and appends the windspeed of the forcasted day
                            const windSpeed = document.createTextNode(`wind speed: ${data.list[i].wind.speed}`);
                            windSection.appendChild(windSpeed);
                            eachDay.appendChild(windSection);

                            for (const [key, value] of Object.entries(data.list[i].main)) { // this for loop only creates and appends only the keys that are desired to be on the page, which is the tempature and humidity
                                const weatherForcast = document.createElement("li");
                                const textWeatherForcast = document.createTextNode(`${key}: ${value}`);
                                weatherForcast.appendChild(textWeatherForcast);
                                if (key == "temp" || key == "humidity") {// this is the statement that only puts the desired weather keys on the page
                                    eachDay.appendChild(weatherForcast);
                                }
                            }
                        }
                    }
                })
        })
}
function history() {// this deletes and restores data to the local storage for the history section
    if (localStorage.history) {// if theres any locally stored data in the history this will exicute to render the history to the page on startup 
        storedHistoryArray = JSON.parse(localStorage.getItem("history"))
        while (historySection.hasChildNodes()) {// this is hear to remove the history so that it can append the new list later to stop multiple coppies of the same thing 
            historySection.removeChild(historySection.firstChild)
        }
        for (let i = 0; i < storedHistoryArray.length; i++) {//this creates and appends buttons for each of the elements in the locally stored history 
            const historyButton = document.createElement("button");
            const searchedCity = document.createTextNode(storedHistoryArray[i]);
            historyButton.appendChild(searchedCity);
            historyButton.addEventListener('click', function () {
                apiCall(storedHistoryArray[i])//this calls the api to get the data for the city that is displayed on the button
            })
            historySection.appendChild(historyButton)
        }
    }
}
history() //this is called on startup to get any of the old searches from locally stored history 
userCitySearchButton.addEventListener('click', function () {// this is the event listener for the search button thats attatched to the user input box
    apiCall(userCityInput.value)// this calls the api function to get the current and forcasted weather of the searched city
    if (searchHistory.includes(userCityInput.value) === false) {// this pushes the search to local history only if its not there already
        searchHistory.push(userCityInput.value)// this pushes the search to an array thats used to push to local storage later
        localStorage.setItem('history', JSON.stringify(searchHistory))//this pushes the seach history to the local storage under 'history'
        history()// this is called to render the newly searched city to the search history section
    }
});