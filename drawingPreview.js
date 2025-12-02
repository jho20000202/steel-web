// Drawing Preview Functionality for library.html

// Store drawings data
let drawingsData = [];

// Load drawings from Supabase
async function loadDrawings() {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }

    try {
        const { data, error } = await window.supabaseClient
            .from('drawings')
            .select('*');

        if (error) {
            console.error('Error loading drawings:', error);
            return;
        }

        drawingsData = data || [];
        console.log(`Loaded ${drawingsData.length} drawings`);
    } catch (err) {
        console.error('Exception loading drawings:', err);
    }
}

// Fuzzy match function
function fuzzyMatchDrawing(componentId, drawingKey) {
    if (!componentId || !drawingKey) return false;

    // Normalize: remove special characters, convert to uppercase
    const normalize = (str) => str.replace(/[_\-\s]/g, '').toUpperCase();

    const normId = normalize(componentId);
    const normKey = normalize(drawingKey);

    // Check if drawing key contains component ID
    return normKey.includes(normId);
}

// Find drawing for component
function findDrawing(componentId) {
    if (!componentId) return null;

    // Try exact match first on cleaned_key
    let drawing = drawingsData.find(d => d.cleaned_key && d.cleaned_key.toUpperCase() === componentId.toUpperCase());

    if (drawing) return drawing;

    // Try fuzzy match on cleaned_key
    drawing = drawingsData.find(d => d.cleaned_key && fuzzyMatchDrawing(componentId, d.cleaned_key));

    if (drawing) return drawing;

    // Try fuzzy match on file_name
    drawing = drawingsData.find(d => d.file_name && fuzzyMatchDrawing(componentId, d.file_name));

    return drawing;
}

// View drawing function
window.viewDrawing = function (componentId) {
    console.log('View drawing requested for:', componentId);

    const drawing = findDrawing(componentId);

    if (!drawing) {
        alert(`找不到構件 "${componentId}" 的對應圖面\n\n請確認圖面已正確匯入到資料庫。`);
        return;
    }

    console.log('Found drawing:', drawing);

    // Build preview URL
    let previewUrl = drawing.preview_url;

    // If no preview_url, construct from file_id
    if (!previewUrl && drawing.file_id) {
        previewUrl = `https://drive.google.com/file/d/${drawing.file_id}/preview`;
    }

    if (!previewUrl) {
        alert('無法取得圖面預覽連結');
        return;
    }

    // Set iframe source and show modal
    document.getElementById('drawingFrame').src = previewUrl;
    document.getElementById('drawingModal').style.display = 'block';
    document.getElementById('drawingTitle').textContent = drawing.file_name || componentId;
}

// Close drawing modal
window.closeDrawingModal = function () {
    document.getElementById('drawingModal').style.display = 'none';
    // Clear iframe to stop loading
    document.getElementById('drawingFrame').src = '';
}

// Initialize drawings when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDrawings);
} else {
    loadDrawings();
}
