import { useApp } from "../contexts/AppContext";
import QualitySwitch from "./QualitySwitch";
import ActionBox from "./ActionBox";
import Modal from "./Modal";

function Interface() {
  const { app } = useApp();

  return (
    <div style={{ pointerEvents: app.dragging ? "none" : "all" }}>
      <QualitySwitch />
      <ActionBox />
      <Modal />
    </div>
  );
}

export default Interface;
