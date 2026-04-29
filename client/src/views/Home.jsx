import React from 'react'
import { libros } from '../mock_data/products'
import ProductCard from '../components/ProductCard'

export const Home = () => {
    return (
      <>
        {
        libros.result.map((libro) => (
          <ProductCard
            key={libro.id_libro}
            imagen={libro.imagen}
            id_libro={libro.id_libro}
            titulo={libro.titulo}
            autor={libro.autor}
            precio={libro.precio}
          />
        ))
      }
      </>
    )
  }