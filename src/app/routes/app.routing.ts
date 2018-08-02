import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { LoginComponent } from '../login/login.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AdmisionesComponent } from '../admisiones/admisiones.component';
import { AdmisionDetalleComponent } from '../admision-detalle/admision-detalle.component';
import { AdmisionDetalleExComponent } from '../publico/admision-detalle-ex/admision-detalle-ex.component';

const appRoutes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'ds', component: DashboardComponent },
    { path: 'admisiones', component: AdmisionesComponent },
    { path: 'admisiones/:id', component: AdmisionDetalleComponent },
    { path: 'admisiones/ex/:id', component: AdmisionDetalleExComponent },

    // { path: 'home', component: HomeComponent, canActivate: [RouteActivatorService] },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
