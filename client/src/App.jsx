import './App.css'
import { libros } from './mock_data/products'
import ProductCard from './components/productCard'
import { NavbarComponent } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Profile } from './views/Profile'

function App() {
  console.log(libros)

  return (
    <>
      <NavbarComponent />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/perfil' element={<Profile />} />
        </Routes>
    </>
  )
}

export default App