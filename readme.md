# SHOPCAR
### Sistema de gestión de comercio electrónico

SHOPCAR es un proyecto de comercio electrónico desarrollado con una arquitectura basada en SQL Server y Node.js con TypeScript. Su objetivo es administrar los procesos principales de una tienda en línea, incluyendo seguridad, catálogo de productos, inventario, compras, promociones, ventas, logística y auditoría.

## Tecnologías utilizadas

### Backend
- Node.js 24+
- TypeScript
- Express 5
- Microsoft SQL Server
- Driver `mssql`
- Autenticación mediante JWT
- Hash de contraseñas con bcrypt
- Variables de entorno mediante dotenv

### Base de datos
- Microsoft SQL Server 2019+
- Procedimientos almacenados
- Claves primarias y foráneas
- Restricciones CHECK y UNIQUE
- Índices y controles de integridad

## Arquitectura

El backend utiliza una arquitectura por capas:

- **Config:** configuración de conexiones y seguridad.
- **Controllers:** recepción y respuesta de solicitudes HTTP.
- **Middlewares:** autenticación y controles de acceso.
- **Repositories:** comunicación con SQL Server.
- **Services:** lógica de negocio.
- **Routes:** definición de endpoints.
- **Utils:** funciones auxiliares.

El acceso a la base de datos se realiza mediante procedimientos almacenados, evitando el uso de ORM.

## Módulos del sistema

1. Seguridad y autenticación.
2. Catálogo de productos.
3. Gestión de inventario.
4. Carritos de compra.
5. Promociones y cupones.
6. Checkout, pedidos y pagos.
7. Logística y devoluciones.
8. Reportes.
9. Auditoría.

**Estado del desarrollo:** los módulos se encuentran en distintas etapas de implementación. La autenticación y gestión de sesiones han sido probadas; el resto de funcionalidades debe verificarse conforme se complete su integración con el backend.

## Requisitos previos

- Node.js 24 o superior.
- Microsoft SQL Server 2019 o superior.
- SQL Server Management Studio.
- ODBC Driver 18 for SQL Server.
- Git.

## Instalación

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO
cd SHOPCAR
```

### 2. Preparar la base de datos

1. Abrir SQL Server Management Studio.
2. Ejecutar los scripts de la carpeta `database` en el orden indicado.
3. Verificar la creación de la base de datos `ShopCart`.
4. Confirmar que los esquemas, tablas y procedimientos almacenados estén disponibles.

### 3. Configurar el backend

Ingresar a la carpeta del backend:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear el archivo `.env` a partir de `.env.example` y configurar las variables de entorno.

### 4. Ejecutar el servidor en desarrollo

```bash
npm run dev
```

### 5. Compilar el proyecto

```bash
npm run build
```

## Configuración de variables de entorno

El archivo `.env.example` debe contener las variables necesarias para la conexión a SQL Server y la generación de tokens.

No se deben publicar credenciales reales, claves JWT ni información sensible en el repositorio.

## Seguridad

El proyecto contempla:

- Contraseñas almacenadas mediante hash.
- Autenticación con JWT.
- Refresh tokens almacenados mediante hash.
- Renovación y revocación de sesiones.
- Gestión de roles.
- Acceso a SQL Server mediante procedimientos almacenados.

## Base de datos

La base de datos `ShopCart` está organizada en siete esquemas:

| Esquema | Responsabilidad |
|---|---|
| Seguridad | Usuarios, roles y sesiones |
| Catalogo | Categorías, productos y variantes |
| Compras | Carritos y direcciones |
| Inventario | Existencias, movimientos y reservas |
| Promociones | Cupones y usos |
| Ventas | Pedidos, pagos y devoluciones |
| Auditoria | Registro de operaciones |

## Estado del proyecto

Proyecto en desarrollo. La documentación y las funcionalidades se actualizarán conforme avance la implementación y las pruebas de integración.

## Autoría

**Proyecto:** SHOPCAR  
**Base de datos:** ShopCart  
**Backend:** Node.js + TypeScript + Express  
**Motor de base de datos:** Microsoft SQL Server
