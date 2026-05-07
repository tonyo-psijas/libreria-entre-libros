import React from 'react'
import { Link } from 'react-router-dom'

export const HeroComponent = () => {
    return (
        <div className='hero'>
            <div className="hero-content container">
                <div className="hero-texts">
                    <h1 className="display-5 fw-semibold">
                        50% de descuento en
                        productos seleccionados
                    </h1>
                    <p className='text-secondary'>
                        Encuentra las mejores ofertas en nuestra tienda virtual.
                        Ofertas válidas hasta el 30 de Junio.
                    </p>

                    <Link to="/promociones">
                        <button className='btn boton-agregar boton-primario mt-3'>
                            VER OFERTAS <i className="fa-regular fa-chevron-right"></i>
                        </button>
                    </Link>
                    
                </div>
                    
                
            </div>
        </div>
    )
}