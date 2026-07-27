import { createContext, useContext, useState } from "react";

const NavigationGuardContext = createContext(null);

export function NavigationGuardProvider({ children }) {
  const [pendingRoute, setPendingRoute] = useState(null);

  const [showModal, setShowModal] = useState(false);

  return (
    <NavigationGuardContext.Provider
      value={{
        pendingRoute,
        setPendingRoute,

        showModal,
        setShowModal,
      }}
    >
      {children}
    </NavigationGuardContext.Provider>
  );
}

export function useNavigationGuard() {
  return useContext(NavigationGuardContext);
}