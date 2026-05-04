import React from 'react'
import { librosMock } from '../mock_data/mockData'
import ProductCard from '../components/ProductCard'
import { HeroComponent } from '../components/HeroComponent'
import { Link } from 'react-router-dom'
import discountImg from '../assets/images/discount-img.png'

export const Home = () => {
    // Ordena por los más recientes primero y toma solo 6
    const ultimosLibros = [...librosMock.result]
        .filter(libro =>
            !libro.descuento &&
            !libro.generos.some(
                genero => genero.nombre === "Comics & Mangas"
            )
        )
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 6)


    const librosConDescuento = [...librosMock.result]
        .filter(libro => libro.descuento)
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 5)


    const comicsYMangas = [...librosMock.result]
    .filter(libro =>
        libro.generos.some(
            genero => genero.nombre === "Comics & Mangas"
        )
    )
    .sort((a, b) => b.id_libro - a.id_libro)
    .slice(0, 6)

    return (
        <>
            <HeroComponent />

            <div className='container pt-5'>

                <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                    <h2 className='fw-semibold'>Novedades</h2>

                    <Link to="/libros" className='ver-mas'>
                        Ver Más <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                </div>

                <div className="row g-4 ">
                    {ultimosLibros.map((libro) => (
                        <div
                            key={libro.id_libro}
                            className="
                                col-6
                                col-sm-4
                                col-lg-2
                            "
                        >
                            <ProductCard
                                imagen={libro.imagen}
                                id_libro={libro.id_libro}
                                titulo={libro.titulo}
                                autor={libro.autores.map(autor => autor.nombre).join(", ")}
                                precio={libro.precio}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='container pt-5'>

                <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                    <h2 className='fw-semibold'>Comics & Mangas</h2>

                    <Link to="/comics-&-mangas" className='ver-mas'>
                        Ver Más <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                </div>

                <div className="row g-4 ">
 

                    {comicsYMangas.map((libro) => (
                        <div
                            key={libro.id_libro}
                            className="
                                col-6
                                col-sm-4
                                col-lg-2
                            "
                        >
                            <ProductCard
                                imagen={libro.imagen}
                                id_libro={libro.id_libro}
                                titulo={libro.titulo}
                                autor={libro.autores.map(autor => autor.nombre).join(", ")}
                                precio={libro.precio}
                                descuento={libro.descuento}
                                precio_original={libro.precio_original}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className='container pt-5'>

                <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                    <h2 className='fw-semibold'>Promociones</h2>

                    <Link to="/promociones" className='ver-mas'>
                        Ver Más <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                </div>

                <div className="row g-4 ">

                    <div className="col-12 col-sm-6 col-lg-4">
                        <img className='img-fluid img-descuento' src={discountImg} alt="descuentos" />
                    </div>      

                    {librosConDescuento.map((libro) => (
                        <div
                            key={libro.id_libro}
                            className="
                                col-6
                                col-sm-4
                                col-lg-2
                            "
                        >
                            <ProductCard
                                imagen={libro.imagen}
                                id_libro={libro.id_libro}
                                titulo={libro.titulo}
                                autor={libro.autores.map(autor => autor.nombre).join(", ")}
                                precio={libro.precio}
                                descuento={libro.descuento}
                                precio_original={libro.precio_original}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}