<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>To-Do List</title>
    <style>
        /* ... (existing styles unchanged) ... */
    </style>
</head>
<body>

<h2 style="text-align: center;">To-Do List</h2>

<table id="todoList">
    <thead>
        <tr>
            <th>Number</th>
            <th>Text</th>
            <th>Action</th>
        </tr>
    </thead>
    <tbody id="listBody">
        {{rows}}
    </tbody>
</table>

<div class="add-form">
    <input type="text" id="newItem" placeholder="Enter new item">
    <button onclick="addItem()">Add</button>
</div>

<script>
    let items = [];

    document.addEventListener('DOMContentLoaded', function() {
        const rows = document.querySelectorAll('#listBody tr');
        rows.forEach(row => {
            const id = parseInt(row.cells[0].textContent);
            const text = row.cells[1].textContent;
            items.push({ id, text });
        });
    });

    function renderList() {
        const listBody = document.getElementById('listBody');
        listBody.innerHTML = '';

        items.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.text}</td>
                <td><button onclick="removeItem(${item.id})">Remove</button></td>
            `;
            listBody.appendChild(row);
        });
    }

    function addItem() {
        const newItemInput = document.getElementById('newItem');
        const newItemText = newItemInput.value.trim();

        if (newItemText) {
            fetch('/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newItemText })
            })
            .then(response => response.json())
            .then(newItem => {
                items.push(newItem);
                newItemInput.value = '';
                renderList();
            })
            .catch(error => console.error('Error:', error));
        }
    }

    function removeItem(id) {
        fetch(`/remove/${id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                items = items.filter(item => item.id !== id);
                renderList();
            }
        })
        .catch(error => console.error('Error:', error));
    }
</script>

</body>
</html>
