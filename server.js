const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json()); // To parse JSON body
app.use(express.static("public"));
const multer = require("multer");
const Joi = require("joi");


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/dogs/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const Dogs = {
    "animals": [
      {
        "_id": 1,
        "name": "Baxter",
        "breed": "Cocker Spaniel",
        "age": "3 months old",
        "img_name": "Cocker-Baxston.png",
        "features": ["Friendly", "Energetic", "Loyal"],
        "vaccinated": true,
        "gender": "Male"
      },
      {
        "_id": 2,
        "name": "Mary",
        "breed": "Golden Doodle",
        "age": "1 month old",
        "img_name": "puppy-Mary.png",
        "features": ["Playful", "Intelligent", "Affectionate"],
        "vaccinated": false,
        "gender": "Female"
      },
      {
        "_id": 3,
        "name": "Zoey",
        "breed": "Australian Shepherd",
        "age": "6 weeks old",
        "img_name": "Ausie-Zoey.jpg",
        "features": ["Energetic", "Loyal", "Protective"],
        "vaccinated": true,
        "gender": "Female"
      },
      {
        "_id": 4,
        "name": "Moxie",
        "breed": "Wheaten Terrier",
        "age": "6 weeks old",
        "img_name": "Wheaten-Boxer.jpeg",
        "features": ["Friendly", "Curious", "Independent"],
        "vaccinated": true,
        "gender": "Female"
      },
      {
        "_id": 5,
        "name": "Cassie",
        "breed": "Boxer Spaniel",
        "age": "11 weeks old",
        "img_name": "boxer-cassie.png",
        "features": ["Energetic", "Loyal", "Playful"],
        "vaccinated": false,
        "gender": "Female"
      },
      {
        "_id": 6,
        "name": "Walter",
        "breed": "Dalmatian",
        "age": "8 weeks old",
        "img_name": "dalmation-walter.jpeg",
        "features": ["Active", "Outgoing", "Friendly"],
        "vaccinated": false,
        "gender": "Male"
      },
      {
        "_id": 7,
        "name": "Rufors",
        "breed": "Great Dane",
        "age": "15 weeks old",
        "img_name": "Dane-Ruford.png",
        "features": ["Gentle", "Loyal", "Protective"],
        "vaccinated": true,
        "gender": "Male"
      },
      {
        "_id": 8,
        "name": "Snoopy",
        "breed": "German Shepherd",
        "age": "5 weeks old",
        "img_name": "german-snoopy.png",
        "features": ["Intelligent", "Loyal", "Protective"],
        "vaccinated": true,
        "gender": "Male"
      },
      {
        "_id": 9,
        "name": "Damian",
        "breed": "Husky",
        "age": "12 weeks old",
        "img_name": "husky-damian.png",
        "features": ["Energetic", "Friendly", "Independent"],
        "vaccinated": true,
        "gender": "Male"
      },
      {
        "_id": 10,
        "name": "Jodi",
        "breed": "Labradoodle",
        "age": "14 weeks old",
        "img_name": "lab-jodi.png",
        "features": ["Playful", "Affectionate", "Curious"],
        "vaccinated": true,
        "gender": "Female"
      }
    ]
  };


// GET request to serve the HTML file (e.g., for testing purposes)
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// GET request to fetch all dogs
app.get("/api/dogs", (req, res) => {
  res.json(Dogs);
});

// Validation schema using Joi
function validateDog(dog) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    breed: Joi.string().min(3).required(),
    age: Joi.string().required(),
    features: Joi.array().items(Joi.string()).min(3).required(),
    vaccinated: Joi.boolean().required(),
    gender: Joi.string().valid("Male", "Female").required(),
  });
  return schema.validate(dog);
}

// POST request to add a new dog entry
app.post("/api/dogs", upload.single("dogImage"), (req, res) => {
  const { error } = validateDog(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const newDog = {
    _id: Dogs.animals.length + 1, // Simple ID assignment
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    img_name: req.file ? req.file.filename : "default.jpg",
    features: req.body.features.split(","), // Convert comma-separated list to array
    vaccinated: req.body.vaccinated === "true",
    gender: req.body.gender,
  };

  Dogs.animals.push(newDog);
  res.status(201).json(newDog);
});

// File upload route for testing image upload separately (optional)
app.post("/api/upload", upload.single("dogImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }
  console.log("File uploaded successfully:", req.file);
  res.send({ message: "File uploaded successfully!", file: req.file });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});