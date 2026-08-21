const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sellerName: {
            type: String,
            required: true
        },

        type: {
            type: String,
            required: true
        },

        quantity: {
            type: Number,
            required: true
        },

        pricePerKg: {
            type: Number,
            required: true
        },

        location: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "Available"
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);