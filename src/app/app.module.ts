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
import { CardAdmisionDetalleComponent } from './admision-detalle/card-admision-detalle/card-admision-detalle.component';
import { AdmisionDetalleExComponent } from './public/admision-detalle-ex/admision-detalle-ex.component';
import { SolicitudesComponent } from './solicitudes/solicitudes.component';
import { ListSolicitudesComponent } from './solicitudes/list-solicitudes/list-solicitudes.component';
import { CardSolicitudComponent } from './solicitudes/list-solicitudes/card-solicitud/card-solicitud.component';
import { FormSolicitudesComponent } from './solicitudes/form-solicitudes/form-solicitudes.component';
import { SolicitudDetalleComponent } from './solicitud-detalle/solicitud-detalle.component';
import { CardAdmisionDetalleItemComponent } from './admision-detalle/card-admision-detalle-item/card-admision-detalle-item.component';
import { CardSolicitudDetalleComponent } from './solicitud-detalle/card-solicitud-detalle/card-solicitud-detalle.component';
import { CardSolicitudDetalleItemComponent } from './solicitud-detalle/card-solicitud-detalle-item/card-solicitud-detalle-item.component';
import { SolicitudDetalleExComponent } from './public/solicitud-detalle-ex/solicitud-detalle-ex.component';
import { TramitesComponent } from './tramites/tramites.component';
import { FormTramitesComponent } from './tramites/form-tramites/form-tramites.component';
import { ListTramitesComponent } from './tramites/list-tramites/list-tramites.component';
import { TramiteDetalleComponent } from './tramite-detalle/tramite-detalle.component';
import { CardTramiteDetalleComponent } from './tramite-detalle/card-tramite-detalle/card-tramite-detalle.component';
import { CardTramiteDetalleItemComponent } from './tramite-detalle/card-tramite-detalle-item/card-tramite-detalle-item.component';
import { TramiteDetalleExComponent } from './public/tramite-detalle-ex/tramite-detalle-ex.component';
import { CardTramiteComponent } from './tramites/list-tramites/card-tramite/card-tramite.component';
import { ModalConfirmaComponent } from './common/modal-confirma/modal-confirma.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { FormParametrosComponent } from './parametros/form-parametros/form-parametros.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { FormUsuariosComponent } from './usuarios/form-usuarios/form-usuarios.component';
import { ListUsuariosComponent } from './usuarios/list-usuarios/list-usuarios.component';
import { CardUsuarioComponent } from './usuarios/list-usuarios/card-usuario/card-usuario.component';
import { FormContrasenaComponent } from './usuarios/form-contrasena/form-contrasena.component';
import { GenericoComponent } from './generico/generico.component';
import { OlvideContrasenaComponent } from './generico/olvide-contrasena/olvide-contrasena.component';
import { RecuperaContrasenaComponent } from './generico/recupera-contrasena/recupera-contrasena.component';

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
    CardAdmisionDetalleItemComponent,
    CardAdmisionDetalleComponent,
    AdmisionDetalleExComponent,
    SolicitudesComponent,
    ListSolicitudesComponent,
    CardSolicitudComponent,
    FormSolicitudesComponent,
    SolicitudDetalleComponent,
    CardSolicitudDetalleComponent,
    CardSolicitudDetalleItemComponent,
    SolicitudDetalleExComponent,
    TramitesComponent,
    FormTramitesComponent,
    ListTramitesComponent,
    CardTramiteComponent,
    TramiteDetalleComponent,
    CardTramiteDetalleComponent,
    CardTramiteDetalleItemComponent,
    TramiteDetalleExComponent,
    ModalConfirmaComponent,
    ParametrosComponent,
    FormParametrosComponent,
    UsuariosComponent,
    FormUsuariosComponent,
    ListUsuariosComponent,
    CardUsuarioComponent,
    FormContrasenaComponent,
    GenericoComponent,
    OlvideContrasenaComponent,
    RecuperaContrasenaComponent
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
