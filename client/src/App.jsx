import './App.css'
import { libros } from './mock_data/products'
import { NavbarComponent } from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Home } from './views/Home'
import { Profile } from './views/Profile'
import { Catalogo } from './views/Catalogo'
import { Carrito } from './views/Carrito'
import { Favoritos } from './views/Favoritos'
import { Gallery } from './views/Gallery'

function App() {
  console.log(libros)

  const user = {
    id: 1,
    nombre: 'María',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    telefono: '+56 9 1234 5678',
    password: '',
    role: 'admin'
  }

  return (
    <>
      <NavbarComponent user={user} />
        <Routes>

          <Route path='/' element={<Home />} />

          <Route
            path='/perfil'
            element={user ? <Profile user={user} /> : <Navigate to={"/"} />}
          />

          <Route
            path='/carrito'
            element={user ? <Carrito /> : <Navigate to={"/"} />}
          />

          <Route
            path='/favoritos'
            element={user ? <Favoritos /> : <Navigate to={"/"} />}
          />

          <Route
            path='/libros'
            element={user ? <Gallery /> : <Navigate to={"/"} />}
          />

          <Route path='/catalogo'
          element={user && user.role === "admin" ? <Catalogo user={user} /> : <Navigate to={"/"} />} />

          <Route path='*' element={<h1>404 Not Found</h1>} />

        </Routes>
    </>
  )
}

export default App