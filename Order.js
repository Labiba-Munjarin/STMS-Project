const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },

        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        buyerName: {
            type: String,
            required: true
        },

        productType: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        totalPrice: {
            type: Number,
            required: true
        },

        deliveryLocation: {
            type: String,
            required: true
        },

        paymentMethod: {
            type: String,
            default: "Cash on Delivery"
        },

        paymentStatus: {
            type: String,
            enum: ["Unpaid", "Paid"],
            default: "Unpaid"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Processing",
                "Delivered",
                "Cancelled"
            ],
            default: "Pending"
        }

    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Order", orderSchema);