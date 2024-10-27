//insert your api key below
const apiKey = 'yourapikey';


let date;
let hour;
let minute;
let second;
let day;
let month;
let dayDate;


function formatTimeUnit(unit) {
    return unit < 10 ? '0' + unit : unit;
}
function formatOnlyHour(unit){
    if(unit<=12){
        return unit < 10 ? '0' + unit : unit;
    }
    else{
        return (unit-12) < 10 ? '0' + (unit-12) : (unit-12);
    }
}
//sets if it is after or before midday
function setAmPm(){
    date = new Date();
    if (date.getHours()<=12) document.getElementById("am-pm").innerHTML = "AM";
    else document.getElementById("am-pm").innerHTML = "PM"
    
}

//time displayer
function upDateTime(){
    date = new Date();
    hour = formatOnlyHour(date.getHours());
    minute = formatTimeUnit(date.getMinutes());
    second = formatTimeUnit(date.getSeconds());
    document.getElementById("hour").innerHTML = hour + "." +minute +"."+second; 
}
//date displayer
function updateDate(){
    date = new Date();
    day = date.getDay();
    month = date.getMonth();
    dayDate = date.getDate();
    document.getElementById("date").innerHTML= dayDate + " " + whichMonth(month+1) + " " + whichDay(day);
    for(i=1;i<=4;i++){
        ++day;
        day = day > 6 ? (day%6) : day ; 
        document.getElementById(`day${i}`).innerHTML = `<div class="day-forecast-title">${whichDay(day)}</div>
        <img id="day${i}-weather-condition-symbol" src="" alt=""><br>
        <div id="day${i}-daytime"></div><div id="day${i}-nighttime"></div>`;
    }
}
function whichDay(num){
    switch(num){
        case 1:
            return "Monday";
            break;
        case 2:
            return "Tuesday";
            break;
        case 3:
            return "Wednesday";
            break;
        case 4:
            return "Thursday";
            break;
        case 5:
            return "Friday";
            break;
        case 6:
            return "Saturday";
            break;
        case 0:
            return "Sunday";
            break;
        default:
    }
}
function whichMonth(num){
    switch(num){
        case 1:
            return "January";
            break;
        case 2:
            return "February";
            break;
        case 3:
            return "March";
            break;
        case 4:
            return "April";
            break;
        case 5:
            return "May";
            break;
        case 6:
            return "June";
            break;
        case 7:
            return "July";
            break;
        case 8:
            return "August";
            break;
        case 9:
            return "September";
            break;
        case 10:
            return "October";
            break;
        case 11:
            return "November";
            break;
        case 12:
            return "December";
            break;
        default:
    }
}

//calling the functions which are above
upDateTime();
setAmPm();
updateDate();

//updating time and date while page is open
setInterval(upDateTime, 1000);
setInterval(setAmPm, 3600000);
setInterval(updateDate, 3600000);


let lat,lon;
let latLonList = [];
let isRainOn = 0;

//function which works when any location is searched
function checkEnter(event) {
    if (event.keyCode == 13) {
        let locationInfo = document.getElementById('location-search').value;
        getWeatherData(locationInfo); //get respond for locationInfo location
        if(isRainOn!=0){
            let drops = document.getElementsByClassName("drop");
            for(i=drops.length-1;i>=0;i--) drops[i].remove();
        }
    } 
}



//creates rain when weather is rainy
function createRain() {
    isRainOn = 1;
    const rainContainer = document.getElementById('rain-effect');
    rainContainer.classList.add('rain');

    for (let i = 0; i < 100; i++) { //create 100 drops
        
        //create drop elements
        const drop = document.createElement('div');
        rainContainer.appendChild(drop);
        drop.classList.add('drop');

        drop.style.left = Math.random() * 100 + 'vw'; // makes raindrops spreaded through whole page
        drop.style.animationDuration = Math.random() * 3 + 0.5 + 's'; // rain speed
        
    }
    

    //the code below makes it fade in animated
    rainContainer.style.opacity = 0; 
    rainContainer.style.display = "block";
    setTimeout(() => {
        rainContainer.style.transition = "opacity 3s ease-in-out"; 
        rainContainer.style.opacity = 0.26; 
    }, 1000);
}


