const express = require("express");
const cors = require("cors");

const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const messageRouter = require("./routes/message");

const app = express();



app.use(express.json())

app.use((req,res,next)=>{
    res.append("Access-Control-Allow-Origin", "http://localhost:5173")
    res.append("Access-Control-Allow-Methods", "*")
    res.append("Access-Control-Allow-Headers", "*")
    next();
})


app.listen(3000, ()=>{
    console.log("Server is running.")
})

app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/messages", messageRouter);
