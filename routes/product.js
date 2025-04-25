const router = require("express").Router();
const multer = require("multer");
const Product = require("../models/product");

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



router.get("/fetchProduct", async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/addProduct", upload.array("images", 3), async (req, res) => {
  try {
    const { name, price, description } = req.body;
    console.log("Request Body:", req.body);
    console.log("Uploaded Files:", req.files);

    

    const imageURLs = req.files.map((file) => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      price,
      description,
      imageURL: imageURLs.length > 0 ? imageURLs : undefined,
    });

    await newProduct.save();
    res.status(201).json({message:"Successfully Added Product"});
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
});

module.exports = router;