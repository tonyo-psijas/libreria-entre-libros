import './App.css'
import { libros } from './mock_data/products'
import ProductCard from './components/ProductCard'

function App() {
  console.log(libros)

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

export default App