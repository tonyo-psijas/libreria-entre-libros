import React from 'react'
import { libros } from '../mock_data/products'
import ProductCard from '../components/ProductCard'

export const Home = () => {
    return (
      <div className='container'>
        <div className="row g-4">
            {
            libros.result.map((libro) => (
                <div
                key={libro.id_libro}
                className="
                  col-12
                  col-sm-6
                  col-md-4
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
    )
  }