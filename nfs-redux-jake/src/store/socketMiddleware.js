import { wsConnecting, wsConnected, wsDisconnected, addMessage, postComplete, postInit } from './actions';

const socketMiddleware = (function(){
  let socket = null;

  const onOpen = (ws,store) => evt =>
    store.dispatch(wsConnected());


  const onClose = (ws,store) => evt =>
    store.dispatch(wsDisconnected());

  const onMessage = (ws,store) => evt => {
    let msg = JSON.parse(evt.data);
    switch(msg.type) {
      case "message":
        store.dispatch(addMessage(msg));
        break;
      case "reconnect_url" || "hello":
        break;
      default:
        console.log("Received unknown message type:" +  msg.type);
        console.log("Message:" +  evt.data);
        break;
    }
    if(msg.ok) {
      msg.user = ws.userId;
      store.dispatch(postComplete());
      store.dispatch(addMessage(msg));}
  };

  return store => next => action => {
    switch(action.type) {
      case 'WS_CONNECT':
        if(socket != null) socket.close();
        store.dispatch(wsConnecting());
        socket = new WebSocket(action.url);
        socket.onmessage = onMessage(socket,store);
        socket.onclose = onClose(socket,store);
        socket.onopen = onOpen(socket,store);
        socket.userId = action.userId;
        socket.msgCount = 0;
        break;
      case 'POST_CHAT_MESSAGE':
        const newMsg = {
          id: ++socket.msgCount,
          type: "message",
          channel: action.channel,
          text: action.text,
        };
        store.dispatch(postInit());
        socket.send(JSON.stringify(newMsg));
        break;
      default:
        return next(action);
    }
  };

})();

export default socketMiddleware;
