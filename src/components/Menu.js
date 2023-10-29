import styles from "./Menu.module.css";
import { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { projectSettings } from "../settings";
import { Button, Menu as MuiMenu, MenuItem, Paper } from "@mui/material";
import { OpenInNew as OpenInNewIcon } from "@mui/icons-material";

function Menu() {
  const { dispatch } = useApp();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRestartClick = () => {
    dispatch({ type: "restart_game" });
    setAnchorEl(null);
  };

  const handleGitHubClick = () => {
    window.open(projectSettings.gitHubUrl, "_blank");
    setAnchorEl(null);
  };

  return (
    <div className={styles.wrapper}>
      <Paper>
        <Button
          id="main-menu-button"
          aria-controls={open ? "main-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          variant={open ? "contained" : "text"}
          size="small"
          color="info"
          disableElevation={true}
          onClick={handleClick}
          sx={{ px: 1.5 }}
        >
          Menu
        </Button>
        <MuiMenu
          id="main-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          elevation={1}
          MenuListProps={{
            "aria-labelledby": "main-menu-button",
          }}
          sx={{ mt: 1 }}
        >
          <MenuItem dense={true} onClick={handleRestartClick}>
            Restart The Game
          </MenuItem>
          <MenuItem dense={true} onClick={handleGitHubClick}>
            GitHub Page
            <OpenInNewIcon
              color="disabled"
              fontSize="small"
              sx={{ ml: 0.25 }}
            />
          </MenuItem>
        </MuiMenu>
      </Paper>
    </div>
  );
}

export default Menu;
