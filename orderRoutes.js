const express = require("express");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();


// ========================================
// GET ALL ORDERS
// ========================================

router.get("/", async (req, res) => {

    try {

        const orders =
            await Order.find()
                .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {

        console.error(
            "Get Orders Error:",
            error
        );

        res.status(500).json({
            message: "Failed to load orders"
        });

    }

});


// ========================================
// PLACE ORDER
// ========================================

router.post("/place", async (req, res) => {

    try {

        const {
            productId,
            buyer,
            buyerName,
            quantity,
            deliveryLocation,
            paymentMethod
        } = req.body;


        // ========================================
        // VALIDATE DATA
        // ========================================

        if (
            !productId ||
            !buyer ||
            !buyerName ||
            !quantity ||
            !deliveryLocation ||
            !paymentMethod
        ) {

            return res.status(400).json({

                message:
                    "Please provide all required information."

            });

        }


        // ========================================
        // FIND PRODUCT
        // ========================================

        const product =
            await Product.findById(productId);


        if (!product) {

            return res.status(404).json({

                message:
                    "Product not found."

            });

        }


        // ========================================
        // CHECK STOCK
        // ========================================

        if (
            quantity <= 0
        ) {

            return res.status(400).json({

                message:
                    "Quantity must be greater than 0."

            });

        }


        if (
            quantity > product.quantity
        ) {

            return res.status(400).json({

                message:
                    `Only ${product.quantity} KG available.`

            });

        }


        // ========================================
        // CALCULATE TOTAL PRICE
        // ========================================

        const totalPrice =
            quantity *
            product.pricePerKg;


        // ========================================
        // CREATE ORDER
        // ========================================

        const order =
            new Order({

                productId:
                    product._id,

                buyer:
                    buyer,

                buyerName:
                    buyerName,

                productType:
                    product.type,

                quantity:
                    quantity,

                totalPrice:
                    totalPrice,

                deliveryLocation:
                    deliveryLocation,

                paymentMethod:
                    paymentMethod,

                paymentStatus:
                    "Unpaid",

                status:
                    "Pending"

            });


        await order.save();


        // ========================================
        // REDUCE PRODUCT STOCK
        // ========================================

        product.quantity =
            product.quantity -
            quantity;


        await product.save();


        // ========================================
        // RESPONSE
        // ========================================

        res.status(201).json({

            message:
                "Order placed successfully!",

            order:
                order

        });


    } catch (error) {

        console.error(
            "Place Order Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to place order."

        });

    }

});


// ========================================
// UPDATE ORDER STATUS
// ========================================

router.put("/:id/status", async (req, res) => {

    try {

        const {
            status
        } = req.body;


        // ========================================
        // ALLOWED STATUSES
        // ========================================

        const allowedStatuses = [

            "Pending",

            "Confirmed",

            "Processing",

            "Delivered",

            "Cancelled"

        ];


        if (
            !allowedStatuses.includes(status)
        ) {

            return res.status(400).json({

                message:
                    "Invalid order status."

            });

        }


        // ========================================
        // FIND AND UPDATE ORDER
        // ========================================

        const order =
            await Order.findByIdAndUpdate(

                req.params.id,

                {
                    status:
                        status
                },

                {
                    new: true
                }

            );


        // ========================================
        // ORDER NOT FOUND
        // ========================================

        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found."

            });

        }


        // ========================================
        // SUCCESS
        // ========================================

        res.json({

            message:
                "Order status updated successfully.",

            order:
                order

        });


    } catch (error) {

        console.error(
            "Update Status Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update order status."

        });

    }

});


// ========================================
// UPDATE PAYMENT STATUS
// ========================================

router.put("/:id/payment", async (req, res) => {

    try {

        const {
            paymentStatus
        } = req.body;


        const allowedPaymentStatuses = [

            "Unpaid",

            "Paid"

        ];


        if (
            !allowedPaymentStatuses.includes(
                paymentStatus
            )
        ) {

            return res.status(400).json({

                message:
                    "Invalid payment status."

            });

        }


        const order =
            await Order.findByIdAndUpdate(

                req.params.id,

                {
                    paymentStatus:
                        paymentStatus
                },

                {
                    new: true
                }

            );


        if (!order) {

            return res.status(404).json({

                message:
                    "Order not found."

            });

        }


        res.json({

            message:
                "Payment status updated successfully.",

            order:
                order

        });


    } catch (error) {

        console.error(
            "Payment Status Error:",
            error
        );

        res.status(500).json({

            message:
                "Failed to update payment status."

        });

    }

});


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;