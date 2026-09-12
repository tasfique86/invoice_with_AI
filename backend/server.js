require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routers/authRoutes");
const invoiceRoutes = require("./routers/invoiceRoutes");
const aiRoutes = require("./routers/aiRoutes");

const app = express();

// Middleware to handle cors
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//connectDB
connectDB();

//Middleware to handle json and url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routers here
app.use("/api/auth", authRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/ai", aiRoutes);

//start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
