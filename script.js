//Chaging Background
window.addEventListener('load', changeBackground(document.body));

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
const getBtn = document.getElementById('getBtn');
const city = document.querySelector('.city'); 
const date = document.querySelector('.date'); 
const weatherIcon = document.querySelector('.weather-icon');
const tempDisplay = document.querySelector('.temp-display');
const tempReview = document.querySelector('.temp-review');
const windSpeed = document.querySelector('.wind-speed');
const unitBtn = document.getElementById('unitBtn');
const nameOfCity = document.getElementById('nameOfCity');

//load from local storage.

let units = JSON.parse(localStorage.getItem('units'));
console.log(units);
//Temperature variables
let unit =  `${units.unit}`;
let unitName = `${units.unitName}`;

unitBtn.classList.add(`${units.className}`);

//Get Weather Update

function getWeatherUpdate (city){
     fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=f00c38e0279b7bc85480c3fe775d518c&units=${unit}`)
    .then((response) => response.json())
    .then((data) => print(data))
    .catch(() => handleError())
}



//Toggling Temperature button
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
// console.log(units);
   localStorage.setItem('units', JSON.stringify(units));  //Store in local storage
   getWeatherUpdate(`${ city.innerText}`);
}

//Load Default City
getWeatherUpdate("Lagos");
nameOfCity.disabled = false;

//Load Entered City
getBtn.addEventListener('click', function(){
    let nameOfCityValue = document.getElementById('nameOfCity').value.trim();
    if (nameOfCityValue != ""){
       getWeatherUpdate(nameOfCityValue);
    }
});

function print(data) {
    city.innerText = data.name;
    weatherIcon.src= `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    tempDisplay.innerText = `${data.main.temp} ${unitName}`;
    tempReview.innerText = data.weather[0].description;
    windSpeed.innerText = `Wind Speed: ${data.wind.speed} m/s`;
   const localTime = new Date((data.dt + data.timezone) * 1000);
   date.innerText= localTime.toLocaleString();
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
    const reloadBtn = document.querySelector('.reload-btn');
    reloadBtn.style.display = 'block';
    nameOfCity.disabled = true;
    reloadBtn.addEventListener('click', () => {
        location.reload();
    })
}
