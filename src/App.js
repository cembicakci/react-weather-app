import React, { useEffect, useState } from "react"

const api = {
  key: "8aa3ebfb7eb0ce4277f8b9eabb365502",
  base: "https://api.openweathermap.org/data/2.5/"
}

function App() {

  const [query, setQuery] = useState('');
  const [weather, setWeather] = useState({});
  const [daily, setDaily] = useState({});

  useEffect(() => {
    dailyAPI()
  }, [weather])

  const search = (e) => {
    if (e.key === "Enter") {
      fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setWeather(data)
          setQuery('');

        })
    }
  }

  const dailyAPI = async () => {
    await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${weather.coord.lat}&lon=${weather.coord.lon}&exclude=current,minutely,hourly&units=metric&appid=${api.key}`)
      .then(res => res.json())
      .then(data => {
        setDaily(data);
        console.log(data);

      })
  }


  const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;
  }



  function dtConverter(UNIX_TIMESTAMP) {
    var date = new Date(UNIX_TIMESTAMP * 1000).toString().split(" ")[0];
    return date;
  }

  return (
    <div className="App">
      <main>

        <div className="search-box">
          <input
            type="text"
            className="search-bar"
            placeholder="Search"
            onChange={(e) => setQuery(e.target.value)} 
            value={query}
            onKeyPress={search}
          />
        </div>


        {(typeof weather.main !== "undefined" ? (
          <div>

            <div className="location-box">
              <div className="location">{weather.name}, {weather.sys.country}</div>
              <div className="date">{dateBuilder(new Date())}</div>
            </div>

            {/*
            <div className="weather-box">
              <div className="temp">
                <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
                {Math.round(weather.main.temp)}°C
              </div>
              <div className="weather">
                {weather.weather[0].main}
              </div>
            </div>
            
            */}

          </div>

        ) : (
          <div>
            <p className="enter-location">Please enter a location.</p>
          </div>
        ))}



        {(typeof weather.main !== "undefined" ? (

          <div className="weather-container">
            {daily.daily && daily.daily.map((d, i) => (

              <div className="weather-box" key={i}>
                <p>{dtConverter(d.dt)}</p>
                <img src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`} alt="" />
                <p>{d.weather[0].description.toUpperCase()}</p>
                <li>
                  {Math.floor(d.temp.min)}°C / {Math.floor(d.temp.max)}°C
                </li>
              </div>

            ))}

          </div>

        ) : (''))}
      </main>
    </div>
  )
}

export default App