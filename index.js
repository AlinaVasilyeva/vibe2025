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

// Parse request body
async function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                resolve(JSON.parse(body));
            } catch {
                resolve({});
            }
        });
    });
}

// API endpoints
async function handleApiRequest(req, res) {
    try {
        // GET all items
        if (req.url === '/api/items' && req.method === 'GET') {
            const connection = await mysql.createConnection(dbConfig);
            const [rows] = await connection.execute('SELECT id, text FROM items');
            await connection.end();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows));
            return true;
        }
        
        // POST new item
        if (req.url === '/api/items' && req.method === 'POST') {
            const body = await parseRequestBody(req);
            
            if (!body.text || body.text.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Text is required' }));
                return true;
            }
            
            const connection = await mysql.createConnection(dbConfig);
            const [result] = await connection.execute(
                'INSERT INTO items (text) VALUES (?)',
                [body.text]
            );
            await connection.end();
            
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                id: result.insertId, 
                text: body.text 
            }));
            return true;
        }
        
        // PUT update item
        if (req.url.startsWith('/api/items/') && req.method === 'PUT') {
            const id = req.url.split('/')[3];
            const body = await parseRequestBody(req);
            
            if (!body.text || body.text.trim() === '') {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Text is required' }));
                return true;
            }
            
            const connection = await mysql.createConnection(dbConfig);
            await connection.execute(
                'UPDATE items SET text = ? WHERE id = ?',
                [body.text, id]
            );
            await connection.end();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            return true;
        }
        
        // DELETE item
        if (req.url.startsWith('/api/items/') && req.method === 'DELETE') {
            const id = req.url.split('/')[3];
            const connection = await mysql.createConnection(dbConfig);
            await connection.execute(
                'DELETE FROM items WHERE id = ?',
                [id]
            );
            await connection.end();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
            return true;
        }
        
        return false;
    } catch (err) {
        console.error('API error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
        return true;
    }
}

// Main request handler
async function handleRequest(req, res) {
    // Handle API requests
    if (await handleApiRequest(req, res)) {
        return;
    }
    
    // Serve static files
    if (req.url === '/') {
        try {
            const html = await fs.promises.readFile(
                path.join(__dirname, 'index.html'), 
                'utf8'
            );
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
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

// Create and start server
const server = http.createServer(handleRequest);
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));