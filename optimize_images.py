import os
from PIL import Image
import shutil

# Configuration
IMAGE_DIR = r"c:\Users\Hp\Documents\MENU CLIENTS\CAFE Rifle 18\restaurant-menu-full\public\Images"
# We assume current state is clean (restored from backup)
# No need to backup again if we already have it, but safety first? 
# The previous backup is still there.

MAX_WIDTH = 600 # Further reduce to 600
QUALITY = 70 # Reduce quality slightly

def optimize_images():
    count = 0
    saved_space = 0
    
    print("Starting optimization (smart mode)...")

    for root, _, files in os.walk(IMAGE_DIR):
        for file in files:
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                file_path = os.path.join(root, file)
                
                try:
                    original_size = os.path.getsize(file_path)
                    
                    with Image.open(file_path) as img:
                        # Resize if too large
                        resize_needed = img.width > MAX_WIDTH
                        if resize_needed:
                            ratio = MAX_WIDTH / img.width
                            new_height = int(img.height * ratio)
                            img_resized = img.resize((MAX_WIDTH, new_height), Image.Resampling.LANCZOS)
                        else:
                            img_resized = img

                        # Save to temp buffer/file to check size
                        temp_path = file_path + ".temp"
                        
                        fmt = img.format
                        if not fmt: 
                            fmt = 'JPEG' if file.lower().endswith(('.jpg', '.jpeg')) else 'PNG'

                        if fmt == 'JPEG':
                            img_resized.save(temp_path, 'JPEG', quality=QUALITY, optimize=True)
                        elif fmt == 'PNG':
                            # Optimize PNG
                            img_resized.save(temp_path, 'PNG', optimize=True, quality=QUALITY) 
                        elif fmt == 'WEBP':
                            img_resized.save(temp_path, 'WEBP', quality=QUALITY)
                        else:
                            # Fallback
                            img_resized.save(temp_path)

                        new_size = os.path.getsize(temp_path)
                        
                        if new_size < original_size:
                            # It's an improvement! Overwrite.
                            os.replace(temp_path, file_path)
                            saved = original_size - new_size
                            saved_space += saved
                            count += 1
                            print(f"Optimized: {file} | {original_size/1024:.1f}KB -> {new_size/1024:.1f}KB")
                        else:
                            # No improvement, discard temp
                            os.remove(temp_path)
                            # print(f"Skipped: {file} (No gain)")
                    
                except Exception as e:
                    print(f"Error optimizing {file}: {e}")
                    if os.path.exists(file_path + ".temp"):
                         os.remove(file_path + ".temp")

    print(f"\nTotal images successfully optimized: {count}")
    print(f"Total space saved: {saved_space / 1024 / 1024:.2f} MB")

if __name__ == "__main__":
    optimize_images()
