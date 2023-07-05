const { cartUserAuth } = require("../middlewares/cartAuth");
const { Address } = require("../models/address.model");
const { Router } = require('express');

const addressRoute = Router();
addressRoute.use(cartUserAuth);

addressRoute.get("/", async (req, res) => {
    try {
        let { userID } = req.body;
        let data = await Address.find({ userID });
        res.status(200).send({
            isError: false,
            data
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

addressRoute.post('/', async (req, res) => {
    try {
        let { type, name, phoneNo, address, userID } = req.body;
        let Addresss = new Address({ type, name, phoneNo, address, userID });
        await Addresss.save();
        res.status(200).send({
            isError: false,
            message: "address created successfully",
            Addresss
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

addressRoute.patch('/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let data = await Address.findById(id);
        if (data.userID === req.body.userID) {
            await Address.findByIdAndUpdate(id, req.body);
            res.status(200).send({
                isError: false,
                message: "address updated successfully"
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "not authorised"
            })
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

addressRoute.delete('/:id', async (req, res) => {
    let { id } = req.params;
    try {
        let data = await Address.findById(id);
        if (data.userID === req.body.userID) {
            await Address.findByIdAndDelete(id);
            res.status(200).send({
                isError: false,
                message: "address deleted successfully"
            })
        }
        else {
            res.status(400).send({
                isError: true,
                error: "not authorised"
            })
        }
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

module.exports = {addressRoute}

