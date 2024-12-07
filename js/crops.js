document.addEventListener('DOMContentLoaded', () => {
    const cropTableBody = document.getElementById('my-table');
    const saveButton = document.querySelector('.save');
    const updateButton = document.querySelector('.update');
    const deleteButton = document.querySelector('.delete');

    const cropIdInput = document.getElementById('crop-id');
    const cropCommonNameInput = document.getElementById('crop-common-name');
    const cropScientificNameInput = document.getElementById('crop-scientific-name');
    const cropSeasonInput = document.getElementById('crop-season');
    const cropCategoryInput = document.getElementById('crop-ctegory');
    const fieldCropSelect = document.getElementById('field-crop');
    const cropImageInput = document.getElementById('crop-image');

    const API_BASE_URL = 'http://localhost:8080/crop';
    const FIELD_API_URL = 'http://localhost:8080/field/all_fields'; 

    // Function to fetch and display fields in the select dropdown
    const loadFields = async () => {
        try {
            const response = await fetch(FIELD_API_URL);
            const fields = await response.json();
            fieldCropSelect.innerHTML = '<option>Select Fields</option>'; // Clear existing options
            fields.forEach(field => {
                const option = document.createElement('option');
                option.value = field.fieldCode; // Use fieldCode as the value
                option.textContent = field.fieldName; // Use fieldName as the display text
                fieldCropSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading fields:', error);
        }
    };

    //clear fields
    const clearFormFields = () => {
        cropIdInput.value = '';
        cropCommonNameInput.value = '';
        cropScientificNameInput.value = '';
        cropSeasonInput.value = '';
        cropCategoryInput.value = '';
        fieldCropSelect.value = 'Select Fields'; // Reset dropdown to default
        cropImageInput.value = ''; // Clear the file input
    };

    // Function to fetch and display crops
    const loadCrops = async () => {
        try {
            const response = await fetch('http://localhost:8080/crop/all_crops');
            const crops = await response.json();
            cropTableBody.innerHTML = '';
            crops.forEach(crop => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${crop.cropCode}</td>
                    <td>${crop.cropCommonName}</td>
                    <td>${crop.cropScientificName}</td>
                    <td>${crop.cropSeason}</td>
                    <td>${crop.category}</td>
                    <td><img src="${crop.cropImage}" alt="Crop Image" width="50"></td>
                    <td>${crop.fieldCode}</td>
                `;
                row.addEventListener('click', () => populateForm(crop));
                cropTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error loading crops:', error);
        }
    };

    // Function to populate the form for updating or deleting
    const populateForm = (crop) => {
        cropIdInput.value = crop.cropCode;
        cropCommonNameInput.value = crop.cropCommonName;
        cropScientificNameInput.value = crop.cropScientificName;
        cropSeasonInput.value = crop.cropSeason;
        cropCategoryInput.value = crop.category;
        fieldCropSelect.value = crop.fieldCode;
    };

    // Function to save a new crop
    const saveCrop = async () => {
        const formData = new FormData();
        formData.append('cropCommonName', cropCommonNameInput.value);
        formData.append('cropScientificName', cropScientificNameInput.value);
        formData.append('cropSeason', cropSeasonInput.value);
        formData.append('category', cropCategoryInput.value);
        formData.append('fieldCode', fieldCropSelect.value);
        if (cropImageInput.files[0]) {
            formData.append('cropImage', cropImageInput.files[0]);
        }

        try {
            await fetch(API_BASE_URL, {
                method: 'POST',
                body: formData,
            });
            loadCrops();
            clearFormFields();
        } catch (error) {
            console.error('Error saving crop:', error);
        }
    };

    // Function to update a crop
    const updateCrop = async () => {
        const cropId = cropIdInput.value;
        if (!cropId) return alert('Select a crop to update.');

        const formData = new FormData();
        formData.append('cropCommonName', cropCommonNameInput.value);
        formData.append('cropScientificName', cropScientificNameInput.value);
        formData.append('cropSeason', cropSeasonInput.value);
        formData.append('category', cropCategoryInput.value);
        formData.append('fieldCode', fieldCropSelect.value);
        if (cropImageInput.files[0]) {
            formData.append('cropImage', cropImageInput.files[0]);
        }

        try {
            await fetch(`${API_BASE_URL}/${cropId}`, {
                method: 'PUT',
                body: formData,
            });
            loadCrops();
            clearFormFields();
        } catch (error) {
            console.error('Error updating crop:', error);
        }
    };

    // Function to delete a crop
    const deleteCrop = async () => {
        const cropId = cropIdInput.value;
        if (!cropId) return alert('Select a crop to delete.');

        try {
            await fetch(`${API_BASE_URL}/${cropId}`, {
                method: 'DELETE',
            });
            loadCrops();
            clearFormFields();
        } catch (error) {
            console.error('Error deleting crop:', error);
        }
    };

    // Event listeners
    saveButton.addEventListener('click', saveCrop);
    updateButton.addEventListener('click', updateCrop);
    deleteButton.addEventListener('click', deleteCrop);

    // Initial load of fields and crops
    loadFields();
    loadCrops();
});