//this functions handles the whole respond
function getWeatherData(locationInfo){
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${locationInfo}&limit=1&appid=${apiKey}`)
    //takes latitude and longtitude values from country or state name
    .then(response => {
        if (!response.ok) {
          throw new Error('Ağ hatasi: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        lat = data[0].lat;
        lon = data[0].lon;
        latLonList.length = 0;
        latLonList.push(lat,lon);
        changeWeatherCondition(); //updates the page for todays informations
        changeWeatherForecastes(); //updates the page for forecasted days informations
    })
    .catch(error => {
        console.error('Hata:', error);
    });
      
    };



function changeWeatherCondition(){ // updates the page for todays weather conditions
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latLonList[0]}&lon=${latLonList[1]}&appid=${apiKey}&units=metric`)
    .then(response => {
        if (!response.ok) {
          throw new Error('Ağ hatasi: ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        //this .then block is for update the page
        console.log(data);
        document.getElementById("current-degree").innerHTML = data.main.temp + '°C';
        document.getElementById("current-humidity").innerHTML = "Humidity: " + data.main.humidity + '%';
        let locSec = document.getElementById("location-search");
        let forecastArea = document.getElementById("weather-forecastes");
        let forecastedDay = document.getElementsByClassName("forecasting-day");
        //this switch case block takes the action based on a parameter from api call respond
        switch(String(data.weather[0].main)){
            case 'Rain':
                createRain();
                locSec.style.backgroundColor = "rgb(40, 40, 40)";
                locSec.style.borderColor = "rgb(23, 23, 23)";
                document.getElementById("rand-info").innerHTML = "Rainy";
                document.body.style.backgroundColor = 'rgb(40,40,40)';
                document.getElementById("weather-condition-symbol").src = 'src/downpour-rainy-day-16531-dark.png';
                document.getElementById("condition-based-text").innerHTML = "Looks like it's a rainy day! Perfect weather to cozy up with a good book and a warm drink.";
                document.getElementById("text-side").style.borderColor = "rgb(23,23,23)";
                forecastArea.style.background = "rgb(40,40,40)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(40,40,40,1) 0%, rgba(66,66,66,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(23,23,23,0.25)"
                    forecastedDay[i].style.border = "2px solid rgb(40,40,40)"
                }

                break;
            case 'Thunderstorm':
                createRain();
                locSec.style.backgroundColor = "rgb(40, 40, 40)";
                locSec.style.borderColor = "rgb(23, 23, 23)";
                document.body.style.backgroundColor = 'rgb(40,40,40)';
                document.getElementById("rand-info").innerHTML = "Stormy";
                document.getElementById("weather-condition-symbol").src = 'src/lightning-and-blue-rain-cloud-16533-dark.png';
                document.getElementById("condition-based-text").innerHTML = "Hold on tight, it's stormy out there! Let's stay safe and enjoy the sound of the rain from indoors.";
                document.getElementById("text-side").style.borderColor = "rgb(23,23,23)";
                forecastArea.style.background = "rgb(40,40,40)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(40,40,40,1) 0%, rgba(66,66,66,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(23,23,23,0.25)"
                    forecastedDay[i].style.border = "2px solid rgb(40,40,40)"
                }
                break;
            case 'Snow':
                locSec.style.backgroundColor = "rgb(99, 150, 179)";
                locSec.style.borderColor = "rgb(62, 95, 114)";
                document.body.style.backgroundColor = 'rgb(119, 178, 212)';
                document.getElementById("rand-info").innerHTML = "Snowy";
                document.getElementById("weather-condition-symbol").src = 'src/snowfall-and-blue-cloud-16541.png';
                document.getElementById("condition-based-text").innerHTML = "Wow, it's a winter wonderland out there! Perfect time for a snowball fight or some hot cocoa by the fire!";
                document.getElementById("text-side").style.borderColor = "rgb(62, 95, 114)";
                forecastArea.style.background = "rgb(118,178,212)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(118,178,212,1) 0%, rgba(142,209,247,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(118,178,212,0.15)"
                    forecastedDay[i].style.border = "2px solid rgb(142,209,247)"
                }
                break;
            case 'Clear':
                locSec.style.backgroundColor = "rgb(99, 150, 179)";
                locSec.style.borderColor = "rgb(62, 95, 114)";
                document.body.style.backgroundColor = 'rgb(119, 178, 212)';
                document.getElementById("rand-info").innerHTML = "Clear";
                document.getElementById("weather-condition-symbol").src = 'src/yellow-sun-16526.png';
                document.getElementById("condition-based-text").innerHTML = "What a beautiful day! The sun is shining, and it's perfect for a little adventure outside!";
                document.getElementById("text-side").style.borderColor = "rgb(62, 95, 114)";
                forecastArea.style.background = "rgb(118,178,212)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(118,178,212,1) 0%, rgba(142,209,247,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(118,178,212,0.15)"
                    forecastedDay[i].style.border = "2px solid rgb(142,209,247)"
                }
                break;
            case 'Clouds':
                locSec.style.backgroundColor = "rgb(99, 150, 179)";
                locSec.style.borderColor = "rgb(62, 95, 114)";
                document.body.style.backgroundColor = 'rgb(119, 178, 212)';
                document.getElementById("rand-info").innerHTML = "Cloudy";
                document.getElementById("weather-condition-symbol").src = 'src/blue-cloud-and-weather-16527.png';
                document.getElementById("condition-based-text").innerHTML = "It's a bit cloudy out there today. A great reminder that even the sun needs a little break sometimes!";
                document.getElementById("text-side").style.borderColor = "rgb(62, 95, 114)";
                forecastArea.style.background = "rgb(118,178,212)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(118,178,212,1) 0%, rgba(142,209,247,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(118,178,212,0.15)"
                    forecastedDay[i].style.border = "2px solid rgb(142,209,247)"
                }
                break;
            case 'Drizzle':
                createRain();
                locSec.style.backgroundColor = "rgb(40, 40, 40)";
                locSec.style.borderColor = "rgb(23, 23, 23)";
                document.getElementById("rand-info").innerHTML = "Drizzly";
                document.body.style.backgroundColor = 'rgb(40,40,40)';
                document.getElementById("weather-condition-symbol").src = 'src/rainy-and-cloudy-day-16532-dark.png';
                document.getElementById("condition-based-text").innerHTML = "Today, light rain is expected, so don't forget to take your umbrella when you head out! Those showers are a perfect excuse to cozy up inside with a warm cup of coffee.";
                document.getElementById("text-side").style.borderColor = "rgb(23,23,23)";
                forecastArea.style.background = "rgb(40,40,40)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(40,40,40,1) 0%, rgba(66,66,66,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(23,23,23,0.25)"
                    forecastedDay[i].style.border = "2px solid rgb(40,40,40)"
                }
                break;
            default:
                locSec.style.backgroundColor = "rgb(40, 40, 40)";
                locSec.style.borderColor = "rgb(23, 23, 23)";
                document.getElementById("rand-info").innerHTML = "Others";
                document.body.style.backgroundColor = 'rgb(40,40,40)';
                document.getElementById("weather-condition-symbol").src = 'https://openweathermap.org/img/wn/50d@4x.png';
                document.getElementById("condition-based-text").innerHTML = "<0o0>";
                document.getElementById("text-side").style.borderColor = "rgb(23,23,23)";
                forecastArea.style.background = "rgb(40,40,40)";
                forecastArea.style.background = "linear-gradient(180deg, rgba(40,40,40,1) 0%, rgba(66,66,66,1) 22%)";
                for(i=0;i<forecastedDay.length;i++){
                    forecastedDay[i].style.backgroundColor = "rgb(23,23,23,0.25)"
                    forecastedDay[i].style.border = "2px solid rgb(40,40,40)"
                }
        }
        
    })
    .catch(error => {
        console.error('Hata:', error);
    });

}

