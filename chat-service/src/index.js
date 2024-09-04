const express = require("express");
const cors = require("cors");
const {createServer} = require("http");


const usersRouter = require("./routes/users");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout")
const messageRouter = require("./routes/message");
const notificationRouter = require("./routes/notifications");
const channelMembersRouter = require("./routes/channel-members")
const channelsRouter = require("./routes/channels")
const reactionsRouter = require("./routes/reactions");
const channelMessagesRouter = require("./routes/channel-messages")
const repository = require("./repository/repository");
const inMemoryDB = require("./databases/inMemoryDB");
const postgres = require("./databases/postgres");
const messageRepository = require("./repository/message-repository");
const channelsRepository = require("./repository/channels-repository")
const channelMembersRepository = require("./repository/channel-members-repository")
const channelMessagesRepository = require("./repository/channel-messages-repository");
const reactionsRepository = require("./repository/reactions-repository")
const ws  = require("./ws");

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
ws.createWsServer(server);

server.on("upgrade", (req, socket, head) => {
    // console.log(req.headers, "cookiess");
    socket.headers = req.headers;
    //socket.destroy();
})

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
app.use("/channels", channelsRouter)
app.use("/channel-members", channelMembersRouter);
app.use("/channel-messages", channelMessagesRouter)
app.use("/logout", logoutRouter);
app.use("/reactions", reactionsRouter);
