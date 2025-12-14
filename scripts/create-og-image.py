#!/usr/bin/env python3
"""
Create OG image for CardRoots (1200x630px)

Requires Pillow:
  pip install pillow
  # Or install from requirements:
  pip install -r scripts/requirements.txt
"""
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    print("PIL/Pillow not available. Install with: pip install pillow")
    exit(1)

# Dimensions
WIDTH = 1200
HEIGHT = 630

# Colors - premium, festive but subtle
BG_COLOR = "#0f1724"  # Dark slate (matches site theme)
ACCENT_COLOR = "#f59e0b"  # Amber (matches site accent)
TEXT_COLOR = "#ffffff"  # White
SUBTLE_COLOR = "#94a3b8"  # Muted slate

# Create image
img = Image.new("RGB", (WIDTH, HEIGHT), BG_COLOR)
draw = ImageDraw.Draw(img)

# Draw subtle gradient background
for y in range(HEIGHT):
    alpha = int(255 * (1 - y / HEIGHT * 0.3))
    color = tuple(int(c * alpha / 255) for c in [15, 23, 36])
    draw.line([(0, y), (WIDTH, y)], fill=color)

# Try to load a font, fallback to default if not available
try:
    # Try system fonts
    title_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 72)
    subtitle_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
except:
    try:
        title_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 72)
        subtitle_font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", 36)
    except:
        # Fallback to default font
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

# Draw text - centered
title_text = "CardRoots"
subtitle_text = "Send a Christmas card that plants a real tree 🌱"

# Get text dimensions for centering
title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=subtitle_font)

title_width = title_bbox[2] - title_bbox[0]
title_height = title_bbox[3] - title_bbox[1]
subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
subtitle_height = subtitle_bbox[3] - subtitle_bbox[1]

# Position text (centered vertically, with spacing)
title_y = HEIGHT // 2 - 60
subtitle_y = HEIGHT // 2 + 40

title_x = (WIDTH - title_width) // 2
subtitle_x = (WIDTH - subtitle_width) // 2

# Draw title
draw.text((title_x, title_y), title_text, fill=ACCENT_COLOR, font=title_font)

# Draw subtitle
draw.text((subtitle_x, subtitle_y), subtitle_text, fill=TEXT_COLOR, font=subtitle_font)

# Draw subtle tree icon/decoration (simple geometric shape)
tree_x = WIDTH - 150
tree_y = 50
# Simple tree shape using triangles
tree_points = [
    (tree_x, tree_y + 80),  # Bottom
    (tree_x - 30, tree_y + 40),  # Left
    (tree_x + 30, tree_y + 40),  # Right
]
draw.polygon(tree_points, fill="#22c55e")  # Green

# Save image
output_path = "public/og-image.jpg"
img.save(output_path, "JPEG", quality=85, optimize=True)

print(f"✅ OG image created: {output_path}")
print(f"   Dimensions: {WIDTH}x{HEIGHT}px")
print(f"   File size: {img.size[0] * img.size[1] * 3 / 1024:.1f} KB (estimated)")

