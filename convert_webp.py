import os
from PIL import Image
import json
import glob

# Configuration
PROJECT_ROOT = r"c:\Users\Hp\Documents\MENU CLIENTS\CAFE Rifle 18\restaurant-menu-full"
IMAGE_DIR = os.path.join(PROJECT_ROOT, "public", "Images")
DATA_DIR = os.path.join(PROJECT_ROOT, "public", "data")

QUALITY = 75 # Standard WebP quality

def convert_to_webp():
    mappings = {} # Store "old_filename": "new_filename"
    
    print("Starting WebP conversion...")
    
    # 1. Convert Images
    for root, _, files in os.walk(IMAGE_DIR):
        for file in files:
            # Skip if already webp
            if file.lower().endswith('.webp'):
                continue
                
            if file.lower().endswith(('.png', '.jpg', '.jpeg')):
                file_path = os.path.join(root, file)
                file_name_no_ext = os.path.splitext(file)[0]
                new_file_name = file_name_no_ext + ".webp"
                new_file_path = os.path.join(root, new_file_name)
                
                try:
                    with Image.open(file_path) as img:
                        img.save(new_file_path, 'WEBP', quality=QUALITY)
                    
                    # Store mapping (Windows paths might be tricky, stored as filenames since they are unique in flat folder)
                    mappings[file] = new_file_name
                    
                    # Delete original
                    os.remove(file_path)
                    print(f"Converted: {file} -> {new_file_name}")
                    
                except Exception as e:
                    print(f"Failed to convert {file}: {e}")

    print(f"\nImages converted. Updating JSON files...")

    # 2. Update JSON Data
    json_files = glob.glob(os.path.join(DATA_DIR, "*.json"))
    
    for jf in json_files:
        try:
            with open(jf, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            
            # Replace all occurrences
            for old_name, new_name in mappings.items():
                if old_name in content:
                    content = content.replace(old_name, new_name)
            
            if content != original_content:
                with open(jf, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated: {os.path.basename(jf)}")
                
        except Exception as e:
            print(f"Error updating {jf}: {e}")

    print("\nConversion and updates complete!")

if __name__ == "__main__":
    convert_to_webp()
