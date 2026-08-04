import urllib.request
import os

req = urllib.request.Request('https://upload.wikimedia.org/wikipedia/en/2/23/360_Security_Logo.png', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as response:
    with open(r'c:\inspireweb\inspire-web\public\hover-hero.png', 'wb') as out_file:
        out_file.write(response.read())
print("Downloaded")
