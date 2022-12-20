class forecastData {
    constructor(data) {
        this.start = new Date(data.forecastStart);
        this.tempIndex = "UTCI";
        this.tempUnits = "Celsius";
    }
    get sum() {
        delete this.sum;
        return (this.sum = 1 + 2);
    }
    get test() {
        delete this.test;
        return (this.test = "TODO");
    }
    get wbgt() {
        delete this.wbgt;
        return (this.wbgt = "TODO");
    }
    get temps() {
        return this[this.tempIndex.toLowerCase()];
    }
    use(index, units) {
        this.tempIndex = index;
        this.tempUnits = units;
    }
}

let test = new forecastData({ forecastStart: Date.now() });

console.log(test.sum);
console.log(test.test);

const Sum = {
    a: 2,
    b: 3,
    get sum() {
        delete this.sum;
        return (this.sum = this.a + this.b);
    },
};
