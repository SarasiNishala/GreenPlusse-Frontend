// document.addEventListener("DOMContentLoaded", () => {
//     const fieldSelect = document.getElementById("field-id");
//     const staffSelect = document.getElementById("member-id");
//     const confirmButton = document.querySelector(".confirm");

//     const BASE_URL_FIELDS = "http://localhost:8080/all_fields"; // Updated Field URL
//     const BASE_URL_STAFF = "http://localhost:8080/all_staff"; // Updated Staff URL

//     // Fetch Field IDs and populate the dropdown
//     async function fetchFieldIDs() {
//         try {
//             const response = await fetch(BASE_URL_FIELDS); // Fetch data from new field URL
//             if (!response.ok) throw new Error("Failed to fetch field IDs.");
//             const fields = await response.json();

//             // Clear existing options and add placeholder
//             fieldSelect.innerHTML = '<option value="">Select the field ID</option>';

//             // Add options dynamically
//             fields.forEach(field => {
//                 const option = document.createElement("option");
//                 option.value = field.fieldCode; // Assuming fieldCode is the unique identifier
//                 option.textContent = `Field ID: ${field.fieldCode}`;
//                 fieldSelect.appendChild(option);
//             });
//         } catch (error) {
//             console.error("Error fetching field IDs:", error);
//         }
//     }

//     // Fetch Staff Members and populate the dropdown
//     async function fetchStaffMembers() {
//         try {
//             const response = await fetch(BASE_URL_STAFF); // Fetch data from new staff URL
//             if (!response.ok) throw new Error("Failed to fetch staff members.");
//             const staffMembers = await response.json();

//             // Clear existing options and add placeholder
//             staffSelect.innerHTML = '<option value="">Select the staff</option>';

//             // Add options dynamically
//             staffMembers.forEach(staff => {
//                 const option = document.createElement("option");
//                 option.value = staff.staffId; // Assuming staffId is the unique identifier
//                 option.textContent = `${staff.staffName} (ID: ${staff.staffId})`; // Assuming staffName exists
//                 staffSelect.appendChild(option);
//             });
//         } catch (error) {
//             console.error("Error fetching staff members:", error);
//         }
//     }

//     // Handle form submission
//     confirmButton.addEventListener("click", async (event) => {
//         event.preventDefault();

//         const fieldCode = fieldSelect.value;
//         const staffId = staffSelect.value;
//         const assignedDate = document.querySelector('input[type="date"]').value;

//         // Validate inputs
//         if (!fieldCode || !staffId || !assignedDate) {
//             alert("Please fill in all fields.");
//             return;
//         }

//         const fieldStaffDTO = {
//             fieldCode: parseInt(fieldCode, 10),
//             staffId: parseInt(staffId, 10),
//             assignedDate: assignedDate,
//             dueDate: null, // Add dueDate if applicable
//         };

//         try {
//             const response = await fetch(`${BASE_URL_FIELDS}/assignFieldToStaff`, { // Updated API endpoint for assignment
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(fieldStaffDTO),
//             });

//             if (response.ok) {
//                 alert("Field successfully assigned to staff!");
//                 window.location.href = "/pages/field.html"; // Redirect on success
//             } else {
//                 const errorMessage = await response.text();
//                 alert(`Error: ${errorMessage}`);
//             }
//         } catch (error) {
//             console.error("Error submitting form:", error);
//             alert("Failed to assign field. Please try again later.");
//         }
//     });

//     // Populate dropdowns when the page loads
//     fetchFieldIDs();
//     fetchStaffMembers();
// });
