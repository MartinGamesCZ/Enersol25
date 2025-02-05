#include <Arduino.h>
#include <WebServer.h>
#include <WiFi.h>
#include <WiFiClient.h>

#define SERIAL_SPEED 115200
#define SERIAL_PORT Serial
#define CHRG_ENABLE 22
#define CHRG_DETECT 34
#define GEN_CURRENT 35
#define GEN_VOLTAGE 36
#define USS_TRIGGER 32
#define USS_ECHO 33
#define ENDSTOP 24
#define WIFI_SSID "sb"
#define WIFI_PASS "12345677"

WebServer server(80);

void setup() {
  SERIAL_PORT.begin(SERIAL_SPEED);

  SERIAL_PORT.println("Starting...");

  pinMode(CHRG_ENABLE, OUTPUT);
  pinMode(CHRG_DETECT, INPUT_PULLDOWN);
  pinMode(GEN_CURRENT, INPUT);
  pinMode(GEN_VOLTAGE, INPUT);
  pinMode(USS_TRIGGER, OUTPUT);
  pinMode(USS_ECHO, INPUT);
  pinMode(ENDSTOP, INPUT);

  digitalWrite(CHRG_ENABLE, HIGH);
  digitalWrite(USS_TRIGGER, LOW);

  SERIAL_PORT.println("WiFi connecting...");

  WiFi.begin(WIFI_SSID, WIFI_PASS);

  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    SERIAL_PORT.println(".");
  }

  SERIAL_PORT.println("WiFi connected");

  SERIAL_PORT.print("IP address: ");
  SERIAL_PORT.println(WiFi.localIP());

  server.on("/charge", []() { server.send(200, "text/plain", "Charge on"); });

  server.begin();
}

void loop() { server.handleClient(); }