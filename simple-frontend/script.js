// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Date formatting utility function
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Login function
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        const user = await response.json();
        
        // Store user info in localStorage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on role
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'dashboard.html';
        }
    } catch (error) {
        console.error('Login error:', error);
        alert(error.message || 'Invalid email or password');
    }
}

// Register function
async function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        alert('Registration successful! Please login.');
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Registration error:', error);
        alert(error.message || 'Registration failed');
    }
}

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Check if user is logged in
function checkAuth() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Load student dashboard data
async function loadDashboardData() {
    if (!checkAuth()) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/students/${user.id}`);
        
        if (!response.ok) {
            throw new Error('Failed to load dashboard data');
        }
        
        const data = await response.json();
        
        // Update personal information
        document.getElementById('studentName').textContent = data.user.name || '--';
        document.getElementById('studentId').textContent = data.user.studentId || '--';
        document.getElementById('studentEmail').textContent = data.user.email || '--';
        document.getElementById('studentPhone').textContent = data.user.phone || 'N/A';
        document.getElementById('studentAddress').textContent = data.user.address || 'N/A';
        
        // Update housing details if assigned
        if (data.housing) {
            document.getElementById('roomNumber').textContent = data.housing.roomNumber || '--';
            document.getElementById('buildingName').textContent = data.housing.building || '--';
            document.getElementById('floorNumber').textContent = data.housing.floor || '--';
            document.getElementById('roomType').textContent = data.housing.roomType || '--';
            document.getElementById('roommates').textContent = data.housing.roommates?.length > 0 ? data.housing.roommates.join(', ') : 'None';
            document.getElementById('monthlyRent').textContent = data.housing.monthlyRent ? `$${data.housing.monthlyRent}` : '--';
            document.getElementById('moveInDate').textContent = data.housing.moveInDate ? formatDate(data.housing.moveInDate) : '--';
        } else {
            document.getElementById('roomNumber').textContent = 'Not Assigned';
            document.getElementById('buildingName').textContent = 'N/A';
            document.getElementById('floorNumber').textContent = 'N/A';
            document.getElementById('roomType').textContent = 'N/A';
            document.getElementById('roommates').textContent = 'N/A';
            document.getElementById('monthlyRent').textContent = 'N/A';
            document.getElementById('moveInDate').textContent = 'N/A';
        }
        
        // Update application status
        const statusBadge = document.getElementById('applicationStatus');
        if (data.application) {
            statusBadge.textContent = data.application.status;
            statusBadge.className = `status-badge status-${data.application.status.toLowerCase()}`;
        } else {
            statusBadge.textContent = 'Not Applied';
            statusBadge.className = 'status-badge status-pending';
        }
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        alert('Failed to load dashboard data. Please try again later.');
    }
}

// Apply for housing
async function applyForHousing(event) {
    event.preventDefault();
    
    if (!checkAuth()) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: user.id,
                preferredBuilding: document.getElementById('preferredBuilding').value,
                preferredRoomType: document.getElementById('preferredRoomType').value,
                moveInDate: document.getElementById('moveInDate').value,
                specialRequirements: document.getElementById('specialRequirements').value
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit application');
        }
        
        alert('Application submitted successfully!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Application error:', error);
        alert(error.message || 'Failed to submit application');
    }
}

// Handle housing application form submission
async function handleHousingApplication(event) {
    event.preventDefault();
    
    if (!checkAuth()) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    try {
        const response = await fetch(`${API_BASE_URL}/applications`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                studentId: user.id,
                preferredBuilding: document.getElementById('preferredBuilding').value,
                preferredRoomType: document.getElementById('preferredRoomType').value,
                moveInDate: document.getElementById('moveInDate').value,
                specialRequirements: document.getElementById('specialRequirements').value
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit application');
        }
        
        alert('Application submitted successfully!');
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Application error:', error);
        alert(error.message || 'Failed to submit application');
    }
}

// Load admin dashboard data
async function loadAdminDashboard() {
    if (!checkAuth()) return;
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    try {
        // Fetch dashboard data
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to load dashboard data');
        }
        const data = await response.json();
        
        // Update statistics
        document.getElementById('totalApplications').textContent = data.stats.totalApplications;
        document.getElementById('pendingApplications').textContent = data.stats.pendingApplications;
        document.getElementById('totalRooms').textContent = data.stats.totalRooms;
        document.getElementById('availableRooms').textContent = data.stats.availableRooms;
        document.getElementById('totalStudents').textContent = data.stats.totalStudents;
        document.getElementById('occupancyRate').textContent = `${data.stats.occupancyRate}%`;
        
        // Update recent applications table
        const applicationsTable = document.getElementById('applicationsTable');
        if (applicationsTable) {
            const tbody = applicationsTable.querySelector('tbody');
            tbody.innerHTML = '';
            
            data.applications.forEach(app => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${app.studentName}</td>
                    <td>${app.studentEmail}</td>
                    <td>${app.preferredRoomType}</td>
                    <td>${formatDate(app.moveInDate)}</td>
                    <td><span class="status-badge status-${app.status.toLowerCase()}">${app.status}</span></td>
                    <td>
                        <button class="action-button" onclick="viewApplication('${app.id}')">View</button>
                        ${app.status === 'pending' ? `
                            <button class="action-button approve" onclick="approveApplication('${app.id}')">Approve</button>
                            <button class="action-button reject" onclick="rejectApplication('${app.id}')">Reject</button>
                        ` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Update rooms table
        const roomsTable = document.getElementById('roomsTable');
        if (roomsTable) {
            const tbody = roomsTable.querySelector('tbody');
            tbody.innerHTML = '';
            
            data.rooms.forEach(room => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${room.roomNumber}</td>
                    <td>${room.building}</td>
                    <td>${room.floor}</td>
                    <td>${room.type}</td>
                    <td><span class="status-badge status-${room.status.toLowerCase()}">${room.status}</span></td>
                    <td>${room.assignedTo ? room.assignedTo : 'None'}</td>
                    <td>
                        <button class="action-button" onclick="viewRoom('${room.id}')">View</button>
                        ${room.status === 'available' ? `
                            <button class="action-button assign" onclick="showAssignRoomModal('${room.id}')">Assign</button>
                        ` : ''}
                        <button class="action-button delete" onclick="deleteRoom('${room.id}')">Delete</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
        
        // Update recent activities
        const activitiesList = document.getElementById('activitiesList');
        if (activitiesList) {
            activitiesList.innerHTML = '';
            
            data.activities.forEach(activity => {
                const item = document.createElement('li');
                item.innerHTML = `
                    <div class="activity-item">
                        <span class="activity-icon">${getActivityIcon(activity.type)}</span>
                        <div class="activity-content">
                            <p class="activity-text">${activity.description}</p>
                            <span class="activity-time">${formatDate(activity.timestamp)}</span>
                        </div>
                    </div>
                `;
                activitiesList.appendChild(item);
            });
        }
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        alert('Failed to load admin dashboard data. Please try again later.');
    }
}

function getActivityIcon(type) {
    const icons = {
        'application': '<i class="fas fa-file-alt"></i>',
        'approval': '<i class="fas fa-check-circle"></i>',
        'rejection': '<i class="fas fa-times-circle"></i>',
        'assignment': '<i class="fas fa-bed"></i>',
        'maintenance': '<i class="fas fa-tools"></i>',
        'payment': '<i class="fas fa-money-bill-wave"></i>'
    };
    return icons[type] || '<i class="fas fa-info-circle"></i>';
}

// Add a new room
async function addRoom(event) {
    event.preventDefault();
    if (!checkAuth()) return;
    
    const form = event.target;
    const formData = new FormData(form);
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/rooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            },
            body: JSON.stringify({
                roomNumber: formData.get('roomNumber'),
                building: formData.get('building'),
                floor: formData.get('floor'),
                type: formData.get('type'),
                capacity: parseInt(formData.get('capacity')),
                status: 'available'
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to add room');
        }
        
        alert('Room added successfully!');
        form.reset();
        closeModal('addRoomModal');
        loadAdminDashboard(); // Refresh the dashboard
    } catch (error) {
        console.error('Error adding room:', error);
        alert(error.message || 'Failed to add room');
    }
}

// Assign a room to a student
async function assignRoom(event) {
    event.preventDefault();
    if (!checkAuth()) return;
    
    const form = event.target;
    const formData = new FormData(form);
    const roomId = formData.get('roomId');
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/rooms/${roomId}/assign`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            },
            body: JSON.stringify({
                studentId: formData.get('studentId'),
                moveInDate: formData.get('moveInDate')
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to assign room');
        }
        
        alert('Room assigned successfully!');
        form.reset();
        closeModal('assignRoomModal');
        loadAdminDashboard(); // Refresh the dashboard
    } catch (error) {
        console.error('Error assigning room:', error);
        alert(error.message || 'Failed to assign room');
    }
}

