const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
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
      "img_name": "Ausie-Zoey.png",
      "features": ["Energetic", "Loyal", "Protective"],
      "vaccinated": true,
      "gender": "Female"
    },
    {
      "_id": 4,
      "name": "Moxie",
      "breed": "Wheaten Terrier",
      "age": "6 weeks old",
      "img_name": "Wheaten-Boxer.png",
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
      "img_name": "dalmation-walter.png",
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

app.get("/api/dogs", (req, res) => {
  res.json(Dogs);
});

app.get("/api/dogs/:_id", (req, res) => {
  const dog = Dogs.animals.find(d => d._id === parseInt(req.params._id));
  if (!dog) {
    return res.status(404).send("Dog not found.");
  }
  res.json(dog);
});


// API to post a new dog, including an image upload
app.post("/api/dogs", upload.single("img"), (req, res) => {
  console.log("In a POST request");

  // Validate the dog data
  const result = validateDog(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    console.log("I have an error");
    return;
  }

  //app.delete("api/dogs/id")

  

  // Create a new dog object
  const dog = {
    _id: Dogs.animals.length + 1, // Auto-increment the ID
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
    features: req.body.features.split(","),
    vaccinated: req.body.vaccinated === "true",
    gender: req.body.gender,
  };

  // If an image was uploaded, save the image filename to the dog object
  if (req.file) {
    dog.img_name = req.file.filename;
  }

  // Add the new dog to the array
  Dogs.animals.push(dog);

  console.log(dog);
  res.status(200).send(dog);
});

app.put("/api/dogs/:_id", upload.single("img"), (req, res) => {

  const dog = Dogs.animals.find((d) => d._id === parseInt(req.params._id));
  
  if (!dog) {
    console.log("Dog with ID", req.params.id, "not found");
    res.status(404).send("The dog with the provided ID was not found.");
    return;
  }

  // Validate the incoming data
  const result = validateDog(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // Update the dog's properties
  dog.name = req.body.name;
  dog.breed = req.body.breed;
  dog.age = req.body.age;
  dog.features = req.body.features.split(",");
  dog.vaccinated = req.body.vaccinated === "true";
  dog.gender = req.body.gender;

  // If an image was uploaded, update the image name
  if (req.file) {
    dog.img_name = req.file.filename;
  }

  // Send the updated dog object as the response
  res.status(200).send(dog);
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