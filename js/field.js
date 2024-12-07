document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = 'http://localhost:8080/field';

    // Initial table load
    fetchAndUpdateTable();

    // Delete button listener
    document.querySelector(".delete").addEventListener("click", handleDelete);

    function handleDelete(e) {
        e.preventDefault();
        const fieldCode = document.getElementById("field-code").value;

        if (!fieldCode) return alert("Please select a field to delete.");

        if (confirm("Are you sure you want to delete this field?")) {
            fetch(`${BASE_URL}/delete/${fieldCode}`, { method: "DELETE" })
                .then(response => response.ok ? alert("Field deleted successfully!") : handleError(response))
                .then(fetchAndUpdateTable)
                .then(resetForm)
                .catch(console.error);
        }
    }

    function fetchAndUpdateTable() {
        fetch(`${BASE_URL}/all_fields`)
            .then(response => response.ok ? response.json() : Promise.reject("Failed to fetch fields"))
            .then(populateTable)
            .catch(console.error);
    }

    function populateTable(fields) {
        const tableBody = document.getElementById('my-table');
        tableBody.innerHTML = fields.map(field => `
            <tr>
                <td>${field.fieldCode}</td>
                <td>${field.fieldName}</td>
                <td>${field.fieldLocation}</td>
                <td>${field.extentSize}</td>
                <td><img src="${field.fieldImage1}" alt="Image 1" width="50" height="50"></td>
                <td><img src="${field.fieldImage2}" alt="Image 2" width="50" height="50"></td>
            </tr>
        `).join("");

        Array.from(tableBody.children).forEach((row, index) => {
            row.addEventListener("click", () => populateFields(fields[index]));
        });
    }

    function populateFields(field) {
        document.getElementById("field-code").value = field.fieldCode;
        document.getElementById("field-name").value = field.fieldName;
        document.getElementById("field-location").value = field.fieldLocation;
        document.getElementById("field-size").value = field.extentSize;
        alert("Field data loaded into form. Update images manually if needed.");
    }

    function resetForm() {
        document.querySelectorAll("input").forEach(input => input.value = "");
    }

    function handleError(response) {
        return response.text().then(errorMessage => alert(`Error: ${errorMessage}`));
    }
});
