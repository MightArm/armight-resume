# fonts/

This directory should hold the self-hosted Vazirmatn variable font.

The CSS in `style.css` already references `fonts/Vazirmatn-variable.woff2` via `@font-face` with `font-display: swap` and a system-font fallback stack, so the site still works if the file is missing.

## How to add the font (required before the custom font shows)

Download the official Vazirmatn variable font from the Vazirmatn GitHub repository (SIL Open Font License):

https://github.com/rastikerdar/vazirmatn

The variable web font file is located at:

fonts/webfonts/Vazirmatn[wght].woff2

Direct raw URL:

https://raw.githubusercontent.com/rastikerdar/vazirmatn/master/fonts/webfonts/Vazirmatn%5Bwght%5D.woff2

Save it into this folder as:

fonts/Vazirmatn-variable.woff2

This file is intentionally not committed to the repository (see `.gitignore`). Commit only this README.