// Finds nearest number less than NUM that is a multiple of FACTOR
const floor = (num, factor = 1) => {
    return Math.floor(num / factor) * factor;
};

// Finds nearest number greater than NUM that is a multiple of FACTOR
const ceiling = (num, factor = 1) => {
    return Math.ceil(num / factor) * factor;
};

const isMultipleOf = (a, b) => {
    return b % a === 0;
};

export { floor, ceiling, isMultipleOf };
