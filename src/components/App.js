import styles from "./App.module.css";
import { useEffect } from "react";
import { AppProvider } from "../contexts/AppContext";
import useAppReducer from "../reducers/appReducer";
import Map from "./Map";
import Interface from "./Interface";

function App() {
  const [app, dispatch] = useAppReducer();

  // Load initial setting from localStorage
  useEffect(() => {
    let quality = localStorage.getItem("quality");
    if (quality !== null) {
      dispatch({ type: "set_quality", payload: parseInt(quality) });
    }
  }, [dispatch]);

  // Set a timer at the beginning of the game
  useEffect(() => {
    let clockInterval;
    if (app.status === "playing") {
      clockInterval = setInterval(
        () => dispatch({ type: "subtract_time" }),
        1000
      );
    }
    return () => clearInterval(clockInterval);
  }, [app.status, dispatch]);

  // Win the game by correctly assigning all cities
  useEffect(() => {
    if (
      app.status === "playing" &&
      app.cities.findIndex((city) => !city.correct) === -1
    ) {
      dispatch({ type: "win_game" });
    }
  }, [app.status, app.cities, dispatch]);

  // Lose the game by time lapse
  useEffect(() => {
    if (app.time === 0) {
      dispatch({ type: "lose_game" });
    }
  }, [app.time, dispatch]);

  // Lose the game by making too many mistakes
  useEffect(() => {
    if (app.mistakes === 0) {
      dispatch({ type: "lose_game" });
    }
  }, [app.mistakes, dispatch]);

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
