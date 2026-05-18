# Feature Specification: Integración Endpoint de Admisión (SPEC-FE-001)

**Created**: 2026-05-17  
**Status**: Draft  
**Priority**: P0 (Critical)  
**Backend Dependency**: MOD1-UC-001 (Registrar Admisión de Paquete)

---

## Resumen Ejecutivo

Implementar la integración completa entre el frontend y el endpoint `POST /api/paquetes/admision` del backend, incluyendo validaciones estrictas previas al envío, mapeo correcto de datos, manejo robusto de errores y actualización del estado local tras el registro exitoso.

**Contexto**: Actualmente el `PackageApiRepository` envía datos mock o incompletos al backend. Esta feature corrige la integración para cumplir con los requerimientos del backend y las especificaciones del MOD1-UC-001.

---

## User Stories

### User Story 1 — Validación de Datos Antes del Envío (P0)

**Como** Empleado de Envío y Recepción,  
**Necesito** que el sistema valide todos los campos obligatorios antes de enviar la solicitud al servidor,  
**Para** evitar errores de red innecesarios y recibir feedback inmediato sobre datos faltantes o inválidos.

**Criterios de Aceptación**:

1. **Validación de Remitente**:
   - Tipo de documento: Requerido (debe ser uno de: dni, ruc, ce, pasaporte)
   - Número de documento: Requerido, alfanumérico, longitud entre 8-15 caracteres
   - Nombre completo: Requerido, mínimo 3 caracteres
   - Teléfono: Requerido, formato numérico, 9-15 dígitos

2. **Validación de Destinatario**:
   - Tipo de documento: Requerido (debe ser uno de: dni, ruc, ce, pasaporte)
   - Número de documento: Requerido, alfanumérico, longitud entre 8-15 caracteres
   - Nombre completo: Requerido, mínimo 3 caracteres
   - Teléfono: Requerido, formato numérico, 9-15 dígitos
   - Email: Requerido, formato válido de email
   - Dirección: Requerida, mínimo 10 caracteres

3. **Validación de Datos del Paquete**:
   - Tipo de mercancía: Requerido (ESTANDAR | FRAGIL | PELIGROSO)
   - Valor declarado: Requerido, numérico, mayor a 0
   - Método de pago: Requerido (PREPAGO | CONTRA_ENTREGA)
   - Peso: Requerido, rango 0.01 - 70 kg
   - Dimensiones (largo, ancho, alto): Requeridas, todas > 0 cm
   - Indicador forma irregular: Requerido (boolean)
   - SedeId: Requerido, formato UUID válido

4. **Feedback Inmediato**:
   - Si algún campo falla la validación, mostrar mensaje específico al usuario
   - No realizar la petición HTTP hasta que todos los campos sean válidos
   - Resaltar visualmente los campos con errores

### User Story 2 — Mapeo Correcto de Datos Backend (P0)

**Como** Desarrollador,  
**Necesito** mapear correctamente las entidades de dominio del frontend a los DTOs que espera el backend,  
**Para** garantizar que el servidor pueda procesar exitosamente la petición.

**Criterios de Aceptación**:

1. **Mapeo de Tipos de Documento**:
   ```
   Frontend → Backend
   dni → CEDULA_CIUDADANIA
   ruc → NIT
   ce → CEDULA_EXTRANJERIA
   pasaporte → PASAPORTE
   ```

2. **Mapeo de Tipos de Mercancía**:
   ```
   Frontend → Backend
   estandar → ESTANDAR
   fragil → FRAGIL
   peligroso → PELIGROSO
   ```

3. **Mapeo de Métodos de Pago**:
   ```
   Frontend → Backend
   efectivo → PREPAGO
   tarjeta → PREPAGO
   transferencia → CONTRA_ENTREGA
   yape → PREPAGO
   ```

4. **Estructura de Direccion**:
   - Parsear la dirección del destinatario en componentes: direccion, ciudad, departamento, pais
   - Si no se puede parsear, usar valores por defecto: pais="Colombia", departamento=""
   - Aplicar la misma estructura para direccionDestino

