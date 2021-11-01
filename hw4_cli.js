'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');

const isFile = path => fs.lstatSync(path).isFile(); // проверка на файл
const filesList = path => fs.readdirSync(path); // список файлов и папок
// const executionDir = process.cwd(); // абсолютный путь до директории, где была запущена команда node

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = async (query) => new Promise(resolve => rl.question(query, resolve));
(async () => {
    const query = await question('Введите ваш запрос для поиска: ');
    const data = await inquirerCLI(__dirname);
    
    const regex = new RegExp(query, 'g');
    const foundMatches = data.match(regex);
    
    if (foundMatches !== null) console.log(`Найдено совпадений: ${foundMatches.length}`);
    else console.log('Совпадений не найдено');
    
    // rl.close(); // работает и без закрытия почему-то
})();

const inquirerCLI = (pathToFiles) => inquirer
    .prompt([
        {
            name: 'fileName',
            type: 'list',
            message: 'Выберите файл для поиска:',
            choices: filesList(pathToFiles),
        }
    ])
    .then(answer => {
        console.log('ЗАШЛИ в 2 THEN');
        const name = answer.fileName; // название выбранного файла или папки
        const fullPathToDirOrFile = path.resolve(pathToFiles, name); // полный путь до файла или папки
        console.log(fullPathToDirOrFile, 'полный путь из 2 THEN до условий');
        
        
        if (isFile(fullPathToDirOrFile)) {
            console.log(name, 'название файла из IF');
            return name;
        } else {
            console.log('зашли в ELSE');
            // return new Promise( resolve => inquirerCLI(fullPathToDirOrFile, resolve)); // так данные не возвращаются из последнего .then
            return inquirerCLI(fullPathToDirOrFile);
        }
    })
    .then(fileName => {
        console.log('ЗАШЛИ в 3 THEN'); // ОТРАБАТЫВАЕТ 2 РАЗА почему-то
        const fullPathToFile = path.resolve(pathToFiles, fileName); // полный путь до файла
        console.log(fullPathToFile, 'полный путь до ФАЙЛА из 3 THEN');
        const data = fs.readFileSync(fullPathToFile, 'utf-8'); // чтение данных из файла
        return data;
    });