const express = require('express');
const cors = require('cors');
const monk = require('monk');

//STOMP
const http = require('http');
const sockjs = require('sockjs');

const echo = sockjs.createServer({ prefix:'/echo'});
echo.on('connection', (conn) =>{
    console.log(`STOMP CONNECTION`);
    conn.on('data', (msg) =>{
        console.log(`msg : ${msg}`);
        conn.write(msg);
    });
    conn.on('close', () => {});
});
const stompServer = http.createServer();
echo.installHandlers(stompServer);
stompServer.listen(9999,'0.0.0.0','',(res)=>{
    console.log(`STOMP LISTENING`);
});

const app = express();
const db = monk(process.env.MONGO_ADDR || 'localhost/chat');
const port = process.env.PORT || 4000;
const chat = db.get('chat');

app.use(cors());
app.use(express.json());

app.get('/', (req, res)=> {
    res.json({
        message : 'open chat',
    });
});

app.get('/chat', (req, res, next) =>{
    chat.find().then((msg) =>{
        res.json(msg);
    });
});

app.post('/chat', (req, res, next) =>{
    const msg = {
        name : req.body.name,
        comment : req.body.comment,
        createdDate : new Date(),
    };
    chat.insert(msg).then((createdMsg) => {
        res.json(createdMsg);
    })
});

// app.listen(port, () =>{
//     console.log(`Listening on ${port}`);
// })