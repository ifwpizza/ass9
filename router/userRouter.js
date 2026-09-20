const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");

const userRouter = express.Router();

function isValidUserId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

userRouter.post("/", async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("Error creating user:", error.message);
        const statusCode = error.code === 11000 || error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: "Failed to create user", error: error.message });
    }
});

userRouter.get("/", async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        console.error("Error retrieving users:", error.message);
        res.status(500).json({ message: "Failed to retrieve users", error: error.message });
    }
});

userRouter.patch("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidUserId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: "Request body cannot be empty" });
    }

    try {
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user });
    } catch (error) {
        console.error("Error updating user:", error.message);
        const statusCode = error.code === 11000 || error.name === "ValidationError" ? 400 : 500;
        res.status(statusCode).json({ message: "Failed to update user", error: error.message });
    }
});

userRouter.delete("/:id", async (req, res) => {
    const { id } = req.params;

    if (!isValidUserId(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    try {
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ message: "Failed to delete user", error: error.message });
    }
});

module.exports = userRouter;
