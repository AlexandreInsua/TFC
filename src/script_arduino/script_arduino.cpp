/*
   Proxecto de fin do Ciclo Superior de Desenvolvemento de aplicacións multiplataforma.
   Script para microcontrolador Arduino (ou compatible) que captura a temperatura ambiental, humidade relativa,
   humidade relativa do solo e a luz para un punto en invernadoiro.
   Os datos capturados son enviados a unha base de datos MySQL.
   Creado por: Alexandre Insua Moreira
   (c) 14 de xuño de 2018
*/

// inclúe librería sensor DHT11
#include "DHT.h"

// define o pin dixital onde se conecta o sensor
#define DHTPIN 7

// define o tipo de sensor
#define DHTTYPE DHT11

// inicia o sensor DHT11
DHT dht(DHTPIN, DHTTYPE);

// define o sensor ldr
const byte ldrPin = A3;

// define o sensor Moisture
const byte moisterPin = A5;

// Librería de Rede
#include <Ethernet.h>

// Librería de conector con  mysql
#include <MySQL_Connection.h>

// Librería do cursor
#include <MySQL_Cursor.h>

// Parámetros de conexión de rede
byte mac_addr[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

IPAddress server_addr(192, 168, 0, 11); //127.0.0.1);  // IP of the MySQL *server* here
char user[] = "arduino";              // MySQL user login username
char password[] = "arduino";        // MySQL user login password

char SQL[] = "INSERT INTO greenhouse.raw_data (raTemp,raAirHr, raFloorHr, raLight) VALUES (%d, %d, %d, %d)";
char query[128];

EthernetClient client;

MySQL_Connection conn((Client *)&client);

MySQL_Cursor *cur_mem = new MySQL_Cursor(&conn);

void setup() {
  Serial.begin(115200);
  while (!Serial); // wait for serial port to connect
  Ethernet.begin(mac_addr);
  Serial.println("Conectando coa base de datos...");

  if (conn.connect(server_addr, 3306, user, password)) {

  }
  else {
    Serial.println("Erro de conexión.");
  }

  // arranca o sensor DHT
  dht.begin();
}

void loop() {
  delay(1000);
  /*=============================
     TOMA DE DATOS
    =============================*/
  // Ler temperatura
  int temp = dht.readTemperature();

  // Ler Hr do aire
  int airHr = dht.readHumidity();

  // le humidade do solo
  int floorHr =  map(analogRead(moisterPin), 320, 560, 950, 1);

  // Ler Lux
  int light = analogRead(ldrPin);


  /*=============================
     VERIFICACIÓN DE DATOS
    =============================*/
  // comproba erros de lectura (is not a number)
  if (isnan(temp) || isnan(airHr)) {
    Serial.println("Erro obtendo os datos do sensor DHT11");
    return;
  }

  if (isnan(floorHr)) {
    Serial.println("Erro obtendo os datos do sensor Moisture");
    return;
  }

  if (isnan(light)) {
    Serial.println("Erro obtendo os datos do sensor LDR");
    return;
  }

  /*=============================
     MOSTRA DE DATOS POR MONITOR
    =============================*/
  Serial.print("T: ");
  Serial.print(temp);
  Serial.print("*C, ");
  Serial.print(airHr);
  Serial.print("%, ");
  Serial.print(floorHr);
  Serial.print(", Luz: ");
  Serial.println(light);

  /*=============================
     CREA A SENTENZA DE INSERCIÓN
    ============================= */
  sprintf(query, SQL, temp, airHr, floorHr, light);
  Serial.println(query);

  /*=============================
     EXECUTA A SENTENZA
    ============================= */
  cur_mem->execute(query);
  Serial.println("Datos inseridos");
  
}