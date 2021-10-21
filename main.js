const key = '3d5894c5c1b4966b6c5b2b4c8734f456';
const currTemp = document.querySelector('.temperature');
const currWeather = document.querySelector('.description');
const sunset = document.querySelector('.sunset');
const sunrise = document.querySelector('.sunrise');
const date = document.querySelector('.date');
const metric = document.querySelector('#c');
const imperial = document.querySelector('#f');
const unit = document.querySelector('#unit');
let units = 'standard';


async function getWeather (){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=${units}&appid=${key}`)
    let data = await response.json();
    populateContainers(data)
    
}

function tempUnits(unit){
 
    if (unit == 'imperial')
        unit.innerHTML = 'F';
    
    else (unit == 'metric')
        unit.innerHTML = 'C';
    
}

imperial.addEventListener('click', event =>{
    units = 'imperial';
    getWeather();
    tempUnits('imperial');
})

metric.addEventListener('click', event =>{
    units = 'metric';
    getWeather();
    tempUnits('metric');
})
  


function populateContainers(data){
   
    
    let today = new Date()
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = days[today.getDay()];
    const months = ['January','February', 'March','April', 'May','June','July','August','September','October','Novermber','December']
    let month = months[today.getMonth()];
    date.innerHTML = ` ${today.getFullYear()}`;
     
    date.innerHTML = `${day}, ${month} ${today.getDate()}, ${today.getFullYear()}`;
    
    currTemp.innerHTML = `${data.current.temp}  (Feels like ${data.current.feels_like})`;
   
    currWeather.innerHTML = data.current.weather.description;
    
    //Convert sunrise UNIX UTC to hour and minute format
    let sunriseUNIX = data.current.sunrise;
    let msRise = sunriseUNIX * 1000;
    let riseHM = new Date(msRise)
    sunrise.innerHTML = `Sunrise: ${riseHM.getHours()}:${riseHM.getMinutes()} AM`;
   
    //Convert sunset UNIX UTC to hour(MOD by 12 to convert to regular time) and minute format
    let sunsetUNIX = data.current.sunset;
    let msSet = sunsetUNIX * 1000;
    let setHM = new Date(msSet)
    sunset.innerHTML = `Sunset: ${setHM.getHours() % 12}:${setHM.getMinutes()} PM`;
   
}



