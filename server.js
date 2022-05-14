const express = require('express');
const http = require('http')
const app = express()
const server = http.createServer(app)
const cors = require('cors')
require("dotenv").config();

const io = require('socket.io')(server, {
    cors : {
        origin : process.env.FRONTEND_URL,
        methods : ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('user connected');
    socket.emit("socketId", socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('call ended')
    })

    socket.on('callUser', (data) => {
        console.log(data.userToCall);
        io.to(data.userToCall).emit('callUser' , {
            signal : data.signalData,
            from : data.from,
            name : data.name
        })
    })

    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal)
    })

    socket.on('callEnd', (data) => {
        io.to(data.coCaller).emit('call End',{})
    })
})

const PORT = process.env.PORT || 8900;

server.listen(PORT , () => {
    console.log(`server started at port : ${PORT}`);
})