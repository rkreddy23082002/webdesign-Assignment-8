// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const { createUser, editUser, getUserByEmail, deleteUserByEmail } = require("../controllers/userController");

// const router = express.Router();

// // ✅ Multer configuration for image uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, "image/");  // Use your existing "image" folder
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({ storage });

// // ✅ Image upload route
// router.post("/user/uploadImage", upload.single("image"), (req, res) => {
//     if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//     }

//     const imageUrl = `/image/${req.file.filename}`;
//     res.status(201).json({
//         message: "Image uploaded successfully",
//         imageUrl
//     });
// });

// // ✅ Other existing routes
// router.post("/create", createUser);
// router.put("/edit/:userId", editUser);
// router.get("/getUser/:email", getUserByEmail);
// router.delete("/user/:email", deleteUserByEmail);

// module.exports = router;

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
// const { createUser, editUser, getUserByEmail, deleteUserByEmail } = require("../controllers/userController");

// const router = express.Router();

// // Ensure the upload directory exists
// const uploadDir = path.join(__dirname, "../images");
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }

// // ✅ Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir); // Save to the "image" directory
//     },
//     filename: (req, file, cb) => {
//         const uniqueName = `${Date.now()}-${file.originalname}`;
//         cb(null, uniqueName);
//     }
// });

// // ✅ Optional: File filter to accept only images
// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ["images/jpeg", "images/png", "images/jpg"];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error("Invalid file type. Only JPEG and PNG are allowed."), false);
//     }
// };

// // ✅ Final Multer upload config
// const upload = multer({
//     storage,
//     fileFilter,
//     limits: { fileSize: 5 * 1024 * 1024 } // Max 5MB
// });

// // ✅ Image Upload Route
// router.post("/user/uploadImage", upload.single("images"), (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: "No file uploaded" });
//         }

//         const imageUrl = `/images/${req.file.filename}`;
//         res.status(201).json({
//             message: "Image uploaded successfully",
//             imageUrl
//         });
//     } catch (error) {
//         console.error("Upload error:", error);
//         res.status(500).json({ error: "Image upload failed" });
//     }
// });

// // ✅ Other existing routes
// router.post("/create", createUser);
// router.put("/edit/:userId", editUser);
// router.get("/getUser/:email", getUserByEmail);
// router.delete("/user/:email", deleteUserByEmail);

// module.exports = router;

const express = require("express");
const multer = require("multer");
const path = require("path");
const { createUser, editUser, getUserByEmail, deleteUserByEmail } = require("../controllers/userController");
const User = require("../models/User");  // Assuming you have a User model in `models/User.js`

const router = express.Router();

// ✅ Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "image/");  // Use your existing "image" folder
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);  // Use a unique name based on timestamp
    }
});

const upload = multer({ storage });

// ✅ Image upload route
router.post("/user/uploadImage", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = `/image/${req.file.filename}`;
    res.status(201).json({
        message: "Image uploaded successfully",
        imageUrl
    });
});

// ✅ GET all users route
router.get("/user/getAll", async (req, res) => {
    try {
        const users = await User.find({}, "fullName email imageUrl");  // Adjust fields as needed
        if (users.length === 0) {
            return res.status(404).json({ error: "No users found." });
        }
        res.status(200).json({ users: users });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error during user retrieval." });
    }
});


// ✅ Other existing routes
router.post("/create", createUser);
router.put("/edit/:userId", editUser);
router.get("/getUser/:email", getUserByEmail);
router.delete("/user/:email", deleteUserByEmail);

module.exports = router;
