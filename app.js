// Uses the free Open-Meteo APIs. No API key needed.
const form = document.getElementById("search");
const cityInput = document.getElementById("city");
const statusEl = document.getElementById("status");
const current = document.getElementById("current");
const forecastEl = document.getElementById("forecast");

const CODES = {
  0: "Clear sky", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
  45: "Fog", 48: "Fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
  61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
  75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Heavy showers",
  95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Thunderstorm with hail"
};
const describe = code => CODES[code] || "Unknown";

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed. Check your connection and try again.");
  return res.json();
}

async function loadWeather(city) {
  const geo = await getJSON(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
  );
  if (!geo.results || !geo.results.length) {
    throw new Error(`No city found for "${city}". Check the spelling.`);
  }
  const { latitude, longitude, name, country } = geo.results[0];
  const data = await getJSON(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,weather_code,wind_speed_10m` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`
  );
  return { name, country, data };
}

function render({ name, country, data }) {
  document.getElementById("place").textContent = `${name}, ${country}`;
  document.getElementById("temp").textContent = Math.round(data.current.temperature_2m);
  document.getElementById("desc").textContent = describe(data.current.weather_code);
  document.getElementById("wind").textContent = Math.round(data.current.wind_speed_10m);
  current.hidden = false;

  forecastEl.innerHTML = "";
  data.daily.time.forEach((date, i) => {
    const day = new Date(date).toLocaleDateString(undefined, { weekday: "short" });
    const el = document.createElement("div");
    el.className = "day";
    el.innerHTML = `<strong>${day}</strong>
      ${Math.round(data.daily.temperature_2m_max[i])}&deg; / ${Math.round(data.daily.temperature_2m_min[i])}&deg;
      <div>${describe(data.daily.weather_code[i])}</div>`;
    forecastEl.appendChild(el);
  });
  forecastEl.hidden = false;
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  statusEl.textContent = "Loading...";
  current.hidden = true;
  forecastEl.hidden = true;
  try {
    render(await loadWeather(cityInput.value.trim()));
    statusEl.textContent = "";
  } catch (err) {
    statusEl.textContent = err.message;
  }
});
