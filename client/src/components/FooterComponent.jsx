import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import logoFooter from '../assets/images/logo-footer.png'
import iconoFacebook from '../assets/images/icono-facebook.png'
import iconoInstagram from '../assets/images/icono-insta.png'
import iconoTwitter from '../assets/images/icono-x.png'


export const FooterComponent = () => {
  return (
    <footer className='mt-5'>
      <div className="container">

        <div className="row g-5 g-sm-4">

          <div className="col-12 col-sm-6 col-md-3">
            {/* LOGO */}
            <NavLink to="/" className="navbar-brand">
              <img className='img-fluid logo-footer' src={logoFooter} alt="logo-footer" />
            </NavLink>
          </div>

          <div className="col-12 col-sm-6 col-md-3">

            <ul className='d-flex flex-column gap-2 list-unstyled'>
              <li>
                <p className='fw-semibold mb-2'>Servicio al Cliente</p>
              </li>

              <li>
                <Link className='text-decoration-none fw-light'>Términos y condiciones</Link>
              </li>

              <li>
                <Link className='text-decoration-none fw-light'>Política de privacidad</Link>
              </li>

              <li>
                <Link className='text-decoration-none fw-light'>Política de despacho</Link>
              </li>

              <li>
                <Link className='text-decoration-none fw-light'>Atención al cliente</Link>
              </li>
            </ul>

          </div>

          <div className="col-12 col-sm-6 col-md-3">
              <ul className='d-flex flex-column gap-2 list-unstyled'>
                <li>
                  <p className='fw-semibold mb-2'>Nuestra empresa</p>
                </li>

                <li>
                  <Link className='text-decoration-none fw-light'>Sobre nosotros</Link>
                </li>

                <li>
                  <Link className='text-decoration-none fw-light'>Nuestras tiendas</Link>
                </li>

                <li>
                  <Link className='text-decoration-none fw-light'>Trabaja con nosotros</Link>
                </li>

              </ul>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
          <ul className='d-flex flex-column gap-2 list-unstyled'>
                <li>
                  <p className='fw-semibold mb-2'>Contacto</p>
                </li>

                <li>
                  <a className='text-decoration-none fw-light' href="contacto@entrelibros.cl">contacto@entrelibros.cl</a>
                </li>

                <li>
                  <Link className='text-decoration-none fw-light'>+ 56 2 2200 3345</Link>
                </li>

                <li className='rrss-footer d-flex gap-3'>
                  <a className='text-decoration-none' href="#">
                    <img src={iconoFacebook} alt="facebook" className='img-fluid'/>
                  </a>

                  <a className='text-decoration-none' href="#">
                    <img src={iconoInstagram} alt="instagram" className='img-fluid'/>
                  </a>

                  <a className='text-decoration-none' href="#">
                    <img src={iconoTwitter} alt="twitter" className='img-fluid'/>
                  </a>

                </li>

              </ul>
          </div>

        </div>

      </div>

      <br />
        <hr className='divider'/>
        <p className='text-center text-secondary fw-light mt-2'>Todos los derechos reservados © 2026</p>
  
    </footer>
  )
}