5. **Estructura de Persona (Remitente y Destinatario)**:
   - Incluir todos los campos requeridos por el backend
   - Para remitente.correoElectronico: usar string vacío si no está disponible
   - Para remitente.direccion: usar misma dirección que direccionDestino

### User Story 3 — Manejo Robusto de Errores (P0)

**Como** Empleado de Envío y Recepción,  
**Necesito** recibir mensajes claros cuando ocurre un error en el registro,  
**Para** poder corregir el problema y completar la admisión del paquete.

**Criterios de Aceptación**:

1. **Error de Validación del Backend (400)**:
   - Parsear el array `errores` de la respuesta
   - Mostrar cada error por campo de forma específica
   - Ejemplo: "El peso debe estar entre 0.01 y 70 kg"

2. **Error de Servidor (500)**:
   - Mostrar mensaje genérico: "Error interno del servidor. Intente nuevamente."
   - Registrar el error completo en console para debugging

3. **Error de Red / Timeout**:
   - Mostrar: "No se pudo conectar con el servidor. Verifique su conexión."
   - Permitir reintento manual

4. **Error de Autorización (401/403)**:
   - Redirigir automáticamente al login
   - Mostrar: "Su sesión ha expirado. Por favor, inicie sesión nuevamente."

5. **Estructura de Error del Backend**:
   ```typescript
   interface ApiErrorResponse {
     timestamp: string;
     status: number;
     codigo: string;
     mensaje: string;
     errores?: Array<{
       campo: string;
       mensaje: string;
     }>;
   }
   ```

### User Story 4 — Actualización del Estado Local (P0)

**Como** Sistema,  
**Necesito** actualizar el estado local con los datos retornados por el servidor,  
**Para** mantener sincronización entre el frontend y el backend.

**Criterios de Aceptación**:

1. **Respuesta Exitosa**:
   - El backend retorna: `{ paqueteId: UUID }`
   - Actualizar el Package en el repositorio local con el ID real del backend
   - Limpiar cualquier flag de "pendiente de envío"

2. **Navegación Post-Registro**:
   - Tras registro exitoso, mostrar mensaje de éxito
   - Opcional: Redirigir a la página de detalles del paquete
   - Opcional: Permitir imprimir etiqueta digital (solo visualización interna)

---

## Technical Requirements

### TR-001: Crear Servicio de Admisión

Crear archivo: `src/infrastructure/api/admission.api.ts`

```typescript
export interface AdmissionRequest {
  sedeId: string;
  direccionDestino: {
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
  };
  valorDeclarado: number;
  metodoPago: string; // PREPAGO | CONTRA_ENTREGA
  remitente: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico: string;
    direccion: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  destinatario: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico: string;
    direccion: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  tipoMercancia: string; // ESTANDAR | FRAGIL | PELIGROSO
  indicadorFormaIrregular: boolean;
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
}

export interface AdmissionResponse {
  paqueteId: string;
}

export class AdmissionApiService {
  async registerAdmission(request: AdmissionRequest): Promise<AdmissionResponse>;
}
```

### TR-002: Actualizar PackageRepository

Modificar: `src/infrastructure/repositories/api/package.repository.api.ts`

- Remover lógica de envío mock en el método `update()`
- Implementar método `registerAdmission()` que use el nuevo servicio
- Eliminar el flag `ships` (ya no es necesario)
- Usar el mapper mejorado para convertir Package → AdmissionRequest

### TR-003: Mejorar PackageMapper

Actualizar: `src/infrastructure/mappers/package.mapper.ts`

- Mejorar método `domainToAdmissionRequest()`:
  - Validar que todos los campos requeridos existan antes de mapear
  - Parsear correctamente la dirección del destinatario
  - Mapear correctamente todos los enums
  - Lanzar error descriptivo si falta algún campo crítico

### TR-004: Validaciones de Entrada

Crear: `src/domain/validators/admission.validator.ts`

