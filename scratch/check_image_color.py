import urllib.request
import ssl
from PIL import Image
import io

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

try:
    url = "https://amenomenu.com/images/products_categories_images/1860167066346073.webp"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
        data = response.read()
        img = Image.open(io.BytesIO(data))
        print("Image dimensions:", img.size)
        print("Image format:", img.format)
        
        # Check average color
        img_rgb = img.convert('RGB')
        pixels = list(img_rgb.getdata())
        avg_r = sum(p[0] for p in pixels) / len(pixels)
        avg_g = sum(p[1] for p in pixels) / len(pixels)
        avg_b = sum(p[2] for p in pixels) / len(pixels)
        print(f"Average color: R={avg_r:.1f}, G={avg_g:.1f}, B={avg_b:.1f}")
except Exception as e:
    print("Error:", e)
