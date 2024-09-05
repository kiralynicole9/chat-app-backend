const {WebSocketServer} = require("ws")
const EventEmitter = require('node:events');
const messageRepository = require("./repository/message-repository");

const eventBus = new EventEmitter
module.exports = {
    connected: false,
    ws: null,
    async getWS(){
        if(this.connected){
            return Promise.resolve(this.ws);
        }
        return new Promise((resolve, reject) => {
            eventBus.on("connected", () => {
                resolve(this.ws);
                this.connected = true
            })
        })
    },
    sendTo(to_user, data){
        this.connections[to_user]?.send(JSON.stringify(data));
    },
    broadcast(data){
        Object.values(this.connections).forEach((connection) => {
            connection.send(JSON.stringify(data));
        })
    },
    connections: {},
    messageListeners: [],
    createWsServer(server){
        const ws = new WebSocketServer({
            server
        })
        
        this.ws = ws;
        ws.on("connection", (webSocket, req, client) => {
            eventBus.emit("connected")
            const cookies = req.headers.cookie.split(';').reduce((acc, curr) => {
                 const values = curr.trim().split('=');
               return {
                 ...acc,
                 [values[0]]: values[1]
               }
             }, {})  
            // console.log(this, "ggvgv")

             this.connections[cookies.user] = webSocket;  
             console.log(cookies, "8888")
             // console.log("connected", webSocket);
            //  console.log(req, "reqqq")
             ws.on("error", (e) => {
                 console.log(e,"error");
             });
             ws.on("message", (data) => {
                //  console.log(data);
                 ws.send(data);
             })
             console.log(this.messageListeners, "llll")
             for(const messageListener of this.messageListeners){
                webSocket.on("message", (data) => {
                    messageListener?.(data, cookies);
                })
             }
             ws.on("headers", (headers, req) => {
                //  console.log(req, "1234")
             })           
         });
    }
}

const handleWebRTC = (data, cookies) => {
    const parsedData = JSON.parse(data);
    console.log("parseddataa here", parsedData);

    switch(parsedData.type){
        case "offer":
        case "answer":
        case "ice-candidate":
            if(parsedData.to_user){
                module.exports.sendTo(parsedData.to_user, parsedData);
            }
            break;

        case "end-call":
            if(parsedData.to_user){
                module.exports.sendTo(parsedData.to_user, parsedData)
            }
            break;
         
        default:
            console.log("Unknown message type: ", parsedData.type)    
    }
}

module.exports.messageListeners.push(handleWebRTC);