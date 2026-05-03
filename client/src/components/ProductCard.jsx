import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'

function ProductCard({id_libro, imagen, titulo, autor, precio, descuento = false, precio_original = null}) {

    const { agregarAlCarrito } = useCart()

    const handleAgregar = () => {
        agregarAlCarrito({
            id_libro,
            imagen,
            titulo,
            autor,
            precio,
        })
    }

    return (

        <Link to={`/libro/${id_libro}`} className='product-card-link'>
            <div key={id_libro} className="product-card">
                <img src={imagen} alt={titulo} class="card-image img-fluid mb-2"/>
                <div className="card-body">
                    <p className="autor-name-card">{autor}</p>
                    <h5 className="card-title">{titulo}</h5>

                    {descuento ? (
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <p className="precio-original mb-0">
                                ${Number(precio_original).toLocaleString('es-CL')}
                            </p>

                            <p className="card-price fw-semibold fs-5 mb-0">
                                ${Number(precio).toLocaleString('es-CL')}
                            </p>
                        </div>
                    ) : (
                        <p className="card-price fw-semibold fs-5">
                            ${Number(precio).toLocaleString('es-CL')}
                        </p>
                    )}

                </div>
                <button
                    className='btn boton-agregar boton-primario'
                    onClick={handleAgregar}
                >
                    Agregar <i className="fa-solid fa-basket-shopping"></i>
                </button>
            </div>
        </Link>
        
    )
}

export default ProductCard;