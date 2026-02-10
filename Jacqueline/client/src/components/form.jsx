import {useForm} from 'react-hook-form'
import React from 'react'

const Form = ({inputs,onSubmit,submitLabel}) => {

    const {register, handleSubmit, formState:{errors}} = useForm()

  return (

    <form onSubmit ={handleSubmit(onSubmit)}>

        {
            inputs.map((input) => (
            
                <div key={input.name}>

                    <label>{input.label}</label>

                    <input type={input.type} {... register(input.name, input.validation)} />

                    {errors [input.name] && (<p>{errors[input.name].message}</p>)}

                </div>
            ))
        }

        <button type="submit"> {submitLabel}</button>

    </form>
  )
}

export default Form