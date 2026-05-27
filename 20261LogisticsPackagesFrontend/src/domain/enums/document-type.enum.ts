export enum DocumentType {
  CEDULA_CIUDADANIA = "CEDULA_CIUDADANIA",
  CEDULA_EXTRANJERIA = "CEDULA_EXTRANJERIA",
  PASAPORTE = "PASAPORTE",
  NIT = "NIT",
}

export const DocumentTypeLabel: Record<DocumentType, string> = {
  [DocumentType.CEDULA_CIUDADANIA]: "Cédula de Ciudadanía",
  [DocumentType.CEDULA_EXTRANJERIA]: "Cédula de Extranjería",
  [DocumentType.PASAPORTE]: "Pasaporte",
  [DocumentType.NIT]: "NIT",
};
