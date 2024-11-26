const express = require('express');
const ejs = require('ejs');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', socket => {
    console.log('Novo usuário conectado! ID: ' + socket.id);

    /* Recuperar e manter as mensagem do frontend para o backend */
    socket.emit('previousMessage', messages);
    
    /* Dispara ações quando recebe as mensagens do frontend */
    socket.on('sendMessage', data => {
        /* Adiciona a nova mensagem no final do array "messages" */
        messages.push(data);

        /* Propaga a mensagem para todos os usuários conectados no chat */
        socket.broadcast.emit('receivedMessage', data);


    });

});

server.listen(3000, () => {
    console.log('TA RODANDO CARALHO! => http://localhost:3000')
});