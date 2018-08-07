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

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'ds', component: DashboardComponent },

    { path: 'admisiones', component: AdmisionesComponent },
    { path: 'admisiones/:id/edit', component: AdmisionesComponent },
    { path: 'admisiones/:id', component: AdmisionDetalleComponent },
    { path: 'admisiones/ex/:id', component: AdmisionDetalleExComponent },

    { path: 'solicitudes', component: SolicitudesComponent },
    { path: 'solicitudes/:id/edit', component: SolicitudesComponent },
    { path: 'solicitudes/:id', component: SolicitudDetalleComponent },
    { path: 'solicitudes/ex/:id', component: SolicitudDetalleExComponent },

    { path: 'tramites', component: TramitesComponent },
    { path: 'tramites/:id/edit', component: TramitesComponent },
    { path: 'tramites/:id', component: TramiteDetalleComponent },
    { path: 'tramites/ex/:id', component: TramiteDetalleExComponent },

    { path: 'parametros', component: ParametrosComponent },

    // { path: 'home', component: HomeComponent, canActivate: [RouteActivatorService] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
