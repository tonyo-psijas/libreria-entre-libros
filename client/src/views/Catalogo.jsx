import React, { useState, useEffect } from 'react'
import { ProfileNavComponent } from '../components/ProfileNav'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"
const LIBROS_POR_PAGINA = 6

const authFetch = (url, options = {}) => {
    const token = localStorage.getItem("token")
    return fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    })
}

const FORM_LIBRO_VACIO = {
    titulo: '', descripcion: '', imagen: '',
    precio: '', stock: '', descuento: 0,
    autores: '', generos: [],
    editorial: '', fecha_publicacion: '',
    numero_paginas: '', formato: 'fisico',
}

export const Catalogo = () => {
    const [libros, setLibros] = useState([])
    const [generos, setGeneros] = useState([])
    const [loading, setLoading] = useState(true)
    const [busqueda, setBusqueda] = useState('')
    const [paginaActual, setPaginaActual] = useState(1)

    // Modal editar
    const [libroEditando, setLibroEditando] = useState(null)
    const [formEditar, setFormEditar] = useState({ ...FORM_LIBRO_VACIO })
    const [guardandoEdicion, setGuardandoEdicion] = useState(false)
    const [mensajeEdicion, setMensajeEdicion] = useState('')

    // Modal agregar
    const [mostrarModalAgregar, setMostrarModalAgregar] = useState(false)
    const [tabAgregar, setTabAgregar] = useState('isbn') // 'isbn' | 'manual'

    // Tab ISBN
    const [isbn, setIsbn] = useState('')
    const [libroBuscado, setLibroBuscado] = useState(null)
    const [buscandoIsbn, setBuscandoIsbn] = useState(false)
    const [errorIsbn, setErrorIsbn] = useState('')
    const [formIsbn, setFormIsbn] = useState({ precio: '', stock: '', descuento: 0 })
    const [guardandoIsbn, setGuardandoIsbn] = useState(false)

    // Tab manual
    const [formManual, setFormManual] = useState({ ...FORM_LIBRO_VACIO })
    const [guardandoManual, setGuardandoManual] = useState(false)
    const [mensajeManual, setMensajeManual] = useState('')

    const cargarGeneros = async () => {
        try {
            const res = await fetch(`${BASE_URL}/generos`)
            const json = await res.json()
            const lista = Array.isArray(json) ? json : (json.data ?? [])
            setGeneros(lista)
        } catch (error) {
            console.error("Error al cargar géneros:", error)
        }
    }

    const cargarLibros = async (q = '') => {
        setLoading(true)
        try {
            const params = q ? `?titulo=${encodeURIComponent(q)}` : ''
            const res = await fetch(`${BASE_URL}/libros/filtros${params}`)
            const json = await res.json()
            const lista = Array.isArray(json) ? json : (json.data ?? [])
            setLibros(lista)
        } catch (error) {
            console.error("Error al cargar libros:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { cargarLibros(); cargarGeneros() }, [])

    const handleBusqueda = (e) => {
        const q = e.target.value
        setBusqueda(q)
        setPaginaActual(1)
        cargarLibros(q)
    }

    const totalPaginas = Math.ceil(libros.length / LIBROS_POR_PAGINA)
    const indiceInicio = (paginaActual - 1) * LIBROS_POR_PAGINA
    const librosPaginados = libros.slice(indiceInicio, indiceInicio + LIBROS_POR_PAGINA)

    // ── HELPERS ─────────────────────────────────────────────
    const toggleGenero = (setter, listaActual, nombre) => {
        setter(prev => ({
            ...prev,
            generos: listaActual.includes(nombre)
                ? listaActual.filter(g => g !== nombre)
                : [...listaActual, nombre]
        }))
    }

    const buildPayload = (form) => ({
        titulo: form.titulo,
        descripcion: form.descripcion,
        imagen: form.imagen,
        precio: Number(form.precio),
        stock: Number(form.stock),
        descuento: Number(form.descuento),
        editorial: form.editorial,
        fecha_publicacion: form.fecha_publicacion || null,
        numero_paginas: form.numero_paginas ? Number(form.numero_paginas) : null,
        formato: form.formato,
        autores: form.autores
            ? form.autores.split(',').map(a => a.trim()).filter(Boolean)
            : [],
        generos: form.generos,
    })

    // ── EDITAR ──────────────────────────────────────────────
    const abrirModalEditar = async (libro) => {
        setMensajeEdicion('')
        try {
            const res = await fetch(`${BASE_URL}/libros/${libro.id_libro}`)
            const detalle = await res.json()
            setLibroEditando(detalle)
            setFormEditar({
                titulo: detalle.titulo || '',
                descripcion: detalle.descripcion || '',
                imagen: detalle.imagen || '',
                precio: detalle.precio || '',
                stock: detalle.stock ?? '',
                descuento: detalle.descuento ?? 0,
                autores: detalle.autores || '',
                generos: detalle.generos
                    ? detalle.generos.split(', ').map(g => g.trim())
                    : [],
                editorial: detalle.editorial || '',
                fecha_publicacion: detalle.fecha_publicacion
                    ? detalle.fecha_publicacion.split('T')[0]
                    : '',
                numero_paginas: detalle.numero_paginas || '',
                formato: detalle.formato || 'fisico',
            })
        } catch (error) {
            console.error("Error al cargar detalle:", error)
        }
    }

    const handleGuardarEdicion = async () => {
        setGuardandoEdicion(true)
        setMensajeEdicion('')
        try {
            const res = await authFetch(`${BASE_URL}/libros/${libroEditando.id_libro}`, {
                method: 'PUT',
                body: JSON.stringify(buildPayload(formEditar)),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setMensajeEdicion('✅ Libro actualizado correctamente.')
            cargarLibros(busqueda)
            setTimeout(() => setLibroEditando(null), 1500)
        } catch (error) {
            setMensajeEdicion(`❌ ${error.message}`)
        } finally {
            setGuardandoEdicion(false)
        }
    }

    // ── DESACTIVAR ───────────────────────────────────────────
    const handleDesactivar = async (libro) => {
        if (!confirm(`¿Desactivar "${libro.titulo}"? No aparecerá en la tienda.`)) return
        try {
            const res = await authFetch(`${BASE_URL}/libros/${libro.id_libro}/desactivar`, { method: 'PUT' })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            cargarLibros(busqueda)
        } catch (error) {
            alert(`❌ ${error.message}`)
        }
    }

    // ── AGREGAR POR ISBN ─────────────────────────────────────
    const handleBuscarIsbn = async () => {
        if (!isbn.trim()) return
        setBuscandoIsbn(true)
        setErrorIsbn('')
        setLibroBuscado(null)
        try {
            const res = await authFetch(`${BASE_URL}/libros/buscar-isbn/${isbn.trim()}`)
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            setLibroBuscado(data)
            setFormIsbn({ precio: '', stock: '', descuento: 0 })
        } catch (error) {
            setErrorIsbn(`❌ ${error.message}`)
        } finally {
            setBuscandoIsbn(false)
        }
    }

    const handleGuardarIsbn = async () => {
        if (!libroBuscado) return
        setGuardandoIsbn(true)
        try {
            const libro = libroBuscado.data
            const res = await authFetch(`${BASE_URL}/libros`, {
                method: 'POST',
                body: JSON.stringify({
                    titulo: libro.titulo,
                    isbn: libro.isbn,
                    descripcion: libro.descripcion,
                    precio: Number(formIsbn.precio),
                    stock: Number(formIsbn.stock),
                    descuento: Number(formIsbn.descuento),
                    formato: libro.formato || 'fisico',
                    editorial: libro.editorial,
                    fecha_publicacion: libro.fecha_publicacion,
                    numero_paginas: libro.numero_paginas,
                    imagen: libro.imagen,
                    autores: libro.autores || [],
                    generos: libro.generos || [],
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            cerrarModalAgregar()
            cargarLibros(busqueda)
            alert('✅ Libro agregado correctamente.')
        } catch (error) {
            alert(`❌ ${error.message}`)
        } finally {
            setGuardandoIsbn(false)
        }
    }

    // ── AGREGAR MANUAL ───────────────────────────────────────
    const handleGuardarManual = async () => {
        if (!formManual.titulo || !formManual.precio || !formManual.stock) {
            setMensajeManual('❌ Título, precio y stock son obligatorios.')
            return
        }
        setGuardandoManual(true)
        setMensajeManual('')
        try {
            const res = await authFetch(`${BASE_URL}/libros`, {
                method: 'POST',
                body: JSON.stringify({
                    ...buildPayload(formManual),
                    isbn: `MANUAL-${Date.now()}`, // ISBN temporal
                }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message)
            cerrarModalAgregar()
            cargarLibros(busqueda)
            alert('✅ Libro agregado correctamente.')
        } catch (error) {
            setMensajeManual(`❌ ${error.message}`)
        } finally {
            setGuardandoManual(false)
        }
    }

    const cerrarModalAgregar = () => {
        setMostrarModalAgregar(false)
        setIsbn('')
        setLibroBuscado(null)
        setErrorIsbn('')
        setFormManual({ ...FORM_LIBRO_VACIO })
        setMensajeManual('')
        setTabAgregar('isbn')
    }

    // ── RENDER CAMPOS COMPARTIDOS ────────────────────────────
    const renderCamposLibro = (form, setForm) => (
        <div className="row g-3">
            <div className="col-12">
                <label className="form-label">Título *</label>
                <input type="text" className="form-control form-input"
                    value={form.titulo}
                    onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} />
            </div>

            <div className="col-12">
                <label className="form-label">Descripción</label>
                <textarea className="form-control form-long-text" rows={3}
                    value={form.descripcion}
                    onChange={e => setForm(p => ({ ...p, descripcion: e.target.value }))} />
            </div>

            <div className="col-12">
                <label className="form-label">URL de imagen</label>
                <input type="text" className="form-control form-input"
                    placeholder="https://..."
                    value={form.imagen}
                    onChange={e => setForm(p => ({ ...p, imagen: e.target.value }))} />
                {form.imagen && (
                    <img src={form.imagen} alt="preview"
                        style={{ width: '60px', marginTop: '8px', borderRadius: '6px' }}
                        onError={e => e.target.style.display = 'none'} />
                )}
            </div>

            <div className="col-12">
                <label className="form-label">
                    Autores <span className="text-secondary fw-light">(separados por coma)</span>
                </label>
                <input type="text" className="form-control form-input"
                    placeholder="Ej: Gabriel García Márquez, Isabel Allende"
                    value={form.autores}
                    onChange={e => setForm(p => ({ ...p, autores: e.target.value }))} />
            </div>

            <div className="col-12">
                <label className="form-label">Géneros</label>
                <div className="d-flex flex-wrap gap-2">
                    {generos.map(g => (
                        <button key={g.id_genero} type="button"
                            className={`btn btn-sm ${form.generos.includes(g.nombre) ? 'boton-primario' : 'boton-secundario'}`}
                            onClick={() => toggleGenero(setForm, form.generos, g.nombre)}>
                            {g.nombre}
                        </button>
                    ))}
                </div>
            </div>

            <div className="col-12">
                <label className="form-label">Editorial</label>
                <input type="text" className="form-control form-input"
                    value={form.editorial}
                    onChange={e => setForm(p => ({ ...p, editorial: e.target.value }))} />
            </div>

            <div className="col-12 col-sm-6">
                <label className="form-label">Fecha de publicación</label>
                <input type="date" className="form-control form-input"
                    value={form.fecha_publicacion}
                    onChange={e => setForm(p => ({ ...p, fecha_publicacion: e.target.value }))} />
            </div>

            <div className="col-12 col-sm-6">
                <label className="form-label">Número de páginas</label>
                <input type="number" className="form-control form-input"
                    value={form.numero_paginas}
                    onChange={e => setForm(p => ({ ...p, numero_paginas: e.target.value }))} />
            </div>

            <div className="col-12 col-sm-6">
                <label className="form-label">Formato</label>
                <select className="form-select" value={form.formato}
                    onChange={e => setForm(p => ({ ...p, formato: e.target.value }))}>
                    <option value="fisico">Físico</option>
                    <option value="digital">Digital</option>
                    <option value="preventa">Preventa</option>
                </select>
            </div>

            <div className="col-12">
                <label className="form-label">Precio (CLP) *</label>
                <input type="number" className="form-control form-input"
                    value={form.precio}
                    onChange={e => setForm(p => ({ ...p, precio: e.target.value }))} />
            </div>

            <div className="col-6">
                <label className="form-label">Stock *</label>
                <input type="number" className="form-control form-input"
                    value={form.stock}
                    onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
            </div>

            <div className="col-6">
                <label className="form-label">Descuento (%)</label>
                <input type="number" className="form-control form-input"
                    min="0" max="100"
                    value={form.descuento}
                    onChange={e => setForm(p => ({ ...p, descuento: e.target.value }))} />
            </div>
        </div>
    )

    return (
        <div className='container py-5'>
            <div className="row g-4">

                {/* SIDEBAR */}
                <div className="col-12 col-md-3">
                    <ProfileNavComponent />
                </div>

                {/* CONTENIDO */}
                <div className="col-12 col-md-9">
                    <div className="profile-content">

                        <div className="d-flex flex-column flex-sm-row justify-content-between gap-3 align-items-start align-items-sm-center mb-4">
                            <h4 className="fw-semibold mb-0">Catálogo</h4>
                            <div className='d-flex gap-2 w-100'>
                                <form className="d-flex search-group flex-grow-1" onSubmit={e => e.preventDefault()}>
                                    <input className="form-control nav-searchbar" type="search"
                                        placeholder="Buscar libro" value={busqueda} onChange={handleBusqueda} />
                                    <button className="btn boton-primario boton-search-navbar" type="submit">
                                        <i className="fa-regular fa-magnifying-glass"></i>
                                    </button>
                                </form>
                                <button className='btn boton-primario' onClick={() => setMostrarModalAgregar(true)}>
                                    <span className="d-none d-lg-inline">Agregar item</span>{" "}
                                    <i className="fa-regular fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" role="status">
                                    <span className="visually-hidden">Cargando...</span>
                                </div>
                            </div>
                        ) : libros.length === 0 ? (
                            <p className="text-secondary text-center py-4">No se encontraron libros.</p>
                        ) : (
                            librosPaginados.map((libro) => (
                                <React.Fragment key={libro.id_libro}>
                                    <hr className='divider' />
                                    <div className="d-flex flex-column flex-sm-row gap-2 justify-content-between item-libro">
                                        <div className="d-flex gap-3 align-items-start">
                                            {libro.imagen && <img className='img-fluid' src={libro.imagen} alt={libro.titulo} />}
                                            <div className='book-info'>
                                                <h5 className='fw-semibold mb-1'>{libro.titulo}</h5>
                                                {libro.autores && <p className='mb-0'>Autor: <span className='fw-semibold'>{libro.autores}</span></p>}
                                                <p className='mb-0'>Editorial: <span className='fw-semibold'>{libro.editorial}</span></p>
                                                <p className='mb-0'>Stock: <span className='fw-semibold'>{libro.stock ?? '—'}</span></p>
                                                {libro.descuento > 0 && <p className='mb-0'>Descuento: <span className='fw-semibold'>{libro.descuento}%</span></p>}
                                                <p className='fw-semibold card-price mb-0'>
                                                    ${Number(libro.precio_final ?? libro.precio).toLocaleString('es-CL')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-row flex-sm-column justify-content-between justify-content-sm-start gap-2">
                                            <button className='link-editar btn btn-sm' onClick={() => abrirModalEditar(libro)}>
                                                <i className="fa-regular fa-pen-to-square"></i> Editar
                                            </button>
                                            <button className='link-eliminar btn btn-sm' onClick={() => handleDesactivar(libro)}>
                                                <i className="fa-solid fa-trash-can"></i> Desactivar
                                            </button>
                                        </div>
                                    </div>
                                </React.Fragment>
                            ))
                        )}

                        {totalPaginas > 1 && (
                            <>
                                <hr className='divider' />
                                <nav className="mt-4">
                                    <ul className="pagination justify-content-center">
                                        {[...Array(totalPaginas)].map((_, i) => (
                                            <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                                                <button className="page-link" onClick={() => setPaginaActual(i + 1)}>{i + 1}</button>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* ── MODAL EDITAR ─────────────────────────────────── */}
            {libroEditando && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
                    <div className="profile-content" style={{ width: '100%', maxWidth: '560px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-semibold mb-0">Editar libro</h5>
                            <button className="btn btn-sm" onClick={() => setLibroEditando(null)}>✕</button>
                        </div>
                        <hr className="divider mb-3" />

                        {renderCamposLibro(formEditar, setFormEditar)}

                        {mensajeEdicion && <p className="mt-3 mb-0">{mensajeEdicion}</p>}

                        <div className="d-flex gap-2 mt-4">
                            <button className="btn boton-primario" onClick={handleGuardarEdicion} disabled={guardandoEdicion}>
                                {guardandoEdicion ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                            <button className="btn boton-secundario" onClick={() => setLibroEditando(null)}>Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── MODAL AGREGAR ────────────────────────────────── */}
            {mostrarModalAgregar && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 }}>
                    <div className="profile-content" style={{ width: '100%', maxWidth: '580px', margin: '1rem', maxHeight: '90vh', overflowY: 'auto' }}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="fw-semibold mb-0">Agregar libro</h5>
                            <button className="btn btn-sm" onClick={cerrarModalAgregar}>✕</button>
                        </div>

                        {/* TABS */}
                        <ul className="nav nav-tabs mb-4">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${tabAgregar === 'isbn' ? 'active' : ''}`}
                                    onClick={() => setTabAgregar('isbn')}
                                >
                                    Por ISBN
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${tabAgregar === 'manual' ? 'active' : ''}`}
                                    onClick={() => setTabAgregar('manual')}
                                >
                                    Manual
                                </button>
                            </li>
                        </ul>

                        {/* TAB ISBN */}
                        {tabAgregar === 'isbn' && (
                            <>
                                <div className="d-flex gap-2 mb-3">
                                    <input type="text" className="form-control form-input"
                                        placeholder="Ej: 9788466379717"
                                        value={isbn}
                                        onChange={e => setIsbn(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleBuscarIsbn()} />
                                    <button className="btn boton-primario" onClick={handleBuscarIsbn} disabled={buscandoIsbn}>
                                        {buscandoIsbn ? '...' : 'Buscar'}
                                    </button>
                                </div>

                                {errorIsbn && <p className="text-danger mb-3">{errorIsbn}</p>}

                                {libroBuscado && (
                                    <>
                                        <div className="d-flex gap-3 mb-3 p-3" style={{ backgroundColor: '#F1F2ED', borderRadius: '12px' }}>
                                            {libroBuscado.data.imagen && (
                                                <img src={libroBuscado.data.imagen} alt={libroBuscado.data.titulo}
                                                    style={{ width: '60px', borderRadius: '6px', objectFit: 'cover' }} />
                                            )}
                                            <div>
                                                <p className="fw-semibold mb-0">{libroBuscado.data.titulo}</p>
                                                {libroBuscado.data.autores?.length > 0 && (
                                                    <p className="text-secondary mb-1">{libroBuscado.data.autores.join(', ')}</p>
                                                )}
                                                <span className="badge" style={{ backgroundColor: '#6B705C' }}>
                                                    Fuente: {libroBuscado.origen}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label className="form-label">Precio (CLP) *</label>
                                                <input type="number" className="form-control form-input"
                                                    value={formIsbn.precio}
                                                    onChange={e => setFormIsbn(p => ({ ...p, precio: e.target.value }))} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label">Stock *</label>
                                                <input type="number" className="form-control form-input"
                                                    value={formIsbn.stock}
                                                    onChange={e => setFormIsbn(p => ({ ...p, stock: e.target.value }))} />
                                            </div>
                                            <div className="col-6">
                                                <label className="form-label">Descuento (%)</label>
                                                <input type="number" className="form-control form-input"
                                                    min="0" max="100"
                                                    value={formIsbn.descuento}
                                                    onChange={e => setFormIsbn(p => ({ ...p, descuento: e.target.value }))} />
                                            </div>
                                        </div>

                                        <div className="d-flex gap-2 mt-4">
                                            <button className="btn boton-primario" onClick={handleGuardarIsbn}
                                                disabled={guardandoIsbn || !formIsbn.precio || !formIsbn.stock}>
                                                {guardandoIsbn ? 'Guardando...' : 'Agregar al catálogo'}
                                            </button>
                                            <button className="btn boton-secundario" onClick={cerrarModalAgregar}>Cancelar</button>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* TAB MANUAL */}
                        {tabAgregar === 'manual' && (
                            <>
                                {renderCamposLibro(formManual, setFormManual)}

                                {mensajeManual && <p className="mt-3 mb-0">{mensajeManual}</p>}

                                <div className="d-flex gap-2 mt-4 mb-2">
                                    <button className="btn boton-primario" onClick={handleGuardarManual} disabled={guardandoManual}>
                                        {guardandoManual ? 'Guardando...' : 'Agregar al catálogo'}
                                    </button>
                                    <button className="btn boton-secundario" onClick={cerrarModalAgregar}>Cancelar</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}