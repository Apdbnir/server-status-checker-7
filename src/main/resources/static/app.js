const API_URL = 'http://localhost:8080/api';

function fetchServers() {
    fetch(`${API_URL}/servers`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('servers-list');
            list.innerHTML = '';
            data.forEach(server => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${server.name}</span>
                    <button class="edit-btn" onclick="startEditServer(${server.id}, '${server.name}')">Edit</button>
                    <button class="delete-btn" onclick="deleteServer(${server.id})">Delete</button>
                `;
                list.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching servers:', error));
}

function fetchStatuses() {
    fetch(`${API_URL}/server-status`)
        .then(response => response.json())
        .then(data => {
            const list = document.getElementById('statuses-list');
            list.innerHTML = '';
            data.forEach(status => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${status.url} - ${status.isAvailable ? 'Available' : 'Unavailable'} (${status.message})</span>
                    <button class="delete-btn" onclick="deleteStatus(${status.id})">Delete</button>
                `;
                list.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching statuses:', error));
}

function fetchRequestCount() {
    fetch(`${API_URL}/server-status/request-count`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('request-count').textContent = data;
        })
        .catch(error => console.error('Error fetching request count:', error));
}

function addServer() {
    const name = document.getElementById('server-name').value.trim();
    if (!name) return;
    fetch(`${API_URL}/servers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(response => response.json())
        .then(() => {
            document.getElementById('server-name').value = '';
            fetchServers();
            fetchRequestCount();
        })
        .catch(error => console.error('Error adding server:', error));
}

function deleteServer(id) {
    fetch(`${API_URL}/servers/${id}`, { method: 'DELETE' })
        .then(() => {
            fetchServers();
            fetchRequestCount();
        })
        .catch(error => console.error('Error deleting server:', error));
}

function startEditServer(id, name) {
    const li = event.target.parentElement;
    li.innerHTML = `
        <input type="text" value="${name}" id="edit-server-${id}">
        <button onclick="updateServer(${id})">Save</button>
        <button class="delete-btn" onclick="fetchServers()">Cancel</button>
    `;
}

function updateServer(id) {
    const name = document.getElementById(`edit-server-${id}`).value.trim();
    if (!name) return;
    fetch(`${API_URL}/servers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    })
        .then(response => response.json())
        .then(() => {
            fetchServers();
            fetchRequestCount();
        })
        .catch(error => console.error('Error updating server:', error));
}

function addStatus() {
    const url = document.getElementById('status-url').value.trim();
    if (!url) return;
    fetch(`${API_URL}/server-status/check?url=${url}`)
        .then(response => response.json())
        .then(() => {
            document.getElementById('status-url').value = '';
            fetchStatuses();
            fetchRequestCount();
        })
        .catch(error => console.error('Error adding status:', error));
}

function deleteStatus(id) {
    fetch(`${API_URL}/server-status/${id}`, { method: 'DELETE' })
        .then(() => {
            fetchStatuses();
            fetchRequestCount();
        })
        .catch(error => console.error('Error deleting status:', error));
}

function resetRequestCount() {
    fetch(`${API_URL}/server-status/request-count/reset`, { method: 'POST' })
        .then(() => {
            fetchRequestCount();
        })
        .catch(error => console.error('Error resetting request count:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    fetchServers();
    fetchStatuses();
    fetchRequestCount();
});