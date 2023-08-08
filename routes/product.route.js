const { Router, query } = require('express');
const { Product } = require('../models/products.model');
const { productAdminAuth } = require('../middlewares/productAuth');

const productRoute = Router();

productRoute.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // default to page 1
        const limit = parseInt(req.query.limit) || 9; // default to limit of 10 products per page
        const skipIndex = (page - 1) * limit;
        let sortField = {};
        let searchQuery = {};
        if (req.query.sort) {
            if (req.query.sort == "asc") {
                sortField.price = 1;
            }
            else {
                sortField.price = -1;
            }
        }
        if (req.query.gender) {
            searchQuery.gender = req.query.gender
        }
        if (req.query.category) {
            searchQuery.category = req.query.category
        }
        if (req.query.price) {
           searchQuery.price = {$lte:req.query.price};
        }
        const totalCount = await Product.find(searchQuery).countDocuments();
        let data = await Product.find(searchQuery).skip(skipIndex).limit(limit).sort(sortField);
        res.set({
            'X-Total-Count': totalCount,
            'Access-Control-Expose-Headers': 'X-Total-Count'
        })
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

productRoute.post('/', productAdminAuth, async (req, res) => {
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

productRoute.patch('/:id', productAdminAuth, async (req, res) => {
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

productRoute.delete('/:id', productAdminAuth, async (req, res) => {
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