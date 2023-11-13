// Importing api from openweathermap.org 

// api.openweathermap.org/data/2.5/weather?q={city name}&appid={your api key}


const weatherApi = {
    key: "bab281d79e5f1e9755a68d754cc313e7",
    baseUrl: "https://api.openweathermap.org/data/2.5/weather"
}

const searchInputBox = document.getElementById('input-box')

// Event listener function on keypress 
searchInputBox.addEventListener('keypress',(event)=>{
    if (event.keyCode == 13) {
        if(searchInputBox.value === "")
            alert('Your Have Not Enter value')
        // console.log(searchInputBox.value)
        getWeatherReport(searchInputBox.value) 
    }
})

// get weather report 

// Get Weather Report
function getWeatherReport(city) {
    fetch(`${weatherApi.baseUrl}?q=${city}&appid=${weatherApi.key}&units=metric`)
    .then(weather => {
        return weather.json();
    }).then(showWeatherReport);
}
// show weather report
function showWeatherReport(weather){
    console.log(weather);

    let city = document.getElementById('city')
    let date = document.getElementById('date')
    let temp = document.getElementById('temp')
    let min_max = document.getElementById('min-max')
    let my_weather = document.getElementById('weather')

    // city = weather.name
    city.innerHTML = `${weather.name}  ,${weather.sys.country} `
    temp.innerHTML = `${weather.main.temp}&deg;C`
    min_max.innerHTML = `${weather.main.temp_min}&deg;C (min) / ${weather.main.temp_max}&deg;C (max)`
    my_weather.innerHTML = `${weather.weather[0].main}`

    // date = weather 
    let todayDate = new Date();
    date.innerHTML = dateManager(todayDate)

    // handling Weather image in body
    if (my_weather.textContent == 'Clear') {    
        document.body.style.backgroundImage = 'url(../Image/clear.jpg)'
    } else if(my_weather.textContent ==  'Clouds'){
        document.body.style.backgroundImage = 'url(../Image/cloud.jpg)'
    } else if(my_weather.textContent ==  'Haze'){
        document.body.style.backgroundImage = 'url(../Image/haze.jpg)'
    } else if(my_weather.textContent ==  'Rain'){
        document.body.style.backgroundImage = 'url(../Image/rain.jpg)'
    } else if(my_weather.textContent ==  'Snow'){
        document.body.style.backgroundImage = 'url(../Image/snow.jpg)'
    } else if(my_weather.textContent ==  'Thunderstorm'){
        document.body.style.backgroundImage = 'url(../Image/thunderstorm.jpg)'
    } else{
        document.body.style.backgroundImage = 'url(https://source.unsplash.com/1600x900/?nature,water)'
    }

    // let coords_long_lat =document.getElementById('coords_long_lat')
    // let wind_string = ''
    // for(const key in weather.coord){
    //     wind_string +=  `<li>${key} => ${weather.coord[key]}</li>`
    // }

    // coords_long_lat.innerHTML = wind_string
    // let wind_speed =document.getElementById('wind_speed')
    // wind_string = ''
    // for(const key in weather.wind){
    //     wind_string +=  `<li>${key} => ${weather.wind[key]}</li>`
    // }

    // wind_speed.innerHTML = wind_string

}

// date manage
const dateManager = (todayDate)=>{
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    let year = todayDate.getFullYear()
    let month = months[todayDate.getMonth()]
    let date = todayDate.getDate()
    let day = days[todayDate.getDay()]
    return  `${date} ${month} (${day}), ${year}`
}
