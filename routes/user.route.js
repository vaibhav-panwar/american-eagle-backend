const { Router } = require('express');
const { User } = require('../models/user.model');
const { client } = require('../db/redis');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userRoute = Router();

userRoute.post('/register', async (req, res) => {
    let { name, email, password } = req.body;
    let check = await User.findOne({ email });
    if (check) {
        return res.status(400).send({
            isError: true,
            error: "email already exist "
        })
    }
    try {
        const salt = bcrypt.genSaltSync(Number(process.env.saltRounds));
        const hash = bcrypt.hashSync(password, salt);
        let data = new User({ name, email, password: hash });
        await data.save();
        res.status(200).send({
            isError: false,
            message: "user registered successfully",
            user: data
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }

})

userRoute.post('/login', async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            let accessToken = jwt.sign({
                email, isAdmin: user.isAdmin
            }, process.env.accessToken, { expiresIn: '1h' });
            let refreshToken = jwt.sign({
                email, isAdmin: user.isAdmin
            }, process.env.refreshToken, { expiresIn: '7d' });

            await client.setEx(`${email}access`,60*60,accessToken);
            await client.setEx(`${email}refresh`,60*60*7*24,refreshToken);
            res.status(200).send({
                isError: false,
                message: "login successfull",
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "password is wrong"
            })
        }
    }
    else {
        res.status(400).send({
            isError: true,
            error: "email not found"
        })
    }

})

userRoute.post('/logout', async(req, res) => {
   let {email} = req.body;
    try {
        let accessToken = await client.get(`${email}access`);
        let refreshToken = await client.get(`${email}refresh`);

        await client.set(`${email}access`, "");
        await client.set(`${email}refresh`, "");
        await client.set(`${email}blackaccess`, accessToken);
        await client.set(`${email}blackrefresh`, refreshToken);
        
        res.status(200).send({
            isError: false,
            message: "logout successfull",
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error:"jmd"
        })
    }
})

module.exports = {userRoute};