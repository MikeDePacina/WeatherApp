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


let units = 'standard';


async function getWeather (){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=${units}&appid=${key}`)
    let data = await response.json();
    populateCurrentContainer(data);
    populateDailyContainer(data);
    
   
   
    
}



imperial.addEventListener('click', event =>{
    units = 'imperial';
    getWeather();
    
})

metric.addEventListener('click', event =>{
    units = 'metric';
    getWeather();
    
})
  


function populateCurrentContainer(data){
   
    

    let today = new Date()
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = days[today.getDay()];
    const months = ['January','February', 'March','April', 'May','June','July','August','September','October','Novermber','December']
    let month = months[today.getMonth()];
    date.innerHTML = ` ${today.getFullYear()}`;
     
    date.innerHTML = `${day}, ${month} ${today.getDate()}, ${today.getFullYear()}`;
   
    if(units = 'metric'){
        currTemp.innerHTML = `${data.current.temp}° C (Feels like ${data.current.feels_like}° C)`;
    }
    else{
        currTemp.innerHTML = `${data.current.temp}° F (Feels like ${data.current.feels_like}° F)`;
    }
    
    icon.src = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`;
    currWeather.innerHTML = data.current.weather[0].description;

    
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

function populateDailyContainer(data){
    for(let i = 0; i < 10; i++){

         // template for hourly forecast card
         let hourlyContainer = document.createElement('DIV');
         hourlyContainer.classList.add('hourly-container');
         document.querySelector('.daily-container').appendChild(hourlyContainer);
         let card = document.createElement('DIV');
         card.classList.add('hourly');
         hourlyContainer.appendChild(card)
         let hour = document.createElement('DIV');
         hour.classList.add('hour');
         let time = new Date(data.hourly[i].dt * 1000).getHours();
           if(time == 0)
            hour.innerHTML = `12:00AM`;
           else if(time < 12)
            hour.innerHTML = `${time}:00AM`;
           else if(time > 12)
            hour.innerHTML = `${time % 12}:00PM`;
             

         
      
        
       
        

         hourlyContainer.appendChild(hour)
         let icon = document.createElement('IMG');
         icon.classList.add('icon');
         hourlyContainer.appendChild(icon);
         icon.src = `http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png`;
         let description = document.createElement('DIV');
         description.classList.add('description');
         description.innerHTML = data.hourly[i].weather[0].description;
         hourlyContainer.appendChild(description);
         let temp = document.createElement('DIV');
         temp.classList.add('temp');
         hourlyContainer.appendChild(temp);
         temp.innerHTML = data.hourly[i].temp;


       
        

    }
}

