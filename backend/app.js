require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(cors());

const mongoose_Url = "mongodb+srv://"+process.env.Mongoose_Username+":"+process.env.Mongoose_Password+"@cluster0.g55a6.mongodb.net/task";


// const mongoose_Url = "mongodb://localhost:27017/myapp";


mongoose.connect(mongoose_Url, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

// mongoose.connect("mongodb://localhost:27018/task", {useNewUrlParser: true, useUnifiedTopology: true});
 

const countrySchema = new mongoose.Schema({
    name: {
        type: String
    }
});
const Country = mongoose.model("Country", countrySchema);

var ddd;
var startingHour;

app.get("/", function(req, res){
    res.send("working");  
});
app.get("/getCountry", function(req, res){
    Country.find(function (err, docs) {
        res.send(docs);
    });
});
app.get("/getCountry:id", function(req, res){
    var id = req.params.id;
    console.log(id);
    Country.find({_id: id}, function (err, docs) {
        var data = docs;
        res.send(data);
    });
});
app.post("/country", function(req, res){
    const country = new Country({
        name: "UAE"
    });
    country.save();
});

app.post("/",async function(req, res){
    console.log(req.body);
    var delivery = {
        dDay: "",
        dTimeIn: "",
        dTimeFin: ""
    };
    // res.send("data recieved");
    var dt = new Date(req.body.date);
    days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    day = days[dt.getDay()];
    console.log(days[dt.getDay()]);
    console.log(req.body.country);
    await Country.find({name: req.body.country}, async function (err, docs) {
        doccs = docs[0];
        res.send({
            status: "data recieved!",
            data: doccs
        });
    });

});

app.listen(5000, function(req, res){
    console.log("Server is listening to port 5000");
});