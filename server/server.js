const {Server} = require('socket.io')
const http = require('http')

import 'dotenv/config';

const server = http.createServer()

// data store (tmp)
let arr= []

const io = new Server(server,{
    cors:{
        origin:'*',
        methods:['GET','POST']
    }
})

io.on("connection",(socket)=>{
    socket.emit('data',arr)
    socket.on('data',(data)=>{
        arr.push(data)
        socket.emit('reply',arr)
        // console.log('server > ',data)
    })
    socket.on('delete',({id})=>{
       arr = [...arr.filter((cu)=> cu.id!== id)]
       io.emit('reply', arr)
    })
    socket.on('disconnect',()=>{
        console.log(' client disconnected...')
    })
})

server.listen(process.env.PORT||8080,()=>console.log('server started....'))