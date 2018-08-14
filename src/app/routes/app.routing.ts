import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdmisionesComponent } from '../admisiones/admisiones.component';
import { AdmisionDetalleComponent } from '../admision-detalle/admision-detalle.component';
import { AdmisionDetalleExComponent } from '../public/admision-detalle-ex/admision-detalle-ex.component';
import { SolicitudesComponent } from '../solicitudes/solicitudes.component';
import { SolicitudDetalleComponent } from '../solicitud-detalle/solicitud-detalle.component';
import { SolicitudDetalleExComponent } from '../public/solicitud-detalle-ex/solicitud-detalle-ex.component';
import { TramitesComponent } from '../tramites/tramites.component';
import { TramiteDetalleComponent } from '../tramite-detalle/tramite-detalle.component';
import { TramiteDetalleExComponent } from '../public/tramite-detalle-ex/tramite-detalle-ex.component';
import { ParametrosComponent } from '../parametros/parametros.component';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { GenericoComponent } from '../generico/generico.component';
import { EstadisticasComponent } from '../estadisticas/estadisticas.component';
import { RouteActivatorService } from '../login/route-activator.service';

const appRoutes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },

    { path: 'ds', component: DashboardComponent, canActivate: [RouteActivatorService] },

    { path: 'admisiones', component: AdmisionesComponent, canActivate: [RouteActivatorService] },
    { path: 'admisiones/:id/edit', component: AdmisionesComponent, canActivate: [RouteActivatorService] },
    { path: 'admisiones/:id', component: AdmisionDetalleComponent, canActivate: [RouteActivatorService] },
    { path: 'admisiones/ex/:id', component: AdmisionDetalleExComponent },

    { path: 'solicitudes', component: SolicitudesComponent, canActivate: [RouteActivatorService] },
    { path: 'solicitudes/:id/edit', component: SolicitudesComponent, canActivate: [RouteActivatorService] },
    { path: 'solicitudes/:id', component: SolicitudDetalleComponent, canActivate: [RouteActivatorService] },
    { path: 'solicitudes/ex/:id', component: SolicitudDetalleExComponent },

    { path: 'tramites', component: TramitesComponent, canActivate: [RouteActivatorService] },
    { path: 'tramites/:id/edit', component: TramitesComponent, canActivate: [RouteActivatorService] },
    { path: 'tramites/:id', component: TramiteDetalleComponent, canActivate: [RouteActivatorService] },
    { path: 'tramites/ex/:id', component: TramiteDetalleExComponent },

    { path: 'usuarios', component: UsuariosComponent, canActivate: [RouteActivatorService] },
    { path: 'usuario/:id', component: UsuariosComponent, canActivate: [RouteActivatorService] },

    { path: 'generico/:op', component: GenericoComponent },
    { path: 'generico/:op/:token', component: GenericoComponent },

    { path: 'parametros', component: ParametrosComponent, canActivate: [RouteActivatorService] },

    { path: 'estadisticas', component: EstadisticasComponent, canActivate: [RouteActivatorService] },

    // { path: 'home', component: HomeComponent, canActivate: [RouteActivatorService] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
