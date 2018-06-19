import { NgModule } from '@angular/core';
import { RouterModule, Routes} from '@angular/router';

import { ActualComponent } from './actual/actual.component';
import { DiarioComponent } from './diario/diario.component';
import { HistoricoComponent } from './historico/historico.component';



const appRoutes: Routes = [
    { path: '', component: ActualComponent },
    { path: 'actual', component: ActualComponent },
    { path: 'diario', component: DiarioComponent },
    { path: 'historico', component: HistoricoComponent },
    { path: '**', component: ActualComponent },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule],
      
    })
  export class AppRoutingModule {};
