# SPEC-FE-002: Integración Endpoint de Pesaje de Paquetes

## 1. Endpoint del Backend

**URL:** `POST /api/paquetes/pesaje`

**Método:** `POST`

**Descripción:** Procesa el pesaje y dimensiones de un paquete existente. Calcula peso volumétrico, peso facturable, categoría de carga, precio de envío y genera alertas si aplica.

**Códigos de Respuesta:**
- `200 OK` - Pesaje procesado exitosamente con precio calculado
- `400 Bad Request` - Error de validación en los datos de pesaje
- `500 Internal Server Error` - Error interno del servidor

---

## 2. Payload Esperado (Request DTO)

```typescript
interface PesajeRequest {
  paqueteId: string;              // UUID del paquete a procesar (requerido)
  peso: number;                   // Peso real en kg (requerido, 0.01 - 70.0)
  largoCm: number;                // Largo en cm (requerido, > 0.01)
  anchoCm: number;                // Ancho en cm (requerido, > 0.01)
  altoCm: number;                 // Alto en cm (requerido, > 0.01)
  tipoMercancia: TipoMercancia;   // ESTANDAR | FRAGIL | PELIGROSO (requerido)
  formaIrregular: boolean;        // Indica si tiene forma irregular (requerido)
  tarifaBase: number;             // Tarifa base en soles (requerido, >= 0)
  tarifaPorKg: number;            // Tarifa por kg en soles (requerido, >= 0)
  tarifaPorKm: number;            // Tarifa por km en soles (requerido, >= 0)
  recargoTipoMercancia: number;   // Recargo por tipo en soles (requerido, >= 0)
  recargoCategoriaCarga: number;  // Recargo por categoría en soles (requerido, >= 0)
}
```

---

## 3. Respuesta Esperada (Response DTO)

```typescript
interface PesajeResponse {
  paqueteId: string;              // UUID del paquete pesado
  peso: number;                   // Peso real del paquete en kg
  volumenM3: number;              // Volumen calculado en m³
  pesoVolumetrico: number;        // Peso volumétrico calculado (Volumen × 250 kg/m³)
  pesoFacturable: number;         // Peso facturable = MAX(peso real, peso volumétrico)
  categoriaCarga: CategoriaCarga; // NORMAL | CARGA_ESPECIAL
  precioEnvio: number;            // Precio total calculado del envío
  alertas: string[];              // Lista de alertas generadas:
                                  // - "CARGA_ESPECIAL: El paquete requiere manejo especial por peso o volumen"
                                  // - "DENSIDAD_ATIPICA: Verificar el peso y dimensiones del paquete"
}
```

---

## 4. Reglas de Negocio y Validaciones

### 4.1 Validaciones de Entrada (Frontend + Backend)

**Peso (FR-001):**
- ✅ Requerido
- ✅ Debe ser mayor a 0.01 kg
- ✅ No puede exceder 70 kg
- ❌ Rechazar si es null, undefined, <= 0 o > 70

**Dimensiones (FR-003):**
- ✅ Largo, Ancho y Alto son requeridos
- ✅ Cada dimensión debe ser mayor a 0.01 cm
- ❌ Rechazar si alguna dimensión es null, undefined o <= 0

**Tipo de Mercancía:**
- ✅ Requerido
- ✅ Valores válidos: `"estandar"`, `"fragil"`, `"peligroso"`

**Forma Irregular:**
- ✅ Requerido (boolean)

**Tarifas:**
- ✅ Todas las tarifas son requeridas
- ✅ Deben ser >= 0
- ❌ Rechazar valores negativos

**ID del Paquete:**
- ✅ Requerido
- ✅ Debe ser un UUID válido
- ❌ Rechazar si no es un UUID válido

### 4.2 Cálculos Realizados por el Backend (FR-004, FR-005, FR-006)

**Volumen (FR-004):**
```
Volumen (m³) = (Largo × Ancho × Alto) / 1,000,000
```

**Peso Volumétrico (FR-005):**
```
Peso Volumétrico (kg) = Volumen (m³) × 250
```

**Peso Facturable (FR-006):**
```
Peso Facturable = MAX(Peso Real, Peso Volumétrico)
```

**Categoría de Carga (FR-002, FR-007):**
- `CARGA_ESPECIAL` si:
  - Peso > 50 kg Y Peso ≤ 70 kg, O
  - Volumen > 0.5 m³ Y Volumen ≤ 0.7 m³
- `NORMAL` en otros casos
- ⚠️ Nota: Peso > 70 kg o Volumen > 0.7 m³ deben ser rechazados

**Cálculo de Precio:**
```
Precio = Tarifa Base 
       + (Peso Facturable × Tarifa Por Kg) 
       + (Distancia Estimada × Tarifa Por Km) 
       + Recargo Tipo Mercancía 
       + Recargo Categoría Carga
```

### 4.3 Alertas Generadas

**Alerta Carga Especial:**
- Se genera cuando la categoría es `CARGA_ESPECIAL`
- Mensaje: `"CARGA_ESPECIAL: El paquete requiere manejo especial por peso o volumen"`

**Alerta Densidad Atípica:**
- Se genera cuando la diferencia entre peso real y peso volumétrico > 30%
- Fórmula: `|Peso Real - Peso Volumétrico| / Peso Real > 0.3`
- Mensaje: `"DENSIDAD_ATIPICA: Verificar el peso y dimensiones del paquete"`

---

## 5. Integración Propuesta en Frontend

### 5.1 Arquitectura Hexagonal

**Capa de Dominio:**
- ✅ `WeighingValidator` - Validador de datos de pesaje
- ✅ Value Objects: `Weight`, `Dimensions` (ya existen)

**Capa de Infraestructura:**
- ✅ `WeighingApiService` - Servicio HTTP para POST /api/paquetes/pesaje
- ✅ `PackageMapper` - Actualizar mapper existente para transformaciones de pesaje

**Capa de Aplicación:**
- ✅ `PackageRepository` - Agregar método `weighPackage()`

### 5.2 Flujo de Integración

1. Usuario ingresa datos de pesaje en el formulario
2. `WeighingValidator` valida los datos en el cliente
3. Si válido → `PackageRepository.weighPackage()` envía request
4. `WeighingApiService` hace POST a `/api/paquetes/pesaje`
5. Backend procesa, calcula y retorna `PesajeResponse`
6. `PackageMapper` transforma DTO → Entidad de dominio
7. UI muestra resultados: precio, alertas, categoría

---

## 6. Puntos Clave para Implementación

- ⚠️ **Diferencia con Admisión**: En admisión, peso/dimensiones son opcionales. En pesaje, son REQUERIDOS.
- ⚠️ **Tarifas**: El frontend debe proveer todas las tarifas. Considerar si vienen de configuración o estado global.
- ✅ **Reutilización**: Los value objects `Weight` y `Dimensions` ya existen, se pueden reutilizar.
- ✅ **Alertas**: Mostrar prominentemente las alertas al usuario (especialmente CARGA_ESPECIAL).
- ✅ **Precio**: El precio calculado debe mostrarse claramente antes de confirmar el pesaje.

---

**Estado del Análisis:** ✅ Completo y listo para implementación
