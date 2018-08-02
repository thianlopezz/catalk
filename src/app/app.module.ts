import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './common/header/header.component';
import { HomeComponent } from './home/home.component';
import { routing } from './routes/app.routing';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SessionService } from './login/session.service';
import { AdmisionesComponent } from './admisiones/admisiones.component';
import { ListTipoAdmisionComponent } from './admisiones/list-tipo-admision/list-tipo-admision.component';
import { CardTipoAdmisionComponent } from './admisiones/list-tipo-admision/card-tipo-admision/card-tipo-admision.component';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { FormAdmisionesComponent } from './admisiones/form-admisiones/form-admisiones.component';
import { AdmisionesService } from './admisiones/admisiones.service';
import { AdmisionDetalleComponent } from './admision-detalle/admision-detalle.component';
import { CardDetalleComponent } from './admision-detalle/card-detalle/card-detalle.component';
import { CardAdmisionDetalleComponent } from './admision-detalle/card-admision-detalle/card-admision-detalle.component';
import { AdmisionDetalleExComponent } from './publico/admision-detalle-ex/admision-detalle-ex.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    AdmisionesComponent,
    ListTipoAdmisionComponent,
    CardTipoAdmisionComponent,
    SpinnerComponent,
    FormAdmisionesComponent,
    AdmisionDetalleComponent,
    CardDetalleComponent,
    CardAdmisionDetalleComponent,
    AdmisionDetalleExComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [SessionService, AdmisionesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
