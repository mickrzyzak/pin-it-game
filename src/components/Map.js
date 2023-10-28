import styles from "./Map.module.css";
import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import { displaySettings } from "../settings";
import mapImgSvg from "../assets/map.svg";
import mapImgPng from "../assets/map.png";
import Marker from "./Marker";

function mapBiggerThanWindow() {
  return {
    x: displaySettings.mapDimensions.x > window.innerWidth,
    y: displaySettings.mapDimensions.y > window.innerHeight,
  };
}

function Map() {
  const { app, dispatch } = useApp();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [moveStartPosition, setMoveStartPosition] = useState(null);

  useEffect(() => {
    centerMap();
  }, []);

  const centerMap = () => {
    setPosition({
      x: mapBiggerThanWindow().x
        ? displaySettings.mapDimensions.x / 2 - window.innerWidth / 2
        : 0,
      y: mapBiggerThanWindow().y
        ? displaySettings.mapDimensions.y / 2 - window.innerHeight / 2
        : 0,
    });
  };

  const handleMove = (e) => {
    if (moveStartPosition === null) return;
    if (!e.touches && e.clientX === 0 && e.clientY === 0) return;
    let positionX =
      moveStartPosition.x - (e.touches ? e.touches[0].clientX : e.clientX);
    let positionY =
      moveStartPosition.y - (e.touches ? e.touches[0].clientY : e.clientY);
    setPosition({
      x: mapBiggerThanWindow().x
        ? positionX > 0
          ? positionX + window.innerWidth <
            displaySettings.playgroundDimensions.x
            ? positionX
            : displaySettings.playgroundDimensions.x - window.innerWidth
          : 0
        : 0,
      y: mapBiggerThanWindow().y
        ? positionY > 0
          ? positionY + window.innerHeight <
            displaySettings.playgroundDimensions.y
            ? positionY
            : displaySettings.playgroundDimensions.y - window.innerHeight
          : 0
        : 0,
    });
  };

  const handleMoveStart = (e) => {
    if (!mapBiggerThanWindow().x && !mapBiggerThanWindow().y) return;
    dispatch({ type: "set_dragging", payload: true });
    setMoveStartPosition({
      x: (e.touches ? e.touches[0].clientX : e.clientX) + position.x,
      y: (e.touches ? e.touches[0].clientY : e.clientY) + position.y,
    });
  };

  const handleMoveEnd = (e) => {
    dispatch({ type: "set_dragging", payload: false });
    setMoveStartPosition(null);
  };

  return (
    <div
      className={styles.map}
      style={{
        top: -position.y,
        left: -position.x,
        width: displaySettings.playgroundDimensions.x,
        height: displaySettings.playgroundDimensions.y,
      }}
    >
      <div
        className={styles.drag}
        draggable={false}
        onMouseMove={handleMove}
        onMouseDown={handleMoveStart}
        onMouseUp={handleMoveEnd}
        onMouseLeave={handleMoveEnd}
        onTouchMove={handleMove}
        onTouchStart={handleMoveStart}
        onTouchEnd={handleMoveEnd}
        style={{ cursor: moveStartPosition === null ? "grab" : "grabbing" }}
      />
      <img
        className={styles.mapImg}
        style={{
          width: displaySettings.mapDimensions.x,
          height: displaySettings.mapDimensions.y,
        }}
        src={app.quality ? mapImgSvg : mapImgPng}
        alt="Map"
      />
      {app.cities.map((city, index) => (
        <Marker city={city} key={index} />
      ))}
    </div>
  );
}

export default Map;
