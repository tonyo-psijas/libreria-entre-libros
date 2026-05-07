import React, { useState, useMemo } from 'react'
import { librosMock } from '../mock_data/mockData'
import ProductCard from '../components/ProductCard'

const LIBROS_POR_PAGINA = 24
const ID_COMICS_MANGAS = 14

export const ComicsMangas = () => {
    const [ordenamiento, setOrdenamiento] = useState('recientes')
    const [paginaActual, setPaginaActual] = useState(1)

    // handler que faltaba
    const handleOrdenamiento = (e) => {
        setOrdenamiento(e.target.value)
        setPaginaActual(1)
    }


    const librosFiltrados = useMemo(() => {
        let resultado = [...librosMock.result]

        // SOLO Comics & Mangas
        resultado = resultado.filter(libro =>
            libro.generos.some(
                genero => genero.id_genero === ID_COMICS_MANGAS
            )
        )


        // ordenamiento
        switch (ordenamiento) {
            case 'precio-asc':
                resultado.sort((a, b) => a.precio - b.precio)
                break

            case 'precio-desc':
                resultado.sort((a, b) => b.precio - a.precio)
                break

            case 'alfabetico':
                resultado.sort((a, b) =>
                    a.titulo.localeCompare(b.titulo)
                )
                break

            case 'recientes':
            default:
                resultado.sort((a, b) =>
                    b.id_libro - a.id_libro
                )
                break
        }

        return resultado
    }, [ordenamiento])

    // paginación que faltaba
    const totalPaginas = Math.ceil(
        librosFiltrados.length / LIBROS_POR_PAGINA
    )

    const indiceInicial =
        (paginaActual - 1) * LIBROS_POR_PAGINA

    const indiceFinal =
        indiceInicial + LIBROS_POR_PAGINA

    const librosPaginados = librosFiltrados.slice(
        indiceInicial,
        indiceFinal
    )

    return (
        <>
            <div className="section-header">
                <div className="container">
                    <h1>
                        Comics & Mangas {" "}
                        <i class="fa-light fa-thought-bubble"></i>
                    </h1>
                </div>
            </div>

            <div className="container pt-5">

                {/* BARRA DE FILTROS */}
                <div className="row g-3 mb-4 align-items-center">


                    {/* ordenamiento */}
                    <div className="col-12 col-md-3">
                        <select
                            className="form-select"
                            value={ordenamiento}
                            onChange={handleOrdenamiento}
                        >
                            <option value="recientes">
                                Más recientes
                            </option>

                            <option value="precio-asc">
                                Precio: menor a mayor
                            </option>

                            <option value="precio-desc">
                                Precio: mayor a menor
                            </option>

                            <option value="alfabetico">
                                Alfabéticamente
                            </option>
                        </select>
                    </div>

                    {/* resultados */}
                    <div className="col-6 col-md-9 text-md-end">
                        <span className="text-secondary">
                            {librosFiltrados.length} resultados
                        </span>
                    </div>

                </div>

                {/* GRILLA */}
                {librosPaginados.length === 0 ? (
                    <div className="text-center py-5">
                        <h5 className="fw-semibold">
                            No se encontraron libros
                        </h5>

                        <p className="text-secondary">
                            Intenta con otro término o filtro
                        </p>
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
                                    autor={libro.autores
                                        .map(a => a.nombre)
                                        .join(", ")}
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

                            <li
                                className={`page-item ${
                                    paginaActual === 1
                                        ? 'disabled'
                                        : ''
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setPaginaActual(p => p - 1)
                                    }
                                >
                                    &laquo;
                                </button>
                            </li>

                            {[...Array(totalPaginas)].map((_, i) => (
                                <li
                                    key={i}
                                    className={`page-item ${
                                        paginaActual === i + 1
                                            ? 'active'
                                            : ''
                                    }`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() =>
                                            setPaginaActual(i + 1)
                                        }
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            ))}

                            <li
                                className={`page-item ${
                                    paginaActual === totalPaginas
                                        ? 'disabled'
                                        : ''
                                }`}
                            >
                                <button
                                    className="page-link"
                                    onClick={() =>
                                        setPaginaActual(p => p + 1)
                                    }
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