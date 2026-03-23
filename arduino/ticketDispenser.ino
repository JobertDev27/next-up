#include <SevSeg.h>

SevSeg sevseg;

byte button = 14;
byte buzzer = 15;

unsigned long startTime = 0;
unsigned long lastBeep = 0;

bool counting = false;
int numberToDisplay = 0;

bool isBeeping = false;
unsigned long beepStart = 0;

void setup() {
  byte numDigits = 4;

  byte digitPins[] = {12, 9, 8, 6};
  byte segmentPins[] = {11, 7, 4, 2, 13, 10, 5, 3};

  bool resistorsOnSegments = true;
  byte hardwareConfig = COMMON_CATHODE;
  bool updateWithDelays = false;
  bool leadingZeros = false;
  bool disableDecPoint = false;

  pinMode(button, INPUT_PULLUP);
  pinMode(buzzer, OUTPUT);


  sevseg.begin(
    hardwareConfig,
    numDigits,
    digitPins,
    segmentPins,
    resistorsOnSegments,
    updateWithDelays,
    leadingZeros,
    disableDecPoint
  );

  sevseg.setBrightness(90);
  sevseg.setChars("----");
  Serial.begin(9600);

}

void loop() {
  sevseg.refreshDisplay();

  if (digitalRead(button) == LOW && !counting) {
    counting = true;
    Serial.println("requestCode");
    startTime = millis();
    lastBeep = millis();
  }

  if (counting) {
    if (Serial.available()) {
      String input = Serial.readStringUntil('\n');
      if (input.length() > 0) {
        numberToDisplay = input.toInt();
      }
    }

    sevseg.setNumber(numberToDisplay);
    unsigned long currentTime = millis();
    if (currentTime - lastBeep >= 1000) {
      tone(buzzer, 1000);
      isBeeping = true;
      beepStart = currentTime;
      lastBeep = currentTime;
    }
    
    if (isBeeping && currentTime - beepStart >= 100) {
      noTone(buzzer);
      isBeeping = false;
    }

    if (currentTime - startTime >= 10000) {
      counting = false;
      noTone(buzzer);
      sevseg.setChars("----");
    }
  }
}