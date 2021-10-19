const colors = require('colors');
const primes = [];
let counter = 0;

const searchPrimes = () => {
    nextPrime:
    for (let i = +process.argv[2]; i <= +process.argv[3]; i++) {
        if (i < 2) continue nextPrime;

        for (let j = 2; j < i; j++) {
            if (i % j == 0) continue nextPrime;
        }

        primes.push(i);
    }
};

const primesOutput = () => {
    if (primes.length !== 0) {
        primes.forEach(el => {
            if (counter === 0) {
                console.log( colors.red(el) );
                counter++;
            } else if (counter === 1) {
                console.log( colors.yellow(el) );
                counter++;
            } else {
                console.log( colors.green(el) );
                counter = 0;
            }
        });
    } else {
        console.log(colors.red('Простых чисел не обнаружено!'))
    }
}

if (isNaN(process.argv[2]) || isNaN(process.argv[3])) {
    console.log(colors.red('Введите число, а не ерунду!'));
    return;
} else {
    searchPrimes();
    primesOutput();
}
