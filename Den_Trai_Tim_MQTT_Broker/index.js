const mosca = require('mosca');
const uuid = require('uuid');

const server = new mosca.Server({
  port: 1883,
});
server.on('ready', setup);

server.on('clientConnected', function(client) {
  client.uuid = uuid.v4();
	console.log('client connected: ', client.id);		
});

server.on('clientDisconnected', (client) => {
  for(let t in topics){
    delete topics[t][client.uuid];
  }
  console.log('disconnected: ', client.id);
});

const topics = {};
server.on('subscribed', (t, client) => {
  if(!topics[t]) topics[t]={};
  topics[t][client.uuid] = client;
  console.log(client.id + ' subscribed ' + t);
});

server.on('unsubscribed', (t, client) => {
  if(topics[t]){
    delete topics[t][client.uuid];
    console.log(client.id + ' unsubscribed ' + t);
  }
});

// fired when a message is received
server.on('published', function(packet, client) {
  //console.log('Published', packet.topic, packet.payload);
});

// fired when the mqtt server is ready
function setup() {
  console.log('Mosca server is up and running..');
}
