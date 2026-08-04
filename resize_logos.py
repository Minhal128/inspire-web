import os
import re

def resize_logos():
    base_dir = r"c:\inspireweb\inspire-web\components"
    layouts = [
        "DashboardLayout.tsx",
        "AdminDashboardLayout.tsx",
        "ManagementDashboardLayout.tsx",
        "AssetManagerDashboardLayout.tsx",
        "OtherDashboardLayout.tsx"
    ]

    # Desktop sidebar logo
    old_desktop = 'className="h-36 w-auto cursor-pointer scale-110 hover:scale-125 transition-transform"'
    new_desktop = 'className="h-16 w-auto cursor-pointer hover:scale-105 transition-transform"'

    # Mobile sidebar overlay logo
    old_mobile_sidebar = 'className="w-auto h-20 cursor-pointer scale-110"'
    new_mobile_sidebar = 'className="w-auto h-12 cursor-pointer"'

    # Mobile header logo
    old_mobile_header = 'className="w-auto h-16 sm:h-20 cursor-pointer"'
    new_mobile_header = 'className="w-auto h-10 sm:h-12 cursor-pointer"'

    for layout in layouts:
        path = os.path.join(base_dir, layout)
        if not os.path.exists(path):
            continue
            
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()

        content = content.replace(old_desktop, new_desktop)
        content = content.replace(old_mobile_sidebar, new_mobile_sidebar)
        content = content.replace(old_mobile_header, new_mobile_header)

        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Updated {layout}")

if __name__ == "__main__":
    resize_logos()
