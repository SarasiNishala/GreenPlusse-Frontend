document.addEventListener('DOMContentLoaded', function () {
    // Select buttons and form fields
    const saveButton = document.querySelector('.save');
    const updateButton = document.querySelector('.update');
    const deleteButton = document.querySelector('.delete');
    const equipmentIdInput = document.getElementById('equipment-id');
    const equipmentNameInput = document.getElementById('equipment-name');
    const equipmentTypeSelect = document.getElementById('equipment-type');
    const equipmentStatusInput = document.getElementById('equipment-status');
    const staffSelect = document.getElementById('staff');
    const fieldSelect = document.getElementById('field');
    const equipmentTableBody = document.getElementById('my-table');

    // Function to load data into a select dropdown
    function loadSelectData(url, selectElement) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                selectElement.innerHTML = ''; // Clear existing options
                const defaultOption = document.createElement('option');
                defaultOption.text = 'Select an option';
                defaultOption.value = '';
                selectElement.appendChild(defaultOption);
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.text = item.name || item.type || item.fieldName;
                    option.value = item.id || item.fieldCode || item.staffId;
                    selectElement.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error loading data:', error);
            });
    }

    // Function to load equipment data into the table
    function loadEquipmentData() {
        fetch('http://localhost:8080/equipment/all_equip')
            .then(response => response.json())
            .then(data => {
                equipmentTableBody.innerHTML = ''; // Clear existing table rows
                data.forEach(item => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${item.equipmentId}</td>
                        <td>${item.name}</td>
                        <td>${item.type}</td>
                        <td>${item.status}</td>
                        <td>${item.staffName}</td>
                        <td>${item.fieldName}</td>
                    `;
                    equipmentTableBody.appendChild(row);

                    // Add click event to each row to populate the form fields
                    row.addEventListener('click', function () {
                        equipmentIdInput.value = item.equipmentId;
                        equipmentNameInput.value = item.name;
                        equipmentTypeSelect.value = item.type;
                        equipmentStatusInput.value = item.status;
                        staffSelect.value = item.staffId;
                        fieldSelect.value = item.fieldCode;
                    });
                });
            })
            .catch(error => {
                console.error('Error loading equipment data:', error);
            });
    }

    // Load select dropdown data
    loadSelectData('http://localhost:8080/equipment/all_equip', equipmentTypeSelect);
    loadSelectData('http://localhost:8080/staff/all_staff', staffSelect);
    loadSelectData('http://localhost:8080/field/all_fields', fieldSelect);

    // Load initial equipment data into the table
    loadEquipmentData();

    // On Save button click, handle form submission
    saveButton.addEventListener('click', function (event) {
        event.preventDefault();
        const equipmentDTO = {
            equipmentId: parseInt(equipmentIdInput.value),
            name: equipmentNameInput.value,
            type: equipmentTypeSelect.value,
            status: equipmentStatusInput.value,
            staffId: parseInt(staffSelect.value),
            fieldCode: parseInt(fieldSelect.value),
        };

        fetch('http://localhost:8080/equipment', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipmentDTO),
        })
            .then(response => {
                if (response.status === 201) {
                    alert('Equipment added successfully!');
                    loadEquipmentData();
                } else {
                    return response.text();
                }
            })
            .then(error => {
                if (error) {
                    alert('Failed to add equipment: ' + error);
                }
            })
            .catch(err => {
                alert('An error occurred: ' + err);
            });
    });

    // On Update button click, handle updating the equipment
    updateButton.addEventListener('click', function (event) {
        event.preventDefault();

        const equipmentDTO = {
            equipmentId: parseInt(equipmentIdInput.value),
            name: equipmentNameInput.value,
            type: equipmentTypeSelect.value,
            status: equipmentStatusInput.value,
            staffId: parseInt(staffSelect.value),
            fieldCode: parseInt(fieldSelect.value),
        };

        fetch(`http://localhost:8080/equipment/get/${equipmentIdInput.value}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(equipmentDTO),
        })
            .then(response => {
                if (response.status === 204) {
                    alert('Equipment updated successfully!');
                    loadEquipmentData();
                } else {
                    return response.text();
                }
            })
            .then(error => {
                if (error) {
                    alert('Failed to update equipment: ' + error);
                }
            })
            .catch(err => {
                alert('An error occurred: ' + err);
            });
    });

    // On Delete button click, handle deleting the equipment
    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();

        const equipmentId = equipmentIdInput.value;

        fetch(`http://localhost:8080/equipment/delete/${equipmentId}`, { 
            method: 'DELETE',
        })
            .then(response => {
                if (response.status === 204) {
                    alert('Equipment deleted successfully!');
                    loadEquipmentData();
                } else {
                    return response.text();
                }
            })
            .then(error => {
                if (error) {
                    alert('Failed to delete equipment: ' + error);
                }
            })
            .catch(err => {
                alert('An error occurred: ' + err);
            });
    });
});
