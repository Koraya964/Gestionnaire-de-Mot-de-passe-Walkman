import React from 'react'
import Form from '../../components/form.jsx'
import api from '../../api/axios.js'

const RegisterPage = () => {

    const fields = [

        {
            name:"email",

            label:"email",

            type:"email",

            validation:{required:"email requis"}

        },

        {
            name:"password",

            label:"password",

            type:"password",

            validation:{required:"mot de passe requis",minLength:6}

        },

        {
            name:"confirmPassword",

            label:"confirmPassword",

            type:"password",

            validation:{required:"Confirmation de mot de passe requis",minLength:6}

            
        }
    ];

    const onSubmit = async (data) =>{

        try {
            
           await api.post ('/auth/register', data)

            alert("Votre compte a bien été créé")

        } catch (error) {
            
            console.error(error)

            alert(error.response?.data?.message)
        }

    }

  return (
    
    <>
    
    
      <h1> Inscription</h1>

      <Form inputs={fields} onSubmit={onSubmit} submitLabel={"S'inscrire"} />
    
    
    </>
  
  )
}

export default RegisterPage