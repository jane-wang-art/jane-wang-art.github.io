"""Test the generated Hexo site and capture fully loaded desktop/mobile previews."""
from pathlib import Path
import functools, http.server, threading
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass
server=http.server.ThreadingHTTPServer(('127.0.0.1',4173),functools.partial(Quiet,directory=str(ROOT/'public')))
threading.Thread(target=server.serve_forever,daemon=True).start()
results=ROOT/'test-results';results.mkdir(exist_ok=True)
def load_images(page):
    # A full-page screenshot does not itself scroll or trigger lazy images.
    # Load and decode them for verification, without changing production loading.
    page.evaluate('''async () => {
      const images = [...document.images].filter(img => img.getAttribute('src'));
      images.forEach(img => img.loading = 'eager');
      await Promise.all(images.map(img => img.decode()));
      if (images.some(img => !img.complete || !img.naturalWidth)) throw new Error('Image failed to load');
    }''')
try:
    with sync_playwright() as p:
        browser=p.chromium.launch()
        page=browser.new_page(viewport={'width':1440,'height':1000},device_scale_factor=1)
        errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
        routes=['','gallery/','archives/','about/','licensing/','stories/autumn-terrace/']
        for route in routes:
            response=page.goto('http://127.0.0.1:4173/'+route,wait_until='networkidle')
            assert response.status==200,route
            assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),route
            load_images(page)
        page.goto('http://127.0.0.1:4173/',wait_until='networkidle');load_images(page)
        page.screenshot(path=str(results/'homepage-desktop.png'),full_page=True)
        page.goto('http://127.0.0.1:4173/gallery/',wait_until='networkidle');load_images(page)
        page.screenshot(path=str(results/'gallery-desktop.png'),full_page=True)
        assert page.locator('[data-lightbox]').count()==9
        page.locator('[data-lightbox]').first.click()
        assert page.locator('dialog').is_visible()
        page.keyboard.press('ArrowRight')
        assert page.locator('#lightbox-count').inner_text()=='2 / 9'
        page.keyboard.press('Escape');assert not page.locator('dialog').is_visible()
        for width in [390,320,768]:
            page.set_viewport_size({'width':width,'height':844})
            for route in routes:
                page.goto('http://127.0.0.1:4173/'+route,wait_until='networkidle')
                assert not page.evaluate('document.documentElement.scrollWidth > innerWidth'),f'{width} {route}'
        page.set_viewport_size({'width':390,'height':844})
        page.goto('http://127.0.0.1:4173/',wait_until='networkidle');load_images(page)
        page.screenshot(path=str(results/'homepage-mobile.png'),full_page=True)
        page.locator('.menu-toggle').click();assert page.locator('#main-nav').is_visible()
        page.locator('#main-nav a[href="/gallery/"]').click()
        assert page.locator('.art-card').count()==9
        load_images(page)
        page.screenshot(path=str(results/'gallery-mobile.png'),full_page=True)
        page.goto('http://127.0.0.1:4173/stories/autumn-terrace/',wait_until='networkidle')
        assert page.locator('.comic-page').count()==9
        page.locator('.page-jumps a').nth(4).click()
        assert page.url.endswith('#page-05')
        page.locator('#page-05 a').click()
        assert page.locator('dialog').is_visible()
        page.locator('#lightbox-image').evaluate('(img) => img.decode()')
        page.screenshot(path=str(results/'reader-mobile.png'))
        page.keyboard.press('Escape')
        assert not errors,errors
        browser.close()
        print('PASS: six routes at desktop, 320px, 390px and 768px; all displayed images decoded; 9-image gallery, reader anchors, mobile menu, keyboard lightbox; no JavaScript errors.')
finally:
    server.shutdown()
