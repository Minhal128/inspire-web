import os

root_dir = r"c:\inspireweb\inspire-web\app"
target = "http://localhost:5005"
replacement = "https://sea-lion-app-2u676.ondigitalocean.app"

for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file.endswith((".tsx", ".ts", ".js", ".jsx")):
            filepath = os.path.join(subdir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            if target in content:
                print(f"Replacing in {filepath}")
                new_content = content.replace(target, replacement)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