```typescript
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export class AdmissionValidator {
  static validate(pkg: Package): ValidationResult;
  private static validateSender(sender: Sender): string[];
  private static validateRecipient(recipient: Recipient): string[];
  private static validatePackageData(pkg: Package): string[];
}
```

### TR-005: Mejorar Manejo de Errores

Actualizar: `src/infrastructure/api/http-client.ts`

- Mejorar función `parseApiError()` para incluir errores de campo específicos
- Agregar tipos para errores estructurados
- Exportar utilidades para verificar tipos de error

---

## Testing Strategy

### Unit Tests

1. **AdmissionValidator.test.ts**:
   - ✓ Rechaza paquete sin remitente
   - ✓ Rechaza paquete sin destinatario
   - ✓ Rechaza peso fuera de rango (< 0.01 o > 70)
   - ✓ Rechaza dimensiones ≤ 0
   - ✓ Rechaza valor declarado ≤ 0
   - ✓ Acepta paquete válido completo

2. **PackageMapper.test.ts**:
   - ✓ Mapea correctamente todos los tipos de documento
   - ✓ Mapea correctamente todos los tipos de mercancía
   - ✓ Mapea correctamente todos los métodos de pago
   - ✓ Parsea dirección compleja correctamente
   - ✓ Lanza error si faltan campos críticos

### Integration Tests

3. **AdmissionApiService.test.ts**:
   - ✓ Envía request correcto al endpoint
   - ✓ Incluye token de autorización en headers
   - ✓ Parsea response 200 correctamente
   - ✓ Maneja error 400 con errores de validación
   - ✓ Maneja error 500 correctamente
   - ✓ Maneja timeout/error de red

### E2E Tests (Manual o Automatizado)

4. **Flujo Completo de Admisión**:
   - Llenar formulario de admisión con datos válidos
   - Verificar que no se envía request si hay campos inválidos
   - Verificar envío exitoso al backend
   - Verificar que se recibe paqueteId del servidor
   - Verificar actualización del estado local

---

## Acceptance Criteria

- [ ] **AC-001**: El sistema valida todos los campos obligatorios antes de enviar la petición HTTP
- [ ] **AC-002**: El sistema muestra mensajes de error específicos por campo cuando la validación falla
- [ ] **AC-003**: El sistema mapea correctamente todos los enums (documento, mercancía, pago) del frontend al backend
- [ ] **AC-004**: El sistema parsea correctamente la dirección del destinatario en sus componentes
- [ ] **AC-005**: El sistema envía la petición HTTP con la estructura exacta que espera el backend
- [ ] **AC-006**: El sistema maneja correctamente errores 400 mostrando mensajes específicos por campo
- [ ] **AC-007**: El sistema maneja correctamente errores 500 y de red con mensajes apropiados
- [ ] **AC-008**: El sistema actualiza el estado local con el paqueteId retornado por el backend
- [ ] **AC-009**: El sistema NO envía datos mock o hardcodeados (sedeId debe ser configurable)
- [ ] **AC-010**: El sistema incluye el token de autorización en todas las peticiones

---

## Success Metrics

- **SM-001**: 100% de las admisiones con datos válidos se registran exitosamente en el backend
- **SM-002**: 0% de peticiones HTTP fallidas por datos mal formateados (después de validación)
- **SM-003**: Tiempo de respuesta promedio del flujo completo < 2 segundos
- **SM-004**: 100% de los errores del backend se traducen a mensajes comprensibles para el usuario

---

## Dependencies

### Backend Dependencies
- ✅ Endpoint `POST /api/paquetes/admision` implementado y desplegado
- ✅ DTO `RegistroAdmisionRequest` documentado y estable
- ✅ DTO `RegistroAdmisionResponse` documentado y estable

### Frontend Dependencies
- ✅ Axios configurado con interceptores
- ✅ Entidades de dominio (Package, Sender, Recipient) implementadas
- ✅ PackageMapper base implementado
- ⚠️ Validador de admisión (se implementará en esta feature)
- ⚠️ Servicio de API de admisión (se implementará en esta feature)

---

## Implementation Plan

