import mqtt from "mqtt";
import { store } from "./App";
import { newMessageHasBeenReceived } from "./store/actions/tracking.actions";
import { updateConnectionStatus } from "./store/actions/connectionStatus.actions";

function subscribeMQTT() {
  const client = mqtt.connect("mqtt://mqtt.broker.gkasperski.usermd.net:1884");

  client.on("connect", () => {
    store.dispatch(updateConnectionStatus("online"));
  });
  client.on("offline", () => {
    store.dispatch(updateConnectionStatus("offline"));
  });
  client.on("connect", () => {
    client.subscribe("/Tracking/+");
  });
  client.on("message", (topic, message) => {
    console.log(topic, message);
    store.dispatch(newMessageHasBeenReceived(message.toString(), topic.split("/")[2]));
  });
}

export default subscribeMQTT;
