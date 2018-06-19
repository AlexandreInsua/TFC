export class Row {
    dateg: string;
    temperature: number;
    airhr: number;
    floorhr: number;
    light: number;
    dvph: number;

    constructor(dateg, temperature, airhr, floorhr, light, dvph){
        this.dateg = dateg;
        this.temperature = temperature;
        this.airhr = airhr;
        this.floorhr = floorhr;
        this.light = light;
        this.dvph = dvph;
    }
}