/**
 * Validador y tipos para el servicio de pesaje (SPEC-FE-002)
 * Define la interfaz WeighingData que se usa para procesar pesajes de paquetes
 */

export interface WeighingData {
  paqueteId: string;
  peso: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  tipoMercancia: string;
  formaIrregular: boolean;
}
