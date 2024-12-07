const BASE_URL = 'http://localhost:8080/field';

document.addEventListener("DOMContentLoaded", () => {
    const saveButton = document.querySelector(".save");
    const updateButton = document.querySelector(".update");
    const deleteButton = document.querySelector(".delete");

    let currentFieldCode = null; // To track which field is being updated or deleted

    /**
     * Event listener for the "Save" button.
     * Captures form data, validates it, and sends a POST request to the backend to save the field data.
     */
    saveButton.addEventListener("click", async () => {
        const formData = captureFormData();
        if (!formData) return; // If form data validation fails

        try {
            const response = await fetch(`${BASE_URL}`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                alert("Field added successfully!");
                clearForm(); // Clear the form after successful submission
                loadFields(); // Reload the table with updated data
            } else {
                const error = await response.text();
                alert(`Failed to add field: ${error}`);
            }
        } catch (error) {
            console.error("Error adding field:", error);
            alert("An error occurred while adding the field.");
        }
    });

    /**
     * Event listener for the "Update" button.
     * Updates an existing field based on the currentFieldCode.
     */
    updateButton.addEventListener("click", async () => {
        if (!currentFieldCode) {
            alert("Please select a field to update.");
            return;
        }

        const formData = captureFormData();
        if (!formData) return; // If form data validation fails

        try {
            const response = await fetch(`${BASE_URL}/update/${currentFieldCode}`, {
                method: "PUT",
                body: formData,
            });

            if (response.ok) {
                alert("Field updated successfully!");
                clearForm();
                currentFieldCode = null; // Reset the current field code
                loadFields();
            } else {
                const error = await response.text();
                alert(`Failed to update field: ${error}`);
            }
        } catch (error) {
            console.error("Error updating field:", error);
            alert("An error occurred while updating the field.");
        }
    });

    /**
     * Event listener for the "Delete" button.
     * Deletes the selected field based on the currentFieldCode.
     */
    deleteButton.addEventListener("click", async () => {
        if (!currentFieldCode) {
            alert("Please select a field to delete.");
            return;
        }

        const confirmDelete = confirm("Are you sure you want to delete this field?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${BASE_URL}/delete/${currentFieldCode}`, {
                method: "DELETE",
            });

            if (response.ok) {
                alert("Field deleted successfully!");
                clearForm();
                currentFieldCode = null; // Reset the current field code
                loadFields(); // Reload the table with updated data
            } else if (response.status === 404) {
                alert("Field not found. It may have already been deleted.");
            } else {
                alert("Failed to delete field. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting field:", error);
            alert("An error occurred while deleting the field.");
        }
    });

    /**
     * Captures form data and validates input fields.
     * @returns {FormData | null} FormData object if valid, otherwise null.
     */
    const captureFormData = () => {
        const fieldName = document.getElementById("field-name").value.trim();
        const fieldLocation = document.getElementById("field-location").value.trim();
        const fieldSize = document.getElementById("field-size").value.trim();
        const fieldImage1 = document.getElementById("field-image1").files[0];
        const fieldImage2 = document.getElementById("field-image2").files[0];

        if (!fieldName || !fieldLocation || !fieldSize || !fieldImage1 || !fieldImage2) {
            alert("Please fill all fields and upload both images.");
            return null;
        }

        const formData = new FormData();
        formData.append("fieldName", fieldName);
        formData.append("fieldLocation", fieldLocation);
        formData.append("extentSize", fieldSize);
        formData.append("fieldImage1", fieldImage1);
        formData.append("fieldImage2", fieldImage2);

        return formData;
    };

    /**
     * Clears all input fields in the form.
     */
    const clearForm = () => {
        document.getElementById("field-code").value = "";
        document.getElementById("field-name").value = "";
        document.getElementById("field-location").value = "";
        document.getElementById("field-size").value = "";
        document.getElementById("field-image1").value = "";
        document.getElementById("field-image2").value = "";
        currentFieldCode = null;
    };

    /**
     * Fetches all fields from the backend and populates the table.
     */
    const loadFields = async () => {
        try {
            const response = await fetch(`${BASE_URL}/all_fields`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const fields = await response.json();
                renderFields(fields);
            } else {
                console.error("Failed to load fields.");
                alert("Unable to load fields. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching fields:", error);
            alert("An error occurred while fetching field data.");
        }
    };

    /**
     * Renders the field data into the HTML table and attaches click listeners to populate form inputs.
     * @param {Array} fields - An array of field objects.
     */
    const renderFields = (fields) => {
        const tableBody = document.getElementById("my-table");
        tableBody.innerHTML = ""; // Clear existing rows

        if (fields.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6">No fields available</td></tr>`;
            return;
        }

        fields.forEach((field) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${field.fieldCode}</td>
                <td>${field.fieldName}</td>
                <td>${field.fieldLocation}</td>
                <td>${field.extentSize}</td>
                <td>
                    <img src="data:image/jpeg;base64,${field.fieldImage1}" alt="Field Image 1" width="100">
                </td>
                <td>
                    <img src="data:image/jpeg;base64,${field.fieldImage2}" alt="Field Image 2" width="100">
                </td>
            `;

            // Add click listener to populate form inputs
            row.addEventListener("click", () => populateForm(field));

            tableBody.appendChild(row);
        });
    };

    /**
     * Populates the form inputs with data from the selected table row.
     * @param {Object} field - The field object containing data.
     */
    const populateForm = (field) => {
        document.getElementById("field-code").value = field.fieldCode || "";
        document.getElementById("field-name").value = field.fieldName || "";
        document.getElementById("field-location").value = field.fieldLocation || "";
        document.getElementById("field-size").value = field.extentSize || "";
        document.getElementById("field-image1").value = ""; // Reset file input
        document.getElementById("field-image2").value = ""; // Reset file input

        currentFieldCode = field.fieldCode; // Store the current field code for updates or deletion
        alert("Form populated with selected field data. Update or delete if necessary.");
    };

    // Initial load of the field data when the page loads
    loadFields();
});
