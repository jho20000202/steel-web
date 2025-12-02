# -*- coding: utf-8 -*-
import re

# Read the original library.html
with open('library.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add CSS for view-drawing-btn after delete-btn:hover
css_addition = """
        .view-drawing-btn {
            background: #17a2b8;
            color: #fff;
            border: none;
            padding: 6px 16px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 14px;
            pointer-events: auto;
            position: relative;
            z-index: 10;
            margin-right: 8px;
        }

        .view-drawing-btn:hover {
            background: #138496;
        }

        .btn-group {
            display: flex;
            gap: 8px;
            justify-content: flex-end;
            margin-top: 12px;
        }
"""

# Find and replace the delete-btn:hover section
content = content.replace(
    """        .delete-btn:hover {
            background: #e03e3e;
        }""",
    """        .delete-btn:hover {
            background: #e03e3e;
        }
""" + css_addition
)

# 2. Add drawing modal HTML before </body>
modal_html = """
    <!-- Drawing Preview Modal -->
    <div id="drawingModal" class="modal">
        <div class="modal-content" style="max-width: 95%; max-height: 95vh; height: 90vh;">
            <div class="modal-header">
                <div class="modal-title" id="drawingTitle">📋 製造圖預覽</div>
                <span class="close-btn" onclick="closeDrawingModal()">&times;</span>
            </div>
            <div style="height: calc(100% - 80px); overflow: hidden; background: #0f1320; border-radius: 8px;">
                <iframe id="drawingFrame" style="width: 100%; height: 100%; border: none;"></iframe>
            </div>
        </div>
    </div>
"""

# Add script reference
script_ref = '    <script src="drawingPreview.js"></script>\n'

# Insert before </body>
content = content.replace('</body>', script_ref + modal_html + '</body>')

# 3. Update the card rendering to include view drawing button
# Find the delete button line and replace it with btn-group
old_button = '''                        <div style="margin-top: 12px; text-align: right;">
                            <button class="delete-btn" onclick="event.stopPropagation(); window.handleDelete('${item.id}')">刪除構件</button>
                        </div>'''

new_button = '''                        <div class="btn-group">
                            <button class="view-drawing-btn" onclick="event.stopPropagation(); viewDrawing('${item.item_id}')">📋 查看圖面</button>
                            <button class="delete-btn" onclick="event.stopPropagation(); window.handleDelete('${item.id}')">刪除構件</button>
                        </div>'''

content = content.replace(old_button, new_button)

# Write the modified content
with open('library.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ library.html updated successfully!")
print("Added:")
print("  - CSS for view-drawing-btn and btn-group")
print("  - Drawing preview modal HTML")
print("  - drawingPreview.js script reference")
print("  - View drawing button in card layout")
