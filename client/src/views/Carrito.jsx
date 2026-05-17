import { useCart } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

export const Carrito = () => {

    const { carrito, quitarDelCarrito, actualizarCantidad, vaciarCarrito, totalItems, totalPrecio } = useCart()

    const navigate = useNavigate()

    if (carrito.length === 0) {
        return (
            <div className="container py-5 text-center">

                <i class="fa-duotone fa-solid fa-basket-shopping fa-3x mb-3"></i>
                <h4 className="fw-semibold">Tu carrito está vacío</h4>
                <p className="text-secondary">Agrega libros desde nuestra tienda.</p>
                <Link to="/libros" className="btn boton-primario mt-2">
                    Ver libros
                </Link>
            </div>
        )
    }

    return (
        <div className="container py-5">

            <div className="row g-4 align-items-start">

                
                <div className="col-12 col-lg-8">
                    <div className="profile-content">

                    {/* ENCABEZADO */}
                    <div className="d-flex justify-content-between mb-3">
                        <h4 className="fw-semibold">Mi carrito ({totalItems} {totalItems === 1 ? 'libro' : 'libros'})</h4>

                        {/* Vaciar carrito */}
                        <div className="text-end">
                            <button
                                className="link-eliminar btn btn-sm"
                                onClick={vaciarCarrito}
                            >
                                <i className="fa-regular fa-trash-can"></i> Vaciar carrito
                            </button>
                        </div>
                    </div>
                    
                    {/* LISTA DE ITEMS */}
                        {carrito.map((item, index) => (
                            <div key={item.id_libro}>
                                <hr className='divider'/>
                                <div className="d-flex gap-3 align-items-center item-libro">

                                    {/* Imagen */}
                                    <img src={item.imagen} alt={item.titulo} />

                                    {/* Todo lo que va a la derecha de la imagen */}
                                    <div className="flex-grow-1 d-flex flex-column flex-sm-row align-items-sm-center gap-2 gap-sm-3">

                                      {/* Info */}
                                      <div className="flex-grow-1">
                                          <p className="autor-name-card mb-0">{item.autor}</p>
                                          <h5 className="fw-semibold mb-0">{item.titulo}</h5>
                                      </div>

                                      {/* Cantidad, subtotal y eliminar */}
                                      <div className="d-flex flex-column flex-md-row align-items-start align-items-sm-center gap-3">
                                          {/* Cantidad */}
                                          <div className="d-flex align-items-center gap-2">
                                              <button
                                                  className="btn btn-sm boton-secundario px-2 py-0"
                                                  onClick={() => actualizarCantidad(item.id_libro, item.cantidad - 1)}
                                              >
                                                  −
                                              </button>
                                              <span className="fw-semibold">{item.cantidad}</span>
                                              <button
                                                  className="btn btn-sm boton-secundario px-2 py-0"
                                                  onClick={() => actualizarCantidad(item.id_libro, item.cantidad + 1)}
                                              >
                                                  +
                                              </button>
                                          </div>

                                          {/* Subtotal */}
                                          <p className="fw-semibold mb-0" style={{ textAlign: 'center' }}>
                                              ${Number(item.precio * item.cantidad).toLocaleString('es-CL')}
                                          </p>

                                          {/* Eliminar */}
                                          <button
                                              className="link-eliminar btn btn-sm"
                                              onClick={() => quitarDelCarrito(item.id_libro)}
                                              title="Quitar del carrito"
                                          >
                                              <i className="fa-regular fa-trash-can"></i>
                                          </button>
                                      </div>

                                    </div>

                                </div>

                                {/* Divider entre items, excepto el último */}
                                {index < carrito.length - 1 && <hr className="divider" />}
                            </div>
                        ))}

                        

                    </div>
                </div>

                {/* RESUMEN DE COMPRA */}
                <div className="col-12 col-lg-4">
                    <div className="profile-content">
                        <h6 className="fw-semibold mb-3">Resumen de compra</h6>
                        <hr className="divider mb-3" />

                        <div className="d-flex justify-content-between text-secondary mb-2">
                            <span>Subtotal ({totalItems} {totalItems === 1 ? 'libro' : 'libros'})</span>
                            <span>${Number(totalPrecio).toLocaleString('es-CL')}</span>
                        </div>

                        <div className="d-flex justify-content-between text-secondary mb-3">
                            <span>Envío</span>
                            <span>Por calcular</span>
                        </div>

                        <hr className="divider mb-3" />

                        <div className="d-flex justify-content-between fw-semibold mb-4">
                            <span>Total</span>
                            <span className="card-price">${Number(totalPrecio).toLocaleString('es-CL')}</span>
                        </div>

                        <button className="btn boton-primario py-2 w-100" onClick={() => navigate('/checkout')}>
                            Continuar con el pago {" "}
                            <i class="fa-regular fa-chevron-right"></i>
                        </button>

                        <div className="text-center mt-2 mb-2">
                            <Link to="/libros" className="btn boton-secundario w-100">
                                ← Seguir comprando
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}