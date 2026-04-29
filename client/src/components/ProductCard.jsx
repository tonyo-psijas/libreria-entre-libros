function ProductCard({id_libro, imagen, titulo, autor, precio}) {
    return (
        <div key={id_libro}>
            <img src={imagen} alt={titulo} class="card-image"/>
            <p>{autor}</p>
            <h2>{titulo}</h2>
            <p>${precio}</p>
            <button class='btn btn-dark'>Agregar</button>
        </div>
    )
}

export default ProductCard;