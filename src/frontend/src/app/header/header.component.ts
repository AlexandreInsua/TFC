import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public title: string;
  public description: string;
  public author: string;
  public date: string;

  constructor() { }

  ngOnInit() {

    this.title = "Greenhouse";
    this.description = "Proxecto de fin do Ciclo Superior de Desenvolvemento de Aplicacións Multiplataforma";
    this.author = "Alexandre Insua Moreira";
    this.date = this.transformDate(new Date());
  }

  transformDate(date: Date) {
    let dayString;

    function transformDay(day) {
      switch (day) {
        case 0: return "Domingo";
        case 1: return "Luns";
        case 2: return "Martes";
        case 3: return "Mércores";
        case 4: return "Xoves";
        case 5: return "Venres";
        case 6: return "Sábado"
      }
    }

    function transforMonth(month) {
      switch (month) {
        case 0: return "Xaneiro";
        case 1: return "Febreiro";
        case 2: return "Marzo";
        case 3: return "Abril";
        case 4: return "Maio";
        case 5: return "Xuño";
        case 6: return "Xullo";
        case 7: return "Agosto";
        case 8: return "Setembro";
        case 9: return "Outubro"
        case 10: return "Novembro"
        case 11: return "Decembro"

      }
    }
    dayString = transformDay(date.getDay()) + ", "+ date.getDate()+ " de " + transforMonth(date.getMonth()) + " de " + date.getFullYear()
    return dayString;
  }
}
