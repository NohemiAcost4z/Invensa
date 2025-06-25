'use client';
import { createContext, useContext, useState } from 'react';

const useEstadoAppContext = createContext(null);

function EstadoAppContextProvider({ children }) {
  const [rutaActiva, setRutaActiva] = useState('/');
  const [usuario, setUsuario] = useState();

  return (
    <useEstadoAppContext.Provider
      value={{ rutaActiva, usuario, setRutaActiva, setUsuario }}
    >
      {children}
    </useEstadoAppContext.Provider>
  );
}

function useEstadoApp() {
  return useContext(useEstadoAppContext);
}

export { EstadoAppContextProvider, useEstadoApp };
