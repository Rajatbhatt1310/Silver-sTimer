import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const FocusModeContext = createContext(null);

export function FocusModeProvider({ children }) {
  const [isFocusMode, setIsFocusMode] = useState(false);

  async function enterFocusMode() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function exitFocusMode() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFocusMode(Boolean(document.fullscreenElement));
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  }, []);

  return (
    <FocusModeContext.Provider
      value={{
        isFocusMode,
        enterFocusMode,
        exitFocusMode,
      }}
    >
      {children}
    </FocusModeContext.Provider>
  );
}

export function useFocusMode() {
  const context = useContext(FocusModeContext);

  if (!context) {
    throw new Error(
      "useFocusMode must be used inside FocusModeProvider"
    );
  }

  return context;
}