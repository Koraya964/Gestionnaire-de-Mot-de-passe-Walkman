import express from 'express';
import argon2 from 'argon2';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// C'est une function pour enrigisterer un nouveau utilisateur
export const registerOneUser = async(req, res) => {
    const user = await User.findOne({email: req.body.email});

    if (user){
        return res.status(401).json({
            message: 'un utilisateur avec le meme email exist deja'
        })
    }else{
        // const hash = argon2.hash(req.body.password);
        try{
            const newUser = await new User(req.body);
            const result = await newUser.save();
            console.log(result);
            res.end(JSON.stringify(result)); //c'est justement pour afficher le contenu de result en navigateur
        }catch(error){
            console.log(error)
        }
    }
}

// c'est une function pour authentication chaque utilisateur en temps de login
export const authenticateUser = async(req, res) => {
    const {email, password} = req.body;
    const secret = "secret" //c'est un mot secret pour encryption et decryption de token

    try{
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message: 'email ou mot de pass incorrect'});

        const matchPassword = await User.findOne({password});
        if(!matchPassword) return res.status(401).json({message: 'email ou mot de pass incorrect'});

        // si l'email et mdp est bien correct les deux on passe un token au navigateur
        const token = jwt.sign({
            id: user._id,
            email: user.email,
            role: user.role
        }, 
        secret
    );
    res.cookie('token', token);
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'Erreur serveur'});
    }

}

// c'est une function pour loging out en temps que l'utilisateur appoyer le button logout
export const logout = (req, res)=> {
    res.clearCookie('token');
    res.redirect('/login')
}