'use strict';

const http = require('http');
const path = require('path');
const fs = require('fs');

(async () => {
    const isFile = (path) => fs.lstatSync(path).isFile(); // проверка на файл

    http.createServer( (req, res) => {
        const fullPath = path.join(process.cwd(), req.url); // полный путь
        if (!fs.existsSync(fullPath)) return res.end('File or directory not found'); // проверка на несуществующий путь с закрытием подключения

        // если файл, то создается поток на чтение
        if (isFile(fullPath)) {
            return fs.createReadStream(fullPath).pipe(res);
        }

        let linksList = '';

        const urlParams = req.url.match(/[\d\w\.-]+/gi); // массив из "путей"

        // если в массиве есть "путь", то отрезаем последний, склеиваем итог, и создаем путь к предыдущей папке либо к корню
        if (urlParams) {
            urlParams.pop();
            const prevUrl = urlParams.join('/');
            linksList = urlParams.length ? `<li><a href="/${prevUrl}">..</a></li>` : '<li><a href="/">..</a></li>';
        }

        // аккумулируем список 
        fs.readdirSync(fullPath)
            .forEach(fileName => {
                const filePath = path.join(req.url, fileName);
                linksList += `<li><a href="${filePath}">${fileName}</a></li>`;
            });

        // чтение index.html и замена строчки '##links' на список из путей и имен
        const HTML = fs
            .readFileSync(path.join(__dirname, 'index.html'), 'utf-8')
            .replace('##links', linksList);

        // заголовок
        res.writeHead(200, {
            'Content-Type': 'text/html',
        });

        return res.end(HTML);
    }).listen(3000);
})();
