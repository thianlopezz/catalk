const AdmisionesController = require('./AdmisionesController');

function RootController() {

    this.getAll = function (request, res) {

        switch (request.queryResult.intent.displayName) {
            case 'info.admisiones': AdmisionesController.mapAction(request, res); break;
            case 'info.admisiones.selecciona': AdmisionesController.mapAction(request, res); break;
            case 'info.admisiones.selecciona.si': AdmisionesController.mapAction(request, res); break;
            default: 'lol';
        }
    }
}

module.exports = new RootController();
