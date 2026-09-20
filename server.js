const express = require("express");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/assignment9";

app.use(express.json());
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
    res.json({ message: "Users API is running" });
});

async function startServer() {
    try {
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
        app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
}

startServer();
