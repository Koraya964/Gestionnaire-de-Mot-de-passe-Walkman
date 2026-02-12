import React from "react";
import { Form } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div id="creationCompte">
        <NavLink to="/register" className="creationCompte">
          Créer un compte?
        </NavLink>
      </div>

      <div id="mdpOublie">
        <NavLink to="/mdpOublie" className="mdpOublie">
          Mot de passe oublié?
        </NavLink>
      </div>

      <input type="text" name="email" placeholder="Email" />

      <input type="text" name="password" placeholder="Mot de passe" />

      <button type="submit">Se connecter</button>
    </form>
  );
};

export default LoginPage;
