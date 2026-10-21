# Weather App

Search any city and see the current weather plus a 5-day forecast. Built with vanilla JavaScript and the free [Open-Meteo](https://open-meteo.com/) APIs, so no API key is needed.

**Live demo:** add your deployed link here

## Features
- City search using the Open-Meteo geocoding API
- Current temperature, conditions and wind speed
- 5-day forecast
- Loading, empty and error states
- Responsive and keyboard accessible

## Run locally
```bash
git clone https://github.com/anushka-s-t/weather-app.git
cd weather-app
npx serve .
```

## How it works
1. `loadWeather()` turns the city name into coordinates.
2. It requests current and daily forecast data for those coordinates.
3. `render()` updates the page; errors show in the status line.

## Ideas to extend
- Add a °C / °F toggle
- Remember the last searched city with `localStorage`
- Use the browser Geolocation API for a "my location" button
- Rewrite in React to practise components and hooks

## Tech
HTML, CSS, JavaScript (fetch, async/await), Open-Meteo API.
