class Graph {

    constructor(id, obj) {
        let c = document.getElementById(id);
        if (!c instanceof HTMLCanvasElement)
            throw `Element id of ${id} does not belong to a canvas element.`;
        this.width = c.width;
        this.height = c.height;
        this.ctx = c.getContext("2d");

        this.xIncrement = obj.xIncrement;
        this.yIncrement = obj.yIncrement;
        this.maxX = obj.maxX;
        this.maxY = obj.maxY;
        this.minX = obj.minX;
        this.minY = obj.minY;
        this.dataset = obj.dataset;

        let xAmount = (Math.abs(this.maxX) + Math.abs(this.minX)) / this.xIncrement;
        this.xCellSize = ((this.width - 40 - 50) / (xAmount));
        let yAmount = (Math.abs(this.maxY) + Math.abs(this.minY)) / this.yIncrement;
        this.yCellSize = ((this.height - 50 - 40) / (yAmount));

        if (obj.xIncrement > obj.maxX || obj.yIncrement > obj.maxY)
            throw 'Increment value cannot be greater than the maximum.';

        this.ctx.fillStyle = "#D3D3D3FF";
        this.ctx.font = "50px Verdana";
        this.ctx.fillText("Test | Work in Progress", 50, 50);
        this.draw();
    }

    draw() {
        this.ctx.strokeStyle = "#676767";
        this.ctx.fillStyle = "#D3D3D3FF";
        this.ctx.font = "20px Verdana";
        this.ctx.lineWidth = 2;

        let baseWidth = this.ctx.measureText(9).width;
        let x, t, xAmount = (Math.abs(this.maxX) + Math.abs(this.minX)) / this.xIncrement;
        for (let i = 0; i <= xAmount; i++) {
            x = 50 + this.xCellSize * i;

            this.ctx.beginPath();
            this.ctx.moveTo(x, this.height - 40);
            this.ctx.lineTo(x, 40);
            this.ctx.stroke();

            t = this.minX + 2 * i;
            let xWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, x - xWidth / 2, this.height - 20);
        }

        let xDec = xAmount - Math.trunc(xAmount);
        if (xDec > 0) {
            x = x + this.xCellSize * (xDec);

            this.ctx.beginPath();
            this.ctx.moveTo(x, this.height - 40);
            this.ctx.lineTo(x, 40);
            this.ctx.stroke();

            t = t + this.xIncrement * xDec;
            let xWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, x - xWidth / 2, this.height - 20);
        }

        let y, yAmount = (Math.abs(this.maxY) + Math.abs(this.minY)) / this.yIncrement;
        for (let i = 0; i <= yAmount; i++) {
            y = this.height - 50 - this.yCellSize * i;

            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();

            t = this.minY + 2 * i;
            let yWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, 20 - (yWidth - baseWidth), y + 7);
        }

        let yDec = yAmount - Math.trunc(yAmount);
        if (yDec > 0) {
            y = y - this.yCellSize * yDec;

            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();

            t = t + this.yIncrement * yDec;
            let yWidth = this.ctx.measureText(t).width;
            this.ctx.fillText(t, 20 - (yWidth - baseWidth), y + 7);
        }

        //Draw Axes
        this.ctx.strokeStyle = "#000000";
        this.ctx.lineWidth = 2;

        if (this.minX >= 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(50, 40);
            this.ctx.lineTo(50, this.height - 40);
            this.ctx.stroke();
        } else {
            x = 50 + this.xCellSize * (Math.abs(this.minX) / this.xIncrement);

            this.ctx.beginPath();
            this.ctx.moveTo(x, 40);
            this.ctx.lineTo(x, this.height - 40);
            this.ctx.stroke();
        }

        if (this.minY >= 0) {
            this.ctx.beginPath();
            this.ctx.moveTo(40, this.height - 50);
            this.ctx.lineTo(this.width - 40, this.height - 50);
            this.ctx.stroke();
        } else {
            y = this.height - 50 - this.yCellSize * (Math.abs(this.minY) / this.yIncrement);

            this.ctx.beginPath();
            this.ctx.moveTo(40, y);
            this.ctx.lineTo(this.width - 40, y);
            this.ctx.stroke();
        }

        for (const d in this.dataset) {
            if (this.dataset[d].type === "data" && this.dataset[d].interpolation === "linear") {
                this.dataLinearDraw(this.dataset[d]);
            } else if (this.dataset[d].type === "function") {
                this.functionDraw(this.dataset[d]);
            }
        }
    }

    getXPosition(x) {
        return 50 + this.xCellSize / this.xIncrement * ( Math.abs(this.minX) + x );
    }

    getYPosition(y) {
        return this.height - 50 - this.yCellSize / this.yIncrement * ( Math.abs(this.minY) + y );
    }

    dataLinearDraw(data) {
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        let xS = [];
        let yS = [];

        this.ctx.beginPath();

        let x = this.getXPosition(data.x[0]);
        let y = this.getYPosition(data.y[0]);
        xS.push(x);
        yS.push(y);
        this.ctx.moveTo(x, y);
        for (let i = 1; i < data.x.length; i++) {
            x = this.getXPosition(data.x[i]);
            y = this.getYPosition(data.y[i]);
            xS.push(x);
            yS.push(y);
            this.ctx.lineTo(x, y);
        }
        this.ctx.stroke();

        for (let i = 0; i < data.x.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(xS[i], yS[i], 5, 0, 2 * Math.PI);
            this.ctx.stroke();
        }
    }

    functionDraw(data) {
        this.ctx.strokeStyle = data.color;
        this.ctx.lineWidth = 2;

        const d = 0.001;
        this.ctx.beginPath();
        let y = data.fun(this.minX);
        this.ctx.moveTo(this.getXPosition(this.minX), this.getYPosition(y));
        for (let x = this.minX; x < this.maxX; x += d) {
            y = data.fun(x);
            if (y <= this.maxY && y >= this.minY) {
                this.ctx.lineTo(this.getXPosition(x), this.getYPosition(y));
            } else {
                this.ctx.moveTo(this.getXPosition(x), this.getYPosition(y));
            }
        }
        this.ctx.stroke();
    }
}

let c = document.getElementById("main");
c.width = window.innerWidth - 64 - 17;
c.height = window.innerHeight - 6;

new Graph("main", {
    xIncrement: 2,
    yIncrement: 2,
    maxX: 11,
    maxY: 10,
    minX: -10,
    minY: -9,
    dataset: [
        {
            type: "data",
            interpolation: "linear",
            x: [1, 3, 4, 7],
            y: [2, 3, 9, 4],
            color: "#0090de"
        },
        {
            type: "function",
            fun: function (x) {
                return Math.sin(x);
            },
            color: "#00de04"
        }
    ]
});