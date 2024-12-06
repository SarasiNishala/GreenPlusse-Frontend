// Get the current date and time
const now = new Date();

// Format the date to 'YYYY-MM-DDTHH:mm' to fit the 'datetime-local' input
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
const day = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');

// Combine into the correct format
const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

// Set the value of the input field
document.getElementById('datetime').value = formattedDateTime;
