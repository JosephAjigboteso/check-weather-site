//Chaging Background
window.addEventListener('load', changeBackground(document.body));

window.addEventListener('load', function(){
    const hasSeenPopup = sessionStorage.getItem('hasSeenPopup');

    if (!hasSeenPopup) {
        document.querySelector('.pop-up').style.display = 'flex';
    } else {
     // User has seen the popup before
      document.querySelector('.pop-up').style.display = 'none';
        nameOfCity.disabled = false;
        getBtn.disabled = false;
        defaultBtn.disabled = false;

        const defaultCity = localStorage.getItem('defaultCity');
        if (defaultCity) {
            getWeatherUpdate(defaultCity);
        } 
    }

})

function changeBackground (backElem){
    toggle = true;
setInterval(() => {
    backElem.style.background = toggle ? 
    'linear-gradient(to right, #2ecc71, #3498db)' :
    'linear-gradient(to left, #2ecc71, #3498db)';
    toggle = !toggle;
}, 3000);
}

//DOM Elements
const weatherSection = document.querySelector('.weather-details');
const getBtn = document.getElementById('getBtn');
const acceptBtn = document.getElementById('accept-btn');
const defaultBtn = document.getElementById('default-btn');
const saveBtn = document.getElementById('save-btn');
const city = document.querySelector('.city'); 
const date = document.querySelector('.date'); 
const weatherIcon = document.querySelector('.weather-icon');
const tempDisplay = document.querySelector('.temp-display');
const tempReview = document.querySelector('.temp-review');
const windSpeed = document.querySelector('.wind-speed');
const unitBtn = document.getElementById('unitBtn');
const nameOfCity = document.getElementById('nameOfCity');
const reloadBtn = document.querySelector('.reload-btn');

nameOfCity.disabled = true;
getBtn.disabled = true;
defaultBtn.disabled = true;
unitBtn.style.display = 'none';
reloadBtn.style.display = 'none';

//load temperature units from local storage.

let units = JSON.parse(localStorage.getItem('units')) || { 
     unit: 'metric',
     unitName : '°C',
     className: 'fa-toggle-on'} ;
//Temperature variables
let unit =  `${units.unit}`;
let unitName = `${units.unitName}`;

unitBtn.classList.add(`${units.className}`);

//Accepting condition -- Hide pop-ups and display default city

acceptBtn.addEventListener('click', function(){
    document.querySelector('.pop-up').style.display = 'none';
    //Load Default City
    const defaultCity = localStorage.getItem('defaultCity');
    if(defaultCity){
        getWeatherUpdate(defaultCity); 
    }
    nameOfCity.disabled = false;
    getBtn.disabled = false;
    defaultBtn.disabled = false;
    sessionStorage.setItem('hasSeenPopup', 'true'); 
})

//Set default city Mode
defaultBtn.addEventListener('click', function(){
    nameOfCity.placeholder = 'Enter Default city'
    getBtn.style.display = 'none';
    defaultBtn.style.display = 'none';
    saveBtn.style.display = 'block';
})

//save defualt city to local storage
saveBtn.addEventListener('click', function(){
     let defaultCity = document.getElementById('nameOfCity').value.trim();
      if (defaultCity) {
        localStorage.setItem('defaultCity', defaultCity);
        saveBtn.style.display = 'none';
        getBtn.style.display = 'block';
        defaultBtn.style.display = 'block';
    }
})


//Get Weather Update

function getWeatherUpdate (cityName){
    if (!cityName) return;
     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=f00c38e0279b7bc85480c3fe775d518c&units=${unit}`)
    .then((response) => response.json())
    .then((data) => {
        removeLoadingEffect();
        displayWeather(data);
    })
    .catch(() => handleError())
}

//Toggling unit button
unitBtn.addEventListener('click', function(){
    this.classList.toggle('fa-toggle-on');
    this.classList.toggle('fa-toggle-off');
   changeUnit(this);
})


function changeUnit (unitBtn){
   let className; 
   if (unitBtn.classList.contains("fa-toggle-on")){
     unit = 'metric'
     unitName = '°C'
     className = 'fa-toggle-on'
   }else if(unitBtn.classList.contains("fa-toggle-off")){
    unit = 'imperial'
    unitName = '°F'
    className = 'fa-toggle-off'
   }
   units = {
    "unit": unit,
    "unitName": unitName,
    "className": className
   }

//    Store in local storage
   localStorage.setItem('units', JSON.stringify(units));  //
   getWeatherUpdate(`${ city.innerText}`);
}

//Load Entered City
getBtn.addEventListener('click', function(){
    let nameOfCityValue = document.getElementById('nameOfCity').value.trim();
    if (nameOfCityValue != ""){
        addLoadingEffect();
       getWeatherUpdate(nameOfCityValue);
    }
    defaultBtn.style.display = 'none';
});
2

function displayWeather(data) {
    city.innerText = data.name;
    weatherIcon.src= `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    tempDisplay.innerText = `${data.main.temp} ${unitName}`;
    tempReview.innerText = data.weather[0].description;
    windSpeed.innerText = `Wind Speed: ${data.wind.speed} m/s`;
   const localTime = new Date((data.dt + data.timezone) * 1000);
   date.innerText= localTime.toLocaleString();
   unitBtn.style.display = 'inline-block';
}
function handleError (){
 let nameOfCityValue = document.getElementById('nameOfCity').value.trim()
city.innerText =`Could not get weather for ${nameOfCityValue}`;
city.style.color = 'red';
city.style.fontSize = '20px'
removeData(weatherIcon)
removeData(tempDisplay)
removeData(tempReview)
removeData(windSpeed)
removeData(date)
removeData(unitBtn)
reloadpage();
}

function removeData (data){
    data.style.display = "none";
}
function reloadpage(){
    reloadBtn.style.display = 'block';
    nameOfCity.disabled = true;
    reloadBtn.addEventListener('click', () => {
        location.reload();
    })
}

function addLoadingEffect (){
    getBtn.innerHTML = `<i class="fas fa-sync-alt"></i>`;
    getBtn.style.backgroundColor = 'black';
    getBtn.style.padding = '10px 40px';
    weatherSection.style.opacity = '0.5';
    // body.style.opacity = '0.5';
}
function removeLoadingEffect(){
    getBtn.innerHTML = 'Get Weather';
    getBtn.style.backgroundColor = '#3498db';
    getBtn.style.padding = '10px 15px';
    weatherSection.style.opacity = '1';
}