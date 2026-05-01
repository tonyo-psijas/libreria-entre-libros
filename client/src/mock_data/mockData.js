// src/mock_data/apiMockData.js

export const authMock = {
    register: {
      data: {
        id_cliente: 1,
        nombre: "Antonio Psijas",
        email: "antonio@email.com"
      },
      message: "Usuario registrado correctamente"
    },
  
    login: {
      data: {
        token: "mock-jwt-token-123456",
        cliente: {
          id_cliente: 1,
          nombre: "Antonio Psijas",
          email: "antonio@email.com"
        }
      },
      message: "Login exitoso"
    }
  };

  
  export const clientesMock = {
    data: [
        {
            id_cliente: 1,
            nombre: "Antonio",
            apellido: "Psijas",
            email: "antonio@email.com",
            telefono: "+56 9 5500 2985",
            rol: "admin",
        },
        {
            id_cliente: 2,
            nombre: "María",
            apellido: "González",
            email: "maria.gonzalez@email.com",
            telefono: "+56 9 1234 5678",
            rol: "cliente",
        },
    ],
    message: "Cliente actualizado"
  };
  
  export const direccionesMock = {
    data: [
      {
        id_direccion: 1,
        alias: "Casa",
        destinatario: "Antonio Psijas",
        pais: "Chile",
        ciudad: "Santiago",
        calle: "Av. Providencia",
        numero: "1234",
        codigo_postal: "7500000"
      },
      {
        id_direccion: 2,
        alias: "Trabajo",
        destinatario: "Antonio Psijas",
        pais: "Chile",
        ciudad: "Las Condes",
        calle: "Av. Apoquindo",
        numero: "5678",
        codigo_postal: "7550000"
      }
    ],
    message: "Dirección creada"
  };
  
  export const librosMock = {
    result: [
      {
        id_libro: 1,
        titulo: "Cien Años de Soledad",
        descripcion: "Una obra maestra del realismo mágico. Millones de ejemplares de Cien años de soledad leídos en todas las lenguas y el premio Nobel de Literatura coronando una obra que se había abierto paso «boca a boca» -como gusta decir el escritor- son la más palpable demostración de que la aventura fabulosa de la familia Buendía-Iguarán, con sus milagros, fantasías, obsesiones, tragedias, incestos, adulterios, rebeldías, descubrimientos y condenas, representaba al mismo tiempo el mito y la historia, la tragedia y el amor del mundo entero.",
        precio: 19990,
        stock: 12,
        editorial: "Debolsillo",
        autores: [
          {
            id_autor: 1,
            nombre: "Gabriel García Márquez"
          }
        ],
        generos: [
            {
            id_genero: 8,
            nombre: "Clásicos Universales"
            },
            {
            id_genero: 9,
            nombre: "Literatura Latinoamericana"
            }
        ],
        imagen: "https://www.edicontinente.com.ar/image/titulos/9788466379717.jpg"
      },

      {
        id_libro: 2,
        titulo: "1984",
        descripcion: "Una distopía política clásica. En el año 1984 Londres es una ciudad lúgubre en la que la Policía del Pensamiento controla de forma asfixiante la vida de los ciudadanos.Winston Smith es un peón de este engranaje perverso, su cometido es reescribir la historia para adaptarla a lo que el Partido considera la versión oficial de los hechos... hasta que decide replantearse la verdad del sistema que los gobierna y somete.",
        precio: 14990,
        stock: 8,
        editorial: "Debolsillo",
        autores: [
          {
            id_autor: 2,
            nombre: "George Orwell"
          }
        ],
        generos: [
          {
            id_genero: 2,
            nombre: "Ciencia Ficción"
          },
          {
            id_genero: 8,
            nombre: "Clásicos Universales"
          }
        ],
        imagen: "https://www.penguinlibros.com/cl/7330555/1984-edicion-definitiva-avalada-por-the-orwell-estate-edicion-especial-limitada.jpg"
      },

      {
        id_libro: 3,
        titulo: "El Principito",
        descripcion: "Un clásico universal para todas las edades. Fábula mítica y relato filosófico que interroga acerca de la relación del ser humano con su prójimo y con el mundo, El Principito concentra, con maravillosa simplicidad, la constante reflexión de Saint-Exupéry sobre la amistad, el amor y el sentido de la vida.",
        precio: 9990,
        stock: 20,
        editorial: "Planeta",
        autores: [
          {
            id_autor: 3,
            nombre: "Antoine de Saint-Exupéry"
          }
        ],
        generos: [
          {
            id_genero: 15,
            nombre: "Infantil"
          },
          {
            id_genero: 8,
            nombre: "Clásicos Universales"
          }
        ],
        imagen: "https://m.media-amazon.com/images/I/71AVK5VIAzL._AC_UF1000,1000_QL80_.jpg"
      },

      {
        id_libro: 4,
        titulo: "Dune",
        descripcion: "El libro que definió la ciencia ficción moderna, adaptada al cine por Denis Villeneuve. En el desértico planeta Arrakis, el agua es el bien más preciado y llorar a los muertos, el símbolo de máxima prodigalidad. Pero algo hace de Arrakis una pieza estratégica para los intereses del Emperador, las Grandes Casas y la Cofradía, los tres grandes poderes de la galaxia. Arrakis es el único origen conocido de la melange, preciosa especia y uno de los bienes más codiciados del universo.",
        precio: 24000,
        stock: 24,
        editorial: "Planeta",
        autores: [
            {
                id_autor: 4,
                nombre: "Frank Herbert"
            }
        ],
        generos: [
            {
                id_genero: 2,
                nombre: "Ciencia Ficción"
            }
        ],
        imagen: "https://broslibrerias.cl/cdn/shop/products/c05f2c4e-852e-441c-9f10-eed26adb66f6-3000010022055_800x.jpg?v=1674005533"
      },

      {
        id_libro: 5,
        titulo: "Proyecto Hail Mary",
        descripcion: "Ryland Grace es el único superviviente en una misión desesperada. Es la última oportunidad y, si fracasa, la humanidad y la Tierra misma perecerán. Claro que, de momento, él no lo sabe. Ni siquiera puede recordar su propio nombre, y mucho menos la naturaleza de su misión o cómo llevarla a cabo.",
        precio: 20000,
        stock: 19,
        editorial: "Nova",
        autores: [
          {
            id_autor: 8,
            nombre: "Andy Weir"
          }
        ],
        generos: [
            {
                id_genero: 2,
                nombre: "Ciencia Ficción"
            }
        ],
        imagen: "https://www.penguinlibros.com/co/1266622/proyecto-hail-mary.jpg"
      },

      {
        id_libro: 6,
        titulo: "Mi Nombre es Emilia Del Valle",
        descripcion: "San Francisco, 1866: una monja irlandesa, embarazada y abandonada por un aristócrata chileno tras una apasionada relación, da a luz a una niña a la que llama Emilia del Valle. Criada por su cariñoso padrastro, Emilia se convertirá en una joven brillante de gran personalidad, autónoma e independiente, que desafiará las normas sociales de su tiempo para profesar su verdadera pasión y vocación: la escritura.",
        precio: 15990,
        stock: 22,
        editorial: "Nova",
        autores: [
          {
            id_autor: 6,
            nombre: "Isabel Allende"
          }
        ],
        generos: [
            {
                id_genero: 9,
                nombre: "Literatura Latinoamericana"
            }
        ],
        imagen: "https://www.penguinlibros.com/cl/4613032/mi-nombre-es-emilia-del-valle.jpg"
      },

    ],
    message: "Libro creado"
  };
  
  export const autoresMock = {
    data: [
      {
        id_autor: 1,
        nombre: "Gabriel García Márquez"
      },
      {
        id_autor: 2,
        nombre: "George Orwell"
      },
      {
        id_autor: 3,
        nombre: "Antoine de Saint-Exupéry"
      },
      {
        id_autor: 4,
        nombre: "Frank Herbert"
      },
      {
        id_autor: 5,
        nombre: "Stephen King"
      },
      {
        id_autor: 6,
        nombre: "Isabel Allende"
      },
      {
        id_autor: 7,
        nombre: "George R. R. Martin"
      },
      {
        id_autor: 8,
        nombre: "Andy Weir"
      },
      {
        id_autor: 9,
        nombre: "Rachel Reid"
      },
      {
        id_autor: 10,
        nombre: "Cormac McCarthy"
      }
    ]
  };
  
  export const generosMock = {
    data: [
      {
        id_genero: 1,
        nombre: "Fantasía"
      },
      {
        id_genero: 2,
        nombre: "Ciencia Ficción"
      },
      {
        id_genero: 3,
        nombre: "Romance"
      },
      {
        id_genero: 4,
        nombre: "Misterio y Suspenso"
      },
      {
        id_genero: 5,
        nombre: "Terror"
      },
      {
        id_genero: 6,
        nombre: "Crimen"
      },
      {
        id_genero: 7,
        nombre: "Juvenil"
      },
      {
        id_genero: 8,
        nombre: "Clásicos Universales"
      },
      {
        id_genero: 9,
        nombre: "Literatura Latinoamericana"
      },
      {
        id_genero: 10,
        nombre: "Autoayuda"
      },
      {
        id_genero: 11,
        nombre: "Filosofía"
      },
      {
        id_genero: 12,
        nombre: "Historia"
      },
      {
        id_genero: 13,
        nombre: "Arte y Diseño"
      },
      {
        id_genero: 14,
        nombre: "Comics & Mangas"
      },
      {
        id_genero: 15,
        nombre: "Infantil"
      },
      {
        id_genero: 16,
        nombre: "No Ficción"
      }
    ]
  };
  
  export const favoritosMock = {
    data: [

    ]
  };
  
  export const pedidosMock = {
    data: [
      {
        id_pedido: 101,
        fecha: "2026-04-25",
        total: 34980,
        estado: "En preparación"
      },
      {
        id_pedido: 102,
        fecha: "2026-04-20",
        total: 19990,
        estado: "Entregado"
      }
    ],
  
    detalle: {
      id_pedido: 101,
      fecha: "2026-04-25",
      total: 34980,
      estado: "En preparación",
      items: [
        {
          id_libro: 1,
          titulo: "Cien Años de Soledad",
          cantidad: 1,
          precio_unitario: 19990
        },
        {
          id_libro: 2,
          titulo: "1984",
          cantidad: 1,
          precio_unitario: 14990
        }
      ]
    }
  };
  
  export const pagosMock = {
    data: {
      id_pago: 1,
      estado: "Pagado",
      fecha: "2026-04-26"
    }
  };
  
  export const enviosMock = {
    data: {
      id_envio: 1,
      empresa: "Chilexpress",
      estado: "En tránsito",
      fecha_envio: "2026-04-27"
    }
  };