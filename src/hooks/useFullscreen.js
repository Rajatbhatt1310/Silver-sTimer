import { useEffect, useState } from "react";

export default function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  async function enterFullscreen(element = document.documentElement) {
    if (!document.fullscreenElement) {
      await element.requestFullscreen();
    }
  }

  async function exitFullscreen() {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
  }

  useEffect(() => {
    function handleChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener(
      "fullscreenchange",
      handleChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleChange
      );
  }, []);

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
  };
}