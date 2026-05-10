import React, { useState, useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const LIBROS_POR_PAGINA = 24

export const ComicsMangas = () => {
    const [libros, setLibros] = useState([])
    const [loading, setLoading] = useState(true)
    const [ordenamiento, setOrdenamiento] = useState('recientes')
    const [paginaActual, setPaginaActual] = useState(1)

    useEffect(() => {
        const cargarLibros = async () => {
            setLoading(true)
            try {
                // GET /libros/filtros?genero=Comics & Mangas
                const res = await fetch(
                    `${BASE_URL}/libros/filtros?genero=${encodeURIComponent('Comics & Mangas')}`
                )
                const json = await res.json()
                const lista = Array.isArray(json) ? json : (json.data ?? [])
                setLibros(lista)
            } catch (error) {
                console.error("Error al cargar comics y mangas:", error)
            } finally {
                setLoading(false)
            }
        }
        cargarLibros()
    }, [])

    const librosFiltrados = useMemo(() => {
        let resultado = [...libros]
        switch (ordenamiento) {
            case 'precio-asc':
                resultado.sort((a, b) => (a.precio_final ?? a.precio) - (b.precio_final ?? b.precio))
                break
            case 'precio-desc':
                resultado.sort((a, b) => (b.precio_final ?? b.precio) - (a.precio_final ?? a.precio))
                break
            case 'alfabetico':
                resultado.sort((a, b) => a.titulo.localeCompare(b.titulo))
                break
            case 'recientes':
            default:
                resultado.sort((a, b) => b.id_libro - a.id_libro)
                break
        }
        return resultado
    }, [libros, ordenamiento])

    const totalPaginas = Math.ceil(librosFiltrados.length / LIBROS_POR_PAGINA)
    const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA
    const librosPaginados = librosFiltrados.slice(indiceInicio, indiceInicio + LIBROS_POR_PAGINA)

    const handleOrdenamiento = (e) => { setOrdenamiento(e.target.value); setPaginaActual(1) }

    return (
        <>
            <div className="section-header">
                <div className="container">
                    <h1>Comics & Mangas <i className="fa-light fa-thought-bubble"></i></h1>
                </div>
            </div>

            <div className="container pt-5">

                <div className="row g-3 mb-4 align-items-center">
                    <div className="col-12 col-md-3">
                        <select className="form-select" value={ordenamiento} onChange={handleOrdenamiento}>
                            <option value="recientes">Más recientes</option>
                            <option value="precio-asc">Precio: menor a mayor</option>
                            <option value="precio-desc">Precio: mayor a menor</option>
                            <option value="alfabetico">Alfabéticamente</option>
                        </select>
                    </div>
                    <div className="col-12 col-md-9 text-md-end">
                        <span className="text-secondary">{librosFiltrados.length} resultados</span>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Cargando...</span>
                        </div>
                    </div>
                ) : librosPaginados.length === 0 ? (
                    <div className="text-center py-5">
                        <h5 className="fw-semibold">No se encontraron comics o mangas</h5>
                        <p className="text-secondary">Vuelve pronto, estamos agregando más títulos.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {librosPaginados.map((libro) => (
                            <div key={libro.id_libro} className="col-6 col-sm-4 col-lg-2">
                                <ProductCard
                                    imagen={libro.imagen}
                                    id_libro={libro.id_libro}
                                    titulo={libro.titulo}
                                    autor={libro.autores || libro.editorial || ''}
                                    precio={libro.precio_final ?? libro.precio}
                                    descuento={libro.descuento}
                                    precio_original={libro.precio}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {totalPaginas > 1 && (
                    <nav className="mt-5">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPaginaActual(p => p - 1)}>&laquo;</button>
                            </li>
                            {[...Array(totalPaginas)].map((_, i) => (
                                <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
                                </li>
                            ))}
                            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => setPaginaActual(p => p + 1)}>&raquo;</button>
                            </li>
                        </ul>
                    </nav>
                )}
            </div>
        </>
    )
}