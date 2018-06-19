import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { Router } from '@angular/router';
import { AppRoutingModule }        from './app.routing.module';


import { HeaderComponent } from './header/header.component';
import { MenuComponent } from './menu/menu.component';
import { ActualComponent } from './actual/actual.component';
import { DiarioComponent } from './diario/diario.component';
import { HistoricoComponent } from './historico/historico.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    ActualComponent,
    DiarioComponent,
    HistoricoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
      ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { 
  constructor(router: Router){
  }
}
