import React, { createContext, useContext, useState, ReactNode } from "react";

/**
 * Contexto global para el flujo de admisión de paquetes (FE-1)
 * 
 * Persiste el estado entre AdmissionPage → WeighingPage:
 * - paqueteId: ID generado por el backend tras POST /api/paquetes/admision
 * - etiquetaDigital: Etiqueta única del paquete (ej: PK-xxxxx)
 * - estadoGps: PENDIENTE o RESUELTO (para mostrar/ocultar panel de coordenadas manuales)
 * - estado: Estado actual del paquete (ej: RECIBIDO_EN_SEDE)
 * - sedeId: ID de la sede donde se registra el paquete
 */

interface AdmissionContextType {
  paqueteId: string | null;
  etiquetaDigital: string | null;
  estadoGps: "PENDIENTE" | "RESUELTO" | null;
  estado: string | null;
  sedeId: string | null;
  remitenteNombre: string | null;
  destinatarioNombre: string | null;
  direccionDestinoTexto: string | null;
  setPaqueteId: (id: string) => void;
  setEtiquetaDigital: (etiqueta: string) => void;
  setEstadoGps: (estado: "PENDIENTE" | "RESUELTO") => void;
  setEstado: (estado: string) => void;
  setSedeId: (id: string) => void;
  setRemitenteNombre: (nombre: string) => void;
  setDestinatarioNombre: (nombre: string) => void;
  setDireccionDestinoTexto: (direccion: string) => void;
  clearAdmission: () => void;
}

const AdmissionContext = createContext<AdmissionContextType | undefined>(
  undefined
);

export function AdmissionProvider({ children }: { children: ReactNode }) {
  const [paqueteId, setPaqueteId] = useState<string | null>(null);
  const [etiquetaDigital, setEtiquetaDigital] = useState<string | null>(null);
  const [estadoGps, setEstadoGps] = useState<"PENDIENTE" | "RESUELTO" | null>(
    null
  );
  const [estado, setEstado] = useState<string | null>(null);
  const [sedeId, setSedeId] = useState<string | null>(null);
  const [remitenteNombre, setRemitenteNombre] = useState<string | null>(null);
  const [destinatarioNombre, setDestinatarioNombre] = useState<string | null>(null);
  const [direccionDestinoTexto, setDireccionDestinoTexto] = useState<string | null>(null);

  const clearAdmission = () => {
    setPaqueteId(null);
    setEtiquetaDigital(null);
    setEstadoGps(null);
    setEstado(null);
    setSedeId(null);
    setRemitenteNombre(null);
    setDestinatarioNombre(null);
    setDireccionDestinoTexto(null);
  };

  return (
    <AdmissionContext.Provider
      value={{
        paqueteId,
        etiquetaDigital,
        estadoGps,
        estado,
        sedeId,
        remitenteNombre,
        destinatarioNombre,
        direccionDestinoTexto,
        setPaqueteId,
        setEtiquetaDigital,
        setEstadoGps,
        setEstado,
        setSedeId,
        setRemitenteNombre,
        setDestinatarioNombre,
        setDireccionDestinoTexto,
        clearAdmission,
      }}
    >
      {children}
    </AdmissionContext.Provider>
  );
}

export function useAdmission() {
  const context = useContext(AdmissionContext);
  if (!context) {
    throw new Error("useAdmission debe ser usado dentro de AdmissionProvider");
  }
  return context;
}
