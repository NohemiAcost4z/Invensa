'use client';
import { createContext, useContext, useState } from 'react';

const useEstadoNavBarContext = createContext(null);

function EstadoNavBarProvider({ children }) {
  const [rutaActiva, setRutaActiva] = useState('/');
  return (
    <useEstadoNavBarContext.Provider value={{ rutaActiva, setRutaActiva }}>
      {children}
    </useEstadoNavBarContext.Provider>
  );
}

function useEstadoNavBar() {
  return useContext(useEstadoNavBarContext);
}

export { EstadoNavBarProvider, useEstadoNavBar };
