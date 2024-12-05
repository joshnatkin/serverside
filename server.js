const express = require("express");
const cors = require("cors");
const multer = require("multer");
const mongoose = require("mongoose");
const Joi = require("joi");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Multer storage configuration for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/dogs/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Connect to MongoDB
mongoose
  .connect("mongodb+srv://QDV4pCJ8zPJsLXxl:QDV4pCJ8zPJsLXxl@hellodb.dexav.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Couldn't connect to MongoDB", error));

// Define Dog schema and model
const dogSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: String,
  img_name: String,
  features: [String],
  vaccinated: Boolean,
  gender: String,
});

const Dog = mongoose.model("Dog", dogSchema);

// GET request to serve the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET all dogs
app.get("/api/dogs", async (req, res) => {
  try {
    const dogs = await Dog.find();
    res.status(200).send(dogs);
  } catch (error) {
    res.status(500).send("An error occurred while fetching dogs.");
  }
});

// POST a new dog, including an image upload
app.post("/api/dogs", upload.single("img"), async (req, res) => {
  const result = validateDog(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const newDog = new Dog({
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    img_name: req.file ? req.file.filename : null,
    features: req.body.features.split(","),
    vaccinated: req.body.vaccinated === "true",
    gender: req.body.gender,
  });

  try {
    const savedDog = await newDog.save();
    res.status(201).send(savedDog);
  } catch (error) {
    res.status(500).send("An error occurred while saving the dog.");
  }
});

// PUT (update) a dog by ID
app.put("/api/dogs/:id", upload.single("img"), async (req, res) => {
  const result = validateDog(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const fieldsToUpdate = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    features: req.body.features.split(","),
    vaccinated: req.body.vaccinated === "true",
    gender: req.body.gender,
  };

  if (req.file) {
    fieldsToUpdate.img_name = req.file.filename;
  }

  try {
    const updatedDog = await Dog.findByIdAndUpdate(req.params.id, fieldsToUpdate, {
      new: true,
    });
    if (!updatedDog) {
      res.status(404).send("The dog with the provided ID was not found.");
      return;
    }
    res.status(200).send(updatedDog);
  } catch (error) {
    res.status(500).send("An error occurred while updating the dog.");
  }
});

// DELETE a dog by ID
app.delete("/api/dogs/:id", async (req, res) => {
  try {
    const deletedDog = await Dog.findByIdAndDelete(req.params.id);
    if (!deletedDog) {
      res.status(404).send("The dog with the provided ID was not found.");
      return;
    }
    res.status(200).send(deletedDog);
  } catch (error) {
    res.status(500).send("An error occurred while deleting the dog.");
  }
});

// Validation schema using Joi
const validateDog = (dog) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    breed: Joi.string().min(3).required(),
    age: Joi.string().required(),
    features: Joi.string().required(),
    vaccinated: Joi.boolean().required(),
    gender: Joi.string().valid("Male", "Female").required(),
  });

  return schema.validate(dog);
};

// Start the Express server
app.listen(3001, () => {
  console.log("Listening on port 3001...");
});