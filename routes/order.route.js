const { Orders } = require("../models/order.model");
const { orderAdminAuth, orderUserAuth } = require('../middlewares/orderAuth');
const { Router } = require('express');

const orderRouter = Router();

orderRouter.get('/', orderUserAuth, async (req, res) => {
    try {
        let { userId } = req.body;
        let data = await Orders.find({ userId });
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

orderRouter.get('/admin', orderAdminAuth, async (req, res) => {
    try {
        let data = await Orders.find();
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

orderRouter.post('/', orderUserAuth, async (req, res) => {
    try {
        let { userID, products, addressID, total } = req.body;
        let order = new Orders({ userID, products, addressID, total });
        await order.save();
        res.status(200).send({
            isError: false,
            message: 'order created successfully',
            order
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

orderRouter.patch('/admin/:id', orderAdminAuth, async (req, res) => {
    let { id } = req.params;
    try {
        let { status } = req.body;
        await Orders.findByIdAndUpdate(id, { status });
        res.status(200).send({
            isError: false,
            message: 'order status updated successfully',
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

module.exports = {orderRouter};
