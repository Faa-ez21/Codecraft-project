-- Add additional_images column to products table
-- This column will store an array of image URLs for additional product images

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS additional_images TEXT[];

-- Add a comment to the column
COMMENT ON COLUMN products.additional_images IS 'Array of additional image URLs for the product gallery';
