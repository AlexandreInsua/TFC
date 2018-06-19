import { Component, OnInit, NgZone } from '@angular/core';
import { ActualService } from "../services/actual.service";


import { Row } from "../models/Row";

@Component({
  selector: 'actual',
  templateUrl: './actual.component.html',
  styleUrls: ['./actual.component.css'],
  providers: [ActualService]
})

export class ActualComponent implements OnInit {

  public row: Row;

  constructor(public _actualservice: ActualService, private _ngZone: NgZone ) {
        
  }

  ngOnInit() {
    this.row = new Row('2018-06-14 21:00:00', 0, 0, 0, 0, 0);
    this._actualservice.getRow().subscribe(
      result => {
        this.row = result;
        this.processWithinAngularZone();
        },
      error => {
        console.log(error);
      }
    );

  }

  toogleClassTemperature() {
    if (this.row.temperature < 5) {
      return "text-center elemento-actual-boton bg-primary border-p text-light";
    } else if (this.row.temperature >= 5 && this.row.temperature < 10) {
      return "text-center elemento-actual-boton bg-info border-i text-light";
    } else if (this.row.temperature >= 10 && this.row.temperature < 25) {
      return "text-center elemento-actual-boton bg-success border-s text-light";
    } else if (this.row.temperature >= 25 && this.row.temperature < 35) {
      return "text-center elemento-actual-boton bg-warning border-w text-light";
    } else if (this.row.temperature >= 35) {
      return "text-center elemento-actual-boton bg-danger border-d text-light";
    }
  }

  toogleClassAirHr() {
    if (this.row.airhr < 45) {
      return "text-center elemento-actual-boton bg-danger border-d text-light";
    } else if (this.row.airhr >= 45 && this.row.airhr < 65) {
      return "text-center elemento-actual-boton bg-warning border-w text-light";
    } else if (this.row.airhr >= 65) {
      return "text-center elemento-actual-boton bg-success border-s text-light";
    }
  }

  toogleClassFloorHr() {
    if (this.row.floorhr < 65) {
      return "text-center elemento-actual-boton bg-danger border-d text-light";
    } else if (this.row.floorhr >= 65 && this.row.floorhr < 85) {
      return "text-center elemento-actual-boton bg-warning border-w text-light";
    } else if (this.row.floorhr >= 85) {
      return "text-center elemento-actual-boton bg-success border-s text-light";
    }
  }

  toogleClassLux() {
    if (this.row.light < 400) {
      return "text-center elemento-actual-boton bg-dark text-light";
    } else if (this.row.light >= 400 && this.row.light < 1000) {
      return "text-center elemento-actual-boton bg-secondary border-se text-light";
    } else if (this.row.light >= 1000) {
      return "text-center elemento-actual-boton bg-light border-l ";
    }
  }

  toogleClassDvph() {
    if (this.row.dvph < 4.5) {
      return "text-center elemento-actual-boton bg-danger border-d text-light";
    } else if (this.row.dvph >= 4.5 && this.row.dvph < 7.4) {
      return "text-center elemento-actual-boton bg-warning border-w text-light";
    } else if (this.row.dvph >= 7.4 && this.row.dvph < 11) {
      return "text-center elemento-actual-boton bg-success border-s text-light";
    } else if (this.row.dvph >= 11 && this.row.dvph < 12.5) {
      return "text-center elemento-actual-boton bg-warning border-w text-light";
    } else if (this.row.dvph >= 12.5) {
      return "text-center elemento-actual-boton bg-danger border-d text-light";
    }

  }

      // Loop inside the Angular zone
  // so the UI DOES refresh after each setTimeout cycle
  processWithinAngularZone() {
     window.setInterval(
        this._actualservice.getRow().subscribe(
          result => {
            this.row = result;
            console.log("actualizando...")
            this.processWithinAngularZone()
          },
          error => {
            console.log(error);
          }
        ), 10000);

  }
 
  // Loop outside of the Angular zone
  // so the UI DOES NOT refresh after each setTimeout cycle
  
 
 
}



