const AdmisionesController = require('./AdmisionesController');
const TramitesController = require('./TramitesController');
const SolicitudesController = require('./SolicitudesController');

function RootController() {

    this.getAll = function (request, res) {

        console.log(JSON.stringify(request));

        switch (request.queryResult.intent.displayName) {
            case 'info.admisiones': AdmisionesController.mapAction(request, res); break;
            case 'info.admisiones.tipo': AdmisionesController.mapAction(request, res); break;
            case 'info.admisiones.tipo.si': AdmisionesController.mapAction(request, res); break;

            case 'info.solicitudes': SolicitudesController.mapAction(request, res); break;
            case 'info.solicitudes.tipo': SolicitudesController.mapAction(request, res); break;
            case 'info.solicitudes.tipo.si': SolicitudesController.mapAction(request, res); break;

            case 'info.tramites': TramitesController.mapAction(request, res); break;
            case 'info.tramites.tipo': TramitesController.mapAction(request, res); break;
            case 'info.tramites.tipo.si': TramitesController.mapAction(request, res); break;        
            default: 'lol';
        }
    }
}

module.exports = new RootController();
