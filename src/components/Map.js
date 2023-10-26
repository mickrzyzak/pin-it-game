import styles from "./Map.module.css";
import { useState, useEffect } from "react";
import { useApp } from "../contexts/AppContext";
import mapImgSvg from "../assets/map.svg";
import mapImgPng from "../assets/map.png";
import Marker from "./Marker";

const mapDimensions = { x: 1920, y: 1241 };
const playgroundDimensions = { x: 1920, y: 1241 + 300 };

function mapBiggerThanWindow() {
  return {
    x: mapDimensions.x > window.innerWidth,
    y: mapDimensions.y > window.innerHeight,
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
        ? mapDimensions.x / 2 - window.innerWidth / 2
        : 0,
      y: mapBiggerThanWindow().y
        ? mapDimensions.y / 2 - window.innerHeight / 2
        : 0,
    });
  };

  const handleOnMove = (e) => {
    if (moveStartPosition === null) return;
    if (!e.touches && e.clientX === 0 && e.clientY === 0) return;
    let positionX =
      moveStartPosition.x - (e.touches ? e.touches[0].clientX : e.clientX);
    let positionY =
      moveStartPosition.y - (e.touches ? e.touches[0].clientY : e.clientY);
    setPosition({
      x: mapBiggerThanWindow().x
        ? positionX > 0
          ? positionX + window.innerWidth < playgroundDimensions.x
            ? positionX
            : playgroundDimensions.x - window.innerWidth
          : 0
        : 0,
      y: mapBiggerThanWindow().y
        ? positionY > 0
          ? positionY + window.innerHeight < playgroundDimensions.y
            ? positionY
            : playgroundDimensions.y - window.innerHeight
          : 0
        : 0,
    });
  };

  const handleOnMoveStart = (e) => {
    dispatch({ type: "set_dragging", payload: true });
    setMoveStartPosition({
      x: (e.touches ? e.touches[0].clientX : e.clientX) + position.x,
      y: (e.touches ? e.touches[0].clientY : e.clientY) + position.y,
    });
  };

  const handleOnMoveEnd = (e) => {
    dispatch({ type: "set_dragging", payload: false });
    setMoveStartPosition(null);
  };

  return (
    <div
      className={styles.map}
      style={{
        top: -position.y,
        left: -position.x,
        width: playgroundDimensions.x,
        height: playgroundDimensions.y,
      }}
    >
      <div
        className={styles.drag}
        draggable={false}
        onMouseMove={handleOnMove}
        onMouseDown={handleOnMoveStart}
        onMouseUp={handleOnMoveEnd}
        onMouseLeave={handleOnMoveEnd}
        onTouchMove={handleOnMove}
        onTouchStart={handleOnMoveStart}
        onTouchEnd={handleOnMoveEnd}
        style={{ cursor: moveStartPosition === null ? "grab" : "grabbing" }}
      />
      <img
        className={styles.mapImg}
        style={{ width: mapDimensions.x, height: mapDimensions.y }}
        src={app.quality ? mapImgSvg : mapImgPng}
        alt="Map"
      />
      {app.cities.map((city, index) => (
        <Marker city={city} mapDimensions={mapDimensions} key={index} />
      ))}
    </div>
  );
}

export default Map;