// this function is for next days' information updates
function changeWeatherForecastes(){
    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
    .then(response =>{
        if(!response.ok){
            throw new Error('Ağ hatasi: ' + response.status);
        }
        return response.json();
    })
    .then(data =>{
        console.log(data)
        let timeZone = Math.round(lon) * 24 / 360;//calculates how much time gap is there between GMT
        let dateAndTime = data.list[0].dt_txt.split(" ")[1].split(":");
        let timeGmt;
        //this if else block is for taking the whole days forecasts for the area which was searched
        if((parseInt(dateAndTime[0])+timeZone)>24){timeGmt = parseInt(dateAndTime[0])+timeZone-24;}
        else{timeGmt = parseInt(dateAndTime[0])+timeZone;}
        timeGmt = 8-Math.round(timeGmt/3);
        let tempList = [];
        for(i=1;i<=4;i++){
            for(j=0;j<8;j++){
                tempList.push(data.list[timeGmt++].main.temp);
            }
            //the codes below updates the lowest and highest temperature informations
            document.getElementById(`day${i}-daytime`).innerText   = `Maximum Tempereture${Math.min(...tempList)}°C`;
            document.getElementById(`day${i}-nighttime`).innerText = `Maximum Tempereture${Math.max(...tempList)}°C`;
            //this switch case block updates the next days' weather conditions' symbols
            switch(data.list[timeGmt-3].weather[0].main){
                case 'Rain':
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'src/downpour-rainy-day-16531-dark.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    break;
                case 'Thunderstorm':
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'src/lightning-and-blue-rain-cloud-16533-dark.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    break;
                case 'Snow':
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'src/snowfall-and-blue-cloud-16541.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    break;
                case 'Clear':
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'src/yellow-sun-16526.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    break;
                case 'Clouds':
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'src/blue-cloud-and-weather-16527.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    break;
                case 'Drizzle':
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'src/rainy-and-cloudy-day-16532-dark.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    break;
                default:
                    document.getElementById(`day${i}-weather-condition-symbol`).src = 'https://openweathermap.org/img/wn/50d@4x.png';
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxWidth = "60%";
                    document.getElementById(`day${i}-weather-condition-symbol`).style.maxHeight = "60%";
                    
            }
            tempList=[];
        }
        console.log(tempList);
    })
    .catch(error => {
        console.error('Hata:', error);
    })
}
