const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.static('public'));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  setInterval(() => {
    const data = {
      title: 'Новый пост ' + new Date().toLocaleTimeString(),
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(`Получено сообщение: ${message}`);
    ws.send(`Вы сказали: ${message}`);
  });
});

app.server = app.listen(port, () => {
  console.log(`Сервер запущен на http://localhost:${port}`);
});


app.server.on('upgrade', (request, socket, head) => {
  if (request.url === '/chat') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});
