import { Component, OnInit } from '@angular/core';


import { Row } from "../models/Row";

import { DiarioService } from "../services/diario.service";

@Component({
  selector: 'diario',
  templateUrl: './diario.component.html',
  styleUrls: ['./diario.component.css'],
  providers: [DiarioService]
})

export class DiarioComponent implements OnInit {

  public rows: Row[];

   constructor(private _diarioservice: DiarioService) { }

  ngOnInit() {
    this.rows = [new Row('2018-06-14 21:00', 0, 0, 0, 0, 0)];

    this._diarioservice.getRows().subscribe(
      result => {
        this.rows = this.transform(result);
      },
      error => {
        console.log(error);
      }
    );
  }

  transform(array: Row[]) {
    for (let row of array) {
      row.dateg = row.dateg.substring(0, 21);
    }
    return array;
  }

  toogleClassDvph(row) {
    if (row.dvph < 4.5) {
      return "text-center font-weight-bold bg-danger ";
    } else if (row.dvph >= 4.5 && row.dvph < 7.4) {
      return "text-center font-weight-bold bg-warning";
    } else if (row.dvph >= 7.4 && row.dvph < 11) {
      return "text-center font-weight-bold bg-success";
    } else if (row.dvph >= 11 && row.dvph < 12.5) {
      return "text-center font-weight-bold bg-warning";
    } else if (row.dvph >= 12.5) {
      return "text-center font-weight-bold bg-danger";
    }
  }
}
