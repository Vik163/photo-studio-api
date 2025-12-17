import mqtt from 'mqtt';

type Status = 'online' | 'offline';

const topicStatus = 'home/status';
const topicTimer = 'home/timer';

const connectUrl = `mqtt://${process.env.ARD_MQTT_HOST}:${process.env.ARD_MQTT_PORT}`;

const client = mqtt.connect(connectUrl, {
  // clientId, // подписывается только один раз
  connectTimeout: 4000,
  username: process.env.ARD_MQTT_USER_NAME,
  password: process.env.ARD_MQTT_USER_PASS,
  reconnectPeriod: 2000,
});

client.on('connect', () => {
  client.subscribe([topicStatus, topicTimer], () => {});
});

client.on('message', (topic, payload) => {
  const status = payload.toString() as Status;
  const text = `Статус дома **${status}**`;

  if (topic === topicStatus) {
    fetch(
      `https://api.telegram.org/bot${process.env.ARD_TELEG_TOKEN}/sendMessage?chat_id=${process.env.ARD_TELEG_ID}&text=${text}`,
    );
  }
});

export async function mqttConnect() {}
