const app = document.querySelector('#app');
const API_KEY = 'f69a7fc6ad354e7c5850bf2028010738';

let cities = [];

const citiesList = document.createElement('div');
const weatherList = document.createElement('div');
const addCity = document.createElement('div');
const addCityInput = document.createElement('input');
const addCitySubmit = document.createElement('button');

citiesList.classList.add('cities');
weatherList.classList.add('weathers');
addCity.classList.add('add-city');
addCityInput.setAttribute('type', 'text');
addCitySubmit.innerText = "Dodaj miasto";
addCitySubmit.addEventListener('click', () => {
    AddCity(addCityInput.value);
});

addCity.append(addCityInput, addCitySubmit);
app.append(citiesList, addCity, weatherList);

InitiateCities();

async function DisplayCities() {
    citiesList.querySelectorAll('span').forEach((city) => city.remove());
    app.querySelectorAll('.weather').forEach((weather) => weather.remove());
    UpdateLocalStorage();

    for (let i = 0; i < cities.length; i++) {
        const city = cities[i];
        const list_item = document.createElement('span');
        list_item.innerText = city.name;
        list_item.addEventListener('click', () => DeleteCity(city));
        citiesList.append(list_item);

        const weather = document.createElement('div');
        const weather_city = document.createElement('span');
        const weather_temp_c = document.createElement('span');
        const weather_humidity = document.createElement('span');
        const weather_icon = document.createElement('img');

        const weather_response = await GetWeatherByCityApi(city);
        weather.classList.add('weather');
        weather_city.innerText = `Miasto: ${weather_response.name}`;
        weather_temp_c.innerText = `Temp C: ${weather_response.temp_C}`;
        weather_humidity.innerText = `Wilgoć: ${weather_response.humidity}%`;
        weather_icon.setAttribute('src', weather_response.icon);
        weather.append(weather_city, weather_temp_c, weather_humidity, weather_icon);
        weatherList.append(weather);
    }
}

async function AddCity(city) {
    if (cities.length >= 10) return;
    if (city == '') return;
    city = await GetCityByNameApi(city);
    if (city == null) return;
    cities.push(city);
    DisplayCities();
}

function DeleteCity(city) {
    cities.splice(cities.indexOf(city), 1);
    DisplayCities();
}

function UpdateLocalStorage() {
    localStorage.removeItem('cities');
    localStorage.setItem('cities', JSON.stringify(cities));
}

function InitiateCities() {
    if (localStorage.getItem('cities') != null) {
        cities = JSON.parse(localStorage.getItem('cities'));
    }
    if (cities.length > 0) {
        DisplayCities();
    } else {
        cities = []
    }
}

async function GetWeatherByCityApi(city) {
    const data = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${API_KEY}`)
                            .then(response => response.json());
    if (data.length == 0) return null;
    let result = {
        name: city.name,
        temp_C: (data.main.temp - 273.15).toFixed(2),
        humidity: data.main.humidity,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    }

    return result;
}

async function GetCityByNameApi(city) {
    let response = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${API_KEY}`);
    let data = (await response.json())[0];
    if (typeof data === 'undefined') return null;
    let result = {
        name: data.name,
        lat: data.lat,
        lon: data.lon
    }
    return result;
}