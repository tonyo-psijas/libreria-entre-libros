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
            role: "admin",
            password: "antonio1234"
        },
        {
            id_cliente: 2,
            nombre: "María",
            apellido: "González",
            email: "maria.gonzalez@email.com",
            telefono: "+56 9 1234 5678",
            role: "cliente",
            password: "maria1234"
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
        descuento: false,
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
        descuento: false,
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
        descuento: false,
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
        editorial: "Debolsillo",
        descuento: false,
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
        descuento: false,
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
        editorial: "Plaza & Janés",
        descuento: false,
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

      {
        id_libro: 7,
        titulo: "El Resplandor",
        descripcion: "Danny tenía cinco años, y a esa edad poco niños saben que los espejos invierten las imágenes y menos aún saben diferenciar entre realidad y fantasía. Pero Danny tenía pruebas de que sus fantasías relacionadas con el resplandor del espejo acabarían cumpliéndose: REDRUM... MURDER, asesinato.",
        precio: 21000,
        stock: 26,
        editorial: "Debolsillo",
        descuento: true,
        autores: [
          {
            id_autor: 5,
            nombre: "Stephen King"
          }
        ],
        generos: [
            {
                id_genero: 5,
                nombre: "Terror"
            }
        ],
        imagen: "https://www.tiposinfames.com/media/img/portadas/9788490328729.jpg"
      },

      {
        id_libro: 8,
        titulo: "El Viejo y el Mar",
        descripcion: "Una de las historias más grandes jamás contadas. El viejo y el mar es uno de los relatos más bellos que jamás se han escrito. En la cúspide de su maestría, Hemingway alumbró una historia en cuya sencillez vibra una inagotable emoción: en Cuba, un viejo pescador, ya en el crepúsculo de su vida, pobre y sin suerte, cansado de regresar cada día sin pesca, emprende una última y arriesgada travesía. Cuando al fin logre dar con una gran pieza, tendrá que luchar contra ella denodadamente. Y el regreso a puerto, con el acoso de los elementos y los tiburones, se convierte en una última prueba.",
        precio: 13800,
        stock: 31,
        editorial: "Debolsillo",
        descuento: true,
        autores: [
          {
                id_autor: 11,
                nombre: "Ernest Hemingway"
          }
        ],
        generos: [
            {
                id_genero: 8,
                nombre: "Clásicos Universales"
            }
        ],
        imagen: "https://www.penguinlibros.com/cl/55133/viejo-y-el-mar-el.jpg"
      },

      {
        id_libro: 9,
        titulo: "Cuentos de Terror",
        descripcion: "Edgar Allan Poe dejó un legado literario que se convertiría en un punto de referencia constante para todas las artes y que aflora en autores tan variados como Baudelaire, Dostoievski, Cortázar o Stephen King. Este volumen incluye dieciséis de sus mejores relatos; títulos como «La caída de la Casa Usher», «Los crímenes de la calle Morgue» o «La carta robada» son considerados piezas maestras de la literatura universal.",
        precio: 18000,
        stock: 31,
        editorial: "Planeta",
        descuento: true,
        autores: [
          {
                id_autor: 13,
                nombre: "Edgar Allan Poe"
          }
        ],
        generos: [
            {
                id_genero: 5,
                nombre: "Terror"
            },
            {
                id_genero: 8,
                nombre: "Clásicos Universales"
            }
        ],
        imagen: "https://www.planetadelibros.cl/usuaris/libros/fotos/429/original/428384_portada___202510281802.jpg"
      },

      {
        id_libro: 10,
        titulo: "El Extranjero",
        descripcion: "Publicada originalmente en 1942, El extranjero es la primera novela de Albert Camus y una de sus obras más emblemáticas. Ahora con nueva traducción al español de María Teresa Gallego Urrutia y Amaya García Gallego, este libro capital para la cultura del siglo XX transcurre en Argelia y narra la anodina vida de Meursault, un joven oficinista que vive en perpetua apatía. Cuando recibe la noticia del fallecimiento de su madre, la encaja con la mayor impasibilidad. Obligado a abandonar la capital y viajar para asistir al funeral, Meursault desea que la ceremonia sea breve para regresar a su casa. Esa indiferencia existencial marca sus días, avanzando sin reaccionar a la muerte de su madre, al afecto de su amada y ni tan siquiera a un crimen que cometerá con idéntica desidia, incapaz de ver el alcance moral de sus actos.",
        precio: 12500,
        stock: 19,
        editorial: "Penguin Random House",
        descuento: true,
        autores: [
            {
                id_autor: 12,
                nombre: "Albert Camus"
            },
        ],
        generos: [
            {
                id_genero: 8,
                nombre: "Clásicos Universales"
            }
        ],
        imagen: "https://www.penguinlibros.com/cl/1780237/el-extranjero.jpg"
      },

      {
        id_libro: 11,
        titulo: "Meridiano de Sangre",
        descripcion: "Las autoridades mexicanas y del estado de Texas organizan una expedición paramilitar para acabar con el mayor número posible de indios. Es el Grupo Glanton, y tienen como líder espiritual al juez Holden, un ser violento y cruel. Nunca duerme, y afirma que nunca morirá. Todo cambia cuando los carniceros de Glanton dejan de asesinar indios y empiezan a exterminar a los mexicanos que les pagan. Se instaura así la ley de la selva, el terreno moral donde la figura del juez se convierte en una especie de dios arbitrario.",
        precio: 14800,
        stock: 25,
        editorial: "Penguin Random House",
        descuento: false,
        autores: [
            {
                id_autor: 10,
                nombre: "Cormac McCarthy"
            },
        ],
        generos: [
            {
                id_genero: 8,
                nombre: "Clásicos Universales"
            }
        ],
        imagen: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1686647017i/2817961.jpg"
      },

      {
        id_libro: 12,
        titulo: "Juego de Tronos",
        descripcion: "En un mundo diferente al nuestro, en el que los veranos y los inviernos duran generaciones, un gran conflicto está a punto de estallar. Robert Baratheon ocupa el Trono de Hierro en el cálido y opulento sur de Poniente. Se lo arrebató tras una sangrienta guerra al último rey loco de la dinastía Targaryen, señores de dragones. Sin embargo, ahora su poder se ve amenazado: en el norte, el Muro erigido para proteger el reino de las bestias y de los extraños se tambalea. Hace siglos que nadie ve a los caminantes blancos, pero ¿quiénes son entonces esos seres de ojos azules y fríos que se ocultan en las sombras de los bosques y que les arrebatan la vida y la mente a aquellos desafortunados que se cruzan en su camino? El final del verano está próximo, se acerca el invierno y solo un milagro podrá disipar las tinieblas.",
        precio: 24990,
        stock: 42,
        editorial: "Plaza & Janés",
        descuento: false,
        autores: [
            {
                id_autor: 7,
                nombre: "George R. R. Martin"
            },
        ],
        generos: [
            {
                id_genero: 1,
                nombre: "Fantasía"
            }
        ],
        imagen: "https://static.wikia.nocookie.net/hieloyfuego/images/2/21/Juego_de_Tronos_portada_Plaza_Janes.jpg"
      },

      {
        id_libro: 13,
        titulo: "Persépolis",
        descripcion: "Persépolis nos cuenta la revolución islámica iraní vista desde los ojos de una niña que asiste atónita al cambio profundo que experimentan su país y su familia, mientras ella debe aprender a llevar el velo. Intensamente personal y profundamente político, el relato autobiográfico de Marjane Satrapi examina qué significa crecer en un ambiente de guerra y represión política.",
        precio: 24500,
        stock: 7,
        editorial: "Reservoir Books",
        descuento: false,
        autores: [
            {
                id_autor: 14,
                nombre: "Marjane Satrapi"
            },
        ],
        generos: [
            {
                id_genero: 14,
                nombre: "Comics & Mangas"
            }
        ],
        imagen: "https://www.penguinlibros.com/cl/50069/persepolis.jpg"
      },

      {
        id_libro: 14,
        titulo: "Watchmen",
        descripcion: "El asesinato de un antiguo superhéroe y la posterior investigación del crimen no son más que el comienzo de uno de los cómics más aclamados de la historia, uno donde el mundo se aproxima a una catástrofe nuclear mientras sus defensores se ven obligados a resurgir de sus cenizas. Sin embargo, ¿quiénes son esos personajes? ¿Cuál fue la auténtica historia de sus predecesores, los Minutemen? ¿Cómo fue la relación entre Espectro de Seda y su madre? ¿Qué tuvo que ver el Comediante con los Kennedy?",
        precio: 30000,
        stock: 13,
        editorial: "DC Comics",
        descuento: false,
        autores: [
            {
              id_autor: 15,
              nombre: "Alan Moore"
            },
            {
              id_autor: 16,
              nombre: "Dave Gibbons"
            }
        ],
        generos: [
            {
                id_genero: 14,
                nombre: "Comics & Mangas"
            }
        ],
        imagen: "https://upload.wikimedia.org/wikipedia/commons/6/65/Watchmen-cover.svg"
      },

      {
        id_libro: 15,
        titulo: "El Incal",
        descripcion: "Esta es la epopeya de John Difool, un detective de poca monta que al recibir un extraño objeto debe enfrentarse, sin habérselo propuesto, a los altos poderes del cosmos. Mientras, irrumpen varias rebeliones a la vez en el imperio galáctico; siembran el caos, así como la caída y el renacimiento de múltiples poderes y contrapoderes. Difool deberá viajar, junto a la abigarrada compañía metafísica que forman su pájaro Deepo y otros cinco elegidos, por el magistral universo futurista creado por Jodorowsky y Moebius.",
        precio: 30990,
        stock: 3,
        editorial: "Integral",
        descuento: false,
        autores: [
            {
              id_autor: 17,
              nombre: "Alejandro Jodorowsky"
            },
            {
              id_autor: 18,
              nombre: "Moebius"
            }
        ],
        generos: [
            {
                id_genero: 14,
                nombre: "Comics & Mangas"
            }
        ],
        imagen: "https://www.tiposinfames.com/media/img/portadas/9788416709298.jpg"
      },

      {
        id_libro: 16,
        titulo: "Uzumaki",
        descripcion: "De la mano de Junji ito, Uzumaki en su versión integral, se narra la historia del pueblo Kurouzu, el cual está rodeado por la niebla en la costa de Japón, está maldito. Según Shûichi Saitô, el novio de la joven Kirie Goshima, su hogar está encantado, no por una persona, sino por un patrón: UZUMAKI, la espiral, el secreto hipnótico que da forma al mundo.",
        precio: 28500,
        stock: 9,
        editorial: "Planeta",
        descuento: false,
        autores: [
            {
              id_autor: 19,
              nombre: "Junji Ito"
            }
        ],
        generos: [
            {
                id_genero: 14,
                nombre: "Comics & Mangas"
            }
        ],
        imagen: "https://cdnx.jumpseller.com/shazam-online/image/14590402/portada___201706011613.jpg"
      },

      {
        id_libro: 17,
        titulo: "All-Star Superman",
        descripcion: "Con la premisa de Superman muriéndose a causa de una sobrecarga masiva de energía solar, Grant Morrison (El Asco) y Frank Quitely (El Multiverso) narran a lo largo de este volumen las últimas semanas del Hombre de Acero. Durante este tiempo, Superman se enfrentará a dos supervivientes de Krypton, a amenazas alienígenas y, por supuesto, a Lex Luthor en una última batalla por la supervivivencia de la Tierra. Y todo esto mientras, como Clark Kent, intenta poner en orden su propia vida privada ante su inminente e irremediable muerte.",
        precio: 26690,
        stock: 14,
        editorial: "DC Comics",
        descuento: false,
        autores: [
            {
              id_autor: 20,
              nombre: "Grant Morrison"
            },
            {
              id_autor: 21,
              nombre: "Frank Quitely"
            }
        ],
        generos: [
            {
                id_genero: 14,
                nombre: "Comics & Mangas"
            }
        ],
        imagen: "https://content.eccediciones.com/productos/33142/Cubierta_AllStar_Superman.jpg"
      },

      {
        id_libro: 18,
        titulo: "Nijigahara Holograph",
        descripcion: "Once años atrás, un misterioso rumor comenzaba a difundirse entre los chicos de un pueblo: en el túnel de Nijigahara habita un monstruo capaz de destruir el mundo. Convencidos de que tenían que acabar con esto, se la agarran con Arie Kimura, una compañera de primaria. Es así como le echan la culpa por la maldición que los asolaba, y deciden entregársela a la supuesta criatura a modo de sacrificio. En el presente, el destino de esos chicos sigue conectado. Una sucesión de eventos los reúne poco a poco, dando lugar a una serie de crudas experiencias que entremezclan recuerdos con alucinaciones. Con constantes idas y vueltas entre pasado y presente, la historia deja lugar para asesinatos, violaciones, suicidios, mutilaciones y otras joyitas. Y todo esto en el medio de una plaga de mariposas que, de alguna manera, parece estar conectada con los hechos.",
        precio: 16400,
        stock: 19,
        editorial: "Milky Way Ediciones",
        descuento: false,
        autores: [
            {
              id_autor: 22,
              nombre: "Inio Asano"
            }
        ],
        generos: [
            {
                id_genero: 14,
                nombre: "Comics & Mangas"
            }
        ],
        imagen: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1501900060i/17306314.jpg"
      },

    ].map(libro => ({
        ...libro,
        precio_original: libro.precio,
        precio: libro.descuento ? libro.precio / 2 : libro.precio
      })),

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
      },
      {
        id_autor: 11,
        nombre: "Ernest Hemingway"
      },
      {
        id_autor: 12,
        nombre: "Albert Camus"
      },
      {
        id_autor: 13,
        nombre: "Edgar Allan Poe"
      },
      {
        id_autor: 14,
        nombre: "Marjane Satrapi"
      },
      {
        id_autor: 15,
        nombre: "Alan Moore"
      },
      {
        id_autor: 16,
        nombre: "Dave Gibbons"
      },
      {
        id_autor: 17,
        nombre: "Alejandro Jodorowsky"
      },
      {
        id_autor: 18,
        nombre: "Moebius"
      },
      {
        id_autor: 19,
        nombre: "Junji Ito"
      },
      {
        id_autor: 20,
        nombre: "Grant Morrison"
      },
      {
        id_autor: 21,
        nombre: "Frank Quitely"
      },
      {
        id_autor: 22,
        nombre: "Inio Asano"
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