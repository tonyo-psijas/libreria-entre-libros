import React from 'react'
import { librosMock } from '../mock_data/mockData'
import ProductCard from '../components/productCard'
import { HeroComponent } from '../components/HeroComponent'
import { Link } from 'react-router-dom'

export const Home = () => {
    // Ordena por los más recientes primero y toma solo 6
    const ultimosLibros = [...librosMock.result]
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 6)

    return (
        <>
            <HeroComponent />

            <div className='container py-5'>

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
        </>
    )
}