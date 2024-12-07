// URL for the backend API
const apiUrl = "http://localhost:8080/log";

// Fetch the dropdown data for fields, crops, and staff on page load
document.addEventListener("DOMContentLoaded", () => {
    loadDropdownData();
    loadLogTable();
});

// Load data for the dropdown menus
function loadDropdownData() {
    // Fetch fields data
    fetch("http://localhost:8080/field/all_fields")
        .then((response) => response.json())
        .then((fields) => populateDropdown("log-field", fields, "fieldCode", "fieldName"))
        .catch((err) => console.error("Error loading fields:", err));

    // Fetch crops data
    fetch("http://localhost:8080/crop/all_crops")
        .then((response) => response.json())
        .then((crops) => {
            console.log("Crops Data:", crops); // Log crops data
            populateDropdown("log-crop", crops, "cropCode", "commonName");
        })
        .catch((err) => console.error("Error loading crops:", err));

    // Fetch staff data
    fetch("http://localhost:8080/staff/all_staff")
        .then((response) => response.json())
        .then((staff) => {
            console.log("Staff Data:", staff); // Log staff data
            populateDropdown("log-staff", staff, "staffId", "staffName");
        })
        .catch((err) => console.error("Error loading staff:", err));
}

// Populate dropdown options
function populateDropdown(selectId, data, valueField, textField) {
    const select = document.getElementById(selectId);
    select.innerHTML = `<option value="">Select an option</option>`; // Default option

    data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item[valueField]; // Value for the option
        option.textContent = item[textField]; // Text to display
        select.appendChild(option);
    });
}

// Save log data
document.querySelector(".save").addEventListener("click", () => {
    const logDate = document.getElementById("log-date").value;
    const logDetails = document.getElementById("log-details").value;
    const cropStatus = document.getElementById("log-status").value;
    const fieldCode = document.getElementById("log-field").value;
    const cropCode = document.getElementById("log-crop").value;
    const staffId = document.getElementById("log-staff").value;
    const observedImage = document.getElementById("observed-image").files[0];

    // Check if all required fields are filled
    if (!logDate || !logDetails || !cropStatus || !fieldCode || !cropCode || !staffId || !observedImage) {
        alert("Please fill all fields and upload an image.");
        return;
    }

    const formData = new FormData();
    formData.append("logDate", logDate);
    formData.append("logDetails", logDetails);
    formData.append("cropStatus", cropStatus);
    formData.append("fieldCode", fieldCode);
    formData.append("cropCode", cropCode);
    formData.append("staffId", staffId);
    formData.append("observedImage", observedImage);

    fetch(apiUrl, {
        method: "POST",
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                alert("Log saved successfully!");
                loadLogTable(); // Refresh the log table
            } else {
                response.text().then((msg) => alert("Error: " + msg));
            }
        })
        .catch((err) => console.error("Error:", err));
});

// Load and display logs in the table
function loadLogTable() {
    fetch('http://localhost:8080/log/all_logs')
        .then((response) => response.json())
        .then((logs) => {
            const tableBody = document.getElementById("my-table");
            tableBody.innerHTML = ""; // Clear existing rows

            logs.forEach((log) => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${log.logCode}</td>
                    <td>${log.logDate}</td>
                    <td>${log.logDetails}</td>
                    <td>${log.cropStatus}</td>
                    <td>${log.fieldCode}</td>
                    <td>${log.cropCode}</td>
                    <td>${log.staffId}</td>
                    <td>
                        <img src="data:image/jpeg;base64,${log.observedImage}" 
                             alt="Observed Image" 
                             style="width: 50px; height: 50px;" />
                    </td>
                `;

                // Add a click event listener to populate the input fields
                row.addEventListener("click", () => {
                    populateFormFields(log);
                });

                tableBody.appendChild(row);
            });
        })
        .catch((err) => console.error("Error loading logs:", err));
}

// Populate the form fields with data from a table row
function populateFormFields(log) {
    document.getElementById("log-date").value = log.logDate;
    document.getElementById("log-details").value = log.logDetails;
    document.getElementById("log-status").value = log.cropStatus;
    document.getElementById("log-field").value = log.fieldCode;
    document.getElementById("log-crop").value = log.cropCode;
    document.getElementById("log-staff").value = log.staffId;

    // Note: observedImage can't be pre-populated since it requires file input.
    // You can optionally display the image elsewhere if needed.
    const observedImagePreview = document.getElementById("observed-image-preview");
    if (observedImagePreview) {
        observedImagePreview.src = `data:image/jpeg;base64,${log.observedImage}`;
    }
}

// Handle Update button to update log
document.querySelector(".update").addEventListener("click", () => {
    const logCode = document.getElementById("log-code").value;  // Log Code input
    const logDate = document.getElementById("log-date").value;
    const logDetails = document.getElementById("log-details").value;
    const cropStatus = document.getElementById("log-status").value;
    const fieldCode = document.getElementById("log-field").value;
    const cropCode = document.getElementById("log-crop").value;
    const staffId = document.getElementById("log-staff").value;
    const observedImage = document.getElementById("observed-image").files[0];

    // Check if all required fields are filled
    if (!logDate || !logDetails || !cropStatus || !fieldCode || !cropCode || !staffId || !observedImage) {
        alert("Please fill all fields and upload an image.");
        return;
    }

    const formData = new FormData();
    formData.append("logDate", logDate);
    formData.append("logDetails", logDetails);
    formData.append("cropStatus", cropStatus);
    formData.append("fieldCode", fieldCode);
    formData.append("cropCode", cropCode);
    formData.append("staffId", staffId);
    formData.append("observedImage", observedImage);

    fetch(`${apiUrl}/update/${logCode}`, {
        method: "PUT",
        body: formData,
    })
        .then((response) => {
            if (response.ok) {
                alert("Log updated successfully!");
                loadLogTable();  // Refresh the log table after updating
            } else {
                response.text().then((msg) => alert("Error: " + msg));
            }
        })
        .catch((err) => console.error("Error:", err));
});
