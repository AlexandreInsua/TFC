/* ====================================
   SCRIPT DE CREACIÓN DA BASE DE DATOS 
   ==================================== */
   
/* Nota: Para que se active o evento é necesario configurar 
	o plaficador de tareas como root
    set GLOBAL event_scheduler=on;
 */

CREATE DATABASE IF NOT EXISTS greenhouse;
USE greenhouse;

-- rexistra os datos brutos cada segundo
-- 1M rexistros = 11,57 días
DROP TABLE raw_data;
CREATE TABLE IF NOT EXISTS raw_data (
    raId INT AUTO_INCREMENT PRIMARY KEY ,
    raDatetime DATETIME DEFAULT NOW(),
    raTemp INTEGER DEFAULT 0,
    raAirHr INTEGER DEFAULT 0,
    raFloorHr INTEGER DEFAULT 0, 
    raLight INTEGER DEFAULT 0
)ENGINE = INNODB;

-- optimización de buscas
CREATE INDEX raDate ON raw_data(raDatetime);

-- rexistra os datos procesados cada segundo
-- 1M rexistros = 11,57 días
DROP TABLE IF EXISTS processed_data;
CREATE TABLE IF NOT EXISTS processed_data (
    prId INT AUTO_INCREMENT PRIMARY KEY,
    prDatetime DATETIME ,
    prTemp FLOAT(5 , 2 ),
    prAirHr FLOAT(5 , 2 ),
    prFloorHr FLOAT(5 , 2 ),
    prLight INTEGER,
    prDvpt FLOAT(5, 2)
)ENGINE = INNODB;

-- optimización de buscas
CREATE INDEX prDate ON processed_data(prDatetime);

-- rexistro os datos procesados cada hora 
-- 1M rexistros = 114,15 anos
-- permitirá mostrar unha vista por día (graph)
-- permite mostrar unha táboa por intervalo
-- permite mostrar unha taboa de datos por ano
drop table historical;
CREATE TABLE IF NOT EXISTS historical (
    hiId INT AUTO_INCREMENT PRIMARY KEY ,
    hiDatetime DATETIME,
    hiTemp FLOAT(5 , 2 ),
    hiAirHr FLOAT(5 , 2 ),
    hiFloorHr FLOAT(5 , 2 ),
    hiLight INTEGER DEFAULT 1,
    hiDvph FLOAT(5 , 2 )
)ENGINE = INNODB; 

-- CREATE INDEX raDate ON raw_data(raHour);
CREATE INDEX hiDate ON historical(hiDatetime);


CREATE TABLE IF NOT EXISTS configuration (
    coActiveConnection BOOLEAN DEFAULT TRUE,
    coScatterIrrigation BOOLEAN DEFAULT FALSE,
    coDripIrrigation BOOLEAN DEFAULT FALSE,
    coForcedVentilation BOOLEAN DEFAULT FALSE
)  ENGINE=INNODB;

INSERT INTO configuration VALUES (TRUE, FALSE, FALSE, FALSE);

######################################################
##########		FUNCIÓNS  		######################

/* FUNCIÓN PARA TRANSFORMAR A HUMIDADE DO SOLO EN T% */
DROP FUNCTION IF EXISTS calculatePrFloorHr;
CREATE FUNCTION calculatePrFloorHr(floorHr INTEGER) RETURNS FLOAT
	RETURN floorHr/10;


/* FUNCIÓN PARA TRANSFORMAR A LECTURA DE LUZ EN LUX */
/*
const long A = 1000;     //Resistencia en oscuridad en KΩ
const int B = 15;        //Resistencia a la luz (10 Lux) en KΩ
const int Rc = 10;       //Resistencia calibracion en KΩ
const int LDRPin = A0;   //Pin del LDR
 
int V;
int ilum;
 
void setup() 
{
   Serial.begin(115200);
}
 
void loop()
{
   V = analogRead(LDRPin);         
 
   //ilum = ((long)(1024-V)*A*10)/((long)B*Rc*V);  //usar si LDR entre GND y A0 
   ilum = ((long)V*A*10)/((long)B*Rc*(1024-V));    //usar si LDR entre A0 y Vcc (como en el esquema anterior)
  
   Serial.println(ilum);   
   delay(1000);
}

formula alternativa
	(V*A*100)/(B*Rc*(1023-V))
*/
DROP FUNCTION IF EXISTS calculateLux;
CREATE FUNCTION calculateLux(light INTEGER) RETURNS INTEGER
	RETURN (light * 1000 * 100 ) / (15*10*(1023-light));
	-- RETURN ((1024-light)*1000*10)/(15*10*(1024-light));


