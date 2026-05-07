import re

# 1. Update style.css
with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

divider_css = """
/* SECTION DIVIDER */
.section-divider {
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(15, 164, 175, 0.3), transparent);
    margin: 60px 0;
}
"""

if '.section-divider {' not in css:
    css += divider_css
    with open('assets/css/style.css', 'w', encoding='utf-8') as f:
        f.write(css)
    print("Added .section-divider to style.css")

# 2. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Add separator before manifesto
if '<!-- 7. WHY XENATRIX AI -->' in html:
    html = html.replace('<!-- 7. WHY XENATRIX AI -->', '<div class="section-divider"></div>\n    <!-- 7. WHY XENATRIX AI -->')

# Add separator after manifesto
if '</section>\n\n    \n    <!-- 7.5 LIVE DEMO CTA SECTION -->' in html:
    html = html.replace('</section>\n\n    \n    <!-- 7.5 LIVE DEMO CTA SECTION -->', '</section>\n    <div class="section-divider"></div>\n    \n    <!-- 7.5 LIVE DEMO CTA SECTION -->')
elif '</section>\n    \n    <!-- 7.5 LIVE DEMO CTA SECTION -->' in html:
    html = html.replace('</section>\n    \n    <!-- 7.5 LIVE DEMO CTA SECTION -->', '</section>\n    <div class="section-divider"></div>\n    \n    <!-- 7.5 LIVE DEMO CTA SECTION -->')
elif '<!-- 7.5 LIVE DEMO CTA SECTION -->' in html:
     html = html.replace('<!-- 7.5 LIVE DEMO CTA SECTION -->', '<div class="section-divider"></div>\n    <!-- 7.5 LIVE DEMO CTA SECTION -->')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Added separators to index.html")

# 3. Update main.js
with open('assets/js/main.js', 'r', encoding='utf-8') as f:
    js = f.read()

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
    # insert before `// Animate each line based on its position in viewport`
    js = js.replace('// Animate each line based on its position in viewport', stop_audio_js + '\n    // Animate each line based on its position in viewport')
    with open('assets/js/main.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Added audio stop logic to main.js")

