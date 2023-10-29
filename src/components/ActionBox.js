import styles from "./ActionBox.module.css";
import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { Button, Paper, Grid, Typography } from "@mui/material";

function Tip({ text }) {
  return (
    <Typography
      variant="subtitle1"
      align="center"
      sx={{ lineHeight: 1.25, mb: 1.25 }}
    >
      {text}
    </Typography>
  );
}

function Dashboard({ app }) {
  return (
    <Grid container spacing={1} sx={{ mb: 1.5 }}>
      <Grid item xs={6}>
        <Paper
          variant="outlined"
          sx={{
            px: 1,
            py: 0.5,
            borderColor: app.time <= 15 ? "error.main" : "info.main",
          }}
        >
          <Typography variant="subtitle1" align="center">
            ⏰️ Time: <span style={{ fontWeight: "bold" }}>{app.time}</span>
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper
          variant="outlined"
          sx={{
            px: 1,
            py: 0.5,
            borderColor: app.mistakes <= 1 ? "error.main" : "info.main",
          }}
        >
          <Typography variant="subtitle1" align="center">
            🚩️ Mistakes:{" "}
            <span style={{ fontWeight: "bold" }}>{app.mistakes}</span>
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

function ActionButton({ action, children, color, dispatch }) {
  const handleClick = () => dispatch(action);

  return (
    <Button
      variant="contained"
      color={color}
      size="large"
      onClick={handleClick}
      sx={{ display: "block", mx: "auto", mt: 1.5, width: 1 }}
    >
      {children}
    </Button>
  );
}

function CityList({ app, dispatch }) {
  const handleClick = (e) => {
    if (e.target.value === app.activeCity) {
      dispatch({ type: "set_correct_city", payload: e.target.value });
    } else {
      dispatch({ type: "set_incorrect_city", payload: e.target.value });
      dispatch({ type: "subtract_mistake" });
    }
  };

  return (
    <Grid container spacing={1}>
      {app.cities.map((city, index) => (
        <Grid item xs={4} key={index}>
          <Button
            variant="contained"
            size="small"
            color={city.correct ? "success" : city.incorrect ? "error" : "info"}
            disabled={app.activeCity === null && !city.correct}
            onClick={handleClick}
            value={city.name}
            sx={{
              p: 1.25,
              width: 1,
              height: 1,
              lineHeight: 1,
              wordBreak: "break-word",
              pointerEvents: city.correct || city.incorrect ? "none" : "all",
            }}
          >
            {city.name}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}

function MarkerSelectionHelper({ app, dispatch }) {
  const [unknownCities, setUnknownCities] = useState([]);

  useEffect(() => {
    setUnknownCities(app.cities.filter((city) => !city.correct));
  }, [app.cities]);

  const handleClick = () => {
    let cityId = 0;
    if (app.activeCity !== null) {
      let activeCityId = unknownCities.findIndex(
        (city) => city.name === app.activeCity
      );
      cityId = activeCityId < unknownCities.length - 1 ? activeCityId + 1 : 0;
    }
    dispatch({
      type: "select_active_city",
      payload: unknownCities[cityId].name,
    });
    dispatch({
      type: "set_map_move_to",
      payload: { x: unknownCities[cityId].x, y: unknownCities[cityId].y },
    });
  };

  return (
    app.status === "playing" && (
      <Paper sx={{ display: "inline-block", mb: 1 }}>
        <Button
          variant="text"
          color="warning"
          size="small"
          disableElevation={false}
          onClick={handleClick}
          sx={{ px: 1.25, py: 0.25 }}
        >
          {app.activeCity === null
            ? "Select a marker"
            : "Select the next marker"}
        </Button>
      </Paper>
    )
  );
}

function ActionBox() {
  const { app, dispatch } = useApp();

  return (
    <div
      id="action-box"
      className={styles.wrapper}
      style={{ opacity: app.dragging ? 0.5 : 1 }}
    >
      <MarkerSelectionHelper app={app} dispatch={dispatch} />
      <Paper sx={{ p: 1.5, borderColor: "info.main" }}>
        {app.status === "idle" && (
          <Tip text="🎓️ Assign the drawn cities to the markers." />
        )}
        {app.status === "playing" && app.activeCity === null && (
          <Tip text="📌️ Select a pin on the map." />
        )}
        {app.status === "playing" && app.activeCity !== null && (
          <Tip text="📫️ Select the correct city." />
        )}
        {app.status === "won" && (
          <Tip text="🎉️ You won the game. Congratulations!" />
        )}
        {app.status === "lost" && (
          <Tip text="🪦️ You lost the game. Try again!" />
        )}
        <Dashboard app={app} />
        {app.status === "idle" && (
          <ActionButton
            action={{ type: "start_game" }}
            color="success"
            dispatch={dispatch}
          >
            START THE GAME
          </ActionButton>
        )}
        {app.status !== "idle" && <CityList app={app} dispatch={dispatch} />}
        {app.status === "won" && (
          <ActionButton
            action={{ type: "restart_game" }}
            color="info"
            dispatch={dispatch}
          >
            RESTART THE GAME
          </ActionButton>
        )}
        {app.status === "lost" && (
          <ActionButton
            action={{ type: "restart_game" }}
            color="error"
            dispatch={dispatch}
          >
            RESTART THE GAME
          </ActionButton>
        )}
      </Paper>
    </div>
  );
}

export default ActionBox;
