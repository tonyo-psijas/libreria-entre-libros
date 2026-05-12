import React, { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import { HeroComponent } from '../components/HeroComponent'
import { Link } from 'react-router-dom'
import discountImg from '../assets/images/discount-img.png'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const Home = () => {
    const [libros, setLibros] = useState([])
    const [comicsMangas, setComicsMangas] = useState([])
    const [preventas, setPreventas] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarTodo = async () => {
            try {
                const [resLibros, resComics, resPreventas] = await Promise.all([
                    fetch(`${BASE_URL}/libros/filtros`),
                    fetch(`${BASE_URL}/libros/filtros?genero=${encodeURIComponent('Comics & Mangas')}`),
                    fetch(`${BASE_URL}/preventas`)
                ])

                const jsonLibros = await resLibros.json()
                const jsonComics = await resComics.json()
                const jsonPreventas = await resPreventas.json()

                setLibros(Array.isArray(jsonLibros) ? jsonLibros : (jsonLibros.data ?? []))
                setComicsMangas(Array.isArray(jsonComics) ? jsonComics : (jsonComics.data ?? []))
                setPreventas(Array.isArray(jsonPreventas) ? jsonPreventas : (jsonPreventas.data ?? []))
            } catch (error) {
                console.error("Error al cargar libros:", error)
            } finally {
                setLoading(false)
            }
        }
        cargarTodo()
    }, [])

    const idsComics = new Set(comicsMangas.map(l => l.id_libro))
    const idsPreventas = new Set(preventas.map(l => l.id_libro))

    // Novedades: sin descuento, con imagen, sin Comics & Mangas, sin Preventas
    const ultimosLibros = [...libros]
        .filter(l =>
            (!l.descuento || l.descuento === 0) &&
            l.imagen &&
            !idsComics.has(l.id_libro) &&
            !idsPreventas.has(l.id_libro)
        )
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 6)

    // Promociones: con descuento, con imagen, sin Preventas
    const librosConDescuento = [...libros]
        .filter(l => l.descuento && l.descuento > 0 && l.imagen && !idsPreventas.has(l.id_libro))
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 4)

    // Comics & Mangas: max 6
    const comicsMangasHome = [...comicsMangas]
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 6)

    // Preventas: max 6
    const preventasHome = [...preventas]
        .sort((a, b) => b.id_libro - a.id_libro)
        .slice(0, 6)

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5">
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <HeroComponent />

            {/* NOVEDADES */}
            <div className='container pt-5'>
                <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                    <h2 className='fw-semibold'>Novedades</h2>
                    <Link to="/libros" className='ver-mas'>
                        Ver Más <i className="fa-regular fa-chevron-right"></i>
                    </Link>
                </div>
                <div className="row g-4">
                    {ultimosLibros.map((libro) => (
                        <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-2">
                            <ProductCard
                                imagen={libro.imagen}
                                id_libro={libro.id_libro}
                                titulo={libro.titulo}
                                autor={libro.autores || ''}
                                precio={libro.precio_final ?? libro.precio}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* COMICS & MANGAS */}
            {comicsMangasHome.length > 0 && (
                <div className='container pt-5'>
                    <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                        <h2 className='fw-semibold'>Comics & Mangas</h2>
                        <Link to="/comics-&-mangas" className='ver-mas'>
                            Ver Más <i className="fa-regular fa-chevron-right"></i>
                        </Link>
                    </div>
                    <div className="row g-4">
                        {comicsMangasHome.map((libro) => (
                            <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-2">
                                <ProductCard
                                    imagen={libro.imagen}
                                    id_libro={libro.id_libro}
                                    titulo={libro.titulo}
                                    autor={libro.autores || ''}
                                    precio={libro.precio_final ?? libro.precio}
                                    descuento={libro.descuento}
                                    precio_original={libro.precio}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PREVENTAS */}
            {preventasHome.length > 0 && (
                <div className='container pt-5'>
                    <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                        <h2 className='fw-semibold'>Preventas</h2>
                        <Link to="/preventas" className='ver-mas'>
                            Ver Más <i className="fa-regular fa-chevron-right"></i>
                        </Link>
                    </div>
                    <div className="row g-4">
                        {preventasHome.map((libro) => (
                            <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-2">
                                <ProductCard
                                    imagen={libro.imagen}
                                    id_libro={libro.id_libro}
                                    titulo={libro.titulo}
                                    autor={libro.autores || ''}
                                    precio={libro.precio_final ?? libro.precio}
                                    descuento={libro.descuento}
                                    precio_original={libro.precio}
                                    esPreventa={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* PROMOCIONES */}
            {librosConDescuento.length > 0 && (
                <div className='container pt-5'>
                    <div className="encabezado-home mb-2 d-flex justify-content-between align-items-center">
                        <h2 className='fw-semibold'>Promociones</h2>
                        <Link to="/promociones" className='ver-mas'>
                            Ver Más <i className="fa-regular fa-chevron-right"></i>
                        </Link>
                    </div>
                    <div className="row g-4">
                        <div className="col-12 col-sm-6 col-lg-4">
                            <img className='img-fluid img-descuento' src={discountImg} alt="descuentos" />
                        </div>
                        {librosConDescuento.map((libro) => (
                            <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-2">
                                <ProductCard
                                    imagen={libro.imagen}
                                    id_libro={libro.id_libro}
                                    titulo={libro.titulo}
                                    autor={libro.autores || ''}
                                    precio={libro.precio_final ?? libro.precio}
                                    descuento={libro.descuento}
                                    precio_original={libro.precio}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}