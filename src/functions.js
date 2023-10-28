import { displaySettings } from "./settings";
import citiesData from "./data/cities.json";

function drawNewCities(cities) {
  if (cities > 30) throw Error("drawNewCities: Too many cities.");
  let newCitites = [];
  for (let i = 0; i < cities; i++) {
    let randomId = null;
    do {
      randomId = Math.floor(Math.random() * citiesData.length);
    } while (!newCitySuitable(newCitites, citiesData[randomId]));
    let city = citiesData[randomId];
    let position = letlngToPx(city.lat, city.lng);
    newCitites.push({
      ...city,
      x: position.x,
      y: position.y,
      correct: false,
      incorrect: false,
    });
  }
  return newCitites;
}

function newCitySuitable(cities, newCity) {
  // City is in array
  if (cities.findIndex((city) => city.name === newCity.name) > -1) return false;
  // City is too close to another one
  if (
    cities.findIndex((city) => {
      let a = city.lat - newCity.lat;
      let b = city.lng - newCity.lng;
      let c = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2), 2);
      return c < 15;
    }) > -1
  )
    return false;
  return true;
}

function letlngToPx(lat, lng) {
  // Mercator projection
  let x = (lng + 180) * (displaySettings.mapDimensions.x / 360);
  let latRad = (lat * Math.PI) / 180;
  let n = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  let y =
    displaySettings.mapDimensions.y / 2 -
    (displaySettings.mapDimensions.x * n) / (2 * Math.PI);
  // Map offset
  x += -57;
  y += 235;
  return { x, y };
}

export { drawNewCities, newCitySuitable, letlngToPx };
