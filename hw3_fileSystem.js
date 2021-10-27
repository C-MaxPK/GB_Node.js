'use strict';

const fs = require('fs'); // доступ к файловой системе
const readline = require('linebyline'); // пакет linebyline для построчного считывания файла

const rl = readline('./access.log'); // передача в функцию адреса до файла
const ips = ['89.123.1.41', '34.48.240.111']; // список ip для поиска

// метод для добавления данных в файл
const appendFile = (ip, line) => {
    fs.appendFile(
        `./${ip}_requests.log`,
        line + '\n',
        'utf-8',
        (err) => {
            if (err) console.log(err);
        }
    );
};

// событие, в котором описана логика поиска совпадений по ip
rl.on('line', line => {
    if (line.includes(ips[0])) {
        appendFile(ips[0], line);
    } else if (line.includes(ips[1])) {
        appendFile(ips[1], line);
    }
})
.on('error', e => {
    console.log(e);
});
