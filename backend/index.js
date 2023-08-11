import express from "express"
import cors from "cors"
import mongoose from "mongoose"
// import bodyParser from "body-parser"

const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

mongoose
    .connect('mongodb://127.0.0.1:27017/myLoginRegisterDB')
    .then(console.log("db conn"))
    .catch (error => console.log(error));


const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)




app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    
    try {
        const user = await User.findOne({ email: email });

        if (user) {
            if (password === user.password) {
                res.send({ message: "Login Successful", user: user });
            } else {
                res.send({ message: "Password didn't match" });
            }
        } else {
            res.send({ message: "User not registered" });
        }
    } catch (err) {
        res.send({ message: "An error occurred" });
    }
});




app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;
    console.log(req.body);
    
    try {
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            res.send({ message: "User already registered" });
        } else {
            const newUser = new User({
                name,
                email,
                password
            });

            newUser.save()
                .then(() => {
                    res.send({ message: "Successfully Registered, Please login now." });
                })
                .catch((err) => {
                    res.status(500).send({ message: "Registration failed", error: err });
                });
        }
    } catch (err) {
        res.status(500).send({ message: "An error occurred", error: err });
    }
});


app.listen(9002,() => {
    console.log("BE started at port 9002")
})