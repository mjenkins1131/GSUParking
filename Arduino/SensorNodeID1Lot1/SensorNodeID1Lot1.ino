#include <RTClib.h>

#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>



//States the node can be in
enum NodeState{
  idle,
  sensingObject
};

//Current state of the node, defaulted as idle
NodeState currentState = idle;

//struct to represent an object passing
struct PassedObject{
  byte averageDistance; //Average distance of an object that has passed the sensor
  byte enterHour; //Hour the object entered the sensor
  byte enterMinute; //Minute the object entered the sensor
  byte enterSecond; //Second the object entered the sensor
  byte exitHour; //Hour the object left the sensor
  byte exitMinute; //Minute the object the sensor
  byte exitSecond; //Second the object left the sensor
  //constructor for default object
  PassedObject(): averageDistance(0), enterHour(0), enterMinute(0), enterSecond(0), exitHour(0), exitMinute(0), exitSecond(0) {}
  //Constructor for object when object was first sensed
  PassedObject(byte firstDistance, byte hour, byte minute, byte second): averageDistance(firstDistance), enterHour(hour), enterMinute(minute), enterSecond(second){}
};

//Used for keeping track of an object in the sensor
int objectTotalCycles;
int objectTotalDistance;
int objectPreviousDistance;

//represent the current passing object. Null if no object passing
PassedObject currentPassingObject;

//The amount of traffic events we are alowed to save at once
#define MAXMEMEVENTS 100
//Offset at the beginning of a packet before starting events (in bytes)
#define PACKETEVENTOFFSET 3
//Array holding the bytes of the traffic events
byte trafficEvents[(MAXMEMEVENTS * sizeof(PassedObject)) + PACKETEVENTOFFSET];

//index of the last added event + 1
byte trafficEventIndex = 0;

//Identifier for the node
byte nodeID = 1;
//Lot number for this node
byte lotID = 1;


//------------------***LORA VARIABLES/Methods***------------------
// Pin mapping
const lmic_pinmap lmic_pins = {
    .nss = 10,
    .rxtx = LMIC_UNUSED_PIN,
    .rst = 11,
    .dio = {0, 5, LMIC_UNUSED_PIN},
};

// LoRaWAN NwkSKey, network session key
static const PROGMEM u1_t NWKSKEY[16] = {0x71, 0x30, 0x4B, 0x55, 0x05, 0x06, 0xAD, 0x2C, 0xD1, 0x02, 0xBB, 0x12, 0x5B, 0x09, 0xAB, 0x05};//{ 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };

// LoRaWAN AppSKey, application session key
static const u1_t PROGMEM APPSKEY[16] = {0x25, 0xEC, 0xCC, 0x64, 0x7C, 0xCB, 0x99, 0x9F, 0x07, 0x91, 0x81, 0xF2, 0xAE, 0x7E, 0x82, 0xCC };//{ 0x2B, 0x7E, 0x15, 0x16, 0x28, 0xAE, 0xD2, 0xA6, 0xAB, 0xF7, 0x15, 0x88, 0x09, 0xCF, 0x4F, 0x3C };

// LoRaWAN end-device address (DevAddr)
static const u4_t DEVADDR = 0x260212A6; // <-- Change this address for every node!

//Channel to send on
static const int channel = 0;

// These callbacks are only used in over-the-air activation, so they are
// left empty here (we cannot leave them out completely unless
// DISABLE_JOIN is set in config.h, otherwise the linker will complain).
void os_getArtEui (u1_t* buf) { }
void os_getDevEui (u1_t* buf) { }
void os_getDevKey (u1_t* buf) { }

