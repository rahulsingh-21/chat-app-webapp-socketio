const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const { generateMsg } = require('./func/messages')
const { generateLoc } = require('./func/messages')
const { addUser,removeUser,getUser,getUsersInRoom } = require('./func/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const pubpath = path.join(__dirname,'../public')
app.use(express.static(pubpath))

const message = 'Welcome!'

io.on('connection',(socket)=>{
    console.log('new connection')
    

    socket.on('sendMessage',(msg,callback)=>{
        const user =getUser(socket.id)

        io.to(user.room).emit('message',generateMsg(user.username,msg))
        callback('Delievered!')
    })
    socket.on('sendLocation',(coords,callback)=>{
        const user =getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateLoc(user.username,`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback('location shared!')
    })
    socket.on('join',({username,room})=>{
        
        const user= addUser({id:socket.id,username,room})

        socket.join(room)

        socket.emit('message',generateMsg('Admin',`Welcome ${username}`))
        socket.broadcast.to(room).emit('message',generateMsg(`${username} has joined`))
        io.to(room).emit('roomData',{
            room:room,
            users:getUsersInRoom(room)
        })
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('message',generateMsg('Admin',`${user.username} has left`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }

    })
   
})

server.listen(3000,()=>{
    console.log("port 3000 is running")
})
