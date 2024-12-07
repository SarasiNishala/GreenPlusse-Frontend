document.addEventListener("DOMContentLoaded", () => {
    // Elements from the DOM
    const vehicleIdInput = document.getElementById("vehicle-id");
    const licenseInput = document.getElementById("license");
    const vehicleCategoryInput = document.getElementById("vehicle-category");
    const fuelTypeInput = document.getElementById("fuel-type");
    const remarkInput = document.getElementById("remark");
    const statusInput = document.getElementById("status");
    const staffSelect = document.getElementById("staff");
    const saveButton = document.querySelector(".save");
    const updateButton = document.querySelector(".update");
    const deleteButton = document.querySelector(".delete");

    // Fetch staff list to populate staff dropdown
    async function fetchStaffList() {
        try {
            const response = await fetch('http://localhost:8080/staff/all_staff'); // Change the URL to your actual staff API endpoint
            const staffList = await response.json();
            staffList.forEach(staff => {
                const option = document.createElement('option');
                option.value = staff.id;
                option.textContent = staff.name;
                staffSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error fetching staff list:", error);
        }
    }

    fetchStaffList(); // Call the function to populate staff select dropdown on page load

    // Save vehicle
    async function saveVehicle() {
        const vehicleData = {
            vehicleCode: vehicleIdInput.value,
            licensePlateNumber: licenseInput.value,
            vehicleCategory: vehicleCategoryInput.value,
            fuelType: fuelTypeInput.value,
            remarks: remarkInput.value,
            status: statusInput.value,
            staffId: staffSelect.value
        };

        try {
            const response = await fetch('http://localhost:8080/vehicle', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });

            if (response.status === 201) {
                alert('Vehicle added successfully');
            } else {
                alert('Failed to add vehicle');
            }
        } catch (error) {
            console.error("Error saving vehicle:", error);
        }
    }

    // Update vehicle
    async function updateVehicle() {
        const vehicleData = {
            vehicleCode: vehicleIdInput.value,
            licensePlateNumber: licenseInput.value,
            vehicleCategory: vehicleCategoryInput.value,
            fuelType: fuelTypeInput.value,
            remarks: remarkInput.value,
            status: statusInput.value,
            staffId: staffSelect.value
        };

        try {
            const response = await fetch(`http://localhost:8080/vehicle/update/${vehicleIdInput.value}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(vehicleData)
            });

            if (response.status === 200) {
                alert('Vehicle updated successfully');
            } else {
                alert('Failed to update vehicle');
            }
        } catch (error) {
            console.error("Error updating vehicle:", error);
        }
    }

    // Delete vehicle
    async function deleteVehicle() {
        try {
            const response = await fetch(`http://localhost:8080/vehicle/delete/${vehicleIdInput.value}`, {
                method: 'DELETE'
            });

            if (response.status === 200) {
                alert('Vehicle deleted successfully');
            } else {
                alert('Failed to delete vehicle');
            }
        } catch (error) {
            console.error("Error deleting vehicle:", error);
        }
    }

    // Event listeners for buttons
    saveButton.addEventListener('click', saveVehicle);
    updateButton.addEventListener('click', updateVehicle);
    deleteButton.addEventListener('click', deleteVehicle);
});
