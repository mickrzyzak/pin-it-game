import styles from "./Marker.module.css";
import { useApp } from "../contexts/AppContext";
import { Paper, Typography } from "@mui/material";
import pinImg from "../assets/pushpin.svg";

function Marker({ city, mapDimensions }) {
  const { app, dispatch } = useApp();

  const handleClick = () => {
    if (!city.correct) {
      dispatch({ type: "select_active_city", payload: city.name });
    }
  };

  return (
    <div
      className={`${styles.marker} ${
        app.activeCity === city.name ? styles.active : ""
      }`}
      style={{
        top: city.y,
        left: city.x,
        pointerEvents:
          !city.correct && app.status === "playing" ? "all" : "none",
      }}
      onClick={handleClick}
    >
      <img
        className={styles.markerImg}
        src={pinImg}
        alt={`Pin ${city.name}`}
        draggable={false}
      />
      {(city.correct || app.status === "lost") && (
        <div className={styles.label}>
          <Paper sx={{ px: 0.5, py: 0.25 }}>
            <Typography
              variant="overline"
              align="center"
              sx={{ display: "block", lineHeight: 1 }}
            >
              {city.name}
            </Typography>
          </Paper>
        </div>
      )}
    </div>
  );
}

export default Marker;