void setupLora()
{
    // LMIC init
  os_init();
  // Reset the MAC state. Session and pending data transfers will be discarded.
  LMIC_reset();

  // Set static session parameters. Instead of dynamically establishing a session
  // by joining the network, precomputed session parameters are be provided.
  #ifdef PROGMEM
  // On AVR, these values are stored in flash and only copied to RAM
  // once. Copy them to a temporary buffer here, LMIC_setSession will
  // copy them into a buffer of its own again.
  uint8_t appskey[sizeof(APPSKEY)];
  uint8_t nwkskey[sizeof(NWKSKEY)];
  memcpy_P(appskey, APPSKEY, sizeof(APPSKEY));
  memcpy_P(nwkskey, NWKSKEY, sizeof(NWKSKEY));
  LMIC_setSession (0x1, DEVADDR, nwkskey, appskey);
  #else
  // If not running an AVR with PROGMEM, just use the arrays directly
  LMIC_setSession (0x1, DEVADDR, NWKSKEY, APPSKEY);
  #endif
  #if defined(CFG_us915)
  // Set up the channels used by the Things Network, which corresponds
  // to the defaults of most gateways. Without this, only three base
  // channels from the LoRaWAN specification are used, which certainly
  // works, so it is good for debugging, but can overload those
  // frequencies, so be sure to configure the full frequency range of
  // your network here (unless your network autoconfigures them).
  // Setting up channels should happen after LMIC_setSession, as that
  // configures the minimal channel set.
  // NA-US channels 0-71 are configured automatically
  // but only one group of 8 should (a subband) should be active
  // TTN recommends the second sub band, 1 in a zero based count.
  // https://github.com/TheThingsNetwork/gateway-conf/blob/master/US-global_conf.json
  LMIC_selectSubBand(0);
  //Disable all but the variable "channel" channel
  for(int i=0; i<71; i++) 
  {
    if(i != channel) 
    {
      LMIC_disableChannel(i);
    }
  }
  #endif
  // Disable link check validation
  LMIC_setLinkCheckMode(0);

  // TTN uses SF9 for its RX2 window.
  LMIC.dn2Dr = DR_SF9;

  // Set data rate and transmit power for uplink (note: txpow seems to be ignored by the library)
  LMIC_setDrTxpow(DR_SF9,14);

}


//Handle various LoRa events
void onEvent (ev_t ev) {
    Serial.print(os_getTime());
    Serial.print(": ");
    switch(ev) {
        case EV_SCAN_TIMEOUT:
            Serial.println(F("EV_SCAN_TIMEOUT"));
            break;
        case EV_BEACON_FOUND:
            Serial.println(F("EV_BEACON_FOUND"));
            break;
        case EV_BEACON_MISSED:
            Serial.println(F("EV_BEACON_MISSED"));
            break;
        case EV_BEACON_TRACKED:
            Serial.println(F("EV_BEACON_TRACKED"));
            break;
        case EV_JOINING:
            Serial.println(F("EV_JOINING"));
            break;
        case EV_JOINED:
            Serial.println(F("EV_JOINED"));
            break;
        case EV_RFU1:
            Serial.println(F("EV_RFU1"));
            break;
        case EV_JOIN_FAILED:
            Serial.println(F("EV_JOIN_FAILED"));
            break;
        case EV_REJOIN_FAILED:
            Serial.println(F("EV_REJOIN_FAILED"));
            break;
        case EV_TXCOMPLETE:
            Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
            if (LMIC.txrxFlags & TXRX_ACK)
              Serial.println(F("Received ack"));
            if (LMIC.dataLen) {
              Serial.println(F("Received "));
              Serial.println(LMIC.dataLen);
              Serial.println(F(" bytes of payload"));
            }
            // Schedule next transmission
            //os_setTimedCallback(&sendjob, os_getTime()+sec2osticks(TX_INTERVAL), do_send);
            //If we've sent the packet, clear the saved traffic events
            ClearSavedTrafficEvents();
            break;
        case EV_LOST_TSYNC:
            Serial.println(F("EV_LOST_TSYNC"));
            break;
        case EV_RESET:
            Serial.println(F("EV_RESET"));
            break;
        case EV_RXCOMPLETE:
            // data received in ping slot
            Serial.println(F("EV_RXCOMPLETE"));
            break;
        case EV_LINK_DEAD:
            Serial.println(F("EV_LINK_DEAD"));
            break;
        case EV_LINK_ALIVE:
            Serial.println(F("EV_LINK_ALIVE"));
            break;
         default:
            Serial.println(F("Unknown event"));
            break;
    }
}

//Send a data packet
void do_send(osjob_t* j){
    // Check if there is not a current TX/RX job running
    if (LMIC.opmode & OP_TXRXPEND) {
        Serial.println(F("OP_TXRXPEND, not sending"));
    } else {
        // Prepare upstream data transmission at the next possible time.
        LMIC_setTxData2(1, trafficEvents, trafficEventIndex, 0);
        Serial.println(F("Packet queued"));
    }
    // Next TX is scheduled after TX_COMPLETE event.
}

