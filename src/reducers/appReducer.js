import { useReducer } from "react";
import { gameSettings, displaySettings } from "../settings";
import { drawNewCities } from "../functions";

const initialState = {
  status: "idle",
  quality: window.innerWidth >= 900,
  dragging: false,
  mapMoveTo: null,
  modal: null,
  cities: [],
  activeCity: null,
  time: gameSettings.time,
  mistakes: gameSettings.mistakes,
};

function reducer(state, action) {
  switch (action.type) {
    case "start_game":
      return {
        ...state,
        status: "playing",
        mapMoveTo: {
          x: displaySettings.mapDimensions.x / 2,
          y: displaySettings.mapDimensions.y / 2,
        },
        modal: null,
        cities: drawNewCities(gameSettings.cities),
        activeCity: null,
        time: gameSettings.time,
        mistakes: gameSettings.mistakes,
      };
    case "restart_game":
      return {
        ...state,
        status: "idle",
        modal: null,
        cities: [],
        activeCity: null,
        time: gameSettings.time,
        mistakes: gameSettings.mistakes,
      };
    case "win_game":
      return {
        ...state,
        status: "won",
        modal: {
          title: "🎉️ You are a winner!",
          content: `As a geography expert, you know perfectly well where <strong>${state.cities
            .map((city, index) =>
              index !== state.cities.length - 1 ? city.name + ", " : null
            )
            .join("")
            .slice(0, -2)}</strong> and <b>${
            state.cities[state.cities.length - 1].name
          }</b> are located. It took you <strong>${
            gameSettings.time - state.time
          } seconds</strong> to win and you made <strong>${
            gameSettings.mistakes - state.mistakes
          } mistakes</strong>.`,
          actions: [
            {
              text: "Okay",
              color: "info",
              action: { type: "set_modal", payload: null },
            },
            {
              text: "Play again",
              color: "success",
              action: { type: "start_game" },
            },
          ],
        },
      };
    case "lose_game":
      return {
        ...state,
        status: "lost",
        activeCity: null,
      };
    case "set_quality":
      localStorage.setItem("quality", action.payload);
      return {
        ...state,
        quality: action.payload,
      };
    case "set_modal":
      return {
        ...state,
        modal: action.payload,
      };
    case "set_dragging":
      return {
        ...state,
        dragging: action.payload,
      };
    case "set_map_move_to":
      return {
        ...state,
        mapMoveTo: action.payload,
      };
    case "select_active_city":
      return {
        ...state,
        activeCity: action.payload,
        cities: state.cities.map((city) => {
          return { ...city, incorrect: false };
        }),
      };
    case "set_correct_city":
      return {
        ...state,
        activeCity: null,
        cities: state.cities.map((city) =>
          city.name === action.payload
            ? { ...city, correct: true }
            : { ...city, incorrect: false }
        ),
      };
    case "set_incorrect_city":
      return {
        ...state,
        cities: state.cities.map((city) =>
          city.name === action.payload ? { ...city, incorrect: true } : city
        ),
      };
    case "subtract_mistake":
      return {
        ...state,
        mistakes: state.mistakes - 1,
      };
    case "subtract_time":
      return {
        ...state,
        time: state.time - 1,
      };
    default:
      throw Error("appReducer: Unknown action type.");
  }
}

function useAppReducer() {
  return useReducer(reducer, initialState);
}

export default useAppReducer;
