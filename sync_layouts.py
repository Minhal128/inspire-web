import os
import re

def sync_layouts():
    base_dir = r"c:\inspireweb\inspire-web\components"
    source_file = os.path.join(base_dir, "DashboardLayout.tsx")
    
    with open(source_file, "r", encoding="utf-8") as f:
        template = f.read()

    portals = [
        {
            "filename": "AdminDashboardLayout.tsx",
            "component": "AdminDashboardLayout",
            "prefix": "/admin"
        },
        {
            "filename": "ManagementDashboardLayout.tsx",
            "component": "ManagementDashboardLayout",
            "prefix": "/management/dashboard"
        },
        {
            "filename": "AssetManagerDashboardLayout.tsx",
            "component": "AssetManagerDashboardLayout",
            "prefix": "/asset-manager/dashboard"
        },
        {
            "filename": "OtherDashboardLayout.tsx",
            "component": "OtherDashboardLayout",
            "prefix": "/other/dashboard"
        }
    ]

    for portal in portals:
        dest_file = os.path.join(base_dir, portal["filename"])
        
        # Replace Component Name
        content = template.replace("DashboardLayout", portal["component"])
        
        # We need to replace route paths. In DashboardLayout, routes are like:
        # '/dashboard', '/dashboard/my-inspection', '/dashboard/inspection-status', '/dashboard/reports', '/dashboard/settings'
        # We will carefully replace '/dashboard' with portal['prefix']
        
        # Let's use regex to replace path strings
        content = re.sub(r"'/dashboard'", f"'{portal['prefix']}'", content)
        content = re.sub(r"'/dashboard/([^']+)'", f"'{portal['prefix']}/\\1'", content)
        
        # Also replace isActive('/dashboard')
        content = re.sub(r"isActive\('/dashboard'\)", f"isActive('{portal['prefix']}')", content)
        content = re.sub(r"isActive\('/dashboard/([^']+)'\)", f"isActive('{portal['prefix']}/\\1')", content)

        with open(dest_file, "w", encoding="utf-8") as f:
            f.write(content)
        
        print(f"Updated {portal['filename']}")

if __name__ == "__main__":
    sync_layouts()
