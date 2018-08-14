export class ChartOp {

    data: any = {
        labels: [],
        datasets: []
    };

    type: string;

    options: any = {};

    constructor(type: string, data: any, options: any) {

        this.type = type;
        this.data = data;
        this.options = options;
    }
}
