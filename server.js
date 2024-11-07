const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.static("public"));

const housePlans = {
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

app.get("/",(req,res)=>{
    res.sendFile(__dirname + "/index.html");
});

app.get("/api/house_plans", (req,res)=>{
    res.json(housePlans);
});


app.listen(3001, () => {
    console.log("Listening....");
});