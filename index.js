const express = require("express")
const mongoose = require("mongoose");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const { register } = require("module");

const app = express();
dotenv.config();

app.use(cors());
app.use(express.static(path.join(__dirname, 'pages')));
const port = process.env.PORT || 3000;

const username = process.env.MONGOODB_USERNAME;
const password = process.env.MONGOODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.5rpgsra.mongodb.net/registrationFormDB`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String

});

const Registration = mongoose.model("Regstraion", registrationSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});


app.post("/register", async (req, res) => {
    try {
        // console.log(req.body);

        const { name, email, password } = req.body;

        // console.log(" Name ===>", name, "Email==>", email, "password==>", password);
        // res.send({name,email,password});
        const existingUser = await Registration.findOne({ email: email });
        if (!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            console.log("Hello from backend");
            res.send({status : 200});
        }
        else {
            console.log("User already exist");
            res.send({status : 404});
        }
    }
    catch (error) {
        console.log(error);
        res.redirect("error");
    }
});

app.get("/success", (req, res) => {
    
    res.sendFile(__dirname + "/pages/success.html");
})
app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html");
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
