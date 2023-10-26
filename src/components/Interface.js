import { useApp } from "../contexts/AppContext";
import QualitySwitch from "./QualitySwitch";
import ActionBox from "./ActionBox";

function Interface() {
  const { app } = useApp();

  return (
    <div style={{ pointerEvents: app.dragging ? "none" : "all" }}>
      <QualitySwitch />
      <ActionBox />
    </div>
  );
}

export default Interface;
