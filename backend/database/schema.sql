CREATE DATABASE entre_libros;

\c entre_libros;

CREATE TABLE cliente (
  id_cliente SERIAL PRIMARY KEY,
  nombre VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password_hash TEXT,
  fecha_registro DATE DEFAULT CURRENT_DATE,
  estado BOOLEAN DEFAULT true,
  rol VARCHAR(20) DEFAULT 'cliente'
);

CREATE TABLE editorial (
  id_editorial SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE genero (
  id_genero SERIAL PRIMARY KEY,
  nombre VARCHAR(50) NOT NULL,
  descripcion TEXT
);

CREATE TABLE autor (
  id_autor SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL
);

CREATE TABLE metodo_pago (
  id_metodo_pago SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  descripcion VARCHAR(100)
);

CREATE TABLE empresa_envio (
  id_empresa_envio SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20)
);

CREATE TABLE libro (
  id_libro SERIAL PRIMARY KEY,
  titulo VARCHAR(250) NOT NULL,
  isbn VARCHAR(20) UNIQUE,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  formato VARCHAR(20),
  stock INT DEFAULT 0,
  id_editorial INT,
  fecha_publicacion DATE,
  numero_paginas INT,
  imagen VARCHAR(255),

  FOREIGN KEY (id_editorial) REFERENCES editorial(id_editorial)
);

CREATE TABLE direccion (
  id_direccion SERIAL PRIMARY KEY,
  id_cliente INT NOT NULL,
  alias VARCHAR(100),
  destinatario VARCHAR(100) NOT NULL,
  telefono VARCHAR(20),
  pais VARCHAR(30),
  ciudad VARCHAR(30),
  calle VARCHAR(50),
  numero VARCHAR(10),
  codigo_postal VARCHAR(20),

  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE
);

CREATE TABLE libro_autor (
  id_libro INT,
  id_autor INT,
  PRIMARY KEY (id_libro, id_autor),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE CASCADE,
  FOREIGN KEY (id_autor) REFERENCES autor(id_autor) ON DELETE CASCADE
);

CREATE TABLE libro_genero (
  id_libro INT,
  id_genero INT,
  PRIMARY KEY (id_libro, id_genero),
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE CASCADE,
  FOREIGN KEY (id_genero) REFERENCES genero(id_genero) ON DELETE CASCADE
);

CREATE TABLE favorito (
  id_cliente INT,
  id_libro INT,
  fecha_agregado DATE DEFAULT CURRENT_DATE,
  PRIMARY KEY (id_cliente, id_libro),
  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente) ON DELETE CASCADE,
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro) ON DELETE CASCADE
);

CREATE TABLE pedido (
  id_pedido SERIAL PRIMARY KEY,
  id_cliente INT NOT NULL,
  id_direccion INT NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  total DECIMAL(10,2),
  estado VARCHAR(20),

  FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
  FOREIGN KEY (id_direccion) REFERENCES direccion(id_direccion)
);

CREATE TABLE detalle_pedido (
  id_detalle SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_libro INT NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,

  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido) ON DELETE CASCADE,
  FOREIGN KEY (id_libro) REFERENCES libro(id_libro)
);

CREATE TABLE pago (
  id_pago SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_metodo_pago INT,
  monto DECIMAL(10,2),
  estado VARCHAR(20),
  referencia VARCHAR(100) UNIQUE,
  fecha DATE DEFAULT CURRENT_DATE,

  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago)
);

CREATE TABLE envio (
  id_envio SERIAL PRIMARY KEY,
  id_pedido INT NOT NULL,
  id_empresa_envio INT,
  estado VARCHAR(50),
  tracking VARCHAR(100) UNIQUE,
  costo_envio DECIMAL(10,2),
  fecha_envio DATE,
  fecha_entrega DATE,

  FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
  FOREIGN KEY (id_empresa_envio) REFERENCES empresa_envio(id_empresa_envio)
);
