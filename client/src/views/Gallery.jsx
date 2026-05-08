import React, { useState, useMemo } from 'react'
import { librosMock, generosMock } from '../mock_data/mockData'
import ProductCard from '../components/ProductCard'

const LIBROS_POR_PAGINA = 24
const ID_COMICS_MANGAS = 14 // id_genero de "Comics & Mangas" en el mock

export const Gallery = () => {

    const [busqueda, setBusqueda] = useState('')
    const [ordenamiento, setOrdenamiento] = useState('recientes')
    const [generoSeleccionado, setGeneroSeleccionado] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)

    // Géneros disponibles, excluyendo Comics & Mangas
    const generos = generosMock.data.filter(g => g.id_genero !== ID_COMICS_MANGAS)

    // Filtrado y ordenamiento con useMemo para no recalcular en cada render
    const librosFiltrados = useMemo(() => {
        let resultado = librosMock.result

        // 1. Excluir Comics & Mangas
        resultado = resultado.filter(libro =>
            !libro.generos.some(g => g.id_genero === ID_COMICS_MANGAS)
        )

        // 2. Filtrar por búsqueda (título o autor)
        if (busqueda.trim()) {
            const query = busqueda.toLowerCase()
            resultado = resultado.filter(libro =>
                libro.titulo.toLowerCase().includes(query) ||
                libro.autores.some(a => a.nombre.toLowerCase().includes(query))
            )
        }

        // 3. Filtrar por género
        if (generoSeleccionado) {
            resultado = resultado.filter(libro =>
                libro.generos.some(g => g.id_genero === parseInt(generoSeleccionado))
            )
        }

        // 4. Ordenar
        switch (ordenamiento) {
            case 'precio-asc':
                resultado = [...resultado].sort((a, b) => a.precio - b.precio)
                break
            case 'precio-desc':
                resultado = [...resultado].sort((a, b) => b.precio - a.precio)
                break
            case 'alfabetico':
                resultado = [...resultado].sort((a, b) => a.titulo.localeCompare(b.titulo))
                break
            case 'recientes':
            default:
                resultado = [...resultado].sort((a, b) => b.id_libro - a.id_libro)
                break
        }

        return resultado
    }, [busqueda, ordenamiento, generoSeleccionado])

    // Paginación
    const totalPaginas = Math.ceil(librosFiltrados.length / LIBROS_POR_PAGINA)
    const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA
    const librosPaginados = librosFiltrados.slice(indiceInicio, indiceInicio + LIBROS_POR_PAGINA)

    // Al cambiar cualquier filtro, volver a página 1
    const handleBusqueda = (e) => { setBusqueda(e.target.value); setPaginaActual(1) }
    const handleOrdenamiento = (e) => { setOrdenamiento(e.target.value); setPaginaActual(1) }
    const handleGenero = (e) => { setGeneroSeleccionado(e.target.value); setPaginaActual(1) }

    return (
        <>
            <div className="section-header">
                <div className="container">
                    <h1>
                        Libros <i className="fa-light fa-book-open"></i>
                    </h1>
                </div>
            </div>

            <div className="container pt-5">

                {/* BARRA DE FILTROS */}
                <div className="row g-3 mb-4 align-items-center">


                    {/* Filtro por género */}
                    <div className="col-6 col-md-3">
                        <select
                            className="form-select"
                            value={generoSeleccionado}
                            onChange={handleGenero}
                        >
                            <option value="">Todos los géneros</option>
                            {generos.map(g => (
                                <option key={g.id_genero} value={g.id_genero}>
                                    {g.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Ordenamiento */}
                    <div className="col-6 col-md-3">
                        <select
                            className="form-select"
                            value={ordenamiento}
                            onChange={handleOrdenamiento}
                        >
                            <option value="recientes">Más recientes</option>
                            <option value="precio-asc">Precio: menor a mayor</option>
                            <option value="precio-desc">Precio: mayor a menor</option>
                            <option value="alfabetico">Alfabéticamente</option>
                        </select>
                    </div>

                    {/* Resultados */}
                    <div className="col-12 col-md-6 text-md-end">
                        <span className="text-secondary">{librosFiltrados.length} resultados</span>
                    </div>

                </div>

                {/* GRILLA DE LIBROS */}
                {librosPaginados.length === 0 ? (
                    <div className="text-center py-5">
                        <i className="fa-regular fa-book fa-3x mb-3" style={{ color: '#6B705C' }}></i>
                        <h5 className="fw-semibold">No se encontraron libros</h5>
                        <p className="text-secondary">Intenta con otro término o filtro.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {librosPaginados.map((libro) => (
                            <div
                                key={libro.id_libro}
                                className="col-6 col-sm-4 col-lg-2"
                            >
                                <ProductCard
                                    imagen={libro.imagen}
                                    id_libro={libro.id_libro}
                                    titulo={libro.titulo}
                                    autor={libro.autores.map(a => a.nombre).join(", ")}
                                    precio={libro.precio}
                                    descuento={libro.descuento}
                                    precio_original={libro.precio_original}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* PAGINACIÓN */}
                {totalPaginas > 1 && (
                    <nav className="mt-5">
                        <ul className="pagination justify-content-center">

                            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPaginaActual(p => p - 1)}
                                >
                                    &laquo;
                                </button>
                            </li>

                            {[...Array(totalPaginas)].map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setPaginaActual(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setPaginaActual(p => p + 1)}
                                >
                                    &raquo;
                                </button>
                            </li>

                        </ul>
                    </nav>
                )}

            </div>
        </>
    )
}