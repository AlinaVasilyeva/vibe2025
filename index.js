const http = require('http');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const PORT = 3000;

// Database connection settings
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'todolist',
};

async function retrieveListItems() {
    /* ... unchanged ... */
}

async function getHtmlRows() {
    const todoItems = await retrieveListItems();
    return todoItems.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.text}</td>
            <td>
                <button onclick="removeItem(${item.id})">Remove</button>
                <button onclick="startEdit(${item.id})">Edit</button>
            </td>
        </tr>
    `).join('');
}

async function handleAddRequest(req) {
    /* ... unchanged ... */
}

async function handleRemoveRequest(id) {
    /* ... unchanged ... */
}

// Обработка PUT запроса для обновления элемента
async function handleUpdateRequest(req, id) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const connection = await mysql.createConnection(dbConfig);
                await connection.execute(
                    'UPDATE items SET text = ? WHERE id = ?',
                    [data.text, id]
                );
                await connection.end();
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    });
}

async function handleRequest(req, res) {
    if (req.url === '/add' && req.method === 'POST') {
        /* ... unchanged ... */
    } 
    else if (req.url.startsWith('/remove/') && req.method === 'DELETE') {
        /* ... unchanged ... */
    }
    else if (req.url.startsWith('/update/') && req.method === 'PUT') {
        const id = req.url.split('/')[2];
        try {
            await handleUpdateRequest(req, id);
            res.writeHead(200);
            res.end();
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Error updating item');
        }
    }
    else if (req.url === '/' && req.method === 'GET') {
        try {
            const html = await fs.promises.readFile(
                path.join(__dirname, 'index.html'), 
                'utf8'
            );
            const processedHtml = html.replace('{{rows}}', await getHtmlRows());
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(processedHtml);
        } catch (err) {
            console.error(err);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error loading index.html');
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
}

const server = http.createServer(handleRequest);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
