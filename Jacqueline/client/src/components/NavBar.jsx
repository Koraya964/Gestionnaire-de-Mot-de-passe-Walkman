import React from 'react'
import { NavLink } from 'react-router-dom'


const Navbar = () => {

    return (
<>
        <nav className="navBar">
        <nav></nav>
            <NavLink to="/">Accueil</NavLink>
            <NavLink className="navbar-link" to='/aPropos'>A propos</NavLink>
            <NavLink className="navbar-link" to='/tarif'>Tarif</NavLink>
            <NavLink className="navbar-link" to='/faq'>FAQ</NavLink>     
        <div className='link'>
            <button><NavLink className="connexion" to='/login'>Se connecter</NavLink></button>
            <button><NavLink className="creationCompte" to='/register'>Créer un compte</NavLink></button>
            </div>
            
        </nav >
   


            
</>
    )
}

export default Navbar
