// Load Mongoose OS API
load('api_timer.js');
load('api_gpio.js');
load('api_mqtt.js');
load('api_sys.js');
load('api_config.js');
load('api_log.js');
Log.info('====== Den Trai Tim is starting.. ======');

let isBlinked = false;
let blinkTimerID = 0;
let mqttConnected = false;
let pinOutState = false;
let pinIn = Cfg.get('app.pinIn');
let pinOut = Cfg.get('app.pinOut');
let mqttPub = '/esp8266_den_trai_tim/state';
let mqttSub = '/esp8266_den_trai_tim/state';
function blink () {
  blinkTimerID = Timer.set(1000, true, function () {
    pinOutState = !pinOutState;
    let ok = MQTT.pub(mqttPub, JSON.stringify(pinOutState), 1);
    Log.info('MQTT send: ' + (ok ? 'yes' : 'no'));
  }, null);
  Timer.set(5000, false, function () {
    Timer.del(blinkTimerID);
    blinkTimerID = 0;
  }, null);
}

// esp8266-01 default led pin: 1, esp8266-12f default led pin: 2
GPIO.set_mode(pinOut, GPIO.MODE_OUTPUT);
GPIO.set_mode(pinIn, GPIO.MODE_INPUT);
GPIO.write(pinOut, 0); // default to off

MQTT.sub(mqttSub, function (conn, topic, command) {
  Log.info('MQTT got: ' + topic + ': ' + command);
  let json = JSON.parse(command);

  pinOutState = json === true;
  GPIO.write(pinOut, pinOutState ? 1 : 0);
}, null);
MQTT.setEventHandler(function (conn, ev, edata) {
  if (ev === MQTT.EV_CONNACK) {
    mqttConnected = true;
    if (!isBlinked) {
      isBlinked = true;
      blink();
    }
    // Timer.set(3000, true, function (){
    // pinOutState=!pinOutState;
    // let ok = MQTT.pub(mqttPub, JSON.stringify(pinOutState), 1);
    // Log.info('MQTT send: ' + (ok ? 'yes' : 'no'));
    // }, null);
  } else if (ev === MQTT.EV_CLOSE) {
    mqttConnected = false;
  }
}, null);

GPIO.set_button_handler(pinIn, GPIO.PULL_UP, GPIO.INT_EDGE_NEG, 50, function (x) {
  pinOutState = !pinOutState;
  if (mqttConnected) {
    let ok = MQTT.pub(mqttPub, JSON.stringify(pinOutState), 1);
    Log.info('MQTT send: ' + (ok ? 'OK' : 'Err'));
  } else {
    Log.info('MQTT not connected');
    GPIO.write(pinOut, pinOutState ? 1 : 0);
  }
}, true);

Log.info('====== Den Trai Tim started ======');
