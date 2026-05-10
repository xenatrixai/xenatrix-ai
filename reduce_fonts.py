import re

with open('assets/css/style.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

in_heading_block = False
new_lines = []

def halve_match(match):
    val = float(match.group(1))
    unit = match.group(2)
    return f"{round(val / 2, 2)}{unit}"

for line in lines:
    # Check if this line defines a heading class
    if re.search(r'\.section-title|\.hero-title|\.bento-heading|h[1-6]|.fp-header h2', line):
        in_heading_block = True
    
    if '{' in line and not re.search(r'\.section-title|\.hero-title|\.bento-heading|h[1-6]|.fp-header h2', line) and not line.strip().startswith('@media'):
        in_heading_block = False
        
    if in_heading_block and 'font-size:' in line:
        # replace any number followed by rem, vw, or px with its half
        line = re.sub(r'(\d+\.?\d*)(rem|vw|px)', halve_match, line)
        
    if '}' in line:
        in_heading_block = False

    new_lines.append(line)

with open('assets/css/style.css', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
print("Fonts reduced.")
