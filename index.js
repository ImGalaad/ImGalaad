require('dotenv').config();
const Mustache = require('mustache');
const fetch = require('node-fetch');
const fs = require('fs');
const MUSTACHE_MAIN_DIR = './main.mustache';

// DATA contains all the data to be provided to Mustache.

let DATA = {
    name: 'Galaad',
    date: new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Paris',
  }),
};

// Open 'main.mustache'
// Ask Mustache to render our file with the data
// Create a README.md file with the generated output

async function setWeatherInformation() {
    await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=paris&appid=${process.env.OPEN_WEATHER_MAP_KEY}&units=metric`
    )
      .then(r => r.json())
      .then(r => {
        DATA.city_temperature = Math.round(r.main.temp);
        DATA.city_weather = r.weather[0].description;
        DATA.city_weather_icon = r.weather[0].icon;
        DATA.sun_rise = new Date(r.sys.sunrise * 1000).toLocaleString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris',
        });
        DATA.sun_set = new Date(r.sys.sunset * 1000).toLocaleString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Europe/Paris',
        });
      });
  }

function generateReadMe() {
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) =>  {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}
generateReadMe();

async function action() {
    await setWeatherInformation();
    await generateReadMe();
}
  
action();
  