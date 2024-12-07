// JavaScript to manage staff functionality

const staffTable = document.getElementById('my-table');
const saveButton = document.querySelector('.save');
const updateButton = document.querySelector('.update');
const deleteButton = document.querySelector('.delete');

// Base URL of the backend API
const baseUrl = 'http://localhost:8080/staff';

// Helper function to collect form data
function getFormData() {
    return {
        staffId: document.getElementById('staff-id').value,
        firstName: document.getElementById('first_name').value,
        lastName: document.getElementById('last_name').value,
        designation: document.getElementById('designation').value,
        gender: document.querySelector('input[name="options"]:checked')?.value,
        joinedDate: document.getElementById('joined_date').value,
        dOB: document.getElementById('dob').value,
        buildingNo: document.getElementById('line_1').value,
        lane: document.getElementById('line_2').value,
        mainCity: document.getElementById('line_3').value,
        mainState: document.getElementById('line_4').value,
        postalCode: document.getElementById('line_5').value,
        contactNo: document.getElementById('contact').value,
        email: document.getElementById('email').value,
        role: document.getElementById('role').value
    };
}

// Helper function to clear the form
function clearForm() {
    document.querySelectorAll('.form-group input, .form-group select').forEach(input => input.value = '');
    document.querySelectorAll('input[name="options"]').forEach(radio => radio.checked = false);
}

// Populate the table
async function fetchStaffData() {
    try {
        const response = await fetch('http://localhost:8080/staff/all_staff');
        const staffList = await response.json();

        staffTable.innerHTML = '';
        staffList.forEach(staff => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${staff.staffId}</td>
                <td>${staff.firstName}</td>
                <td>${staff.email}</td>
                <td>${staff.contactNo}</td>
                <td>${staff.designation}</td>
                <td>${staff.role}</td>
                <td>${staff.buildingNo}, ${staff.lane}, ${staff.mainCity}</td>
                <td>${staff.gender}</td>
                <td>${staff.joinedDate}</td>
                <td>${staff.dOB}</td>
            `;
            staffTable.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching staff data:', error);
    }
}

// Save staff
saveButton.addEventListener('click', async () => {
    const staffData = getFormData();

    try {
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(staffData)
        });

        if (response.ok) {
            alert('Staff added successfully!');
            fetchStaffData();
            clearForm();
        } else {
            const error = await response.text();
            alert(`Failed to add staff: ${error}`);
        }
    } catch (error) {
        console.error('Error adding staff:', error);
    }
});

// Update staff
updateButton.addEventListener('click', async () => {
    const staffData = getFormData();

    try {
        const response = await fetch(`${baseUrl}/${staffData.staffId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(staffData)
        });

        if (response.ok) {
            alert('Staff updated successfully!');
            fetchStaffData();
            clearForm();
        } else {
            const error = await response.text();
            alert(`Failed to update staff: ${error}`);
        }
    } catch (error) {
        console.error('Error updating staff:', error);
    }
});

// Delete staff
deleteButton.addEventListener('click', async () => {
    const staffId = document.getElementById('staff-id').value;

    if (!staffId) {
        alert('Please enter a Staff ID to delete.');
        return;
    }

    try {
        const response = await fetch(`${baseUrl}/${staffId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Staff deleted successfully!');
            fetchStaffData();
            clearForm();
        } else {
            const error = await response.text();
            alert(`Failed to delete staff: ${error}`);
        }
    } catch (error) {
        console.error('Error deleting staff:', error);
    }
});

// Initial fetch of staff data
fetchStaffData();
