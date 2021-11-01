'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const inquirer = require('inquirer');

const isFile = path => fs.lstatSync(path).isFile(); // проверка на файл
const filesList = path => fs.readdirSync(path); // список файлов и папок

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
    
    rl.close(); // работает и без закрытия почему-то
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
        const name = answer.fileName; // название выбранного файла или папки
        const fullPath = path.resolve(pathToFiles, name); // полный путь до файла или папки
        
        if (isFile(fullPath)) {
            const data = fs.readFileSync(fullPath, 'utf-8'); // чтение данных из файла
            return data;
        } else {
            return inquirerCLI(fullPath);
        }
    });
