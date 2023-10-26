import styles from "./ActionBox.module.css";
import { useApp } from "../contexts/AppContext";
import { Button, Paper, Grid, Typography } from "@mui/material";

function Tip({ text }) {
  return (
    <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
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

function CityList({ app, dispatch }) {
  const handleOnClick = (e) => {
    if (e.target.value === app.activeCity) {
      dispatch({ type: "set_correct_city", payload: e.target.value });
    } else {
      dispatch({ type: "set_incorrect_city", payload: e.target.value });
      dispatch({ type: "add_mistake" });
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
            onClick={handleOnClick}
            value={city.name}
            sx={{
              p: 1.25,
              width: 1,
              height: 1,
              lineHeight: 1,
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

function ActionBox() {
  const { app, dispatch } = useApp();

  return (
    <div className={styles.wrapper} style={{ opacity: app.dragging ? 0.5 : 1 }}>
      <Paper sx={{ p: 1.5, borderColor: "info.main" }}>
        {app.activeCity === null && <Tip text="📌️ Select a pin on the map." />}
        <Dashboard app={app} />
        <CityList app={app} dispatch={dispatch} />
      </Paper>
    </div>
  );
}

export default ActionBox;
