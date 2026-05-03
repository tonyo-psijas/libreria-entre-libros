import React, { useState } from 'react'
import { librosMock } from '../mock_data/mockData'
import { ProfileNavComponent } from '../components/ProfileNav'

export const Catalogo = ({ user }) => {

    const librosPorPagina = 6
    const [paginaActual, setPaginaActual] = useState(1)

    const totalPaginas = Math.ceil(
        librosMock.result.length / librosPorPagina
    )

    const indiceUltimoLibro = paginaActual * librosPorPagina
    const indicePrimerLibro = indiceUltimoLibro - librosPorPagina

    const librosPaginados = librosMock.result.slice(
        indicePrimerLibro,
        indiceUltimoLibro
    )

    const cambiarPagina = (numeroPagina) => {
        setPaginaActual(numeroPagina)
    }

    return (
        <div className='container py-5'>

            <div className="row g-4">
                {/* SIDEBAR */}
                <div className="col-12 col-md-3">

                    {/* Navegación del perfil */}
                    <ProfileNavComponent user={user}/>
                </div>

                {/* CONTENIDO PRINCIPAL */}
                <div className="col-12 col-md-9">

                    <div className="profile-content">

                        {/* Encabezado */}
                        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 gap-md-5 align-items-start align-items-sm-center mb-4">
                            <h4 className="fw-semibold mb-0">Catálogo</h4>
                            
                            <div className='d-flex gap-2 w-100'>

                                <form className="d-flex search-group flex-grow-1" role="search">
                                    <input
                                        className="form-control nav-searchbar"
                                        type="search"
                                        placeholder="Buscar item"
                                        aria-label="Search"
                                    />

                                    <button
                                        className="btn boton-primario boton-search-navbar"
                                        type="submit"
                                    >
                                        <i className="fa-regular fa-magnifying-glass"></i>
                                    </button>
                                </form>
                                
                                <button className='btn boton-primario'>
                                    <span className="d-none d-lg-inline">
                                        Agregar item
                                    </span>{" "}
                                    <i className="fa-regular fa-plus"></i>
                                </button>

                            </div>
                        </div>

                        {/* LIBROS PAGINADOS */}
                        {
                            librosPaginados.map((libro) => (
                                <React.Fragment key={libro.id_libro}>
                                    <hr className='divider'/>

                                    <div
                                        className="
                                            d-flex
                                            flex-column
                                            flex-sm-row
                                            gap-2
                                            justify-content-between
                                            item-libro
                                        "
                                    >
                                        <div className="d-flex gap-3 align-items-start">
                                            <img
                                                className='img-fluid'
                                                src={libro.imagen}
                                                alt={libro.titulo}
                                            />

                                            <div className='book-info'>
                                                <h5 className='fw-semibold'>
                                                    {libro.titulo}
                                                </h5>

                                                <p className='mb-0'>
                                                    Autor:{" "}
                                                    <span className='fw-semibold'>
                                                        {libro.autores.map(
                                                            autor => autor.nombre
                                                        ).join(", ")}
                                                    </span>
                                                </p>

                                                <p className='mb-0'>
                                                    Categorías:{" "}
                                                    <span className='fw-semibold'>
                                                        {libro.generos.map(
                                                            genero => genero.nombre
                                                        ).join(", ")}
                                                    </span>
                                                </p>

                                                <p className='mb'>
                                                    Stock:{" "}
                                                    <span className='fw-semibold'>
                                                        {libro.stock}
                                                    </span>
                                                </p>

                                                <p className='fw-semibold'>
                                                    ${Number(libro.precio).toLocaleString('es-CL')}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="d-flex flex-row flex-sm-column justify-content-between justify-content-sm-start gap-2">
                                            <a className='link-editar'>
                                                <i className="fa-regular fa-pen-to-square"></i> Editar item
                                            </a>

                                            <a className='link-eliminar'>
                                                <i className="fa-solid fa-trash-can"></i> Eliminar
                                            </a>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        }

                        {/* PAGINACIÓN */}
                        <hr className='divider'/>
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">

                                {[...Array(totalPaginas)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${
                                            paginaActual === index + 1
                                                ? "active"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                cambiarPagina(index + 1)
                                            }
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}

                            </ul>
                        </nav>

                    </div>
                </div>
            </div>

        </div>
    )
}