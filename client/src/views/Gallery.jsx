import React, { useState, useEffect, useMemo } from 'react'
import ProductCard from '../components/ProductCard'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const LIBROS_POR_PAGINA = 24
const NOMBRE_COMICS = "Comics & Mangas"

export const Gallery = () => {
    const [libros, setLibros] = useState([])
    const [idsComics, setIdsComics] = useState(new Set())
    const [generos, setGeneros] = useState([])
    const [loading, setLoading] = useState(true)

    const [busqueda, setBusqueda] = useState('')
    const [ordenamiento, setOrdenamiento] = useState('recientes')
    const [generoSeleccionado, setGeneroSeleccionado] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)

    // Cargar géneros y IDs de comics en paralelo al montar
    useEffect(() => {
        const cargarInicial = async () => {
            try {
                const [resGeneros, resComics] = await Promise.all([
                    fetch(`${BASE_URL}/generos`),
                    fetch(`${BASE_URL}/libros/filtros?genero=${encodeURIComponent(NOMBRE_COMICS)}`)
                ])

                const jsonGeneros = await resGeneros.json()
                const jsonComics = await resComics.json()

                const listaGeneros = Array.isArray(jsonGeneros) ? jsonGeneros : (jsonGeneros.data ?? [])
                const listaComics = Array.isArray(jsonComics) ? jsonComics : (jsonComics.data ?? [])

                // Guardar géneros sin Comics & Mangas
                setGeneros(listaGeneros.filter(g => g.nombre !== NOMBRE_COMICS))
                // Guardar IDs de comics para excluirlos
                setIdsComics(new Set(listaComics.map(l => l.id_libro)))
            } catch (error) {
                console.error("Error al cargar géneros:", error)
            }
        }
        cargarInicial()
    }, [])

    // Cargar libros cuando cambia el género seleccionado
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

                // Excluir Comics & Mangas y libros sin imagen
                setLibros(lista.filter(l => !idsComics.has(l.id_libro) && l.imagen))
            } catch (error) {
                console.error("Error al cargar libros:", error)
            } finally {
                setLoading(false)
            }
        }

        // Solo cargar cuando ya tenemos los IDs de comics
        if (idsComics.size >= 0) cargarLibros()
    }, [generoSeleccionado, generos, idsComics])

    const librosFiltrados = useMemo(() => {
        let resultado = [...libros]

        if (busqueda.trim()) {
            const query = busqueda.toLowerCase()
            resultado = resultado.filter(libro =>
                libro.titulo.toLowerCase().includes(query) ||
                (libro.autores && libro.autores.toLowerCase().includes(query)) ||
                (libro.editorial && libro.editorial.toLowerCase().includes(query))
            )
        }

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
    }, [libros, busqueda, ordenamiento])

    const totalPaginas = Math.ceil(librosFiltrados.length / LIBROS_POR_PAGINA)
    const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA
    const librosPaginados = librosFiltrados.slice(indiceInicio, indiceInicio + LIBROS_POR_PAGINA)

    const handleBusqueda = (e) => { setBusqueda(e.target.value); setPaginaActual(1) }
    const handleOrdenamiento = (e) => { setOrdenamiento(e.target.value); setPaginaActual(1) }
    const handleGenero = (e) => { setGeneroSeleccionado(e.target.value); setPaginaActual(1) }

    return (
        <>
            <div className="section-header">
                <div className="container">
                    <h1>Libros <i className="fa-light fa-book-open"></i></h1>
                </div>
            </div>

            <div className="container pt-5">

                <div className="row g-3 mb-4 align-items-center">
                    <div className="col-12 col-md-4">
                        <div className="d-flex search-group">
                            <input
                                className="form-control nav-searchbar"
                                type="search"
                                placeholder="Buscar por título, autor o editorial"
                                value={busqueda}
                                onChange={handleBusqueda}
                            />
                            <button className="btn boton-primario boton-search-navbar">
                                <i className="fa-regular fa-magnifying-glass"></i>
                            </button>
                        </div>
                    </div>

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

                    <div className="col-12 col-md-2 text-md-end">
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
                        <i className="fa-regular fa-book fa-3x mb-3" style={{ color: '#6B705C' }}></i>
                        <h5 className="fw-semibold">No se encontraron libros</h5>
                        <p className="text-secondary">Intenta con otro término o filtro.</p>
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