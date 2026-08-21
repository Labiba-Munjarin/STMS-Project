const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

const app = express();

const PORT = 5000;
const HOST = "127.0.0.1";

// ========================================
// MIDDLEWARE
// ========================================

app.use(
    cors({
        origin: true,
        credentials: true
    })
);

app.use(express.json());


// ========================================
// FRONTEND PATH
// ========================================

const frontendPath = path.join(
    __dirname,
    "..",
    "frontend"
);


// ========================================
// SERVE FRONTEND
// ========================================

app.use(
    express.static(frontendPath)
);


// ========================================
// ROOT PAGE
// ========================================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(
            frontendPath,
            "index.html"
        )
    );

});


// ========================================
// API TEST
// ========================================

app.get("/api", (req, res) => {

    res.json({
        success: true,
        message: "STMS API is running successfully!"
    });

});


// ========================================
// API ROUTES
// ========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/products",
    productRoutes
);

app.use(
    "/api/orders",
    orderRoutes
);


// ========================================
// API 404
// ========================================

app.use(
    "/api",
    (req, res) => {

        res.status(404).json({

            success: false,

            message:
                "STMS API route not found",

            path:
                req.originalUrl

        });

    }
);


// ========================================
// FRONTEND FALLBACK
// ========================================
// Express 5 FIX:
// "*" is replaced with "/{*splat}"

app.get(
    "/{*splat}",
    (req, res, next) => {

        if (
            req.path.startsWith("/api/")
        ) {

            return next();

        }

        res.sendFile(
            path.join(
                frontendPath,
                "index.html"
            )
        );

    }
);


// ========================================
// ERROR HANDLER
// ========================================

app.use(
    (error, req, res, next) => {

        console.error(
            "STMS SERVER ERROR:",
            error
        );

        res.status(500).json({

            success: false,

            message:
                "Internal server error"

        });

    }
);


// ========================================
// START SERVER
// ========================================

async function startServer() {

    try {

        if (
            !process.env.MONGODB_URI
        ) {

            throw new Error(
                "MONGODB_URI is missing from .env file"
            );

        }


        // ========================================
        // MONGODB
        // ========================================

        await mongoose.connect(
            process.env.MONGODB_URI
        );


        console.log(
            "MongoDB Connected Successfully!"
        );


        // ========================================
        // SERVER
        // ========================================

        const server = app.listen(
            PORT,
            HOST,
            () => {

                console.log("");
                console.log(
                    "========================================"
                );

                console.log(
                    "      STMS SERVER STARTED"
                );

                console.log(
                    "========================================"
                );

                console.log(
                    `Website: http://${HOST}:${PORT}`
                );

                console.log(
                    `API:     http://${HOST}:${PORT}/api`
                );

                console.log(
                    "========================================"
                );

                console.log(
                    "Backend + Frontend are ready."
                );

                console.log(
                    "Keep this terminal open."
                );

                console.log("");
            }
        );


        // ========================================
        // SERVER ERROR
        // ========================================

        server.on(
            "error",
            async (error) => {

                console.error(
                    "STMS Server Error:",
                    error.message
                );


                if (
                    error.code ===
                    "EADDRINUSE"
                ) {

                    console.error("");
                    console.error(
                        `Port ${PORT} is already in use.`
                    );

                    console.error(
                        "Close the old Node process and try again."
                    );

                    console.error("");

                }

            }
        );


    }

    catch (error) {

        console.error("");

        console.error(
            "MongoDB Connection / Server Startup Failed:"
        );

        console.error(
            error.message
        );

        console.error("");

        process.exit(1);

    }

}


// ========================================
// GRACEFUL SHUTDOWN
// ========================================

async function shutdown() {

    console.log("");
    console.log(
        "Shutting down STMS server..."
    );


    try {

        await mongoose.connection.close();

        console.log(
            "MongoDB disconnected."
        );

    }

    catch (error) {

        console.error(
            "Shutdown error:",
            error.message
        );

    }


    process.exit(0);

}


process.on(
    "SIGINT",
    shutdown
);

process.on(
    "SIGTERM",
    shutdown
);


// ========================================
// START
// ========================================

startServer();