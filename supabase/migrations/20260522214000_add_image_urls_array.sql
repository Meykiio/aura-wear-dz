-- Add image_urls array column to product_colors for multiple variant images
-- (e.g. male + female photos per color). image_url remains as the primary
-- thumbnail URL for backward compatibility.

ALTER TABLE public.product_colors
ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}';
