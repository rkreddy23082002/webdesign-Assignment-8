// const express = require("express");
// const mongoose = require("mongoose");
// const userRoutes = require("./routes/userRoutes");
// const app = express();

// // Middleware
// app.use(express.json());

// // Serve static images
// app.use("/images", express.static("images"));

// // Use routes
// app.use("/api", userRoutes);

// mongoose.connect("mongodb+srv://ramakrishna:Rkreddy494635@mycluster.lnqjq.mongodb.net/")
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("MongoDB connection error:", err));

// app.use((req, res) => {
//     res.status(404).json({ error: "Route not found." });
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();

// Swagger Setup
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API",
      description: "API for managing users and handling image uploads",
      version: "1.0.0",
    },
  },
  apis: ["./routes/userRoutes.js"], // Path to the API route files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware
app.use(express.json());

// Serve static images
app.use("/images", express.static("images"));

// Use routes
app.use("/api", userRoutes);

// Connect to MongoDB
mongoose.connect("mongodb+srv://ramakrishna:Rkreddy494635@mycluster.lnqjq.mongodb.net/")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
});

// Listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
