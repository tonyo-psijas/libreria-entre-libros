import React from 'react'
import { NavLink } from 'react-router-dom'

export const ProfileNavComponent = () => {
    return (
        <div className='profile-navbar'>
            <ul className="nav flex-column gap-3">

                <li className="nav-item">
                    <NavLink
                        to="/perfil"
                        className={({ isActive }) =>
                            isActive
                                ? 'profile-link active'
                                : 'profile-link'
                        }
                    >
                        Mi perfil
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/favoritos"
                        className={({ isActive }) =>
                            isActive
                                ? 'profile-link active'
                                : 'profile-link'
                        }
                    >
                        Favoritos
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/historial-compras"
                        className={({ isActive }) =>
                            isActive
                                ? 'profile-link active'
                                : 'profile-link'
                        }
                    >
                        Historial de compras
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/historial-ventas"
                        className={({ isActive }) =>
                            isActive
                                ? 'profile-link active'
                                : 'profile-link'
                        }
                    >
                        Historial de ventas
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/catalogo"
                        className={({ isActive }) =>
                            isActive
                                ? 'profile-link active'
                                : 'profile-link'
                        }
                    >
                        Catálogo
                    </NavLink>
                </li>

                <li className="nav-item">
                    <NavLink
                        to="/gestion-de-usuarios"
                        className={({ isActive }) =>
                            isActive
                                ? 'profile-link active'
                                : 'profile-link'
                        }
                    >
                        Gestión de usuarios
                    </NavLink>
                </li>

            </ul>
        </div>
    )
}