/* ====== POS Streetwear: Crear BD + Tablas + Relaciones ====== */

IF DB_ID('POS_Streetwear') IS NULL
BEGIN
    CREATE DATABASE POS_Streetwear;
END
GO

USE POS_Streetwear;
GO

IF OBJECT_ID('dbo.Detalle_Ventas', 'U') IS NOT NULL DROP TABLE dbo.Detalle_Ventas;
IF OBJECT_ID('dbo.Ventas_Pedidos', 'U') IS NOT NULL DROP TABLE dbo.Ventas_Pedidos;
IF OBJECT_ID('dbo.Productos', 'U') IS NOT NULL DROP TABLE dbo.Productos;
IF OBJECT_ID('dbo.Categorias', 'U') IS NOT NULL DROP TABLE dbo.Categorias;
IF OBJECT_ID('dbo.Marcas', 'U') IS NOT NULL DROP TABLE dbo.Marcas;
IF OBJECT_ID('dbo.Usuarios_Vendedores', 'U') IS NOT NULL DROP TABLE dbo.Usuarios_Vendedores;
GO

CREATE TABLE dbo.Usuarios_Vendedores (
    ID_Usuario        INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre_Completo   NVARCHAR(150)      NOT NULL,
    Rol               NVARCHAR(30)       NOT NULL,
    Email_Contacto    NVARCHAR(150)      NOT NULL UNIQUE,
    CONSTRAINT CK_Usuarios_Rol CHECK (Rol IN ('Administrador','Vendedor'))
);
GO

CREATE TABLE dbo.Marcas (
    ID_Marca      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre_Marca  NVARCHAR(120)     NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Categorias (
    ID_Categoria      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Nombre_Categoria  NVARCHAR(120)     NOT NULL UNIQUE
);
GO

CREATE TABLE dbo.Productos (
    ID_Producto           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ID_Marca              INT               NOT NULL,
    ID_Categoria          INT               NOT NULL,
    Nombre_Modelo         NVARCHAR(200)     NOT NULL,
    Atributo_Talla_Medida NVARCHAR(50)      NOT NULL,
    Precio_Venta          DECIMAL(10,2)     NOT NULL,
    Stock_Disponible      INT               NOT NULL,
    CONSTRAINT CK_Productos_Precio CHECK (Precio_Venta >= 0),
    CONSTRAINT CK_Productos_Stock  CHECK (Stock_Disponible >= 0),
    CONSTRAINT FK_Productos_Marcas
        FOREIGN KEY (ID_Marca) REFERENCES dbo.Marcas(ID_Marca),
    CONSTRAINT FK_Productos_Categorias
        FOREIGN KEY (ID_Categoria) REFERENCES dbo.Categorias(ID_Categoria)
);
GO

CREATE TABLE dbo.Ventas_Pedidos (
    ID_Venta      INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ID_Usuario    INT               NOT NULL,
    Fecha_Hora    DATETIME2         NOT NULL DEFAULT SYSDATETIME(),
    Total_Venta   DECIMAL(10,2)     NOT NULL,
    Metodo_Pago   NVARCHAR(30)      NOT NULL,
    CONSTRAINT CK_Ventas_Total CHECK (Total_Venta >= 0),
    CONSTRAINT FK_Ventas_Usuario
        FOREIGN KEY (ID_Usuario) REFERENCES dbo.Usuarios_Vendedores(ID_Usuario)
);
GO

CREATE TABLE dbo.Detalle_Ventas (
    ID_Detalle              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    ID_Venta                INT               NOT NULL,
    ID_Producto             INT               NOT NULL,
    Cantidad                INT               NOT NULL,
    Precio_Unitario_Cobrado DECIMAL(10,2)     NOT NULL,
    CONSTRAINT CK_Detalle_Cantidad CHECK (Cantidad > 0),
    CONSTRAINT CK_Detalle_Precio   CHECK (Precio_Unitario_Cobrado >= 0),
    CONSTRAINT FK_Detalle_Venta
        FOREIGN KEY (ID_Venta) REFERENCES dbo.Ventas_Pedidos(ID_Venta),
    CONSTRAINT FK_Detalle_Producto
        FOREIGN KEY (ID_Producto) REFERENCES dbo.Productos(ID_Producto)
);
GO

CREATE INDEX IX_Productos_Marca     ON dbo.Productos(ID_Marca);
CREATE INDEX IX_Productos_Categoria ON dbo.Productos(ID_Categoria);
CREATE INDEX IX_Detalle_Venta       ON dbo.Detalle_Ventas(ID_Venta);
CREATE INDEX IX_Detalle_Producto    ON dbo.Detalle_Ventas(ID_Producto);
GO