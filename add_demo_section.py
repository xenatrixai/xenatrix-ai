import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add dedicated DEMO SECTION after Why Xenatrix AI (before Clients)
demo_section = '''
    <!-- 7.5 LIVE DEMO CTA SECTION -->
    <section class="section demo-cta-section" id="demo-trigger-section">
        <div class="container reveal-up" style="text-align: center;">
            <div class="section-badge">Live System</div>
            <h2 class="section-title">Ready to see <span class="gradient-text">Automation</span> in action?</h2>
            <p class="section-subtitle" style="margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto;">
                Skip the consultation. Experience a live workflow response right now through our interactive terminal demo.
            </p>
            <button class="btn-demo-trigger" style="padding: 16px 40px; font-size: 15px;" onclick="openTerminalDemo()">
                <span class="demo-dot"></span> Experience Automation Live →
            </button>
        </div>
    </section>
'''

if 'demo-cta-section' not in html:
    # Insert before Clients section
    html = html.replace('<!-- 8. CURRENT CLIENTS -->', demo_section + '\n    <!-- 8. CURRENT CLIENTS -->')

# 2. Fix Services button (ensuring it's there)
services_trigger = '''
            <div style="text-align:center; margin-top:50px;">
                <button class="btn-demo-trigger" onclick="openTerminalDemo()">
                    <span class="demo-dot"></span> Experience Automation Live →
                </button>
            </div>'''

if 'Experience Automation Live' not in html.split('WHY XENATRIX')[0] and '7.5 LIVE DEMO' not in html:
    # This logic was a bit flawed before, let's just find the end of services
    services_end = '<!-- 7. WHY XENATRIX AI -->'
    if services_trigger not in html:
         html = html.replace(services_end, services_trigger + '\n\n    ' + services_end)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Demo CTA section added after Why Xenatrix AI.")