### Paso 1: Crear Validador (Estimado: 1 hora)
- Archivo: `src/domain/validators/admission.validator.ts`
- Implementar todas las validaciones especificadas en US-1

### Paso 2: Crear Servicio de API (Estimado: 1 hora)
- Archivo: `src/infrastructure/api/admission.api.ts`
- Implementar `AdmissionApiService.registerAdmission()`
- Incluir manejo de errores básico

### Paso 3: Mejorar Mapper (Estimado: 1 hora)
- Archivo: `src/infrastructure/mappers/package.mapper.ts`
- Mejorar `domainToAdmissionRequest()` con validaciones y parseo correcto

### Paso 4: Actualizar Repositorio (Estimado: 1 hora)
- Archivo: `src/infrastructure/repositories/api/package.repository.api.ts`
- Integrar el nuevo servicio y validador
- Remover lógica mock

### Paso 5: Mejorar Manejo de Errores (Estimado: 30 min)
- Archivo: `src/infrastructure/api/http-client.ts`
- Mejorar `parseApiError()` con tipos estructurados

### Paso 6: Testing (Estimado: 2 horas)
- Implementar unit tests
- Implementar integration tests
- Realizar pruebas manuales E2E

### Paso 7: Commit (Estimado: 15 min)
- Mensaje: `feat: integrate admission endpoint with validation`
- Descripción detallada de cambios en el commit body

**Tiempo Total Estimado**: 7 horas

---

## Edge Cases & Considerations

### EC-001: SedeId Hardcodeado
**Problema**: Actualmente el sedeId está hardcodeado en el repositorio.  
**Solución**: Crear configuración de sede o permitir selección de sede en el formulario.  
**Para esta feature**: Usar variable de entorno `VITE_DEFAULT_SEDE_ID` temporalmente.

### EC-002: Dirección Sin Parseo
**Problema**: El usuario puede ingresar dirección en formato libre.  
**Solución**: Para esta feature, asumir formato "Calle, Ciudad" y usar valores por defecto para departamento/país.  
**Mejora futura**: Implementar selector de ciudad/departamento en el formulario.

### EC-003: Correo del Remitente
**Problema**: El backend requiere correoElectronico para remitente pero el frontend no lo captura.  
**Solución**: Enviar string vacío como está actualmente en el mapper.  
**Mejora futura**: Agregar campo opcional de email en formulario de remitente.

### EC-004: Indicador Forma Irregular
**Problema**: Actualmente siempre se envía `false`.  
**Solución**: Agregar toggle en el formulario de admisión.  
**Para esta feature**: Mantener valor por defecto `false` en el mapper.

---

## Security Considerations

- **SEC-001**: Validar que el token JWT esté presente antes de enviar la petición
- **SEC-002**: No almacenar información sensible en localStorage (solo el token)
- **SEC-003**: Sanitizar entradas de usuario antes de enviar al backend
- **SEC-004**: Implementar rate limiting en el frontend para prevenir spam (opcional)

---

## Documentation Updates

- [ ] Actualizar README.md con instrucciones de configuración de VITE_DEFAULT_SEDE_ID
- [ ] Documentar estructura de errores en docs/api-errors.md
- [ ] Agregar ejemplos de uso del validador en docs/examples/admission.md

---

## Rollback Plan

Si esta feature causa problemas críticos:

1. Revertir commit: `git revert <commit-hash>`
2. El sistema volverá a usar la lógica anterior (mock)
3. Los datos locales no se verán afectados (cache local)

---

## Questions & Clarifications

- ❓ ¿Debe el frontend validar que el sedeId existe antes de enviar?
- ❓ ¿Debe mostrar confirmación antes de enviar o enviar automáticamente al hacer submit?
- ❓ ¿Debe limpiar el formulario tras registro exitoso o mantener datos para nuevo registro?
- ❓ ¿Necesitamos implementar validación de cobertura de dirección en esta feature?

---

**Prepared by**: Cline (AI Senior Full-Stack Developer)  
**Review requested from**: Juan Rivera (Product Owner)  
**Estimated completion**: 1 día de desarrollo + testing
