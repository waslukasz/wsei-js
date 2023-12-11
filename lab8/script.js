const weather = document.querySelector("#weather");
const API_KEY = "f69a7fc6ad354e7c5850bf2028010738";

GetWeatherByCityApi("Krakow");

as

async function GetWeatherByCityApi(cityName) {
    const city = await GetCityByNameApi(cityName);
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`)
                            .then(response => response.json());
    let newWeather = {
        name: cityName,
        temp_C: (response.main.temp - 273.15).toFixed(2),
        humidity: response.main.humidity,
        icon: `https://openweathermap.org/img/wn/${response.weather[0].icon}@2x.png`
    }
    let weatherObject = document.createElement("div");
    weatherObject.innerHTML = `<span>${newWeather.name}</span>
    </br>
    <span>Temp_C: ${newWeather.temp_C}</span>
    </br>
    <span>Humidity: ${newWeather.humidity}</span>
    </br>
    <img src="${newWeather.icon}"></img>`;
    weather.append(weatherObject);
}

async function GetCityByNameApi(city) {
    let apiCall = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);
    let response = (await apiCall.json())[0];
    let result = {
        name: response.name,
        lat: response.lat,
        lon: response.lon
    }
    return result;
}