import React from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useUser } from '../context/UserContext'

export const ProfileNavComponent = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { user } = useUser()

    const links = [
        { to: '/perfil', label: 'Mi perfil' },
        { to: '/favoritos', label: 'Favoritos' },
        { to: '/historial-compras', label: 'Historial de compras' },
    ]

    const linksAdmin = [
        { to: '/historial-ventas', label: 'Historial de ventas' },
        { to: '/catalogo', label: 'Catálogo' },
        { to: '/gestion-de-usuarios', label: 'Gestión de usuarios' },
    ]

    const todosLosLinks = user?.role === 'admin'
        ? [...links, ...linksAdmin]
        : links

    return (
        <div className='profile-navbar'>

            {/* DESPLEGABLE — solo visible en mobile (< 768px) */}
            <select
                className="form-select d-md-none"
                value={location.pathname}
                onChange={(e) => navigate(e.target.value)}
            >
                {todosLosLinks.map(link => (
                    <option key={link.to} value={link.to}>
                        {link.label}
                    </option>
                ))}
            </select>

            {/* MENÚ VERTICAL — solo visible en desktop (>= 768px) */}
            <ul className="nav flex-column gap-3 d-none d-md-flex">
                {todosLosLinks.map(link => (
                    <li key={link.to} className="nav-item">
                        <NavLink
                            to={link.to}
                            className={({ isActive }) =>
                                isActive ? 'profile-link active' : 'profile-link'
                            }
                        >
                            {link.label}
                        </NavLink>
                    </li>
                ))}
            </ul>

        </div>
    )
}