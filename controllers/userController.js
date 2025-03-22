const bcrypt = require("bcrypt");
const User = require("../models/User");

// Create User
exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Validate input
        if (!fullName || !email || !password) {
            return res.status(400).json({ error: "All fields are required." });
        }

        // Validate email format
        const emailRegex = /^[a-zA-Z0-9](\.?[a-zA-Z0-9_%+-])*@northeastern\.edu$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format, use a northeastern email." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "User already exists." });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error("Error in createUser:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Edit User
exports.editUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { fullName, email, password } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required." });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(fullName && { fullName }),
                ...(email && { email }),
                ...(hashedPassword && { password: hashedPassword }),
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (err) {
        console.error("Error in editUser:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Get User by Email
exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error("Error in getUserByEmail:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete User by Email
exports.deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Find the user by email and delete
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "User deleted successfully." });
    } catch (err) {
        console.error("Error in deleteUserByEmail:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Upload Image
exports.uploadImage = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Validate if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded." });
        }

        const imagePath = req.file.path;

        // Find the user by ID and update their imagesPath
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $push: { imagesPath: imagePath } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found." });
        }

        res.status(200).json({ message: "Image uploaded successfully", user: updatedUser });
    } catch (err) {
        console.error("Error in uploadImage:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
