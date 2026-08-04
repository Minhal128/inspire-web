from PIL import Image, ImageChops
import os

def trim(im):
    bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    if bbox:
        return im.crop(bbox)
    return im

def crop_transparent(im):
    if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
        alpha = im.convert('RGBA').split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            return im.crop(bbox)
    return trim(im)

def main():
    img_path = r"c:\inspireweb\inspire-web\public\logo.png"
    backup_path = r"c:\inspireweb\inspire-web\public\logo_backup.png"
    
    if not os.path.exists(backup_path):
        import shutil
        shutil.copy2(img_path, backup_path)
        
    try:
        im = Image.open(img_path)
        print(f"Original size: {im.size}")
        
        cropped_im = crop_transparent(im)
        print(f"Cropped size: {cropped_im.size}")
        
        cropped_im.save(img_path)
        print("Successfully cropped and saved logo.png")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
