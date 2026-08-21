const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// ========================================
// ADD PRODUCT
// ========================================

router.post("/add", async (req, res) => {

    try {

        const {
            seller,
            sellerName,
            type,
            quantity,
            pricePerKg,
            location,
            description
        } = req.body;


        const product = new Product({

            seller,
            sellerName,
            type,
            quantity,
            pricePerKg,
            location,
            description

        });


        await product.save();


        res.status(201).json({

            message: "Supari product added successfully!",

            product

        });


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to add product"

        });

    }

});


// ========================================
// GET ALL PRODUCTS
// ========================================

router.get("/", async (req, res) => {

    try {

        const products =
            await Product.find()
                .sort({ createdAt: -1 });


        res.json(products);


    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Failed to load products"

        });

    }

});


module.exports = router;