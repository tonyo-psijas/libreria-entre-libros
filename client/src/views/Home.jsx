import React from 'react'
import { libros } from '../mock_data/products'
import ProductCard from '../components/ProductCard'
import { HeroComponent } from '../components/HeroComponent'

export const Home = () => {
    return (
        <>
            <HeroComponent />
            <div className='container'>
                <div className="row g-4 py-5">
                    {
                    libros.result.map((libro) => (
                        <div
                        key={libro.id_libro}
                        className="
                        col-6
                        col-sm-4
                        col-lg-2
                        "
                    >
                        <ProductCard
                        imagen={libro.imagen}
                        id_libro={libro.id_libro}
                        titulo={libro.titulo}
                        autor={libro.autor}
                        precio={libro.precio}
                        />
                    </div>
                    ))
                    }
                </div>
            </div>
        </>
    )
  }