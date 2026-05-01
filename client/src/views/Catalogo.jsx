import React, { useState } from 'react'
import { librosMock } from '../mock_data/mockData'
import { ProfileNavComponent } from '../components/ProfileNav'


export const Catalogo = ({ user }) => {

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
                                        <i class="fa-regular fa-magnifying-glass"></i>
                                    </button>
                                </form>
                                
                                <button className='btn boton-primario'>
                                    <span className="d-none d-lg-inline">
                                        Agregar item
                                    </span>{" "}
                                    <i class="fa-regular fa-plus"></i>
                                </button>

                            </div>

                        </div>


                        {
                        librosMock.result.map((libro) => (
                            <>
                                <hr className='divider'/>
                                <div
                                key={libro.id_libro}
                                className="
                                d-flex
                                flex-column
                                flex-sm-row
                                gap-2
                                justify-content-between
                                item-libro
                                ">
                                
                                    <div className="d-flex gap-3 align-items-start">
                                        <img className='img-fluid' src={libro.imagen} alt={libro.titulo} />
                                        <div className='book-info'>
                                            <h5 className='fw-semibold'>{libro.titulo}</h5>
                                            <p className='mb-0'>
                                                Autor: {" "}
                                                <span className='fw-semibold'>{libro.autores.map(autor => autor.nombre).join(", ")}</span>
                                            </p>
                                            <p className='mb-0'>
                                                Categorías: {" "}
                                                <span className='fw-semibold'>{libro.generos.map(genero => genero.nombre).join(", ")}</span>
                                            </p>
                                            <p className='mb'>
                                                Stock: {" "}
                                                <span className='fw-semibold'>{libro.stock}</span>
                                            </p>
                                            <p className='fw-semibold'>
                                                ${Number(libro.precio).toLocaleString('es-CL')}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row flex-sm-column justify-content-between justify-content-sm-start gap-2">
                                        <a className='link-editar' >
                                            <i className="fa-regular fa-pen-to-square"></i> Editar item
                                        </a>

                                        <a className='link-eliminar' >
                                            <i class="fa-solid fa-trash-can"></i> Eliminar
                                        </a>
                                    </div>
                                </div>
                            </>
                        ))
                        }

                    </div>

                </div>
            </div>

        </div>
    )
    
}