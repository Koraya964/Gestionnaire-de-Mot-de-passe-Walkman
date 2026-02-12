import React from 'react'
import { NavLink } from 'react-router-dom'


const Navbar = () => {

    return (
<>
        <nav className="navbar shadow-1 meadow light-1">
            <NavLink to="/" className="navbar-brand">Accueil</NavLink>
            <NavLink className="navbar-link" to='/aPropos'>A propos</NavLink>
            <NavLink className="navbar-link" to='/tarif'>Tarif</NavLink>
            <NavLink className="navbar-link" to='/faq'>FAQ</NavLink>
        </nav >
        <div>
            <button><NavLink className="connexion" to='/login'>Se connecter</NavLink></button>
            <button><NavLink className="creationCompte" to='/register'>Créer un compte</NavLink></button>
            </div>
            
</>
    )
}

export default Navbar