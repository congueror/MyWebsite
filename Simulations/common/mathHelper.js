const GRAVITY = 9.81;

function factorial(num) {
    if (num === 0)
        return 1;

    let n = 1;
    for (let i = 1; i <= num; i++) {
        n *= i;
    }
    return n;
}

function toRads(degrees) {
    return (degrees * Math.PI) / 180;
}

function toDegrees(rads) {
    return (rads * 180) / Math.PI;
}

function drawVector(name, x, y, dx, dy, color) {
    drawArrow(x, y, dx, dy, color, 3);
    let fontSize = 13;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillText(name, x + dx + 10, y + dy + 10);
}

function drawArrow(x, y, dx, dy, color, width) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    let angle = Math.atan2(dy, dx);
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - 10 * Math.cos(angle - Math.PI / 6), y + dy - 10 * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - 10 * Math.cos(angle + Math.PI / 6), y + dy - 10 * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}

function createMatrix(array) {
    let m = new Matrix(array.length, array[0].length);
    for (let i = 0; i < m.rows; i++) {
        for (let j = 0; j < m.columns; j++) {
            m.set(i, j, array[i][j]);
        }
    }
    return m;
}

function augmentMatrices(m1, m2) {
    if (m1.rows !== m2.rows)
        throw "Augmenting matrices requires that both have the same amount of rows.";

    let newMatrix = new Matrix(m1.rows, m1.columns + m2.columns);
    for (let i = 0; i < m1.rows; i++) {
        for (let j = 0; j < m1.columns; j++) {
            newMatrix.set(i, j, m1.get(i, j));
        }
        for (let j = 0; j < m2.columns; j++) {
            newMatrix.set(i, j + m1.columns, m2.get(i, j));
        }
    }

    return newMatrix;
}

class Matrix {
    static I = function (rows, columns) {
        let m = new Matrix(rows, columns);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (i === j)
                    m.set(i, j, 1);
            }
        }
    }

    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.table = Array.from({length: this.rows}, (x, i) =>
            Array.from({length: this.columns}, (x, i) => 0));
    }

    toArray() {
        return this.table;
    }

    get(row, column) {
        return this.table[row][column];
    }

    set(row, column, n) {
        this.table[row][column] = n;
    }

    getRow(row) {
        let newMatrix = new Matrix(1, this.columns);
        for (let i = 0; i < this.columns; i++) {
            newMatrix.set(0, i, this.table[row][i]);
        }
        return newMatrix;
    }

    setRow(row, n) {
        if (Number.isFinite(n))
            for (let i = 0; i < this.columns; i++) {
                this.table[row][i] = n;
            }
        else if (Array.isArray(n)) {
            if (n.length === this.columns)
                for (let i = 0; i < this.columns; i++) {
                    this.table[row][i] = n[i];
                }
        } else if (n instanceof Matrix) {
            if (n.columns === this.columns)
                for (let i = 0; i < this.columns; i++) {
                    this.table[row][i] = n.get(0, i);
                }
        }
    }

    addRow(row, n) {
        if (Number.isFinite(n))
            for (let i = 0; i < this.columns; i++) {
                this.table[row][i] += n;
            }
        else if (Array.isArray(n)) {
            if (n.length === this.columns)
                for (let i = 0; i < this.columns; i++) {
                    this.table[row][i] += n[i];
                }
        } else if (n instanceof Matrix) {
            if (n.columns === this.columns)
                for (let i = 0; i < this.columns; i++) {
                    this.table[row][i] += n.get(0, i);
                }
        }
    }

    multiplyRow(row, n) {
        if (Number.isFinite(n))
            for (let i = 0; i < this.columns; i++) {
                this.table[row][i] *= n;
            }
        else if (Array.isArray(n)) {
            if (n.length === this.columns)
                for (let i = 0; i < this.columns; i++) {
                    this.table[row][i] *= n[i];
                }
        }
    }

    swapRows(row1, row2) {
        let temp = this.table[row1];
        this.table[row1] = this.table[row2];
        this.table[row2] = temp;
    }

    gaussianElimination() {
        if (this.rows !== this.columns - 1)
            throw "Square matrix is required to perform gaussian elimination (excluding scalar column).";

        for (let j = 0; j < this.columns - 1; j++) {

            //Find max value in column
            let maxR = 0, maxV = 0;
            for (let i = j; i < this.rows; i++) {
                let n = this.table[i][j];
                if (Math.abs(n) > maxV) {
                    maxR = i;
                    maxV = Math.abs(n);
                }
            }

            this.swapRows(j, maxR);

            this.multiplyRow(j, 1/this.get(j, j));

            for (let i = j + 1; i < this.rows; i++) {
                let n = this.table[i][j];
                let m = this.table[j][j];

                let row1 = this.getRow(j);
                row1.multiplyRow(0, -(n / m));
                this.addRow(i, row1);
            }
            this.print();
        }

        let variableMatrix = new Matrix(this.rows, 1);
        for (let i = this.rows - 1; i >= 0; i--) {
            let v = this.table[i][this.columns - 1];

            for (let j = this.columns - 2; j >= 0; j--) {
                if (i === j) {
                    v /= this.table[i][j];
                    break;
                }
                v -= this.table[i][j] * variableMatrix.get(j, 0);
            }

            variableMatrix.set(i, 0, v);
        }

        return variableMatrix;
    }

    print() {
        let maxLength = 1;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let num = this.table[i][j];
                let n = num.toString();
                if (n.length > maxLength)
                    maxLength = n.length;
            }
        }

        let s = '';
        for (let i = 0; i < this.rows; i++) {
            s += '| ';
            for (let j = 0; j < this.columns; j++) {
                s += this.table[i][j];
                s += ' '.repeat(maxLength - this.table[i][j].toString().length + 1);
            }
            s += '|\n';
        }
        console.log(s);
    }
}