from PIL import Image, ImageDraw, ImageFilter

def draw_logo():
    # Create image
    size = 400
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw dark background rounded square
    bg_margin = 20
    draw.rounded_rectangle(
        [bg_margin, bg_margin, size - bg_margin, size - bg_margin], 
        radius=60, 
        fill=(40, 50, 60, 255)
    )
    
    # Draw yellow circle
    circle_margin = 60
    draw.ellipse(
        [circle_margin, circle_margin, size - circle_margin, size - circle_margin], 
        fill=(255, 204, 0, 255)
    )
    
    # Draw green cross
    cross_width = 160
    cross_thick = 48
    cx, cy = size // 2, size // 2
    
    # horizontal bar
    draw.rounded_rectangle(
        [cx - cross_width//2, cy - cross_thick//2, cx + cross_width//2, cy + cross_thick//2],
        radius=10,
        fill=(50, 160, 40, 255)
    )
    
    # vertical bar
    draw.rounded_rectangle(
        [cx - cross_thick//2, cy - cross_width//2, cx + cross_thick//2, cy + cross_width//2],
        radius=10,
        fill=(50, 160, 40, 255)
    )
    
    # Draw green leaf accents (approximate as arcs)
    draw.arc([30, 30, size-30, size-30], start=100, end=170, fill=(50, 160, 40, 255), width=24)
    draw.arc([30, 30, size-30, size-30], start=280, end=350, fill=(50, 160, 40, 255), width=24)
    
    # Save
    img.save(r'c:\inspireweb\inspire-web\public\hover-hero.png', 'PNG')
    print("Logo generated")

if __name__ == '__main__':
    draw_logo()