/* FUNCIÓN PARA CALCULAR A PRESIÓN DE VAPOR SATURADO*/
DROP FUNCTION IF EXISTS calculateDvs;
delimiter $
CREATE FUNCTION calculateDvs(temperature FLOAT) RETURNS FLOAT
BEGIN
	DECLARE dvs FLOAT;
	SET dvs = (6.11*EXP((17.27*temperature)/(237.3+temperature)));
	RETURN dvs;
END $
Delimiter ; 

    
/* FUNCIÓN PARA CALCULAR O DÉFICIT DE PRESIÓN DE VAPOR */
# recibe dous parámetros de tipo FLOAT: T e HR 
# calcula  segundo a fórmula 
# devolve un valor de tipo FLOAT [de rango entre 5 e 15 en condicións normais]
# para probas https://www.semillas-de-marihuana.com/blog/dpv-deficit-presion-vapor/
DROP FUNCTION IF EXISTS calculateDvpt;
Delimiter $
CREATE FUNCTION calculateDvpt(temperature FLOAT, airHr FLOAT) RETURNS FLOAT
BEGIN
	DECLARE dvpt FLOAT;
    SET dvpt = ((100-airHr)/100)* CALCULATEDVS(temperature);
	RETURN dvpt;
END $
Delimiter ;



/* EVENTO PARA SELECCIONAR OS DATOS HISTÓRICOS*/
DROP EVENT IF EXISTS insertHistorical;

CREATE EVENT insertHistorical 
	ON SCHEDULE 
    EVERY 1 HOUR
    STARTS '2018-05-27 13:00:00' ENABLE
DO
	INSERT INTO historical(hiDatetime, hiTemp, hiAirHr, hiFloorhr, hiLight, hiDvph)
	SELECT NOW(), round(AVG(prTemp),2), round(AVG(prAirHr),2), round(AVG(prFloorHr),2), round(AVG(prLight),0), round(AVG(prDvpt),2)
	FROM processed_data 
    order by prDatetime desc limit 3600;
    

##################################################
###### triger #######

/* TRIGGER QUE INSERTA OS DATOS BRUTOS NOS DATOS TRATADOS*/
DROP TRIGGER new_raw_record;
CREATE TRIGGER new_raw_record AFTER INSERT ON raw_data FOR EACH ROW
	INSERT INTO processed_data(prDatetime, prTemp, prAirHr, prFloorHr, prLight, prDvpt) 
		VALUES (NOW(), new.raTemp, new.raAirHr, CALCULATEPRFLOORHR(new.raFloorHr),
        CALCULATELUX(new.raLight), CALCULATEDVPT(new.raTemp, new.raAirHr));
    

######################
# probas

SELECT * FROM raw_data ORDER BY raDatetime DESC limit 10;
SELECT count(raId) FROM raw_data ORDER BY raDatetime DESC;

SELECT * FROM processed_data ORDER BY prDatetime desc;

SELECT round(avg(prTemp),2), round(avg(prAirHr),2), round(avg(prFloorHr),2), round(avg(prLight),2), round(avg(prDvpt),2) FROM processed_data where prDatetime BETWEEN concat('2018-06-21 ', 23)   and now() ORDER BY prDatetime asc;
select prDatetime from processed_data;

SELECT prDatetime, prTemp, prAirHr, prFloorHr, prLight, prDvpt FROM processed_data ORDER BY prDatetime DESC LIMIT 1;

SELECT avg(prFloorHr) from processed_data order by prDatetime LIMIT 5;

SELECT avg(prLight) from processed_data ; -- order by prDatetime desc limit 3600;

SELECT count(prTemp) from processed_data where prtemp = 22;

select extract(year from now());

SELECT hiDatetime, hiTemp, hiAirHr, hiFloorHr, hiLight, hiDvph FROM historical WHERE EXTRACT(day FROM hiDatetime) = EXTRACT(day FROM NOW()); --  = EXTRACT(hour FROM NOW()); -- AND EXTRACT(MINUTE FROM prDatetime) = EXTRACT(MINUTE FROM NOW());


SELECT * FROM historical ORDER BY hiDatetime desc;
SELECT hiDatetime, hiTemp, hiAirHr, hiFloorHr, hiLight, hiDvph FROM historical;

-- TRUNCATE TABLE historical;

