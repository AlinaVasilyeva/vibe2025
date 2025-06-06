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
    try {
        const connection = await mysql.createConnection(dbConfig);
        const query = 'SELECT id, text FROM items';
        const [rows] = await connection.execute(query);
        await connection.end();
        return rows;
    } catch (error) {
        console.error('Error retrieving list items:', error);
        throw error;
    }
}

async function getHtmlRows() {
    const todoItems = await retrieveListItems();
    return todoItems.map(item => `
        <tr>
            <td>${item.id}</td>
            <td>${item.text}</td>
            <td><button onclick="removeItem(${item.id})">Remove</button></td>
        </tr>
    `).join('');
}

async function handleAddRequest(req) {
    /* ... unchanged from previous branch ... */
}

// Обработка DELETE запроса для удаления элемента
async function handleRemoveRequest(id) {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM items WHERE id = ?', [id]);
        await connection.end();
        return true;
    } catch (error) {
        console.error('Error removing item:', error);
        throw error;
    }
}

async function handleRequest(req, res) {
    if (req.url === '/add' && req.method === 'POST') {
        /* ... unchanged from previous branch ... */
    } 
    else if (req.url.startsWith('/remove/') && req.method === 'DELETE') {
        const id = req.url.split('/')[2];
        try {
            await handleRemoveRequest(id);
            res.writeHead(200);
            res.end();
        } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end('Error removing item');
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
