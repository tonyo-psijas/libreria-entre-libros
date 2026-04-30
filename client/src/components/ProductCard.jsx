function ProductCard({id_libro, imagen, titulo, autor, precio}) {
    return (
        <div key={id_libro} className="product-card">
            <img src={imagen} alt={titulo} class="card-image img-fluid mb-2"/>
            <div className="card-body">
                <p className="autor-name-card">{autor}</p>
                <h5 className="card-title">{titulo}</h5>
                <p className="card-price fw-semibold fs-5">${Number(precio).toLocaleString('es-CL')}</p>
            </div>
            <button className='btn boton-agregar boton-primario'>
                Agregar <i className="fa-solid fa-basket-shopping"></i>
            </button>
        </div>
    )
}

export default ProductCard;