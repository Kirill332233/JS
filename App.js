const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

function onRequest(request, response) {
    let filePath;
    let contentType = 'text/html';

    if (request.url.startsWith('/api/products')) {
        return handleProductsAPI(request, response);
    }

    else if (request.url === '/') {
        filePath = path.join(__dirname, 'Pages', 'index.html');
    } else if (request.url === '/Style.css') {
        filePath = path.join(__dirname, 'Style', 'style.css');
        contentType = 'text/css';
    } else if (request.url === '/Script.js') {
        filePath = path.join(__dirname, 'Script', 'script.js');
        contentType = 'application/javascript';
    } else {
        filePath = path.join(__dirname, 'Pages', 'page404.html');
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            response.writeHead(404);
            return response.end('Not Found');
        }
        
        response.writeHead(200, {'Content-Type': contentType, 'Cache-Control': 'no-cache'});
        response.end(data);
    });
}

function handleProductsAPI(req, res) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const searchParams = url.searchParams;
    
    let apiUrl = 'https://dummyjson.com/products';
    if (searchParams.has('q')) {
        apiUrl = `https://dummyjson.com/products/search?q=${searchParams.get('q')}`;
    }

    https.get(apiUrl, (apiRes) => {
        let data = '';
        
        apiRes.on('data', (chunk) => {
            data += chunk;
        });
        
        apiRes.on('end', () => {
            try {
                res.writeHead(200, { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache'
                });
                res.end(data);
            } catch (e) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'Failed to parse API response' }));
            }
        });
    }).on('error', (err) => {
        res.writeHead(502);
        res.end(JSON.stringify({ error: 'Failed to fetch from API' }));
    });
}

const server = http.createServer(onRequest);
server.listen(3000, '0.0.0.0', () => {
    console.log('Сервер запущен и слушает порт 3000');
    console.log('http://localhost:3000');
});