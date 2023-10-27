import styles from "./Marker.module.css";
import { useApp } from "../contexts/AppContext";
import { Paper, Typography } from "@mui/material";
import pinImg from "../assets/pushpin.svg";

function letlngToPx(lat, lng, mapDimensions) {
  // Mercator projection
  let x = (lng + 180) * (mapDimensions.x / 360);
  let latRad = (lat * Math.PI) / 180;
  let n = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
  let y = mapDimensions.y / 2 - (mapDimensions.x * n) / (2 * Math.PI);
  // Map offset
  x += -57;
  y += 235;
  return { x, y };
}

function Marker({ city, mapDimensions }) {
  const { app, dispatch } = useApp();
  let position = letlngToPx(city.lat, city.lng, mapDimensions);

  const handleOnClick = () => {
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
        top: position.y,
        left: position.x,
        pointerEvents:
          !city.correct && app.status === "playing" ? "all" : "none",
      }}
      onClick={handleOnClick}
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
