## Product concept

Access current weather data for any location on Earth! We collect and process weather data from different sources such as global and local weather models, satellites, radars and a vast network of weather stations. Data is available in JSON, XML, or HTML format.

## Call current weather data

### How to make an API call

API call

`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters          |
| ------------------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lat`               | required | Latitude. If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our [Geocoding API](https://openweathermap.org/api/geocoding-api)  |
| `lon`               | required | Longitude. If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our [Geocoding API](https://openweathermap.org/api/geocoding-api) |
| `appid`             | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys))                                                                       |
| `mode`              | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format)                                                               |
| `units`             | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default.                                        |
| [Learn more](#data) |
| `lang`              | optional | You can use this parameter to get the output in your language. [Learn more](#multi)                                                                                                                         |

Please use [**Geocoder API**](https://openweathermap.org/api/geocoding-api) if you need automatic convert city names and zip-codes to geo coordinates and the other way around.

Please note that [built-in geocoder](#geocoding) has been deprecated. Although it is still available for use, bug fixing and updates are no longer available for this functionality.

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

{
  "coord": {
    "lon": 10.99,
    "lat": 44.34
  },
  "weather": [
    {
      "id": 501,
      "main": "Rain",
      "description": "moderate rain",
      "icon": "10d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 298.48,
    "feels_like": 298.74,
    "temp_min": 297.56,
    "temp_max": 300.05,
    "pressure": 1015,
    "humidity": 64,
    "sea_level": 1015,
    "grnd_level": 933
  },
  "visibility": 10000,
  "wind": {
    "speed": 0.62,
    "deg": 349,
    "gust": 1.18
  },
  "rain": {
    "1h": 3.16
  },
  "clouds": {
    "all": 100
  },
  "dt": 1661870592,
  "sys": {
    "type": 2,
    "id": 2075663,
    "country": "IT",
    "sunrise": 1661834187,
    "sunset": 1661882248
  },
  "timezone": 7200,
  "id": 3163858,
  "name": "Zocca",
  "cod": 200
}


```

## API response

If you do not see some of the parameters in your API response it means that these weather phenomena are just not happened for the time of measurement for the city or location chosen. Only really measured or calculated data is displayed in API response.

### JSON

`JSON format API response example`

```

{
   "coord": {
      "lon": 7.367,
      "lat": 45.133
   },
   "weather": [
      {
         "id": 501,
         "main": "Rain",
         "description": "moderate rain",
         "icon": "10d"
      }
   ],
   "base": "stations",
   "main": {
      "temp": 284.2,
      "feels_like": 282.93,
      "temp_min": 283.06,
      "temp_max": 286.82,
      "pressure": 1021,
      "humidity": 60,
      "sea_level": 1021,
      "grnd_level": 910
   },
   "visibility": 10000,
   "wind": {
      "speed": 4.09,
      "deg": 121,
      "gust": 3.47
   },
   "rain": {
      "1h": 2.73
   },
   "clouds": {
      "all": 83
   },
   "dt": 1726660758,
   "sys": {
      "type": 1,
      "id": 6736,
      "country": "IT",
      "sunrise": 1726636384,
      "sunset": 1726680975
   },
   "timezone": 7200,
   "id": 3165523,
   "name": "Province of Turin",
   "cod": 200
}

```

### JSON format API response fields

- `coord`
  - `coord.lon` Longitude of the location
  - `coord.lat` Latitude of the location
- `weather` (more info [Weather condition codes](https://openweathermap.org/weather-conditions))
  - `weather.id` Weather condition id
  - `weather.main` Group of weather parameters (Rain, Snow, Clouds etc.)
  - `weather.description` Weather condition within the group. Please find more [here.](#list) You can get the output in your language. [Learn more](#multi)
  - `weather.icon` Weather icon id
- `base` Internal parameter
- `main`
  - `main.temp` Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
  - `main.feels_like` Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
  - `main.pressure` Atmospheric pressure on the sea level, hPa
  - `main.humidity` Humidity, %
  - `main.temp_min` Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Please find more info [here.](#min) Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
  - `main.temp_max` Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Please find more info [here.](#min) Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
  - `main.sea_level` Atmospheric pressure on the sea level, hPa
  - `main.grnd_level` Atmospheric pressure on the ground level, hPa
- `visibility` Visibility, meter. The maximum value of the visibility is 10 km
- `wind`
  - `wind.speed` Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
  - `wind.deg` Wind direction, degrees (meteorological)
  - `wind.gust` Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
- `clouds`
  - `clouds.all` Cloudiness, %
- `rain`
  - `1h`(where available)Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
- `snow`
  - `1h`(where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
- `dt` Time of data calculation, unix, UTC
- `sys`
  - `sys.type` Internal parameter
  - `sys.id` Internal parameter
  - `sys.message` Internal parameter
  - `sys.country` Country code (GB, JP etc.)
  - `sys.sunrise` Sunrise time, unix, UTC
  - `sys.sunset` Sunset time, unix, UTC
- `timezone` Shift in seconds from UTC
- `id` City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
- `name` City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
- `cod` Internal parameter

### XML

`XML format API response example`

```

    <current>
    <city id="3163858" name="Zocca">
    <coord lon="10.99" lat="44.34"/>
    <country>IT</country>
    <timezone>7200</timezone>
    <sun rise="2022-08-30T04:36:27" set="2022-08-30T17:57:28"/>
    </city>
    <temperature value="298.48" min="297.56" max="300.05" unit="kelvin"/>
    <feels_like value="298.74" unit="kelvin"/>
    <humidity value="64" unit="%"/>
    <pressure value="1015" unit="hPa"/>
    <wind>
    <speed value="0.62" unit="m/s" name="Calm"/>
    <gusts value="1.18"/>
    <direction value="349" code="N" name="North"/>
    </wind>
    <clouds value="100" name="overcast clouds"/>
    <visibility value="10000"/>
    <precipitation value="3.37" mode="rain" unit="1h"/>
    <weather number="501" value="moderate rain" icon="10d"/>
    <lastupdate value="2022-08-30T14:45:57"/>
    </current>


```

### XML format API response fields

- `city`
  - `city.id` City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
  - `city.name` City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
  - `city.coord`
    - `city.coord.lon`Geo location, longitude
    - `city.coord.lat` Geo location, latitude
  - `city.country` Country code (GB, JP etc.). Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
  - `timezone`Shift in seconds from UTC
  - `city.sun`
    - `city.sun.rise` Sunrise time
    - `city.sun.set` Sunset time
- `temperature`
  - `temperature.value` Temperature
  - `temperature.min` Minimum temperature at the moment of calculation. This is minimal currently observed temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info [here](#min)
  - `temperature.max` Maximum temperature at the moment of calculation. This is maximal currently observed temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info [here](#min)
  - `temperature.unit` Unit of measurements. Possible value is Celsius, Kelvin, Fahrenheit
- `feels_like`
  - `feels_like.value` Temperature. This temperature parameter accounts for the human perception of weather
  - `feels_like.unit` Unit of measurements. Possible value is Celsius, Kelvin, Fahrenheit. Unit Default: Kelvin
- `humidity`
  - `humidity.value` Humidity value
  - `humidity.unit` Humidity units, %
- `pressure`
  - `pressure.value` Pressure value
  - `pressure.unit` Pressure units, hPa
- `wind`
  - `wind.speed`
    - `wind.speed.value` Wind speed
    - `wind.speed.unit` Wind speed units, m/s
    - `wind.speed.name` Type of the wind
  - `wind.direction`
    - `wind.direction.value` Wind direction, degrees (meteorological)
    - `wind.direction.code` Code of the wind direction. Possible value is WSW, N, S etc.
    - `wind.direction.name` Full name of the wind direction
- `clouds`
  - `clouds.value` Cloudiness
  - `clouds.name` Name of the cloudiness
- `visibility`
  - `visibility.value` Visibility, meter. The maximum value of the visibility is 10 km
- `precipitation`
  - `precipitation.value` Precipitation, mm. Please note that only mm as units of measurement are available for this parameter.
  - `precipitation.mode` Possible values are 'no", name of weather phenomena as 'rain', 'snow'
- `weather`
  - `weather.number` Weather condition id
  - `weather.value` Weather condition name
  - `weather.icon` Weather icon id
- `lastupdate`
  - `lastupdate.value` Last time when data was updated

### List of weather condition codes

List of [weather condition codes](https://openweathermap.org/weather-conditions) with icons (range of thunderstorm, drizzle, rain, snow, clouds, atmosphere etc.)

### Min/max temperature in current weather API and forecast API

Please do not confuse min/max parameters in our weather APIs.

- In **Current weather API**, [Hourly forecast API](https://openweathermap.org/api/hourly-forecast) and [5 day / 3 hour forecast API](https://openweathermap.org/forecast5) - **temp_min** and **temp_max** are optional parameters mean min / max temperature in the city at the current moment just for your reference. For large cities and megalopolises geographically expanded it might be applicable. In most cases both **temp_min** and **temp_max** parameters have the same volume as 'temp'. Please use **temp_min** and **temp_max** parameters in current weather API optionally.
- In [16 Day forecast](https://openweathermap.org/forecast16) - **min** and **max** mean maximum and minimum temperature in the day.

`Example of current weather API response`

```

  "main":{
     "temp":306.15, //current temperature
     "pressure":1013,
     "humidity":44,
     "temp_min":306.15, //min current temperature in the city
     "temp_max":306.15 //max current temperature in the city
   }


```

##### For comparison look at example of daily forecast weather API response:

`Example of daily forecast weather API response`

```

  "dt":1406080800,
  "temp":{
        "day":297.77,  //daily averaged temperature
        "min":293.52, //daily min temperature
        "max":297.77, //daily max temperature
        "night":293.52, //night temperature
        "eve":297.77, //evening temperature
        "morn":297.77}, //morning temperature


```

## Bulk downloading

We provide number of bulk files with current weather and forecasts. The service allows you to regularly download current weather and forecast data in JSON format. There is no need to call an API to do this.

More information is on the [Bulk page](https://openweathermap.org/bulk).

Examples of bulk files

[http://bulk.openweathermap.org/sample/](http://bulk.openweathermap.org/sample/)

## Other features

### Geocoding API

Requesting API calls by geographical coordinates is the most accurate way to specify any location. If you need to convert city names and zip-codes to geo coordinates and the other way around automatically, please use our [**Geocoding API**](https://openweathermap.org/api/geocoding-api).

### Built-in geocoding

Please use [**Geocoder API**](https://openweathermap.org/api/geocoding-api) if you need automatic convert city names and zip-codes to geo coordinates and the other way around.

**Please note that [API requests by city name](#name), [zip-codes](#zip) and [city id](#cityid) have been deprecated. Although they are still available for use, bug fixing and updates are no longer available for this functionality.**

#### Built-in API request by city name

You can call by city name or city name, state code and country code. Please note that searching by states available only for the USA locations.

API call

`https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

`https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

`https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `q`        | required | City name, state code and country code divided by comma, Please refer to [ISO 3166](https://www.iso.org/obp/ui/#search) for the state codes or country codes. |

You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.

|
| `appid` | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys)) |
| `mode` | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format) |
| `units` | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default. [Learn more](#data) |
| `lang` | optional | You can use this parameter to get the output in your language. [Learn more](#multi) |

Examples of API calls:

`https://api.openweathermap.org/data/2.5/weather?q=London&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {
       "lon": -0.13,
       "lat": 51.51
     },
     "weather": [
       {
         "id": 300,
         "main": "Drizzle",
         "description": "light intensity drizzle",
         "icon": "09d"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 280.32,
       "pressure": 1012,
       "humidity": 81,
       "temp_min": 279.15,
       "temp_max": 281.15
     },
     "visibility": 10000,
     "wind": {
       "speed": 4.1,
       "deg": 80
     },
     "clouds": {
       "all": 90
     },
     "dt": 1485789600,
     "sys": {
       "type": 1,
       "id": 5091,
       "message": 0.0103,
       "country": "GB",
       "sunrise": 1485762037,
       "sunset": 1485794875
     },
     "id": 2643743,
     "name": "London",
     "cod": 200
     }


```

`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {
       "lon": -0.13,
       "lat": 51.51
     },
     "weather": [
       {
         "id": 300,
         "main": "Drizzle",
         "description": "light intensity drizzle",
         "icon": "09d"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 280.32,
       "pressure": 1012,
       "humidity": 81,
       "temp_min": 279.15,
       "temp_max": 281.15
     },
     "visibility": 10000,
     "wind": {
       "speed": 4.1,
       "deg": 80
     },
     "clouds": {
       "all": 90
     },
     "dt": 1485789600,
     "sys": {
       "type": 1,
       "id": 5091,
       "message": 0.0103,
       "country": "GB",
       "sunrise": 1485762037,
       "sunset": 1485794875
     },
     "id": 2643743,
     "name": "London",
     "cod": 200
     }


```

There is a possibility to receive a central district of the city/town with its own parameters (geographic coordinates/id/name) in API response. [Example](http://samples.openweathermap.org/data/2.5/forecast?q=M%C3%BCnchen,DE&appid=439d4b804bc8187953eb36d2a8c26a02)

#### Built-in API request by city ID

You can make an API call by city ID. List of city ID 'city.list.json.gz' can be downloaded [here](http://bulk.openweathermap.org/sample/).

We recommend to call API by city ID to get unambiguous result for your city.

API call

`https://api.openweathermap.org/data/2.5/weather?id={city id}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`       | required | City ID. List of city ID 'city.list.json.gz' can be downloaded [here](http://bulk.openweathermap.org/sample/).                                                                           |
| `appid`    | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys))                                                    |
| `mode`     | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format)                                            |
| `units`    | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default. [Learn more](#data) |
| `lang`     | optional | You can use this parameter to get the output in your language. [Learn more](#multi)                                                                                                      |

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?id=2172797&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {
       "lon": 145.77,
       "lat": -16.92
     },
     "weather": [
       {
         "id": 802,
         "main": "Clouds",
         "description": "scattered clouds",
         "icon": "03n"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 300.15,
       "pressure": 1007,
       "humidity": 74,
       "temp_min": 300.15,
       "temp_max": 300.15
     },
     "visibility": 10000,
     "wind": {
       "speed": 3.6,
       "deg": 160
     },
     "clouds": {
       "all": 40
     },
     "dt": 1485790200,
     "sys": {
       "type": 1,
       "id": 8166,
       "message": 0.2064,
       "country": "AU",
       "sunrise": 1485720272,
       "sunset": 1485766550
     },
     "id": 2172797,
     "name": "Cairns",
     "cod": 200
     }


```

#### Built-in API request by ZIP code

Please note if country is not specified then the search works for USA as a default.

API call

`https://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| ---------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `zip`      | required | Zip code                                                                                                                                                                                 |
| `appid`    | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys))                                                    |
| `mode`     | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format)                                            |
| `units`    | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default. [Learn more](#data) |
| `lang`     | optional | You can use this parameter to get the output in your language. [Learn more](#multi)                                                                                                      |

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {"lon": -122.08,"lat": 37.39},
     "weather": [
       {
         "id": 800,
         "main": "Clear",
         "description": "clear sky",
         "icon": "01d"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 282.55,
       "feels_like": 281.86,
       "temp_min": 280.37,
       "temp_max": 284.26,
       "pressure": 1023,
       "humidity": 100
     },
     "visibility": 10000,
     "wind": {
       "speed": 1.5,
       "deg": 350
     },
     "clouds": {
       "all": 1
     },
     "dt": 1560350645,
     "sys": {
       "type": 1,
       "id": 5122,
       "message": 0.0139,
       "country": "US",
       "sunrise": 1560343627,
       "sunset": 1560396563
     },
     "timezone": -25200,
     "id": 420006353,
     "name": "Mountain View",
     "cod": 200
     }


```

### Format

Response format. JSON format is used by default. To get data in XML format just set up mode = xml.

| Parameters |
| ---------- | -------- | ----------------------------------------------------------------------------------------------------------------------- |
| `mode`     | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. |

Example of API calls

JSON

`https://api.openweathermap.org/data/2.5/weather?q=London&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

  {
   "coord":{
      "lon":-0.13,
      "lat":51.51
   },
   "weather":[
      {
         "id":300,
         "main":"Drizzle",
         "description":"light intensity drizzle",
         "icon":"09d"
      }
   ],
   "base":"stations",
   "main":{
      "temp":280.32,
      "pressure":1012,
      "humidity":81,
      "temp_min":279.15,
      "temp_max":281.15
   },
   "visibility":10000,
   "wind":{
      "speed":4.1,
      "deg":80
   },
   "clouds":{
      "all":90
   },
   "dt":1485789600,
   "sys":{
      "type":1,
      "id":5091,
      "message":0.0103,
      "country":"GB",
      "sunrise":1485762037,
      "sunset":1485794875
   },
   "id":2643743,
   "name":"London",
   "cod":200
  }


```

XML

`https://api.openweathermap.org/data/2.5/weather?q=London&mode=xml`

```

  <weatherdata>
   <location>
      <name>London</name>
      <type />
      <country>GB</country>
      <timezone />
      <location altitude="0" latitude="51.5085" longitude="-0.1258" geobase="geonames" geobaseid="2643743" />
   </location>
   <credit />
   <meta>
      <lastupdate />
      <calctime>0.0117</calctime>
      <nextupdate />
   </meta>
   <sun rise="2017-01-30T07:40:34" set="2017-01-30T16:47:56" />
   <forecast>
      <time day="2017-01-30">
         <symbol number="500" name="light rain" var="10d" />
         <precipitation value="1.64" type="rain" />
         <windDirection deg="85" code="E" name="East" />
         <windSpeed mps="1.97" name="Light breeze" />
         <temperature day="7" min="4.34" max="7" night="4.91" eve="5.05" morn="7" />
         <pressure unit="hPa" value="1016.99" />
         <humidity value="100" unit="%" />
         <clouds value="few clouds" all="12" unit="%" />
      </time>
      <time day="2017-01-31">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="9.42" type="rain" />
         <windDirection deg="140" code="SE" name="SouthEast" />
         <windSpeed mps="3.37" name="" />
         <temperature day="9.66" min="6.16" max="11.51" night="10.63" eve="10.85" morn="6.16" />
         <pressure unit="hPa" value="1018.15" />
         <humidity value="100" unit="%" />
         <clouds value="overcast clouds" all="92" unit="%" />
      </time>
      <time day="2017-02-01">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="9.11" type="rain" />
         <windDirection deg="197" code="SSW" name="South-southwest" />
         <windSpeed mps="5.01" name="Gentle Breeze" />
         <temperature day="9.81" min="9.64" max="10.23" night="10.08" eve="9.81" morn="10.03" />
         <pressure unit="hPa" value="1011.7" />
         <humidity value="99" unit="%" />
         <clouds value="scattered clouds" all="44" unit="%" />
      </time>
      <time day="2017-02-02">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="3.98" type="rain" />
         <windDirection deg="184" code="S" name="South" />
         <windSpeed mps="8.42" name="Fresh Breeze" />
         <temperature day="11.44" min="8.86" max="11.53" night="8.86" eve="10.99" morn="10.05" />
         <pressure unit="hPa" value="999.34" />
         <humidity value="96" unit="%" />
         <clouds value="overcast clouds" all="92" unit="%" />
      </time>
      <time day="2017-02-03">
         <symbol number="500" name="light rain" var="10d" />
         <precipitation value="1.65" type="rain" />
         <windDirection deg="213" code="SSW" name="South-southwest" />
         <windSpeed mps="8.51" name="Fresh Breeze" />
         <temperature day="10.66" min="8.63" max="10.66" night="8.63" eve="9.14" morn="10.18" />
         <pressure unit="hPa" value="1010.98" />
         <humidity value="0" unit="%" />
         <clouds value="scattered clouds" all="48" unit="%" />
      </time>
      <time day="2017-02-04">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="7.25" type="rain" />
         <windDirection deg="172" code="S" name="South" />
         <windSpeed mps="10.39" name="Fresh Breeze" />
         <temperature day="8.68" min="7.07" max="10.4" night="8.48" eve="10.4" morn="7.07" />
         <pressure unit="hPa" value="1001.13" />
         <humidity value="0" unit="%" />
         <clouds value="overcast clouds" all="96" unit="%" />
      </time>
      <time day="2017-02-05">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="4.24" type="rain" />
         <windDirection deg="274" code="W" name="West" />
         <windSpeed mps="6.21" name="Moderate breeze" />
         <temperature day="8.5" min="4.86" max="8.5" night="4.86" eve="6.25" morn="8.26" />
         <pressure unit="hPa" value="995.24" />
         <humidity value="0" unit="%" />
         <clouds value="broken clouds" all="64" unit="%" />
      </time>
   </forecast>
  </weatherd


```

### Units of measurement

`standard`, `metric`, and `imperial` units are available. [List of all API parameters with available units](https://openweathermap.org/weather-data).

| Parameters |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `units`    | optional | `standard`, `metric`, `imperial`. When you do not use the `units` parameter, format is `standard` by default. |

Temperature is available in Fahrenheit, Celsius and Kelvin units.

- For temperature in Fahrenheit use units=imperial
- For temperature in Celsius use units=metric
- Temperature in Kelvin is used by default, no need to use units parameter in API call

List of all API parameters with units [openweathermap.org/weather-data](http://openweathermap.org/weather-data)

Examples of API calls:

Standard

`https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

{
  "coord": {
    "lon": -2.15,
    "lat": 57
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 281.63,
    "feels_like": 278.05,
    "temp_min": 281.33,
    "temp_max": 282.41,
    "pressure": 1016,
    "humidity": 79,
    "sea_level": 1016,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 7.3,
    "deg": 189,
    "gust": 13.48
  },
  "clouds": {
    "all": 100
  },
  "dt": 1647347424,
  "sys": {
    "type": 2,
    "id": 2031790,
    "country": "GB",
    "sunrise": 1647325488,
    "sunset": 1647367827
  },
  "timezone": 0,
  "id": 2641549,
  "name": "Newtonhill",
  "cod": 200
}


```

metric

`https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid=[{API key}](https://home.openweathermap.org/api_keys)&units=metric`

```

  {
  "coord": {
    "lon": -2.15,
    "lat": 57
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 8.48,
    "feels_like": 4.9,
    "temp_min": 8.18,
    "temp_max": 9.26,
    "pressure": 1016,
    "humidity": 79,
    "sea_level": 1016,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 7.3,
    "deg": 189,
    "gust": 13.48
  },
  "clouds": {
    "all": 100
  },
  "dt": 1647347424,
  "sys": {
    "type": 2,
    "id": 2031790,
    "country": "GB",
    "sunrise": 1647325488,
    "sunset": 1647367827
  },
  "timezone": 0,
  "id": 2641549,
  "name": "Newtonhill",
  "cod": 200
}


```

imperial

`https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid=[{API key}](https://home.openweathermap.org/api_keys)&units=imperial`

```

  {
  "coord": {
    "lon": -2.15,
    "lat": 57
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 47.26,
    "feels_like": 40.82,
    "temp_min": 46.72,
    "temp_max": 48.67,
    "pressure": 1016,
    "humidity": 79,
    "sea_level": 1016,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 16.33,
    "deg": 189,
    "gust": 30.15
  },
  "clouds": {
    "all": 100
  },
  "dt": 1647347504,
  "sys": {
    "type": 2,
    "id": 2031790,
    "country": "GB",
    "sunrise": 1647325488,
    "sunset": 1647367827
  },
  "timezone": 0,
  "id": 2641549,
  "name": "Newtonhill",
  "cod": 200
}


```

### Multilingual support

You can use the `lang` parameter to get the output in your language.

Translation is applied for the `city name` and `description` fields.

API call

`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=[{API key}](https://home.openweathermap.org/api_keys)&lang={lang}`

| Parameters |
| ---------- | -------- | ------------- |
| `lang`     | optional | Language code |

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?id=524901&lang=fr&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```


  {
  "coord": {
    "lon": 37.62,
    "lat": 55.75
  },
  "weather": [
    {
      "id": 501,
      "main": "Rain",
      "description": "pluie modérée",
      "icon": "10d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 295.48,
    "feels_like": 295.41,
    "temp_min": 295.15,
    "temp_max": 296.15,
    "pressure": 1018,
    "humidity": 60
  },
  "visibility": 10000,
  "wind": {
    "speed": 2,
    "deg": 260
  },
  "rain": {
    "1h": 1.23
  },
  "clouds": {
    "all": 100
  },
  "dt": 1599492273,
  "sys": {
    "type": 1,
    "id": 9029,
    "country": "RU",
    "sunrise": 1599446791,
    "sunset": 1599494929
  },
  "timezone": 10800,
  "id": 524901,
  "name": "Moscou",
  "cod": 200
  }


```

We support the following languages that you can use with the corresponded lang values:

- `sq` Albanian
- `af` Afrikaans
- `ar` Arabic
- `az` Azerbaijani
- `eu` Basque
- `be` Belarusian
- `bg` Bulgarian
- `ca` Catalan
- `zh_cn` Chinese Simplified
- `zh_tw` Chinese Traditional
- `hr` Croatian
- `cz` Czech
- `da` Danish
- `nl` Dutch
- `en` English
- `fi` Finnish
- `fr` French
- `gl` Galician
- `de` German
- `el` Greek
- `he` Hebrew
- `hi` Hindi
- `hu` Hungarian
- `is` Icelandic
- `id` Indonesian
- `it` Italian
- `ja` Japanese
- `kr` Korean
- `ku` Kurmanji (Kurdish)
- `la` Latvian
- `lt` Lithuanian
- `mk` Macedonian
- `no` Norwegian
- `fa` Persian (Farsi)
- `pl` Polish
- `pt` Portuguese
- `pt_br` Português Brasil
- `ro` Romanian
- `ru` Russian
- `sr` Serbian
- `sk` Slovak
- `sl` Slovenian
- `sp, es` Spanish
- `sv, se` Swedish
- `th` Thai
- `tr` Turkish
- `ua, uk` Ukrainian
- `vi` Vietnamese
- `zu` Zulu

### Call back function for JavaScript code

To use JavaScript code you can transfer `callback` functionName to JSONP callback.

Example of API call

`https://api.openweathermap.org/data/2.5/weather?q=London,uk&callback=test&appid=[{API key}](https://home.openweathermap.org/api_keys)`

````

   test(
      {
         "coord":{
            "lon":-0.13,
            "lat":51.51
         },
         "weather":[
            {
               "id":300,
               "main":"Drizzle",
               "description":"light intensity drizzle",
               "icon":"09d"
            }
         ],
         "base":"stations",
         "main":{
            "temp":280.32,
            "pressure":1012,
            "humidity":81,
            "temp_min":279.15,
            "temp_max":281.15
         },
         "visibility":10000,
         "wind":{
            "speed":4.1,
            "deg":80
         },
         "clouds":{
            "all":90
         },
         "dt":1485789600,
         "sys":{
            "type":1,
            "id":5091,
            "message":0.0103,
            "country":"GB",
            "sunrise":1485762037,
            "sunset":1485794875
         },
         "id":2643743,
         "name":"London",
         "cod":200
      }
   )


```## Product concept

Access current weather data for any location on Earth! We collect and process weather data from different sources such as global and local weather models, satellites, radars and a vast network of weather stations. Data is available in JSON, XML, or HTML format.

## Call current weather data

### How to make an API call

API call

`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| --- |
| `lat` | required | Latitude. If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our [Geocoding API](https://openweathermap.org/api/geocoding-api) |
| `lon` | required | Longitude. If you need the geocoder to automatic convert city names and zip-codes to geo coordinates and the other way around, please use our [Geocoding API](https://openweathermap.org/api/geocoding-api) |
| `appid` | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys)) |
| `mode` | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format) |
| `units` | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default.
[Learn more](#data) |
| `lang` | optional | You can use this parameter to get the output in your language. [Learn more](#multi) |

Please use [**Geocoder API**](https://openweathermap.org/api/geocoding-api) if you need automatic convert city names and zip-codes to geo coordinates and the other way around.

Please note that [built-in geocoder](#geocoding) has been deprecated. Although it is still available for use, bug fixing and updates are no longer available for this functionality.

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid=[{API key}](https://home.openweathermap.org/api_keys)`

````

{
"coord": {
"lon": 10.99,
"lat": 44.34
},
"weather": [
{
"id": 501,
"main": "Rain",
"description": "moderate rain",
"icon": "10d"
}
],
"base": "stations",
"main": {
"temp": 298.48,
"feels_like": 298.74,
"temp_min": 297.56,
"temp_max": 300.05,
"pressure": 1015,
"humidity": 64,
"sea_level": 1015,
"grnd_level": 933
},
"visibility": 10000,
"wind": {
"speed": 0.62,
"deg": 349,
"gust": 1.18
},
"rain": {
"1h": 3.16
},
"clouds": {
"all": 100
},
"dt": 1661870592,
"sys": {
"type": 2,
"id": 2075663,
"country": "IT",
"sunrise": 1661834187,
"sunset": 1661882248
},
"timezone": 7200,
"id": 3163858,
"name": "Zocca",
"cod": 200
}

```

## API response

If you do not see some of the parameters in your API response it means that these weather phenomena are just not happened for the time of measurement for the city or location chosen. Only really measured or calculated data is displayed in API response.

### JSON

`JSON format API response example`

```

{
"coord": {
"lon": 7.367,
"lat": 45.133
},
"weather": [
{
"id": 501,
"main": "Rain",
"description": "moderate rain",
"icon": "10d"
}
],
"base": "stations",
"main": {
"temp": 284.2,
"feels_like": 282.93,
"temp_min": 283.06,
"temp_max": 286.82,
"pressure": 1021,
"humidity": 60,
"sea_level": 1021,
"grnd_level": 910
},
"visibility": 10000,
"wind": {
"speed": 4.09,
"deg": 121,
"gust": 3.47
},
"rain": {
"1h": 2.73
},
"clouds": {
"all": 83
},
"dt": 1726660758,
"sys": {
"type": 1,
"id": 6736,
"country": "IT",
"sunrise": 1726636384,
"sunset": 1726680975
},
"timezone": 7200,
"id": 3165523,
"name": "Province of Turin",
"cod": 200
}

```

### JSON format API response fields

+   `coord`
    +   `coord.lon` Longitude of the location
    +   `coord.lat` Latitude of the location
+   `weather` (more info [Weather condition codes](https://openweathermap.org/weather-conditions))
    +   `weather.id` Weather condition id
    +   `weather.main` Group of weather parameters (Rain, Snow, Clouds etc.)
    +   `weather.description` Weather condition within the group. Please find more [here.](#list) You can get the output in your language. [Learn more](#multi)
    +   `weather.icon` Weather icon id
+   `base` Internal parameter
+   `main`
    +   `main.temp` Temperature. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
    +   `main.feels_like` Temperature. This temperature parameter accounts for the human perception of weather. Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
    +   `main.pressure` Atmospheric pressure on the sea level, hPa
    +   `main.humidity` Humidity, %
    +   `main.temp_min` Minimum temperature at the moment. This is minimal currently observed temperature (within large megalopolises and urban areas). Please find more info [here.](#min) Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
    +   `main.temp_max` Maximum temperature at the moment. This is maximal currently observed temperature (within large megalopolises and urban areas). Please find more info [here.](#min) Unit Default: Kelvin, Metric: Celsius, Imperial: Fahrenheit
    +   `main.sea_level` Atmospheric pressure on the sea level, hPa
    +   `main.grnd_level` Atmospheric pressure on the ground level, hPa
+   `visibility` Visibility, meter. The maximum value of the visibility is 10 km
+   `wind`
    +   `wind.speed` Wind speed. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
    +   `wind.deg` Wind direction, degrees (meteorological)
    +   `wind.gust` Wind gust. Unit Default: meter/sec, Metric: meter/sec, Imperial: miles/hour
+   `clouds`
    +   `clouds.all` Cloudiness, %
+   `rain`
    +   `1h`(where available)Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
+   `snow`
    +   `1h`(where available) Precipitation, mm/h. Please note that only mm/h as units of measurement are available for this parameter
+   `dt` Time of data calculation, unix, UTC
+   `sys`
    +   `sys.type` Internal parameter
    +   `sys.id` Internal parameter
    +   `sys.message` Internal parameter
    +   `sys.country` Country code (GB, JP etc.)
    +   `sys.sunrise` Sunrise time, unix, UTC
    +   `sys.sunset` Sunset time, unix, UTC
+   `timezone` Shift in seconds from UTC
+   `id` City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
+   `name` City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
+   `cod` Internal parameter

### XML

`XML format API response example`

```

    <current>
    <city id="3163858" name="Zocca">
    <coord lon="10.99" lat="44.34"/>
    <country>IT</country>
    <timezone>7200</timezone>
    <sun rise="2022-08-30T04:36:27" set="2022-08-30T17:57:28"/>
    </city>
    <temperature value="298.48" min="297.56" max="300.05" unit="kelvin"/>
    <feels_like value="298.74" unit="kelvin"/>
    <humidity value="64" unit="%"/>
    <pressure value="1015" unit="hPa"/>
    <wind>
    <speed value="0.62" unit="m/s" name="Calm"/>
    <gusts value="1.18"/>
    <direction value="349" code="N" name="North"/>
    </wind>
    <clouds value="100" name="overcast clouds"/>
    <visibility value="10000"/>
    <precipitation value="3.37" mode="rain" unit="1h"/>
    <weather number="501" value="moderate rain" icon="10d"/>
    <lastupdate value="2022-08-30T14:45:57"/>
    </current>

```

### XML format API response fields

+   `city`
    +   `city.id` City ID. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
    +   `city.name` City name. Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
    +   `city.coord`
        +   `city.coord.lon`Geo location, longitude
        +   `city.coord.lat` Geo location, latitude
    +   `city.country` Country code (GB, JP etc.). Please note that built-in geocoder functionality has been deprecated. Learn more [here](#builtin)
    +   `timezone`Shift in seconds from UTC
    +   `city.sun`
        +   `city.sun.rise` Sunrise time
        +   `city.sun.set` Sunset time
+   `temperature`
    +   `temperature.value` Temperature
    +   `temperature.min` Minimum temperature at the moment of calculation. This is minimal currently observed temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info [here](#min)
    +   `temperature.max` Maximum temperature at the moment of calculation. This is maximal currently observed temperature (within large megalopolises and urban areas), use this parameter optionally. Please find more info [here](#min)
    +   `temperature.unit` Unit of measurements. Possible value is Celsius, Kelvin, Fahrenheit
+   `feels_like`
    +   `feels_like.value` Temperature. This temperature parameter accounts for the human perception of weather
    +   `feels_like.unit` Unit of measurements. Possible value is Celsius, Kelvin, Fahrenheit. Unit Default: Kelvin
+   `humidity`
    +   `humidity.value` Humidity value
    +   `humidity.unit` Humidity units, %
+   `pressure`
    +   `pressure.value` Pressure value
    +   `pressure.unit` Pressure units, hPa
+   `wind`
    +   `wind.speed`
        +   `wind.speed.value` Wind speed
        +   `wind.speed.unit` Wind speed units, m/s
        +   `wind.speed.name` Type of the wind
    +   `wind.direction`
        +   `wind.direction.value` Wind direction, degrees (meteorological)
        +   `wind.direction.code` Code of the wind direction. Possible value is WSW, N, S etc.
        +   `wind.direction.name` Full name of the wind direction
+   `clouds`
    +   `clouds.value` Cloudiness
    +   `clouds.name` Name of the cloudiness
+   `visibility`
    +   `visibility.value` Visibility, meter. The maximum value of the visibility is 10 km
+   `precipitation`
    +   `precipitation.value` Precipitation, mm. Please note that only mm as units of measurement are available for this parameter.
    +   `precipitation.mode` Possible values are 'no", name of weather phenomena as 'rain', 'snow'
+   `weather`
    +   `weather.number` Weather condition id
    +   `weather.value` Weather condition name
    +   `weather.icon` Weather icon id
+   `lastupdate`
    +   `lastupdate.value` Last time when data was updated

### List of weather condition codes

List of [weather condition codes](https://openweathermap.org/weather-conditions) with icons (range of thunderstorm, drizzle, rain, snow, clouds, atmosphere etc.)

### Min/max temperature in current weather API and forecast API

Please do not confuse min/max parameters in our weather APIs.

+   In **Current weather API**, [Hourly forecast API](https://openweathermap.org/api/hourly-forecast) and [5 day / 3 hour forecast API](https://openweathermap.org/forecast5) - **temp\_min** and **temp\_max** are optional parameters mean min / max temperature in the city at the current moment just for your reference. For large cities and megalopolises geographically expanded it might be applicable. In most cases both **temp\_min** and **temp\_max** parameters have the same volume as 'temp'. Please use **temp\_min** and **temp\_max** parameters in current weather API optionally.
+   In [16 Day forecast](https://openweathermap.org/forecast16) - **min** and **max** mean maximum and minimum temperature in the day.

`Example of current weather API response`

```

"main":{
"temp":306.15, //current temperature
"pressure":1013,
"humidity":44,
"temp_min":306.15, //min current temperature in the city
"temp_max":306.15 //max current temperature in the city
}

```

##### For comparison look at example of daily forecast weather API response:

`Example of daily forecast weather API response`

```

"dt":1406080800,
"temp":{
"day":297.77, //daily averaged temperature
"min":293.52, //daily min temperature
"max":297.77, //daily max temperature
"night":293.52, //night temperature
"eve":297.77, //evening temperature
"morn":297.77}, //morning temperature

```

## Bulk downloading

We provide number of bulk files with current weather and forecasts. The service allows you to regularly download current weather and forecast data in JSON format. There is no need to call an API to do this.

More information is on the [Bulk page](https://openweathermap.org/bulk).

Examples of bulk files

[http://bulk.openweathermap.org/sample/](http://bulk.openweathermap.org/sample/)

## Other features

### Geocoding API

Requesting API calls by geographical coordinates is the most accurate way to specify any location. If you need to convert city names and zip-codes to geo coordinates and the other way around automatically, please use our [**Geocoding API**](https://openweathermap.org/api/geocoding-api).

### Built-in geocoding

Please use [**Geocoder API**](https://openweathermap.org/api/geocoding-api) if you need automatic convert city names and zip-codes to geo coordinates and the other way around.

**Please note that [API requests by city name](#name), [zip-codes](#zip) and [city id](#cityid) have been deprecated. Although they are still available for use, bug fixing and updates are no longer available for this functionality.**

#### Built-in API request by city name

You can call by city name or city name, state code and country code. Please note that searching by states available only for the USA locations.

API call

`https://api.openweathermap.org/data/2.5/weather?q={city name}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

`https://api.openweathermap.org/data/2.5/weather?q={city name},{country code}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

`https://api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| --- |
| `q` | required | City name, state code and country code divided by comma, Please refer to [ISO 3166](https://www.iso.org/obp/ui/#search) for the state codes or country codes.
You can specify the parameter not only in English. In this case, the API response should be returned in the same language as the language of requested location name if the location is in our predefined list of more than 200,000 locations.

 |
| `appid` | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys)) |
| `mode` | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format) |
| `units` | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default. [Learn more](#data) |
| `lang` | optional | You can use this parameter to get the output in your language. [Learn more](#multi) |

Examples of API calls:

`https://api.openweathermap.org/data/2.5/weather?q=London&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {
       "lon": -0.13,
       "lat": 51.51
     },
     "weather": [
       {
         "id": 300,
         "main": "Drizzle",
         "description": "light intensity drizzle",
         "icon": "09d"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 280.32,
       "pressure": 1012,
       "humidity": 81,
       "temp_min": 279.15,
       "temp_max": 281.15
     },
     "visibility": 10000,
     "wind": {
       "speed": 4.1,
       "deg": 80
     },
     "clouds": {
       "all": 90
     },
     "dt": 1485789600,
     "sys": {
       "type": 1,
       "id": 5091,
       "message": 0.0103,
       "country": "GB",
       "sunrise": 1485762037,
       "sunset": 1485794875
     },
     "id": 2643743,
     "name": "London",
     "cod": 200
     }



```

`https://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {
       "lon": -0.13,
       "lat": 51.51
     },
     "weather": [
       {
         "id": 300,
         "main": "Drizzle",
         "description": "light intensity drizzle",
         "icon": "09d"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 280.32,
       "pressure": 1012,
       "humidity": 81,
       "temp_min": 279.15,
       "temp_max": 281.15
     },
     "visibility": 10000,
     "wind": {
       "speed": 4.1,
       "deg": 80
     },
     "clouds": {
       "all": 90
     },
     "dt": 1485789600,
     "sys": {
       "type": 1,
       "id": 5091,
       "message": 0.0103,
       "country": "GB",
       "sunrise": 1485762037,
       "sunset": 1485794875
     },
     "id": 2643743,
     "name": "London",
     "cod": 200
     }



```

There is a possibility to receive a central district of the city/town with its own parameters (geographic coordinates/id/name) in API response. [Example](http://samples.openweathermap.org/data/2.5/forecast?q=M%C3%BCnchen,DE&appid=439d4b804bc8187953eb36d2a8c26a02)

#### Built-in API request by city ID

You can make an API call by city ID. List of city ID 'city.list.json.gz' can be downloaded [here](http://bulk.openweathermap.org/sample/).

We recommend to call API by city ID to get unambiguous result for your city.

API call

`https://api.openweathermap.org/data/2.5/weather?id={city id}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| --- |
| `id` | required | City ID. List of city ID 'city.list.json.gz' can be downloaded [here](http://bulk.openweathermap.org/sample/). |
| `appid` | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys)) |
| `mode` | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format) |
| `units` | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default. [Learn more](#data) |
| `lang` | optional | You can use this parameter to get the output in your language. [Learn more](#multi) |

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?id=2172797&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {
       "lon": 145.77,
       "lat": -16.92
     },
     "weather": [
       {
         "id": 802,
         "main": "Clouds",
         "description": "scattered clouds",
         "icon": "03n"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 300.15,
       "pressure": 1007,
       "humidity": 74,
       "temp_min": 300.15,
       "temp_max": 300.15
     },
     "visibility": 10000,
     "wind": {
       "speed": 3.6,
       "deg": 160
     },
     "clouds": {
       "all": 40
     },
     "dt": 1485790200,
     "sys": {
       "type": 1,
       "id": 8166,
       "message": 0.2064,
       "country": "AU",
       "sunrise": 1485720272,
       "sunset": 1485766550
     },
     "id": 2172797,
     "name": "Cairns",
     "cod": 200
     }



```

#### Built-in API request by ZIP code

Please note if country is not specified then the search works for USA as a default.

API call

`https://api.openweathermap.org/data/2.5/weather?zip={zip code},{country code}&appid=[{API key}](https://home.openweathermap.org/api_keys)`

| Parameters |
| --- |
| `zip` | required | Zip code |
| `appid` | required | Your unique API key (you can always find it on your account page under the ["API key" tab](https://home.openweathermap.org/api_keys)) |
| `mode` | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. [Learn more](#format) |
| `units` | optional | Units of measurement. `standard`, `metric` and `imperial` units are available. If you do not use the `units` parameter, `standard` units will be applied by default. [Learn more](#data) |
| `lang` | optional | You can use this parameter to get the output in your language. [Learn more](#multi) |

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?zip=94040,us&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

     {
     "coord": {"lon": -122.08,"lat": 37.39},
     "weather": [
       {
         "id": 800,
         "main": "Clear",
         "description": "clear sky",
         "icon": "01d"
       }
     ],
     "base": "stations",
     "main": {
       "temp": 282.55,
       "feels_like": 281.86,
       "temp_min": 280.37,
       "temp_max": 284.26,
       "pressure": 1023,
       "humidity": 100
     },
     "visibility": 10000,
     "wind": {
       "speed": 1.5,
       "deg": 350
     },
     "clouds": {
       "all": 1
     },
     "dt": 1560350645,
     "sys": {
       "type": 1,
       "id": 5122,
       "message": 0.0139,
       "country": "US",
       "sunrise": 1560343627,
       "sunset": 1560396563
     },
     "timezone": -25200,
     "id": 420006353,
     "name": "Mountain View",
     "cod": 200
     }



```

### Format

Response format. JSON format is used by default. To get data in XML format just set up mode = xml.

| Parameters |
| --- |
| `mode` | optional | Response format. Possible values are `xml` and `html`. If you don't use the `mode` parameter format is JSON by default. |

Example of API calls

JSON

`https://api.openweathermap.org/data/2.5/weather?q=London&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

{
"coord":{
"lon":-0.13,
"lat":51.51
},
"weather":[
{
"id":300,
"main":"Drizzle",
"description":"light intensity drizzle",
"icon":"09d"
}
],
"base":"stations",
"main":{
"temp":280.32,
"pressure":1012,
"humidity":81,
"temp_min":279.15,
"temp_max":281.15
},
"visibility":10000,
"wind":{
"speed":4.1,
"deg":80
},
"clouds":{
"all":90
},
"dt":1485789600,
"sys":{
"type":1,
"id":5091,
"message":0.0103,
"country":"GB",
"sunrise":1485762037,
"sunset":1485794875
},
"id":2643743,
"name":"London",
"cod":200
}

```

XML

`https://api.openweathermap.org/data/2.5/weather?q=London&mode=xml`

```

  <weatherdata>
   <location>
      <name>London</name>
      <type />
      <country>GB</country>
      <timezone />
      <location altitude="0" latitude="51.5085" longitude="-0.1258" geobase="geonames" geobaseid="2643743" />
   </location>
   <credit />
   <meta>
      <lastupdate />
      <calctime>0.0117</calctime>
      <nextupdate />
   </meta>
   <sun rise="2017-01-30T07:40:34" set="2017-01-30T16:47:56" />
   <forecast>
      <time day="2017-01-30">
         <symbol number="500" name="light rain" var="10d" />
         <precipitation value="1.64" type="rain" />
         <windDirection deg="85" code="E" name="East" />
         <windSpeed mps="1.97" name="Light breeze" />
         <temperature day="7" min="4.34" max="7" night="4.91" eve="5.05" morn="7" />
         <pressure unit="hPa" value="1016.99" />
         <humidity value="100" unit="%" />
         <clouds value="few clouds" all="12" unit="%" />
      </time>
      <time day="2017-01-31">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="9.42" type="rain" />
         <windDirection deg="140" code="SE" name="SouthEast" />
         <windSpeed mps="3.37" name="" />
         <temperature day="9.66" min="6.16" max="11.51" night="10.63" eve="10.85" morn="6.16" />
         <pressure unit="hPa" value="1018.15" />
         <humidity value="100" unit="%" />
         <clouds value="overcast clouds" all="92" unit="%" />
      </time>
      <time day="2017-02-01">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="9.11" type="rain" />
         <windDirection deg="197" code="SSW" name="South-southwest" />
         <windSpeed mps="5.01" name="Gentle Breeze" />
         <temperature day="9.81" min="9.64" max="10.23" night="10.08" eve="9.81" morn="10.03" />
         <pressure unit="hPa" value="1011.7" />
         <humidity value="99" unit="%" />
         <clouds value="scattered clouds" all="44" unit="%" />
      </time>
      <time day="2017-02-02">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="3.98" type="rain" />
         <windDirection deg="184" code="S" name="South" />
         <windSpeed mps="8.42" name="Fresh Breeze" />
         <temperature day="11.44" min="8.86" max="11.53" night="8.86" eve="10.99" morn="10.05" />
         <pressure unit="hPa" value="999.34" />
         <humidity value="96" unit="%" />
         <clouds value="overcast clouds" all="92" unit="%" />
      </time>
      <time day="2017-02-03">
         <symbol number="500" name="light rain" var="10d" />
         <precipitation value="1.65" type="rain" />
         <windDirection deg="213" code="SSW" name="South-southwest" />
         <windSpeed mps="8.51" name="Fresh Breeze" />
         <temperature day="10.66" min="8.63" max="10.66" night="8.63" eve="9.14" morn="10.18" />
         <pressure unit="hPa" value="1010.98" />
         <humidity value="0" unit="%" />
         <clouds value="scattered clouds" all="48" unit="%" />
      </time>
      <time day="2017-02-04">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="7.25" type="rain" />
         <windDirection deg="172" code="S" name="South" />
         <windSpeed mps="10.39" name="Fresh Breeze" />
         <temperature day="8.68" min="7.07" max="10.4" night="8.48" eve="10.4" morn="7.07" />
         <pressure unit="hPa" value="1001.13" />
         <humidity value="0" unit="%" />
         <clouds value="overcast clouds" all="96" unit="%" />
      </time>
      <time day="2017-02-05">
         <symbol number="501" name="moderate rain" var="10d" />
         <precipitation value="4.24" type="rain" />
         <windDirection deg="274" code="W" name="West" />
         <windSpeed mps="6.21" name="Moderate breeze" />
         <temperature day="8.5" min="4.86" max="8.5" night="4.86" eve="6.25" morn="8.26" />
         <pressure unit="hPa" value="995.24" />
         <humidity value="0" unit="%" />
         <clouds value="broken clouds" all="64" unit="%" />
      </time>
   </forecast>
  </weatherd
                           
                        
```

### Units of measurement

`standard`, `metric`, and `imperial` units are available. [List of all API parameters with available units](https://openweathermap.org/weather-data).

| Parameters |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------- |
| `units`    | optional | `standard`, `metric`, `imperial`. When you do not use the `units` parameter, format is `standard` by default. |

Temperature is available in Fahrenheit, Celsius and Kelvin units.

- For temperature in Fahrenheit use units=imperial
- For temperature in Celsius use units=metric
- Temperature in Kelvin is used by default, no need to use units parameter in API call

List of all API parameters with units [openweathermap.org/weather-data](http://openweathermap.org/weather-data)

Examples of API calls:

Standard

`https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

{
  "coord": {
    "lon": -2.15,
    "lat": 57
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 281.63,
    "feels_like": 278.05,
    "temp_min": 281.33,
    "temp_max": 282.41,
    "pressure": 1016,
    "humidity": 79,
    "sea_level": 1016,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 7.3,
    "deg": 189,
    "gust": 13.48
  },
  "clouds": {
    "all": 100
  },
  "dt": 1647347424,
  "sys": {
    "type": 2,
    "id": 2031790,
    "country": "GB",
    "sunrise": 1647325488,
    "sunset": 1647367827
  },
  "timezone": 0,
  "id": 2641549,
  "name": "Newtonhill",
  "cod": 200
}


```

metric

`https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid=[{API key}](https://home.openweathermap.org/api_keys)&units=metric`

```

  {
  "coord": {
    "lon": -2.15,
    "lat": 57
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 8.48,
    "feels_like": 4.9,
    "temp_min": 8.18,
    "temp_max": 9.26,
    "pressure": 1016,
    "humidity": 79,
    "sea_level": 1016,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 7.3,
    "deg": 189,
    "gust": 13.48
  },
  "clouds": {
    "all": 100
  },
  "dt": 1647347424,
  "sys": {
    "type": 2,
    "id": 2031790,
    "country": "GB",
    "sunrise": 1647325488,
    "sunset": 1647367827
  },
  "timezone": 0,
  "id": 2641549,
  "name": "Newtonhill",
  "cod": 200
}


```

imperial

`https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid=[{API key}](https://home.openweathermap.org/api_keys)&units=imperial`

```

  {
  "coord": {
    "lon": -2.15,
    "lat": 57
  },
  "weather": [
    {
      "id": 804,
      "main": "Clouds",
      "description": "overcast clouds",
      "icon": "04d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 47.26,
    "feels_like": 40.82,
    "temp_min": 46.72,
    "temp_max": 48.67,
    "pressure": 1016,
    "humidity": 79,
    "sea_level": 1016,
    "grnd_level": 1016
  },
  "visibility": 10000,
  "wind": {
    "speed": 16.33,
    "deg": 189,
    "gust": 30.15
  },
  "clouds": {
    "all": 100
  },
  "dt": 1647347504,
  "sys": {
    "type": 2,
    "id": 2031790,
    "country": "GB",
    "sunrise": 1647325488,
    "sunset": 1647367827
  },
  "timezone": 0,
  "id": 2641549,
  "name": "Newtonhill",
  "cod": 200
}


```

### Multilingual support

You can use the `lang` parameter to get the output in your language.

Translation is applied for the `city name` and `description` fields.

API call

`https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid=[{API key}](https://home.openweathermap.org/api_keys)&lang={lang}`

| Parameters |
| ---------- | -------- | ------------- |
| `lang`     | optional | Language code |

Examples of API calls

`https://api.openweathermap.org/data/2.5/weather?id=524901&lang=fr&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```


  {
  "coord": {
    "lon": 37.62,
    "lat": 55.75
  },
  "weather": [
    {
      "id": 501,
      "main": "Rain",
      "description": "pluie modérée",
      "icon": "10d"
    }
  ],
  "base": "stations",
  "main": {
    "temp": 295.48,
    "feels_like": 295.41,
    "temp_min": 295.15,
    "temp_max": 296.15,
    "pressure": 1018,
    "humidity": 60
  },
  "visibility": 10000,
  "wind": {
    "speed": 2,
    "deg": 260
  },
  "rain": {
    "1h": 1.23
  },
  "clouds": {
    "all": 100
  },
  "dt": 1599492273,
  "sys": {
    "type": 1,
    "id": 9029,
    "country": "RU",
    "sunrise": 1599446791,
    "sunset": 1599494929
  },
  "timezone": 10800,
  "id": 524901,
  "name": "Moscou",
  "cod": 200
  }


```

We support the following languages that you can use with the corresponded lang values:

- `sq` Albanian
- `af` Afrikaans
- `ar` Arabic
- `az` Azerbaijani
- `eu` Basque
- `be` Belarusian
- `bg` Bulgarian
- `ca` Catalan
- `zh_cn` Chinese Simplified
- `zh_tw` Chinese Traditional
- `hr` Croatian
- `cz` Czech
- `da` Danish
- `nl` Dutch
- `en` English
- `fi` Finnish
- `fr` French
- `gl` Galician
- `de` German
- `el` Greek
- `he` Hebrew
- `hi` Hindi
- `hu` Hungarian
- `is` Icelandic
- `id` Indonesian
- `it` Italian
- `ja` Japanese
- `kr` Korean
- `ku` Kurmanji (Kurdish)
- `la` Latvian
- `lt` Lithuanian
- `mk` Macedonian
- `no` Norwegian
- `fa` Persian (Farsi)
- `pl` Polish
- `pt` Portuguese
- `pt_br` Português Brasil
- `ro` Romanian
- `ru` Russian
- `sr` Serbian
- `sk` Slovak
- `sl` Slovenian
- `sp, es` Spanish
- `sv, se` Swedish
- `th` Thai
- `tr` Turkish
- `ua, uk` Ukrainian
- `vi` Vietnamese
- `zu` Zulu

### Call back function for JavaScript code

To use JavaScript code you can transfer `callback` functionName to JSONP callback.

Example of API call

`https://api.openweathermap.org/data/2.5/weather?q=London,uk&callback=test&appid=[{API key}](https://home.openweathermap.org/api_keys)`

```

   test(
      {
         "coord":{
            "lon":-0.13,
            "lat":51.51
         },
         "weather":[
            {
               "id":300,
               "main":"Drizzle",
               "description":"light intensity drizzle",
               "icon":"09d"
            }
         ],
         "base":"stations",
         "main":{
            "temp":280.32,
            "pressure":1012,
            "humidity":81,
            "temp_min":279.15,
            "temp_max":281.15
         },
         "visibility":10000,
         "wind":{
            "speed":4.1,
            "deg":80
         },
         "clouds":{
            "all":90
         },
         "dt":1485789600,
         "sys":{
            "type":1,
            "id":5091,
            "message":0.0103,
            "country":"GB",
            "sunrise":1485762037,
            "sunset":1485794875
         },
         "id":2643743,
         "name":"London",
         "cod":200
      }
   )


```
