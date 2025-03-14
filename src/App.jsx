import { useState, useEffect } from 'react'
import './App.css'
import PropTypes from "prop-types";
const searchIcon = "assets/search.png";
const clearIcon = "assets/clear.png";
const cloudIcon = "/assets/cloudy.png";
const drizzleIcon = "/assets/drizzle.png";
const rainIcon = "/assets/rain.png";
const windIcon = "/assets/wind.png";
const snowIcon = "/assets/snow.png";
const humidityIcon = "assets/humidity.png";

const Weatherdetails = ({icon, temp, city, country, lat, long, humidity, wind,mainweather, forecast })=>{
  return(
  <>
    <div className="image">
     <img src={icon} alt='Image' width={90} height={90} />
    </div>
    <div className="temp">{temp}°C</div>
    <div className="location">{city}</div>
    <div className="country">{country}</div>
    <div className="weather-main">{mainweather}</div>
    <div className="cord">
      <div>
        <span className="lat">latitude</span>
        <span>{lat}</span>
      </div>
      <div>
        <span className="long">longitude</span>
        <span>{long}</span>
      </div>      
    </div>
    <div className="data-container">
      <div className="element1">
        <img src={humidityIcon} alt="Humidity" width={45} height={45} className='icon'/>
        <div className="data"></div>
        <div className="humidity-percent">{humidity}%</div>
        <div className="text">Humidity</div>
      </div>
      <div className="element2">
        <img src={windIcon} alt="Wind" width={45} height={45} className='icon'/>
        <div className="data"></div>
        <div className="wind-percent">{wind} km/h</div>
        <div className="text">Wind Speed</div>
      </div>

    </div>
  </>
  );
}

Weatherdetails.propTypes = {
  icon: PropTypes.string.isRequired, 
  temp: PropTypes.number.isRequired, 
  city: PropTypes.string.isRequired, 
  country: PropTypes.string.isRequired, 
  humidity: PropTypes.number.isRequired, 
  wind: PropTypes.number.isRequired, 
  lat: PropTypes.number.isRequired, 
  long: PropTypes.number.isRequired,
  mainweather:PropTypes.string.isRequired,
};

const Forecast = ({ forecastData }) => {
  return (
    <div className="forecast-container">
      <h2>5-Day Forecast</h2>
      <div className="forecast">
        {forecastData.map((item, index) => (
          <div key={index} className="forecast-item">
            <p><strong>{item.date}</strong></p>
            <img src={item.icon} alt={item.main} width={50} height={50} />
            <p>{item.temp}°C</p>
            <p>{item.main}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

Forecast.propTypes = {
  forecastData: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      main: PropTypes.string.isRequired,
      temp: PropTypes.number.isRequired,
    })
  ).isRequired,
};

function App() {
  let api_key = "b121bc9e070627774a29185333f1c75e";
  const [text, setText] = useState("Chennai");
  const [icon, setIcon] = useState(snowIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);
  const [citynotfound, setCitynotfound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mainweather, setMainweather] = useState("");
  const [forecast, setForecast] = useState([]);

  const weatherIconMap ={
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon, 
    "04d": drizzleIcon,
    "04n": drizzleIcon, 
    "09d": rainIcon,
    "09n": rainIcon, 
    "10d": rainIcon,
    "10n": rainIcon, 
    "13d": snowIcon,
    "13n": snowIcon, 
  };

  const search = async()=>{
    setLoading(true);
    // setError(null);

    let url= `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=Metric`;
                      
  try{
      let res = await fetch(url);
      let data = await res.json();
      console.log(data);
      if(data.cod==="404"){
      console.error("City not found");
      setCitynotfound(true);
      setLoading(false);
      return;
    }  
  
    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLat(data.coord.lat);
    setLong(data.coord.lon);
    setMainweather(data.weather[0].main);
        
    const weatherIconcode = data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconcode] || clearIcon);
    //setCitynotfound(false);
    
      setLoading(true);
       //setError(null);
     
      setCitynotfound(false);
      fetchForecast();
    }catch(error){
        console.error("An error occured:", error.message);
        setError("An Error occured while fetching weather data");
    }finally{
      setLoading(false);
    }  
    };
    const fetchForecast = async () => {
          try {
            const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${text}&appid=${api_key}&units=metric`);
            const forecastData = await forecastRes.json();
      
            if (forecastData.cod !== "200") {
              console.error("Error fetching forecast:", forecastData.message);
              return;
            }
            const dailyForecast = new Map();
                  forecastData.list.forEach((item) => {
                    const date = new Date(item.dt * 1000).toISOString().split("T")[0];
                    if (!dailyForecast.has(date)) {
                      dailyForecast.set(date, {
                        date,
                        temp: Math.round(item.main.temp),
                        main: item.weather[0].main,
                        icon: weatherIconMap[item.weather[0].icon] || clearIcon,
                      });
                    }
                  });
            
                  setForecast(Array.from(dailyForecast.values()).slice(0, 5));
                } catch (error) {
                  console.error("Error fetching forecast:", error);
                }
              };
        

  const handleCity = (e) =>{
    setText(e.target.value);
  }

  const handleKeyDown =(e) =>{
    if (e.key ==="Enter"){
            search();
    }
  }
useEffect(function(){
  search();
}, []);

  return (
    <>
      <div className='container'>
        <div className='input-container'>
          <input type="text" className='cityInput' placeholder='Search City' 
          onChange={handleCity} value={text} onKeyDown={handleKeyDown}/>
            <div className="search-icon" onClick={() => search()}>
         <img src={searchIcon} alt="SearchIcon" width={20} height={20} />
         </div>                 
        </div>   
               
        {!loading && !citynotfound && ( <>
          <Weatherdetails icon={icon} temp={temp} city={city} country={country} 
        mainweather={mainweather} lat={lat} long={long} humidity={humidity} wind={wind} forecast={forecast} />
         <Forecast forecastData={forecast} /> </>)}

        {loading && <div className='loading-message'>Loading...</div>}
        {error && <div className='error-message'>{error}</div>  }  
        {citynotfound && <div className='city-not-found'>City not found</div>}          
      </div>      
    </>
  );
}

export default App