const { Router } = require('express');
const { Product } = require('../models/products.model');
const {productAdminAuth} = require('../middlewares/productAuth');

const productRoute = Router();

productRoute.get("/", async (req, res) => {
    try {
        let data = await Product.find();
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

productRoute.post('/',productAdminAuth, async (req, res) => {
    try {
        let { title, image1, image2, gender, category, price, description, size, discount, quantity } = req.body;
        let prod = new Product({ title, image1, image2, gender, category, price, description, size, discount, quantity });
        await prod.save();
        res.status(200).send({
            isError: false,
            message: "product created successfully",
            product: prod
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error: error.message
        })
    }
})

productRoute.patch('/:id',productAdminAuth, async (req, res) => {
    let { id } = req.params;
    try {
        await Product.findByIdAndUpdate(id, req.body);
        res.status(200).send({
            isError: false,
            message: "product updated successfully"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

productRoute.delete('/:id',productAdminAuth, async (req, res) => {
    let { id } = req.params;
    try {
        await Product.findByIdAndDelete(id);
        res.status(200).send({
            isError: false,
            message: "product deleted successfully"
        })
    } catch (error) {
        res.status(400).send({
            isError: true,
            error
        })
    }
})

module.exports = { productRoute };