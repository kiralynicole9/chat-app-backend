const express = require("express");
const {WebSocketServer} = require("ws")
const cors = require("cors");
const {createServer} = require("http");


const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const messageRouter = require("./routes/message");
const notificationRouter = require("./routes/notifications");
const repository = require("./repository/repository");
const inMemoryDB = require("./databases/inMemoryDB");
const postgres = require("./databases/postgres");
const messageRepository = require("./repository/message-repository");

const app = express();
const server = createServer(app);

app.use(express.json())    

app.use((req,res,next)=>{
    res.append("Access-Control-Allow-Origin", "http://localhost:5173")
    res.append("Access-Control-Allow-Methods", "*")
    res.append("Access-Control-Allow-Headers", "*")
    next();
}) 
const connections = {

}
const ws = new WebSocketServer({
    server
})
server.on("upgrade", (req, socket, head) => {
    // console.log(req.headers, "cookiess");
    socket.headers = req.headers;
    //socket.destroy();
})
ws.on("connection", (webSocket, req, client) => {
   const cookies = req.headers.cookie.split(';').reduce((acc, curr) => {
        const values = curr.trim().split('=');
      return {
        ...acc,
        [values[0]]: values[1]
      }
    }, {})
    connections[cookies.user] = webSocket;  
    console.log(cookies, "8888")
    // console.log("connected", webSocket);
    console.log(req, "reqqq")
    ws.on("error", (e) => {
        console.log(e,"error");
    });
    ws.on("message", (data) => {
        console.log(data);
        ws.send(data);
    })
    ws.on("headers", (headers, req) => {
        console.log(req, "1234")
    })
    webSocket.on("message", (data)=>{
        console.log(cookies);
        const payload = JSON.parse(data);
        if(payload.type === "send_message"){
            (async () => {
               const savedMessage = await messageRepository.createMessage({
                    from_users: cookies.user,
                    to_users: payload.data.to_user,
                    text: payload.data.message
                })
                const message = await messageRepository.select({id: savedMessage.id});

                console.log(message, "messaage");
                console.log(savedMessage);
                connections[payload.data.to_user]?.send(JSON.stringify(message));
                console.log(connections[payload.data.to_user]);
            })();
        }

        
    })
    
});


server.listen(3000, (e)=> {
    console.log(ws, "eee");
    console.log("Server is running.");
    console.log('Connecting to database...');
    (async function(){
        repository.init(postgres);

    })();
})
app.use("/users", usersRouter);
app.use("/login", loginRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);
