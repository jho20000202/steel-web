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

// Find all matching drawings for component
function findAllDrawings(componentId) {
    if (!componentId) return [];

    let matchedDrawings = [];

    // Try exact match first on cleaned_key
    const exactMatches = drawingsData.filter(d => d.cleaned_key && d.cleaned_key.toUpperCase() === componentId.toUpperCase());
    matchedDrawings.push(...exactMatches);

    // If no exact matches, try fuzzy match on cleaned_key
    if (matchedDrawings.length === 0) {
        const fuzzyMatches = drawingsData.filter(d => d.cleaned_key && fuzzyMatchDrawing(componentId, d.cleaned_key));
        matchedDrawings.push(...fuzzyMatches);
    }

    // If still no matches, try fuzzy match on file_name
    if (matchedDrawings.length === 0) {
        const fileNameMatches = drawingsData.filter(d => d.file_name && fuzzyMatchDrawing(componentId, d.file_name));
        matchedDrawings.push(...fileNameMatches);
    }

    return matchedDrawings;
}

// View drawing function
window.viewDrawing = function (componentId) {
    console.log('View drawing requested for:', componentId);

    const drawings = findAllDrawings(componentId);

    if (!drawings || drawings.length === 0) {
        alert(`找不到構件 "${componentId}" 的對應圖面\n\n請確認圖面已正確匯入到資料庫。`);
        return;
    }

    console.log(`Found ${drawings.length} drawing(s):`, drawings);

    // If only one drawing, open it directly
    if (drawings.length === 1) {
        openDrawing(drawings[0]);
        return;
    }

    // If multiple drawings, show selection dialog
    showDrawingSelection(componentId, drawings);
}

// Show drawing selection dialog
function showDrawingSelection(componentId, drawings) {
    const modal = document.getElementById('drawingSelectionModal');
    const list = document.getElementById('drawingSelectionList');
    const title = document.getElementById('drawingSelectionTitle');

    title.textContent = `選擇 "${componentId}" 的圖面 (共 ${drawings.length} 個)`;

    // Clear previous list
    list.innerHTML = '';

    // Create list items
    drawings.forEach((drawing, index) => {
        const item = document.createElement('div');
        item.className = 'drawing-selection-item';
        item.innerHTML = `
            <div class="drawing-item-name">${drawing.file_name || '未命名'}</div>
            <div class="drawing-item-info">${drawing.cleaned_key || ''}</div>
        `;
        item.onclick = () => {
            closeDrawingSelection();
            openDrawing(drawing);
        };
        list.appendChild(item);
    });

    modal.style.display = 'block';
}

// Close drawing selection dialog
window.closeDrawingSelection = function () {
    document.getElementById('drawingSelectionModal').style.display = 'none';
}

// Open a specific drawing
function openDrawing(drawing) {
    console.log('Opening drawing:', drawing);

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
    document.getElementById('drawingTitle').textContent = drawing.file_name || '製造圖預覽';
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
