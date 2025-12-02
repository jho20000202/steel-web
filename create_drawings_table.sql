-- ============================================
-- 建立 drawings 表格用於儲存 Google Drive 圖面資料
-- ============================================

-- 1. 建立 drawings 表格
CREATE TABLE IF NOT EXISTS drawings (
    id SERIAL PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_id TEXT UNIQUE NOT NULL,
    preview_url TEXT,
    cleaned_key TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 建立索引以加速查詢
CREATE INDEX IF NOT EXISTS idx_drawings_file_id ON drawings(file_id);
CREATE INDEX IF NOT EXISTS idx_drawings_cleaned_key ON drawings(cleaned_key);
CREATE INDEX IF NOT EXISTS idx_drawings_file_name ON drawings(file_name);

-- 3. 建立更新時間戳記的觸發器
CREATE OR REPLACE FUNCTION update_drawings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_drawings_timestamp
    BEFORE UPDATE ON drawings
    FOR EACH ROW
    EXECUTE FUNCTION update_drawings_updated_at();

-- 4. 啟用 Row Level Security (RLS)
ALTER TABLE drawings ENABLE ROW LEVEL SECURITY;

-- 5. 建立 RLS 政策（允許所有人讀取）
CREATE POLICY "Allow public read access on drawings"
    ON drawings
    FOR SELECT
    USING (true);

-- 6. 建立 RLS 政策（允許認證用戶寫入）
CREATE POLICY "Allow authenticated insert on drawings"
    ON drawings
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Allow authenticated update on drawings"
    ON drawings
    FOR UPDATE
    USING (true);

CREATE POLICY "Allow authenticated delete on drawings"
    ON drawings
    FOR DELETE
    USING (true);

-- ============================================
-- 查詢範例
-- ============================================

-- 查看所有圖面
-- SELECT * FROM drawings ORDER BY created_at DESC;

-- 根據 cleaned_key 查詢
-- SELECT * FROM drawings WHERE cleaned_key ILIKE '%UV0E3%';

-- 模糊搜尋檔案名稱
-- SELECT * FROM drawings WHERE file_name ILIKE '%UV0E%';
