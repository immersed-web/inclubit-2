import uWebSockets from 'uWebSockets.js';
const { DEDICATED_COMPRESSOR_3KB } = uWebSockets;
// const uWebSockets = require('uWebSockets.js');
const app = uWebSockets.App();
app.ws('/*', {

  /* There are many common helper features */
  idleTimeout: 64,
  maxBackpressure: 1024,
  maxPayloadLength: 512,
  compression: DEDICATED_COMPRESSOR_3KB,

  /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
  message: (ws, message, isBinary) => {
    /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
    
    /* Here we echo the message back, using compression if available */
    let ok = ws.send(message, isBinary, true);
    console.log('was ok:', ok);
  }
  
}).get('/*', (res, _req) => {

  /* It does Http as well */
  res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');
  
}).listen(9001, (listenSocket) => {

  if (listenSocket) {
    console.log('Listening to port 9001');
  }
  
});