import re

# 1. Restore data-theme="dark" and theme toggle to index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Restore theme attribute
if '<body' in html and 'data-theme="dark"' not in html:
    html = html.replace('<body>', '<body data-theme="dark">')

# Restore theme toggle button in nav-actions
theme_toggle_btn = '''
            <button class="theme-toggle" id="theme-toggle" aria-label="Toggle Theme">
                <i class="fa-solid fa-moon"></i>
            </button>'''
if 'nav-actions' in html and 'theme-toggle' not in html:
    html = html.replace('<div class="nav-actions">', '<div class="nav-actions">\n' + theme_toggle_btn)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Restored theme attribute and toggle button.")

# 2. Fix main.js: Add ScrollTrigger.refresh() and audio stop logic
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Add a global refresh at the end of the init
refresh_js = "\n    // Final refresh to ensure all ScrollTriggers are correctly positioned\n    setTimeout(() => { ScrollTrigger.refresh(); }, 1000);\n});"
if 'ScrollTrigger.refresh(); }, 1000);' not in js:
    js = js.rstrip().rstrip('}') + refresh_js

# Add audio stop logic if not present
stop_audio_js = """
    // Stop audio when section is out of view
    ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onLeave: stopAudio,
        onLeaveBack: stopAudio
    });
"""
if 'onLeaveBack: stopAudio' not in js:
    js = js.replace('// Animate each line based on its position in viewport', stop_audio_js + '\n    // Animate each line based on its position in viewport')

with open('assets/js/main.js', 'w', encoding='utf-8') as f:
    f.write(js)
print("Updated main.js with ScrollTrigger refresh and audio control.")
