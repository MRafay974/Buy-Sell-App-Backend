const router = require("express").Router();
const multer = require("multer");
const Product = require("../models/product");
const connectDB = require("../models/db"); // Update path




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Multer destination called");
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    console.log("Multer filename called:", file.originalname);
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/addProduct", upload.array("images", 3), async (req, res) => {
  try {
    // Ensure database connection first
    await connectDB(); // This is the same connection handling used in GET
    
    const { name, price, description } = req.body;
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    // Use the same URL construction pattern as in GET
    const imageURLs = req.files.map((file) => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      price,
      description,
      imageURL: imageURLs.length > 0 ? imageURLs : undefined,
    });

    // Add timeout similar to GET's maxTimeMS
    await newProduct.save({ maxTimeMS: 30000 });
    
    res.status(201).json({
      message: "Successfully Added Product",
      product: { // Return the created product similar to GET response structure
        _id: newProduct._id,
        name: newProduct.name,
        price: newProduct.price,
        description: newProduct.description,
        imageURL: newProduct.imageURL
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ 
      message: "Error creating product", 
      error: error.message,
      fullError: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;