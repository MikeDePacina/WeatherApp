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


let units = 'metric';


async function getWeather (unit){
    let units = unit;
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=${units}&appid=${key}`)
    let data = await response.json();
    
    if(units == 'metric'){
        currTemp.innerHTML = `${data.current.temp}° C (Feels like ${data.current.feels_like}° C)`;
        

    }
    else if(units == 'imperial') {
        currTemp.innerHTML = `${data.current.temp}° F (Feels like ${data.current.feels_like}° F)`;
    }
    
    populateCurrentContainer(data);
   
    
   
   
    
}

function populateCurrentContainer(data){
   

    let today = new Date()
    const days = ['Sunday','Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let day = days[today.getDay()];
    const months = ['January','February', 'March','April', 'May','June','July','August','September','October','Novermber','December']
    let month = months[today.getMonth()];
    
    date.innerHTML = `${day}, ${month} ${today.getDate()}, ${today.getFullYear()}`;
   
    
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


    
 function initializeCards(){
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

let cards = initializeCards()



async function populateCards(array, unit){
    let units = unit
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=${units}&appid=${key}`)
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



/*async function populateDailyContainer(){
    let response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=33.44&lon=-94.04&units=${units}&appid=${key}`)
    let data = await response.json();
    let arrayOfCards = [];
    for(let i = 0; i < 10; i++){

        // template for hourly forecast card
       
        let card = document.createElement('DIV');
        card.classList.add('hourly');
        document.querySelector('.daily-container').appendChild(card);
        let hour = document.createElement('DIV');
        hour.classList.add('hour');
        let time = new Date(data.hourly[i].dt * 1000).getHours();
          if(time == 12)
           hour.innerHTML = `12:00PM`; 
         else if(time < 12)
           hour.innerHTML = `${time}:00AM`;
          else if(time > 12)
           hour.innerHTML = `${time % 12}:00PM`;
            

        card.appendChild(hour)
        let icon = document.createElement('IMG');
        icon.classList.add('icon');
        card.appendChild(icon);
        icon.src = `http://openweathermap.org/img/wn/${data.hourly[i].weather[0].icon}@2x.png`;
        let description = document.createElement('DIV');
        description.classList.add('description');
        description.innerHTML = data.hourly[i].weather[0].description;
        card.appendChild(description);
        let temp = document.createElement('DIV');
        temp.classList.add('temp')
        if(units == 'imperial'){
            temp.innerHTML = `${data.hourly[i].temp} ° F`;
        }else
            temp.innerHTML = `${data.hourly[i].temp} ° C`;
        card.appendChild(temp);
        arrayOfCards[i] = card;
    }
        
   return arrayOfCards;
} 

function changeHourly(data,units, array){
    for(let i = 0; i < array.length; i++){
        if(units == 'imperial'){
            array[i].lastChild = `${data.hourly[i].temp} ° F`;
        }
        else
        array[i].lastChild = `${data.hourly[i].temp} ° C`;
    }
} */

imperial.addEventListener('click', event =>{
    getWeather('imperial');
    populateCards(cards,'imperial')
    //changeHourly('imperial', arrayOfCards)
    
})

metric.addEventListener('click', event =>{
    getWeather('metric');
    populateCards(cards,'metric')
   // changeHourly('metric', arrayOfCards)
    
})
  
//populateDailyContainer();

populateCards(cards);

