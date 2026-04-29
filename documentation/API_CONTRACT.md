# 📄 API Contract


## Ruta AUTH

### `POST /auth/register`
- **Auth Required:** `false`

**Require:**
```json
{
  "nombre": "...",
  "email": "...",
  "password": "..."
}
```

**Response:**
```json
{
  "id_cliente": "...",
  "nombre": "...",
  "email": "..."
}
```


### `POST /auth/login`
- **Auth Required:** `false`

**Request:**
```json
{
  "nombre": "...",
  "password": "..."
}
```

**Response:**
```json
{
  "token": "...",
  "cliente": {
    "id_cliente": "...",
    "nombre": "...",
    "email": "..."
  }
}
```


## Ruta CLIENTES (Privada)

### `GET /clientes/:id`
- **Auth Required:** `true` (Token)

**Response:**
```json
{
  "id_cliente": "...",
  "nombre": "...",
  "email": "..."
}
```


### `PUT /clientes/:id`
- **Auth Required:** `true` (Token)

**Request:**
```json
{
  "nombre": "...",
  "email": "..."
}
```

**Response:**
```json
{
  "id_cliente": "...",
  "nombre": "...",
  "email": "..."
}
```


## Ruta DIRECCIONES

### `GET /direcciones`
- **Auth Required:** `true` (Token)

**Request:**
```json
[
    {
        "alias": "...",
        "destinatario": "...",
        "pais": "...",
        "ciudad": "...",
        "calle": "...",
        "numero": "...",
        "codigo_postal": "..."
    }
]
```


### `POST /direcciones`
- **Auth Required:** `true` (Token)

**Request:**
```json
[
    {
        "alias": "...",
        "destinatario": "...",
        "pais": "...",
        "ciudad": "...",
        "calle": "...",
        "numero": "...",
        "codigo_postal": "..."
    }
]
```

**Response:**
```json
{
  "id_direccion": "...",
  "alias": "..."
}
```


### `PUT /direcciones/:id`
- **Auth Required:** `true` (Token)

**Request:**
```json
[
    {
        "alias": "...",
        "destinatario": "...",
        "pais": "...",
        "ciudad": "...",
        "calle": "...",
        "numero": "...",
        "codigo_postal": "..."
    }
]
```

**Response:**
```json
{
    "message": "Dirección modificada con éxito"
}
```


### `DELETE /direcciones/:id`
- **Auth Required:** `true` (Token)

**Response:**
```json
{
    "message": "Dirección eliminada correctamente"
}
```


## Ruta LIBROS

### `GET /libros`
- **Auth Required:** `false`

**Response:**
```json
{
    "cantidad_libros": 24,
    "prev_page": null,
    "next_page": "/?page=2",
    "result":
        [
            {
                "id_libro": "...",
                "titulo": "...",
                "precio": 0.00,
                "autor": "...",
                "imagen": "..."
            }
        ]
}
```


### `GET /libros/:id`
- **Auth Required:** `false`

**Response:**
```json
[
    {
        "id_libro": "...",
        "titulo": "...",
        "descripcion": "...",
        "precio": 0.00,
        "editorial": "...",
        "autor": [
            {
                "id_autor": "...",
                "nombre": "..."
            }
        ],
        "generos": [
            {
                "id_genero": "...",
                "nombre": "..."
            }
        ],
        "imagen": "..."
    }
]
```


### `POST /libros`
- **Auth Required:** `true` (ADMIN TOKEN)

**Require:**
```json
{
    "titulo": "...",
    "precio": 0.00,
    "descripcion": "...",
    "stock": "...",
    "id_editorial": "...",
    "imagen": "..."
}
```

**Response:**
```json
{
    "message": "Libro agregado con éxito"
}
```


### `PUT /libros/:id`
- **Auth Required:** `true` (ADMIN TOKEN)

**Require:**
```json
{
    "titulo": "...",
    "precio": 0.00,
    "descripcion": "...",
    "stock": "...",
    "id_editorial": "...",
    "imagen": "..."
}
```

**Response:**
```json
{
    "message": "Libro modificado correctamente"
}
```


### `DELETE /libros/:id`
- **Auth Required:** `true` (ADMIN TOKEN)

**Response:**
```json
{
    "message": "Libro eliminada correctamente"
}
```


## Ruta AUTORES

### `GET /autores`
- **Auth Required:** `false`

**Response:**
```json
[
    {
        "id_autor": "...",
        "nombre": "..."
    }
]
```


### `POST /autores`
- **Auth Required:** `true` (ADMIN TOKEN)

**Require:**
```json
{
    "nombre": "..."
}
```

**Response:**
```json
{
    "message": "Autor agregado con éxito"
}
```


## Ruta GENEROS

### `GET /generos`
- **Auth Required:** `false`

**Response:**
```json
[
    {
        "id_genero": "...",
        "nombre": "..."
    }
]
```


## Ruta FAVORITOS

### `GET /favoritos`
- **Auth Required:** `true` (Token)

**Response:**
```json
[
    {
        "id_libro": "...",
        "titulo": "...",
        "precio": 0.00,
        "imagen": "..."
    }
]
```


### `POST /favoritos`
- **Auth Required:** `true` (Token)

**Require:**
```json
{
    "id_libro": "..."
}
```


### `DELETE /favoritos/:id_libro`
- **Auth Required:** `true` (Token)

**Response:**
```json
{
    "message": "Libro eliminado de favoritos"
}
```


## Ruta PEDIDOS

### `GET /pedidos`
- **Auth Required:** `true` (Token)

**Response:**
```json
[
    {
        "id_pedido": "...",
        "fecha": "...",
        "total": 0.00,
        "estado": "..."
    }
]
```


### `GET /pedidos/:id`
- **Auth Required:** `true` (Token)

**Response:**
```json
[
    {
        "id_pedido": "...",
        "fecha": "...",
        "total": 0.00,
        "estado": "...",
        "items": [
            {
                "id_libro": "...",
                "titulo": "...",
                "cantidad": "...",
                "precio_unitario": 0.00
            }
        ]
    }
]
```


### `POST /pedidos`
- **Auth Required:** `true` (Token)

**Require:**
```json
{
    "id_direccion": "...",
    "items": [
            {
                "id_libro": "...",
                "cantidad": "...",
            }
        ]
}
```

**Response:**
```json
[
    {
        "id_pedido": "...",
        "total": 0.00,
        "estado": "..."
    }
]
```


### `POST /pagos`
- **Auth Required:** `true` (Token)

**Require:**
```json
{
    "id_pedido": "...",
    "id_metodo_pago": "..."
}
```

**Response:**
```json
{
    "id_pago": "...",
    "estado": "...",
    "fecha": "..."
}
```


## Ruta ENVIOS

### `GET /envios/:id_pedido`
- **Auth Required:** `true` (Token)

**Response:**
```json
{
    "id_envio": "...",
    "empresa": "...",
    "estado": "...",
    "fecha_envio": "..."
}
```