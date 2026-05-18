import type { PesajeResponseDto } from "../http/weighing-api.service";
import { Weight } from "../../domain/value-objects/weight";
import { CargoCategory } from "../../domain/enums/cargo-category.enum";

/**
 * Resultado del pesaje en el dominio
 * Representa los datos calculados y procesados del pesaje
 */
export interface WeighingResult {
  packageId: string;
  weight: Weight;
  volumeM3: number;
  volumetricWeight: number;
  chargeableWeight: number;
  cargoCategory: CargoCategory;
  shippingPrice: number;
  alerts: string[];
}

/**
 * Mapper para transformar DTOs de pesaje del API a objetos de dominio
 * 
 * Basado en SPEC-FE-002
 */
export class WeighingMapper {
  /**
   * Transforma la respuesta del API de pesaje a un resultado de dominio
   * @param dto DTO de respuesta del backend
   * @returns Resultado de pesaje en el dominio
   */
  static toDomain(dto: PesajeResponseDto): WeighingResult {
    return {
      packageId: dto.paqueteId,
      weight: Weight.create(dto.peso),
      volumeM3: dto.volumenM3,
      volumetricWeight: dto.pesoVolumetrico,
      chargeableWeight: dto.pesoFacturable,
      cargoCategory: this.mapCargoCategory(dto.categoriaCarga),
      shippingPrice: dto.precioEnvio,
      alerts: dto.alertas || [],
    };
  }

  /**
   * Mapea la categoría de carga del DTO al enum de dominio
   * @param categoria Categoría del DTO
   * @returns Categoría del dominio
   */
  private static mapCargoCategory(
    categoria: "NORMAL" | "CARGA_ESPECIAL"
  ): CargoCategory {
    return categoria === "CARGA_ESPECIAL"
      ? CargoCategory.SPECIAL
      : CargoCategory.NORMAL;
  }
}
