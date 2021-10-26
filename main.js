const key = '3d5894c5c1b4966b6c5b2b4c8734f456';
const currTemp = document.querySelector('.temperature');
const currWeather = document.querySelector('.description');
const sunset = document.querySelector('.sunset');
const sunrise = document.querySelector('.sunrise');
const date = document.querySelector('.date');
const metric = document.querySelector('#c');
const imperial = document.querySelector('#f');
const unit = document.querySelector('#unit');
const icon = document.querySelector('#icon');
const searchBox = document.querySelector('input');
const loc = document.querySelector('.location');


let units = 'metric';
let searchedCity;


 


function initializeDailyCards(){
    
    let arrayOfCards = []
    
    for(let i = 0; i < 10; i++){
            
            let card = document.createElement('DIV');
            card.classList.add('hourly');
            document.querySelector('.daily-container').appendChild(card);
            
            let hour = document.createElement('DIV');
            hour.classList.add('hour');
            hour.innerHTML = 'hour';
            card.appendChild(hour)
           
            let icon = document.createElement('IMG');
            icon.classList.add('icon');
            card.appendChild(icon);
           
            let description = document.createElement('DIV');
            description.classList.add('description');
            card.appendChild(description);
            description.innerHTML = 'desc'
            
            let temp = document.createElement('DIV');
            temp.classList.add('temp')
            card.appendChild(temp);
            temp.innerHTML = 'temp';

        arrayOfCards[i] = card;
    }

    return arrayOfCards;
}

let dailyCards = initializeDailyCards()

function initializeWeeklyContainer(){
    
    let weeklyDivs = []
    
    for(let i = 0; i < 7; i ++){
       
        let line = document.createElement('DIV');
        line.classList.add('weekly-line');
        document.querySelector('.weekly-container').appendChild(line)
        
        let day = document.createElement('DIV')
        day.classList.add('weekly-day')
        line.appendChild(day);
        day.innerHTML = 'Day';
        
        let temp = document.createElement('DIV');
        temp.classList.add('weekly-temp');
        line.appendChild(temp);
        temp.innerHTML = 'temp';
        
        let icon = document.createElement('IMG');
        icon.classList.add('weekly-icon');
        line.appendChild(icon);
        
        let desc = document.createElement('DIV');
        desc.classList.add('weekly-desc')
        line.appendChild(desc);
        desc.innerHTML = 'desc';
        
        let lineBreak = document.createElement('HR');
        lineBreak.classList.add('linebreak');
        document.querySelector('.weekly-container').appendChild(lineBreak);

        weeklyDivs[i] = line;
    }
    return weeklyDivs;
}

let weeklyForecast = initializeWeeklyContainer();

searchBox.addEventListener('keypress',(event)=>{
        if(event.keyCode == 13){
            searchedCity = searchBox.value;
            searchBox.value = '';
            getWeather(units,searchedCity);
            
              
        }
})




async function getWeather(unit,city){
    let units = unit;
    let cityName = city;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=${units}&appid=${key}`)
    let data = await response.json();
    
    loc.innerHTML = data.name;

    let today = new Date();
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = days[today.getDay()];
    const months = ['January','February', 'March','April', 'May','June','July','August','September','October','Novermber','December']
    let month = months[today.getMonth()];
    
    date.innerHTML = `${day}, ${month} ${today.getDate()}, ${today.getFullYear()}`;
   
    
    icon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    currWeather.innerHTML = data.weather[0].description;
    

    if(units == 'metric'){
        currTemp.innerHTML = `${data.main.temp_min}° C / ${data.main.temp_max}° C)`;
        

    }
    else if(units == 'imperial') {
        currTemp.innerHTML = `${data.main.temp_min}° F / ${data.main.temp_max}° F)`;
    }
    
    //Convert sunrise UNIX UTC to hour and minute format
    let sunriseUNIX = data.sys.sunrise;
    let msRise = sunriseUNIX * 1000;
    let riseHM = new Date(msRise);
    sunrise.innerHTML = 'Sunrise: ' + riseHM.toLocaleTimeString()
    
   
    //Convert sunset UNIX UTC to hour(MOD by 12 to convert to regular time) and minute format
    let sunsetUNIX = data.sys.sunset;
    let msSet = sunsetUNIX * 1000;
    let setHM = new Date(msSet);
    sunset.innerHTML = 'Sunset: ' + setHM.toLocaleTimeString();
    
    let lat = data.coord.lat;
    let lon = data.coord.lon;
    let coords = `lat=${lat}&lon=${lon}`;

    populateCards(dailyCards,units,coords);
    populateWeeklyForecast(weeklyForecast,units,coords);
}


    
 



async function populateCards(array, unit, coords){
    let coord = coords;
    let units = unit;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?${coord}&units=${units}&appid=${key}`);
    let data = await response.json();
   
    for(let i = 0; i < array.length; i++){
        let time = new Date(data.hourly[i].dt * 1000).getHours();
          if(time == 0)
            array[i].childNodes[0].innerHTML = `12:00AM`;
          else if(time == 12)
            array[i].childNodes[0].innerHTML = `12:00PM`; 
          else if(time < 12)
            array[i].childNodes[0].innerHTML = `${time}:00AM`;
          else if(time > 12)
            array[i].childNodes[0].innerHTML = `${time % 12}:00PM`;
           
         array[i].childNodes[1].src = `http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png`
         array[i].childNodes[2].innerHTML = data.hourly[i].weather[0].description;
         
         if(units == 'metric')
            array[i].childNodes[3].innerHTML = `${data.hourly[i].temp}° C`;
         else if(units == 'imperial') 
            array[i].childNodes[3].innerHTML = `${data.hourly[i].temp}° F`;
         
        }
    
}



async function populateWeeklyForecast(array, unit, coords){
    let coord = coords
    let units = unit;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?${coord}&units=${units}&appid=${key}`);
    let data = await response.json();
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January','February', 'March','April', 'May','June','July','August','September','October','Novermber','December'];
   

    for(let i = 0; i < array.length; i++){
        let date = new Date(data.daily[i].dt * 1000);
        array[i].childNodes[0].innerHTML = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
        if(units == 'metric')
            array[i].childNodes[1].innerHTML = `${data.daily[i].temp.min}° C / ${data.daily[i].temp.max}° C`;
        else if(units == 'imperial')
            array[i].childNodes[1].innerHTML = `${data.daily[i].temp.min}° F / ${data.daily[i].temp.max}° F`;
        array[i].childNodes[2].src = `http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png`;
        array[i].childNodes[3].innerHTML = data.daily[i].weather[0].description;
    }
}



imperial.addEventListener('click', event =>{
    let units = 'imperial';
    getWeather(units,searchedCity);
    
})

metric.addEventListener('click', event =>{
    let units = 'metric';
    getWeather(units,searchedCity);
   
}) 
  

