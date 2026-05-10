import React, { useState, useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const LIBROS_POR_PAGINA = 24
const NOMBRE_COMICS = "Comics & Mangas"

export const Promociones = () => {
    const [libros, setLibros] = useState([])
    const [generos, setGeneros] = useState([])
    const [loading, setLoading] = useState(true)
    const [ordenamiento, setOrdenamiento] = useState('recientes')
    const [generoSeleccionado, setGeneroSeleccionado] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)

    // Cargar géneros para el filtro
    useEffect(() => {
        const cargarGeneros = async () => {
            try {
                const res = await fetch(`${BASE_URL}/generos`)
                const json = await res.json()
                const lista = Array.isArray(json) ? json : (json.data ?? [])
                setGeneros(lista.filter(g => g.nombre !== NOMBRE_COMICS))
            } catch (error) {
                console.error("Error al cargar géneros:", error)
            }
        }
        cargarGeneros()
    }, [])

    // Cargar todos los libros con descuento
    useEffect(() => {
        const cargarLibros = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (generoSeleccionado) {
                    const generoNombre = generos.find(
                        g => g.id_genero === parseInt(generoSeleccionado)
                    )?.nombre
                    if (generoNombre) params.append("genero", generoNombre)
                }

                const url = `${BASE_URL}/libros/filtros${params.toString() ? '?' + params.toString() : ''}`
                const res = await fetch(url)
                const json = await res.json()
                const lista = Array.isArray(json) ? json : (json.data ?? [])

                // Filtrar solo libros con descuento y con imagen
                setLibros(lista.filter(l => l.descuento && l.descuento > 0 && l.imagen))
            } catch (error) {
                console.error("Error al cargar promociones:", error)
            } finally {
                setLoading(false)
            }
        }
        cargarLibros()
    }, [generoSeleccionado, generos])

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
    const handleGenero = (e) => { setGeneroSeleccionado(e.target.value); setPaginaActual(1) }

    return (
        <>
            <div className="section-header">
                <div className="container">
                    <h1>Promociones <i className="fa-light fa-badge-percent"></i></h1>
                </div>
            </div>

            <div className="container pt-5">

                <div className="row g-3 mb-4 align-items-center">
                    <div className="col-6 col-md-3">
                        <select className="form-select" value={generoSeleccionado} onChange={handleGenero}>
                            <option value="">Todos los géneros</option>
                            {generos.map(g => (
                                <option key={g.id_genero} value={g.id_genero}>{g.nombre}</option>
                            ))}
                        </select>
                    </div>

                    <div className="col-6 col-md-3">
                        <select className="form-select" value={ordenamiento} onChange={handleOrdenamiento}>
                            <option value="recientes">Más recientes</option>
                            <option value="precio-asc">Precio: menor a mayor</option>
                            <option value="precio-desc">Precio: mayor a menor</option>
                            <option value="alfabetico">Alfabéticamente</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6 text-md-end">
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
                        <i className="fa-regular fa-tag fa-3x mb-3" style={{ color: '#6B705C' }}></i>
                        <h5 className="fw-semibold">No hay promociones disponibles</h5>
                        <p className="text-secondary">Vuelve pronto, estamos preparando nuevas ofertas.</p>
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