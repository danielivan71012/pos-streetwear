# POS Streetwear API

Backend API para el proyecto POS Streetwear con Node.js, Express y SQL Server.

## Setup

1. Instala dependencias en `backend/`:

```powershell
cd backend
npm.cmd install
```

2. Copia `backend/.env.example` a `backend/.env` y configura valores reales.

3. Inicia la API:

```powershell
npm.cmd run dev
```

## Variables de entorno

Archivo: `backend/.env`

- `PORT`
- `DB_SERVER`
- `DB_DATABASE`
- `DB_USER`
- `DB_PASSWORD`
- `DB_ENCRYPT`
- `DB_TRUST_SERVER_CERT`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `AES_KEY_BASE64`

Para generar `AES_KEY_BASE64`:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Endpoints principales

- `GET /health`
- `GET /db-test`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `GET /api/v1/vendedores`
- `GET /api/v1/vendedores/:id`
- `POST|PUT|DELETE /api/v1/vendedores` y `PATCH /api/v1/vendedores/:id/telefono` requieren `Administrador`
- `GET /api/v1/productos`
- `GET /api/v1/productos/:id`
- `POST|PUT|DELETE /api/v1/productos` requieren `Administrador`
- `GET /api/v1/inventario` requiere autenticación
- `PATCH /api/v1/inventario/:idProducto` requiere `Administrador`
- `POST /api/v1/pedidos` requiere autenticación

## Avance 3 implementado

### Pedidos con transacción

- `POST /api/v1/pedidos` crea ventas atómicas en `Ventas_Pedidos` y `Detalle_Ventas`.
- Si falla una validación, el stock es insuficiente o el decremento concurrente no afecta filas, la transacción hace rollback completo.
- Items duplicados del mismo producto se consolidan antes de calcular total y descontar stock.

Request ejemplo:

```json
{
  "Metodo_Pago": "Tarjeta",
  "items": [
    { "ID_Producto": 1, "Cantidad": 2 },
    { "ID_Producto": 1, "Cantidad": 1 },
    { "ID_Producto": 4, "Cantidad": 1 }
  ]
}
```

### AES para teléfono

- `PATCH /api/v1/vendedores/:id/telefono`
- Body esperado:

```json
{
  "Telefono": "6641234567"
}
```

- El valor se guarda cifrado en `Telefono_Enc` con `AES-256-GCM`.
- La API no expone el ciphertext en la respuesta.

### Hardening

- Los inputs de texto persistidos en vendedores y productos usan `trim()` y `escape()` con `express-validator`.
- Los endpoints mutating de vendedores y productos quedaron protegidos por JWT + RBAC.
- Se agregó un `404` JSON consistente para rutas o métodos inexistentes.

## Seguridad

### SQL Injection

- Knex parametriza automáticamente operaciones como `where`, `insert`, `update` y `delete`.
- Evita concatenar strings SQL manualmente.
- Si necesitas `raw`, usa bindings parametrizados en lugar de interpolación directa.

### XSS

- Nombres, modelos, tallas y emails se sanean con `trim()` y `escape()`.
- Las validaciones rechazan payloads inválidos antes de persistirlos.

## Checklist Postman

- Login con usuario administrador y guardar el token.
- Login con usuario vendedor y guardar el token.
- Crear pedido válido y confirmar `201`, `ID_Venta`, `Total_Venta` y stock actualizado.
- Probar rollback con stock insuficiente y confirmar que no quede venta creada ni stock descontado.
- Probar RBAC con token de vendedor en:
  - `POST /api/v1/vendedores`
  - `PUT /api/v1/vendedores/:id`
  - `DELETE /api/v1/vendedores/:id`
  - `PATCH /api/v1/vendedores/:id/telefono`
  - `POST /api/v1/productos`
  - `PUT /api/v1/productos/:id`
  - `DELETE /api/v1/productos/:id`
  - `PATCH /api/v1/inventario/:idProducto`
- Probar XSS enviando `<script>alert(1)</script>` en `Nombre_Completo` o `Nombre_Modelo` y verificar saneamiento.
- Probar `POST /api/v1/pedidos` sin token y esperar `401`.
- Probar una ruta inválida y esperar `404` JSON.