static osjob_t sendjob;


//------------------***END LORA VARIABLES/Methods***------------------



//------------------***SENSOR VARIABLES/Methods***------------------

#define ECHOPIN 1// Pin to receive echo pulse from sensor
#define TRIGPIN 12// Pin to send trigger pulse from sensor


//Sensor min distance: ~10 inches
const byte minimumSensorDistance = 10;
const byte maximumSensorDistance = 40;

//Delay between each sensor query. Must be >= 50
const byte sensorQueryDelay = 50;

//Thresholds used to account for sensor innacuracy/noise
//Inches of difference to say when an object has left the sensor (small jumps won't trigger the object leaving)
const byte objectPassedThreshold = 5;
//Number of cycles we allow the sensor to change by large values before deciding an object has passed (large jumps due to noise won't trigger the object leaving)
const byte sensorNoiseCycleTheshold = 10;

//keeps track of how long the sensor has given us a distance with a difference greater than the threshold
byte cyclesOverThreshold = 0;

void setupSensor()
{
  pinMode(ECHOPIN, INPUT);

  pinMode(TRIGPIN, OUTPUT);

  digitalWrite(ECHOPIN, HIGH);

  //if the sensorQueryDelay is less than 50 the sensor will not function, so blink a light to show 
  if (sensorQueryDelay < 50)
  {
    //sensorQueryDelay must be at least 50ms (see specifications)
    ErrorBlink("sensorQueryDelay must be at least 50ms (see specifications)");
  }
}

//Query the sensor and return the distance to the nearest object
byte QuerySensor()
{
  //Returns a distance reading from the sensor in inches
  digitalWrite(TRIGPIN, LOW); // Set the trigger pin to low for 2uS

  delayMicroseconds(2);

  digitalWrite(TRIGPIN, HIGH); // Send a 10uS high to trigger ranging

  delayMicroseconds(15);

  digitalWrite(TRIGPIN, LOW); // Send pin low again

  int distance = pulseIn(ECHOPIN, HIGH,26000); // Read in times pulse

  //divide by 148 for inches, 58 for centimeters
  byte distanceInInches = distance/148;           

  return distanceInInches;
}

//------------------***END SENSOR VARIABLES/Methods***------------------


//------------------***CLOCK VARIABLES/Methods***------------------
//Clock variable to query when getting times
RTC_DS3231 rtc;
//Reorded minute of previous frame, used for timing lora packets
byte previousFrameMinute;
//------------------***END CLOCK VARIABLES/Methods***------------------

void setup(){
  //9600
  Serial.begin(9600);
  setupSensor();
  setupLora();
  ClearSavedTrafficEvents();
  DateTime now = rtc.now();
  previousFrameMinute = now.minute();
}

void loop(){
  SenseObject();
  os_runloop_once();
  DateTime now = rtc.now();
  byte thisFrameMinute = now.minute();
  if (thisFrameMinute != previousFrameMinute)
  {
    //if the time has changed by at least a minute, send a new packet
    SendDataPackets();
  }
  delay(sensorQueryDelay);// Wait sensorQueryDelay before next ranging
  previousFrameMinute = thisFrameMinute;
}

void SenseObject()
{
  //Get a distance reading from the sensor
  byte distance = QuerySensor();

  //Depending on the state of the node, process the reading
  switch(currentState)
  {
    case idle:
      //If the sensor is currently idle, we see if a new object has started passing
      if (distance > minimumSensorDistance && distance < maximumSensorDistance)
      {
        DateTime now = rtc.now();
        //if the distance the sensor read is within range, an object is passing
        currentPassingObject = {distance, now.hour(), now.minute(), now.second()};
        objectPreviousDistance = distance;
        currentState = sensingObject;
      }
      break;
    case sensingObject:
      //if an object is already passing, we check to see if it has left the sensor area
      //if the distance reading has changed by more than objectPassedThreshold
      if (abs(objectPreviousDistance - distance) > objectPassedThreshold)
      {
        //increment the amount of cycles the distance has changed significantly 
        cyclesOverThreshold++;
        //if the sensor has given us a reading outside the passThreshold, for long enough, the object has passed
        if (cyclesOverThreshold > sensorNoiseCycleTheshold)
        {
          //Print the passed object data and set the node back to idle (denoting no object in the way of the sensor)
          DateTime now = rtc.now();
          currentPassingObject.exitHour = now.hour();
          currentPassingObject.exitMinute = now.minute();
          currentPassingObject.exitSecond = now.second();
          Serial.println("Object sensed");
          PushTrafficEvent(currentPassingObject);
          cyclesOverThreshold = 0;
          objectPreviousDistance = 0;
          objectTotalDistance = 0;
          objectTotalCycles = 0;
          currentState = idle;
        }
      }
      else
      {
        //If the object is still in the sensor, record the data
        cyclesOverThreshold = 0;
        objectPreviousDistance = distance;
        objectTotalDistance += distance;
        objectTotalCycles++;
        currentPassingObject.averageDistance = objectTotalDistance / objectTotalCycles;
      }
      break;
    default:
      //Should never reach this state
      ErrorBlink("Invalid Node State");
      break;
  }
}

