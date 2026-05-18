export enum DocumentType {
  DNI = "dni",
  RUC = "ruc",
  CE = "ce",
  PASSPORT = "pasaporte",
}

export const DocumentTypeLabel: Record<DocumentType, string> = {
  [DocumentType.DNI]: "DNI - Documento Nacional",
  [DocumentType.RUC]: "RUC",
  [DocumentType.CE]: "Carnet de Extranjería",
  [DocumentType.PASSPORT]: "Pasaporte",
};
