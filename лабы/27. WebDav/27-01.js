const webdav = require('webdav-server').v2;
const server = new webdav.WebDAVServer({port: 3000});
const express = require('express');
const app = require('express')();
const fs = require('fs');
const {createClient} = require('webdav');
const webDAVClient = createClient('https://webdav.yandex.ru', {username: 'lk0ral', password: 'hujldlntayelwuyp'});
const multer = require('multer');
app.use(express.static('publ'));
app.use(multer().single("file"));

server.setFileSystem('/', new webdav.PhysicalFileSystem('./files'), (success) =>
{
    server.start(() =>
    {
        console.log('READY');
    });
    app.listen(5000);
});


app.post('/md/[A-z,0-9,%,/,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let dirName = decodeURI(s);
    webDAVClient.exists(dirName).then((result) =>
    {
        if (!result)
        {
            webDAVClient.createDirectory(dirName);
            res.end('Директория создана успешно');
        }
        else
        {
            //res.writeHead(408,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такая директория уже существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    });
});


app.post('/rd/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let requiredDir = decodeURI(s);
    webDAVClient.exists(requiredDir).then((result) =>
    {
        if (result)
        {
            webDAVClient.deleteFile(requiredDir);
            res.end('Директория удалена успешно');
        }
        else
        {
            //res.writeHead(408,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такой директории не существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    });
});


app.post('/up/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let uploadFileName = decodeURI(s);
    console.log(req.body)
    try {
        let rs = fs.createReadStream('./files/' + uploadFileName);
        let ws = webDAVClient.createWriteStream(uploadFileName);
        rs.pipe(ws);
        res.end('Файл успешно выгружен');
    }
    catch (err)
    {
        console.log(err);
        res.writeHead(408,{'Content-Type': 'text/plain;charset=utf-8'})
        res.end('Ошибка записи');
    }
});


app.post('/down/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let downloadFileName = decodeURI(s);
    webDAVClient.exists(downloadFileName).then((result) => {
        if (result)
        {
            webDAVClient.createReadStream(downloadFileName).pipe(fs.createWriteStream(`./files/${downloadFileName}.jpg`));
            res.end('Файл успешно скачан');
        } else {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
        .catch((err) => {
            console.log(err);
        })
});


app.post('/del/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let deleteFileName = decodeURI(s);
    webDAVClient.exists(deleteFileName).then((result) =>
    {
        if (result)
        {
            webDAVClient.deleteFile(deleteFileName);
            res.end('файл удален');
        }
        else
        {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    })
});


app.post('/copy/[A-z,0-9,%,.]+/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let d = '/' + req.url.split('/')[3];
    let fileName = decodeURI(s);
    let destination = decodeURI(d);
    webDAVClient.exists(fileName).then((result) =>
    {
        if (result)
        {
            webDAVClient.copyFile(fileName, destination);
            res.end('Файл скопирован успешно');
        }
        else
        {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
    .catch((err) =>
    {
        console.log(err);
    })
});


app.post('/move/[A-z,0-9,%,.]+/[A-z,0-9,%,.]+', function (req, res)
{
    let s = '/' + req.url.split('/')[2];
    let d = '/' + req.url.split('/')[3];
    let source = decodeURI(s);
    let destination = decodeURI(d);
    webDAVClient.exists(source).then((result) =>
    {
        if (result)
        {
            webDAVClient.moveFile(source, destination);
            res.end('Файл перемещен успешно');
        }
        else
        {
            //res.writeHead(404,{'Content-Type': 'text/plain;charset=utf-8'})
            res.end('Такого файла не существует');
        }
    })
        .catch((err) => {
            console.log(err);
        })
});