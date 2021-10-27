'use strict';

const colors = require('colors');
const EventEmitter = require('events');
const emitter = new EventEmitter();

// отрезаем лишнее для удобства
const incomingParams = process.argv.slice(2);
// предустановленные цвета для вывода в консоль цветного названия таймера
const colorsForTimer = ['yellow', 'green', 'blue'];

class Timer {
    constructor(hours, minutes, seconds, timerName) {
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
        this.timerName = timerName;
        this.validation();
        this.timer();
    }

    // метод для выбора случайного цвета из предустановленных
    colorRandom() {
        const randomNumber = Math.floor(Math.random() * colorsForTimer.length);
        return colorsForTimer[randomNumber];
    }

    // валидация времени
    validation() {
        if (this.hours > 23) this.hours = 23
        if (this.minutes > 59) this.minutes = 59
        if (this.seconds > 59) this.seconds = 59
    }

    // метод для отсчета установленного времени
    timer() {
        const colorTimer = this.colorRandom();
        const startTimer = setInterval(() => {
            emitter.emit('remainder', `${colors[colorTimer](this.timerName)}: ${this.hours} hr ${this.minutes} min ${this.seconds} sec`);
        
            if (this.seconds > 0) {
                this.seconds--;
            } else {
                if (this.minutes > 0) {
                    this.minutes--;
                    this.seconds = 59;
                } else {
                    if (this.hours > 0) {
                        this.hours--;
                        this.minutes = 59;
                        this.seconds = 59;
                    } else {
                        emitter.emit('stopTimer', colors.red(`${this.timerName} is over!`));
                        clearInterval(startTimer);
                    }
                }
            }
        }, 1000);
    }
}

// проходимся по всем введенным параметрам и создаем экземпляры таймеров
for (let i = 0; i < incomingParams.length; i++) {
    // сплитим данные введенного параметра в формате hh-mm-ss
    const paramsForTimer = incomingParams[i].split('-');

    const hours = paramsForTimer[0];
    const minutes = paramsForTimer[1];
    const seconds = paramsForTimer[2];
    const timerName = `Timer № ${i + 1}`;

    new Timer(hours, minutes, seconds, timerName);
}

// отлов событий и вывод в консоль
emitter.on('remainder', console.log);
emitter.on('stopTimer', console.log);