//Add a traffic event to the event array
void PushTrafficEvent(struct PassedObject object)
{
  if (trafficEventIndex < MAXMEMEVENTS * sizeof(PassedObject) - PACKETEVENTOFFSET)
  {
    trafficEvents[trafficEventIndex++] = object.averageDistance;
    trafficEvents[trafficEventIndex++] = object.enterHour;
    trafficEvents[trafficEventIndex++] = object.enterMinute;
    trafficEvents[trafficEventIndex++] = object.enterSecond;
    trafficEvents[trafficEventIndex++] = object.exitHour;
    trafficEvents[trafficEventIndex++] = object.exitMinute;
    trafficEvents[trafficEventIndex++] = object.exitSecond;
  }
  else
  {
    Serial.println("Out of traffic event space");
  }
}

void ClearSavedTrafficEvents()
{
  trafficEventIndex = PACKETEVENTOFFSET;
}

void SendDataPackets()
{
  trafficEvents[0] = nodeID;
  trafficEvents[1] = lotID;
  trafficEvents[2] = (trafficEventIndex - PACKETEVENTOFFSET) / sizeof(PassedObject);

  Serial.println("Node ");
  Serial.print(trafficEvents[0]);
  Serial.print(" has ");
  Serial.print(trafficEvents[2]);
  Serial.println(" Packets.");
  Serial.println("-------------------");
  if (trafficEvents[2] > 0)
  {
    //if there are traffic events, send the packet
    do_send(&sendjob);
    for(int i = PACKETEVENTOFFSET; i < trafficEventIndex; i+= sizeof(PassedObject))
    {
      PrintObjectPassed(i);
      Serial.println("-------------------");
    }
  } 
}

//print event information
void PrintObjectPassed(int i)
{
  Serial.print("Object has passed. Average Distance: ");
  Serial.print(trafficEvents[i]);
  Serial.println(" in.");
  Serial.print("Enter Time:: Hour: ");
  Serial.print(trafficEvents[i+1], DEC);
  Serial.print(". Minute: ");
  Serial.print(trafficEvents[i+2], DEC);
  Serial.print(". Second: ");
  Serial.println(trafficEvents[i+3], DEC);
  Serial.print("Exit Time:: Hour: ");
  Serial.print(trafficEvents[i+4], DEC);
  Serial.print(". Minute: ");
  Serial.print(trafficEvents[i+5], DEC);
  Serial.print(". Second: ");
  Serial.println(trafficEvents[i+6], DEC);
}

void PrintObjectPassed(struct PassedObject object)
{
  Serial.print("Object has passed. Average Distance: ");
  Serial.print(object.averageDistance);
  Serial.println(" in.");
  Serial.print("Enter Time:: Hour: ");
  Serial.print(object.enterHour, DEC);
  Serial.print(". Minute: ");
  Serial.print(object.enterMinute, DEC);
  Serial.print(". Second: ");
  Serial.println(object.enterSecond, DEC);
  Serial.print("Exit Time:: Hour: ");
  Serial.print(object.exitHour, DEC);
  Serial.print(". Minute: ");
  Serial.print(object.exitMinute, DEC);
  Serial.print(". Second: ");
  Serial.println(object.exitSecond, DEC);
}

//If the node is blinking red, there is an error somewhere
void ErrorBlink(char errorMessage[])
{
  while(true)
  {
    Serial.println(errorMessage);
    digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
    delay(3000);              // wait for a second
    digitalWrite(13, LOW);    // turn the LED off by making the voltage LOW
    delay(1000);     
  }
}
