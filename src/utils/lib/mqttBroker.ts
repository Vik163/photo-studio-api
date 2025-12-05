import mqtt from 'mqtt';

const topic = 'home/status';

const connectUrl = `mqtt://${process.env.ARD_MQTT_HOST}:${process.env.ARD_MQTT_PORT}`;

const client = mqtt.connect(connectUrl, {
  // clientId, // подписывается только один раз
  connectTimeout: 4000,
  username: process.env.ARD_MQTT_USER_NAME,
  password: process.env.ARD_MQTT_USER_PASS,
  reconnectPeriod: 2000,
});

client.on('connect', () => {
  client.subscribe([topic], () => {});
});

client.on('message', (topic, payload) => {
  console.log('Home:', payload.toString());
  const text = 'Нет связи с домом';

  if (payload.toString() === 'offline')
    fetch(
      `https://api.telegram.org/bot${process.env.ARD_TELEG_TOKEN}/sendMessage?chat_id=${process.env.ARD_TELEG_ID}&text=${text}`,
    );
});

export async function mqttConnect() {}
