import styles from "./QualitySwitch.module.css";
import { useApp } from "../contexts/AppContext";
import { Button, ButtonGroup, Paper } from "@mui/material";

function QualitySwitch() {
  const { app, dispatch } = useApp();

  const handleCLick = (e) => {
    dispatch({ type: "set_quality", payload: parseInt(e.target.value) });
  };

  return (
    <div className={styles.wrapper}>
      <Paper>
        <ButtonGroup color="info" size="small" sx={{ bgcolor: "white" }}>
          <Button
            variant={app.quality ? "contained" : "text"}
            disableElevation={true}
            onClick={handleCLick}
            value={1}
            sx={{ px: 1.5 }}
          >
            Quality
          </Button>
          <Button
            variant={!app.quality ? "contained" : "text"}
            disableElevation={true}
            onClick={handleCLick}
            value={0}
            sx={{ px: 1.5 }}
          >
            Performance
          </Button>
        </ButtonGroup>
      </Paper>
    </div>
  );
}

export default QualitySwitch;
