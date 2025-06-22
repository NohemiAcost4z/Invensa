'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const useEstadoAppContext = createContext(null);

function EstadoAppContextProvider({ children }) {
  const [rutaActiva, setRutaActiva] = useState('/');
  const [usuario, setUsuario] = useState();

  useEffect(() => {
    fetch('api/sesion').then(async (res) => {
      const usuario = await res.json();
      setUsuario(usuario);
    });
  }, []);

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