// Show add room modal
function showAddRoomModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h2>Add New Room</h2>
            <form id="addRoomForm" onsubmit="addRoom(event)">
                <div class="form-group">
                    <label for="roomNumber">Room Number</label>
                    <input type="text" id="roomNumber" name="roomNumber" required>
                </div>
                <div class="form-group">
                    <label for="building">Building</label>
                    <input type="text" id="building" name="building" required>
                </div>
                <div class="form-group">
                    <label for="floor">Floor</label>
                    <input type="number" id="floor" name="floor" required>
                </div>
                <div class="form-group">
                    <label for="type">Room Type</label>
                    <select id="type" name="type" required>
                        <option value="single">Single</option>
                        <option value="double">Double</option>
                        <option value="suite">Suite</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="capacity">Capacity</label>
                    <input type="number" id="capacity" name="capacity" required>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="action-button">Add Room</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Show assign room modal
async function showAssignRoomModal(roomId) {
    try {
        // Fetch available students
        const response = await fetch(`${API_BASE_URL}/admin/students`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch students');
        }
        
        const students = await response.json();
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Assign Room</h2>
                <form id="assignRoomForm" onsubmit="assignRoom(event)">
                    <input type="hidden" name="roomId" value="${roomId}">
                    <div class="form-group">
                        <label for="studentId">Select Student</label>
                        <select id="studentId" name="studentId" required>
                            ${students.map(student => `
                                <option value="${student.id}">${student.name} (${student.email})</option>
                            `).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="moveInDate">Move-in Date</label>
                        <input type="date" id="moveInDate" name="moveInDate" required>
                    </div>
                    <div class="modal-actions">
                        <button type="submit" class="action-button">Assign Room</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error showing assign room modal:', error);
        alert('Failed to load student data');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// View application details
async function viewApplication(applicationId) {
    if (!checkAuth()) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch application details');
        }
        
        const application = await response.json();
        
        // Show application details in a modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Application Details</h2>
                <div class="application-details">
                    <p><strong>Student Name:</strong> ${application.studentName}</p>
                    <p><strong>Email:</strong> ${application.studentEmail}</p>
                    <p><strong>Preferred Room Type:</strong> ${application.preferredRoomType}</p>
                    <p><strong>Move-in Date:</strong> ${formatDate(application.moveInDate)}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${application.status.toLowerCase()}">${application.status}</span></p>
                    <p><strong>Special Requirements:</strong> ${application.specialRequirements || 'None'}</p>
                    <p><strong>Application Date:</strong> ${formatDate(application.createdAt)}</p>
                </div>
                ${application.status === 'pending' ? `
                    <div class="modal-actions">
                        <button class="action-button approve" onclick="approveApplication('${application.id}')">Approve</button>
                        <button class="action-button reject" onclick="rejectApplication('${application.id}')">Reject</button>
                    </div>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error viewing application:', error);
        alert(error.message || 'Failed to view application details');
    }
}

// Approve application
async function approveApplication(applicationId) {
    if (!checkAuth()) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to approve application');
        }
        
        alert('Application approved successfully!');
        loadAdminDashboard(); // Refresh the dashboard
    } catch (error) {
        console.error('Error approving application:', error);
        alert(error.message || 'Failed to approve application');
    }
}

// Reject application
async function rejectApplication(applicationId) {
    if (!checkAuth()) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/applications/${applicationId}/reject`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to reject application');
        }
        
        alert('Application rejected successfully!');
        loadAdminDashboard(); // Refresh the dashboard
    } catch (error) {
        console.error('Error rejecting application:', error);
        alert(error.message || 'Failed to reject application');
    }
}

// View room details
async function viewRoom(roomId) {
    if (!checkAuth()) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/rooms/${roomId}`, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch room details');
        }
        
        const room = await response.json();
        
        // Show room details in a modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button" onclick="this.parentElement.parentElement.remove()">&times;</span>
                <h2>Room Details</h2>
                <div class="room-details">
                    <p><strong>Room Number:</strong> ${room.roomNumber}</p>
                    <p><strong>Building:</strong> ${room.building}</p>
                    <p><strong>Floor:</strong> ${room.floor}</p>
                    <p><strong>Type:</strong> ${room.type}</p>
                    <p><strong>Capacity:</strong> ${room.capacity}</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${room.status.toLowerCase()}">${room.status}</span></p>
                    ${room.assignedTo ? `
                        <p><strong>Assigned To:</strong> ${room.assignedTo}</p>
                        <p><strong>Move-in Date:</strong> ${formatDate(room.moveInDate)}</p>
                    ` : ''}
                </div>
                <div class="modal-actions">
                    ${room.status === 'available' ? `
                        <button class="action-button assign" onclick="showAssignRoomModal('${room.id}')">Assign Room</button>
                    ` : ''}
                    <button class="action-button delete" onclick="deleteRoom('${room.id}')">Delete Room</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    } catch (error) {
        console.error('Error viewing room:', error);
        alert(error.message || 'Failed to view room details');
    }
}

// Delete room
async function deleteRoom(roomId) {
    if (!checkAuth()) return;
    
    if (!confirm('Are you sure you want to delete this room?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/admin/rooms/${roomId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            }
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete room');
        }
        
        alert('Room deleted successfully!');
        loadAdminDashboard(); // Refresh the dashboard
    } catch (error) {
        console.error('Error deleting room:', error);
        alert(error.message || 'Failed to delete room');
    }
}

// Initialize pages
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for forms
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', login);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', register);
    }
    
    const housingApplicationForm = document.getElementById('housingApplicationForm');
    if (housingApplicationForm) {
        housingApplicationForm.addEventListener('submit', handleHousingApplication);
    }
    
    // Add event listeners for admin forms
    const addRoomForm = document.getElementById('addRoomForm');
    if (addRoomForm) {
        addRoomForm.addEventListener('submit', addRoom);
    }
    
    const assignRoomForm = document.getElementById('assignRoomForm');
    if (assignRoomForm) {
        assignRoomForm.addEventListener('submit', assignRoom);
    }
    
    // Load dashboard data if on dashboard page
    if (window.location.pathname.includes('dashboard.html')) {
        loadDashboardData();
    }
    
    // Load admin dashboard if on admin page
    if (window.location.pathname.includes('admin.html')) {
        loadAdminDashboard();
    }
}); 