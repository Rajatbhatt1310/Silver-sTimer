import {
  createContext,
  useContext,
  useState,
} from "react";

import useTimer from "../hooks/useTimer";


const TimerContext = createContext(null);


export function TimerProvider({ children }) {
  const timer = useTimer();

  // Planner task currently attached to
  // the next/running focus session.
  const [activeTask, setActiveTask] =
    useState(null);


  function selectTask(task) {
    setActiveTask(task);
  }


  function clearActiveTask() {
    setActiveTask(null);
  }


  const value = {
    ...timer,

    activeTask,
    selectTask,
    clearActiveTask,
  };


  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
}


export function useTimerContext() {
  const context =
    useContext(TimerContext);

  if (!context) {
    throw new Error(
      "useTimerContext must be used inside TimerProvider"
    );
  }

  return context;
}