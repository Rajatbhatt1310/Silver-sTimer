import { useEffect } from "react";

export default function useBeforeUnload(active) {
  useEffect(() => {
    if (!active) return;

    function handler(e) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handler);

    return () =>
      window.removeEventListener(
        "beforeunload",
        handler
      );
  }, [active]);
}