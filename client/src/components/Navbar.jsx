import React from 'react'
import { NavLink } from 'react-router-dom'

export const NavbarComponent = () => {
  return (
    <header>
      {/* NAVBAR SUPERIOR */}
      <nav className="navbar navbar-expand-md navbar-superior">
        <div className="container">

          {/* LOGO */}
          <a className="navbar-brand" href="#">
            Navbar
          </a>

          {/* SEARCHBAR (queda fuera del collapse) */}
          <div className="nav-search flex-grow-1 mx-5 d-none d-md-block">
            <form className="d-flex w-100 search-group" role="search">
              <input
                className="form-control nav-searchbar"
                type="search"
                placeholder="Busca por título, autor, SKU"
                aria-label="Search"
              />

              <button
                className="btn boton-primario boton-search-navbar"
                type="submit"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* BOTÓN HAMBURGUESA SOLO MOBILE */}
          <button
            className="navbar-toggler d-md-none"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mobileNavbar"
            aria-controls="mobileNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* LOGIN / REGISTER DESKTOP */}
          <ul className="navbar-nav d-none d-md-flex flex-row align-items-center gap-3">
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">
                INGRESAR
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/register" className="nav-link">
                CREAR CUENTA
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <hr className="divider" />

      {/* NAVBAR INFERIOR DESKTOP */}
      <nav className="navbar navbar-inferior d-none d-md-flex">
        <div className="container">
          <ul className="navbar-nav d-flex flex-row align-items-center justify-content-between w-100">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/libros" className="nav-link">
                Libros
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/comics-mangas" className="nav-link">
                Comics & Mangas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/promociones" className="nav-link">
                Promociones
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/preventas" className="nav-link">
                Preventas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/contacto" className="nav-link">
                Contacto
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      {/* COLLAPSE MOBILE */}
      <div
        className="collapse navbar-collapse d-md-none"
        id="mobileNavbar"
      >
        <div className="container">

          {/* SEARCHBAR MOBILE */}
          <div className="nav-search my-3">
            <form className="d-flex w-100 search-group" role="search">
              <input
                className="form-control nav-searchbar"
                type="search"
                placeholder="Busca por título, autor, SKU"
                aria-label="Search"
              />

              <button
                className="btn boton-primario boton-search-navbar"
                type="submit"
              >
                Buscar
              </button>
            </form>
          </div>

          {/* LOGIN / REGISTER */}
          <ul className="navbar-nav mb-3">
            <li className="nav-item">
              <NavLink to="/login" className="nav-link">
                INGRESAR
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/register" className="nav-link">
                CREAR CUENTA
              </NavLink>
            </li>
          </ul>

          <hr className='divider'/>

          {/* NAVLINKS INFERIORES */}
          <ul className="navbar-nav pb-3">
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/libros" className="nav-link">
                Libros
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/comics-mangas" className="nav-link">
                Comics & Mangas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/promociones" className="nav-link">
                Promociones
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/preventas" className="nav-link">
                Preventas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink to="/contacto" className="nav-link">
                Contacto
              </NavLink>
            </li>
          </ul>

        </div>
      </div>
    </header>
  )
}