let link = 
        "http://api.weatherstack.com/current?access_key=53b543afc53b263e643e0539d0a17516";

const root = document.getElementById('root');
const popup = document.getElementById('popup');
const form = document.getElementById('form');
const textInput = document.getElementById("text-input");

let store = {
    city: "Tokyo",
    isDay: 'yes',
    observationTime: '00 : 00 AM',
    feelslike: '0',
    temperature: '0',
    description: '',
    properties: {
        cloudcover: '0',
        humidity: '0',
        windSpeed: '0',
        pressure: '0',
        uvIndex: '0',
        visibility: '0'
    }
}

const fetchData = async () => {
    const query = localStorage.getItem("query") || store.city;
    const result = await fetch(`${link}&query=${query}`);
    const data = await result.json();


    //можно упростить дело с помощью массива вместо console.log
    const {
         current: { 
                    feelslike,
                    cloudcover,
                    is_day: isDay, 
                    observation_time: observationTime, 
                    temperature,
                    humidity,
                    uv_index: uvIndex,
                    visibility,
                    weather_descriptions: description,
                    pressure,
                    wind_speed: windSpeed
                },
            location: {
                name: city
            }
        } = data;

    store = {
        ...store,
        city,
        feelslike,
        temperature,
        isDay,
        observationTime,
        description: description[0],
        properties: {
            cloudcover: {
                title: 'cloudcover',
                value: `${humidity}%`,
                icon: 'cloud.png'
            },
            humidity: {
                title: 'humidity',
                value: `${humidity}%`,
                icon: 'humidity.png'
            },
            windSpeed: {
                title: 'windSpeed',
                value: `${windSpeed} km/h`,
                icon: 'wind.png'
            },
            pressure: {
                title: 'pressure',
                value: `${pressure} %`,
                icon: 'gauge.png'
            },
            uvIndex: {
                title: 'uvIndex',
                value: `${uvIndex} km/h`,
                icon: 'uv-index.png'
            },
            visibility: {
                title: 'visibility',
                value: `${visibility}/100`,
                icon: 'visibility.png'
            },
        }
    }

    console.log(data);

    renderComponent();
};

const getImage = (description) =>{
    const value = description.toLowerCase();
    switch(value){
        case "partly cloudy":
            return "partly.png";
        case "cloud":
            return "cloud.png";
        case "fog":
            return "fog.png";
        case "sunny":
            return "sunny.png";

            default:
                return "the.png";
    }
}

const renderProperty = (properties) =>{
    return  Object.values(properties)
    .map(({title, value, icon}) => {
        return `<div class="property">
                    <div class="property-icon">
                        <img src="./img/icons/${icon}" alt="">
                    </div>
                    <div class="property-info">
                        <div class="property-info__value">${value}</div>
                        <div class="property-info__description">${title}</div>
                    </div>
                </div>`;
    })
    .join("")
}


const makeup = () =>{
    const { city, description, observationTime, temperature, containerClass, properties } = store;

    return `<div class="container">
                <div class="top">
                    <div class="city">
                        <div class="city-subtitle">Weather Today in</div>
                        <div class="city-title" id="city">
                        <span>${city}</span>
                        </div>
                    </div>
                    <div class="city-info">
                        <div class="top-left">
                        <img class="icon" src="./img/${getImage(description)}" alt="" />
                        <div class="description">${description}</div>
                    </div>
                    
                    <div class="top-right">
                        <div class="city-info__subtitle">as of ${observationTime}</div>
                        <div class="city-info__title">${temperature}°</div>
                    </div>
                </div>
            </div>
        <div id="properties">${renderProperty(properties)}</div>
    </div>`
}

const togglePopupClass = () => {
    popup.classList.toggle("active");
  };

const renderComponent  = () => {
    root.innerHTML = makeup();

    const handleCity = () => {
        popup.classList.toggle('active')
    }

    const city = document.getElementById('city');
    city.addEventListener('click', handleCity);
}

const handleInput = (e) => {
    store = {
      ...store,
      city: e.target.value,
    };
};

const handleSubmit = (e) => {
    e.preventDefault();
    const value = store.city;
  
    if (!value) return null;
  
    localStorage.setItem("query", value);
    fetchData();
    togglePopupClass();
  };
  
  form.addEventListener("submit", handleSubmit);
  textInput.addEventListener("input", handleInput);

fetchData();