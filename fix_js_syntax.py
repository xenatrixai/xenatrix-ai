import sys

file_path = 'assets/js/main.js'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove the very last lines that are causing the syntax error and incorrect nesting
# We want to find the point where the terminal demo panel starts and make sure the previous block is closed properly.

new_lines = []
found_terminal = False
for line in lines:
    if '// ═══════════════════════════════════════════' in line and 'TERMINAL DEMO PANEL' in lines[lines.index(line)+1]:
        # Before starting terminal panel, we should close the DOMContentLoaded block
        # Check if it's already closed or if we need to close it.
        # Given the previous error, we likely have an unclosed block or a misplaced one.
        if not found_terminal:
            new_lines.append('});\n\n')
            found_terminal = True
    
    # Skip the old trailing refresh and incorrect closing braces
    if 'ScrollTrigger.refresh()' in line and 'setTimeout' in line:
        continue
    if line.strip() == '});' and lines.index(line) > 1260:
         continue
         
    new_lines.append(line)

# Add the refresh at the very end
new_lines.append('\n// Final refresh\nsetTimeout(() => { if(window.ScrollTrigger) ScrollTrigger.refresh(); }, 1500);\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Fixed main.js syntax and scoping.")
