import './App.css'
import { libros } from './mock_data/products'
import { NavbarComponent } from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Profile } from './views/Profile'
import { Catalogo } from './views/Catalogo'

function App() {
  console.log(libros)

  return (
    <>
      <NavbarComponent />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/perfil' element={<Profile />} />
          <Route path='/catalogo' element={<Catalogo />} />
        </Routes>
    </>
  )
}

export default App