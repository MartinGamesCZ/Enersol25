import { board, PinMode, PinState } from "embets:hardware";
import { WiFi, request } from "embets:net";
import { delay, delayMicroseconds } from "embets:timers";

process.env = {
  WIFI_SSID: "sb",
  WIFI_PASS: "12345677",
};

const SRVIP = "192.168.103.210";

const relay = board.pins(22);

const trig = board.pins(5);
const echo = board.pins(18);

const endstop = board.pins(0);

trig.setMode(PinMode.OUTPUT);
echo.setMode(PinMode.INPUT);

relay.setMode(PinMode.OUTPUT);
relay.setState(PinState.HIGH);

endstop.setMode(PinMode.INPUT_PULLUP);

var stopCharging = false;

endstop.on("low", () => {
  relay.setState(PinState.HIGH);

  stopCharging = true;
});

const wifi = new WiFi(process.env.WIFI_SSID ?? "", process.env.WIFI_PASS ?? "");

console.log("Connecting to WiFi (" + process.env.WIFI_SSID + ")...");
wifi.connect();

while (!wifi.connected) delay(100);

console.log("Connected to WiFi: " + wifi.ip);

loop();

function loop() {
  while (true) {
    if (stopCharging) {
      setCharging(false);
    }

    const data = getData();

    if (stopCharging) {
      stopCharging = false;
      if (data.charging) data.charging = false;
    }

    if (data.charging === true) relay.setState(PinState.LOW);
    else if (data.charging === false) relay.setState(PinState.HIGH);

    delay(50);

    const distance = getHcDistance();
    const charge = Math.floor(remap(distance, 2, 40, 0, 100));

    setData("charge=" + charge);

    Duktape.gc();
  }
}

function getData() {
  const req = request("http://" + SRVIP + ":3000/data", {
    method: "GET",
  });

  if (req.statusCode < 0) {
    console.log("Failed to get data from server");
    return {};
  }

  return req.json();
}

function setData(p: string) {
  const req = request("http://" + SRVIP + ":3000/set?" + p, {
    method: "GET",
  });

  if (req.statusCode < 0) {
    console.log("Failed to get data from server");
    return {};
  }

  return {};
}

function setCharging(charging: boolean) {
  const req = request(
    "http://" + SRVIP + ":3000/set/charging?charging=" + (charging ? "1" : "0"),
    {
      method: "GET",
    }
  );

  if (req.statusCode < 0) {
    console.log("Failed to set charging on server");
    return {};
  }

  return {};
}

function getHcDistance() {
  trig.setState(PinState.LOW);
  delayMicroseconds(2);
  trig.setState(PinState.HIGH);
  delayMicroseconds(10);
  trig.setState(PinState.LOW);

  const pulse = echo.measurePulse(PinState.HIGH);

  const distance = pulse * (0.034 / 2);

  return distance;
}

function remap(
  value: number,
  fromLow: number,
  fromHigh: number,
  toLow: number,
  toHigh: number
) {
  return toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
}
