import styles from "./App.module.css";
import { useReducer, useEffect } from "react";
import { AppProvider } from "../contexts/AppContext";
import citiesData from "../data/cities.json";
import Map from "./Map";
import Interface from "./Interface";

export const gameSettings = {
  cities: 9,
  time: 60,
  mistakes: 10,
};

const initialState = {
  status: "idle",
  quality: window.innerWidth >= 600,
  dragging: false,
  modal: null,
  cities: [],
  activeCity: null,
  time: gameSettings.time,
  mistakes: gameSettings.mistakes,
};

function drawNewCities(cities) {
  if (cities > 30) throw Error("drawNewCities: Too many cities.");
  let newCitites = [];
  for (let i = 0; i < cities; i++) {
    let randomId = null;
    do {
      randomId = Math.floor(Math.random() * citiesData.length);
    } while (!newCitySuitable(newCitites, randomId));
    newCitites.push({
      ...citiesData[randomId],
      correct: false,
      incorrect: false,
    });
  }
  return newCitites;
}

function newCitySuitable(cities, newCityId) {
  let newCity = citiesData[newCityId];
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

function appReducer(state, action) {
  switch (action.type) {
    case "start_game":
      return {
        ...state,
        status: "playing",
        cities: drawNewCities(gameSettings.cities),
        activeCity: null,
        time: gameSettings.time,
        mistakes: gameSettings.mistakes,
      };
    case "win_game":
      return {
        ...state,
        status: "won",
      };
    case "lose_game":
      return {
        ...state,
        status: "lost",
        activeCity: null,
      };
    case "set_quality":
      localStorage.setItem("quality", action.payload);
      return {
        ...state,
        quality: action.payload,
      };
    case "set_dragging":
      return {
        ...state,
        dragging: action.payload,
      };
    case "select_active_city":
      return {
        ...state,
        activeCity: action.payload,
        cities: state.cities.map((city) => {
          return { ...city, incorrect: false };
        }),
      };
    case "set_correct_city":
      return {
        ...state,
        activeCity: null,
        cities: state.cities.map((city) =>
          city.name === action.payload
            ? { ...city, correct: true }
            : { ...city, incorrect: false }
        ),
      };
    case "set_incorrect_city":
      return {
        ...state,
        cities: state.cities.map((city) =>
          city.name === action.payload ? { ...city, incorrect: true } : city
        ),
      };
    case "subtract_mistake":
      return {
        ...state,
        mistakes: state.mistakes - 1,
      };
    case "subtract_time":
      return {
        ...state,
        time: state.time - 1,
      };
    default:
      throw Error("appReducer: Unknown action type.");
  }
}

function App() {
  const [app, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    loadLocalStorageData();
  }, []);

  useEffect(() => {
    let clockInterval;
    if (app.status === "playing") {
      clockInterval = setInterval(
        () => dispatch({ type: "subtract_time" }),
        1000
      );
    }

    return () => clearInterval(clockInterval);
  }, [app.status]);

  useEffect(() => {
    if (
      app.status === "playing" &&
      app.cities.findIndex((city) => !city.correct) === -1
    ) {
      dispatch({ type: "win_game" });
    }
  }, [app.status, app.cities]);

  useEffect(() => {
    if (app.time === 0) {
      dispatch({ type: "lose_game" });
    }
  }, [app.time]);

  useEffect(() => {
    if (app.mistakes === 0) {
      dispatch({ type: "lose_game" });
    }
  }, [app.mistakes]);

  const loadLocalStorageData = () => {
    let quality = localStorage.getItem("quality");
    if (quality !== null) {
      dispatch({ type: "set_quality", payload: parseInt(quality) });
    }
  };

  return (
    <AppProvider value={{ app, dispatch }}>
      <div className={styles.wrapper} style={{ height: window.innerHeight }}>
        <Map />
        <Interface />
      </div>
    </AppProvider>
  );
}

export default App;
