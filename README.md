# Breakdance Style Extractor

A Chrome extension that analyzes any website and extracts design styles into a Breakdance-compatible JSON file. Perfect for quickly importing global styles from client templates or design inspiration into your Breakdance WordPress projects.

## Features

✅ **One-Click Style Extraction** - Visit any website and extract styles with a single click

✅ **Automatic Unit Conversion** - Converts px, em, %, pt, and other CSS units to rem automatically

✅ **Comprehensive Style Analysis** - Extracts colors, typography, and button styles

✅ **Breakdance-Ready Output** - Generates JSON files that can be imported directly into Breakdance global settings

## What Gets Extracted

### Colors
- **Brand Color** - Primary brand color from the page
- **Text Color** - Main body text color
- **Heading Color** - Primary heading color
- **Link Color** - Hyperlink color
- **Background Color** - Page background color
- **Additional Palette Colors** - Up to 2 additional colors found on the page

### Typography
- **Body Font** - Main font family used for body text
- **Heading Font** - Font family used for headings
- **Base Font Size** - Root font size (converted to rem)
- **Heading Sizes** - Individual font sizes for H1-H6 (all converted to rem)
- **Font Weight** - Heading font weight
- **Text Transform** - Text transformation (uppercase, lowercase, etc.)

### Buttons
- **Primary Button Styles**
  - Padding (top, bottom, left, right)
  - Background color
  - Text color
- **Secondary Button Styles**
  - Outline style
  - Color
  - Hover behavior

## Installation

1. **Download or Clone this Repository**
   ```bash
   git clone https://github.com/yourusername/breakdance-styles-extractor.git
   ```

2. **Create Icon Files** (if not included)
   - To customize branding: Create three PNG images: `icon16.png`, `icon48.png`, `icon128.png`
   - Place them in the extension folder
   - Simple colored squares work fine as placeholders

3. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right corner)
   - Click "Load unpacked"
   - Select the `breakdance-styles-extractor` folder

4. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in Chrome toolbar
   - Find "Breakdance Style Extractor" and click the pin icon

## How to Use

1. **Navigate to Target Website**
   - Visit any website you want to extract styles from
   - Make sure the page is fully loaded

2. **Open the Extension**
   - Click the Breakdance Style Extractor icon in your Chrome toolbar

3. **Extract Styles**
   - Click the "Extract Styles from Page" button
   - Wait for the extraction to complete (usually 1-2 seconds)

4. **Download JSON File**
   - The file `breakdance-global-settings.json` will automatically download

5. **Import to Breakdance**
   - In WordPress, go to Breakdance → Settings → Global Styles
   - Import the downloaded JSON file
   - Review and adjust the imported styles as needed

## Limitations

### What It Can Extract
- Only visible, rendered styles on the page
- Computed CSS values (actual applied styles)
- Static design elements

### What It Cannot Extract
- Styles from iframes or external embedded content
- Dynamic styles that change on user interaction (beyond initial page load)
- Styles from JavaScript-generated content that hasn't loaded yet
- Custom CSS variables or SCSS/SASS variables
- Animation keyframes or complex transitions
- Gradient definitions (basic gradients array is included but empty)

### Known Issues
- **Font Detection**: Extension uses `gfont-` prefix for all fonts, assuming Google Fonts. You may need to manually adjust font names if the site uses custom or Adobe fonts
- **Color Priority**: Colors are extracted in order of appearance, which may not always match semantic meaning (brand, text, etc.)
- **Button Detection**: Looks for common button selectors. Unusual button implementations might not be detected
- **Empty Headings**: If a page lacks certain heading levels (H4, H5, H6), fallback styles will be used

## Technical Details

### Unit Conversion
The extension converts all font sizes to rem units based on the root font size (typically 16px). Conversion handles:
- Pixels (px) → rem
- Ems (em) → rem
- Percentages (%) → rem
- Points (pt) → rem
- Already-rem values → normalized rem

### Color Extraction
Colors are converted from RGB/RGBA to 8-digit hex format (RRGGBBAA) for Breakdance compatibility.

### Element Detection
The extension searches for typography using:
- Standard HTML heading tags (H1-H6)
- Body element for base styles
- Common button selectors: `button`, `.button`, `.btn`, `a.cta`, `[class*="button"]`

## File Structure

```
breakdance-extractor/
├── manifest.json       # Extension configuration
├── popup.html         # Extension UI
├── popup.js           # Main extraction logic
├── icon16.png         # 16x16 icon
├── icon48.png         # 48x48 icon
├── icon128.png        # 128x128 icon
└── README.md          # This file
```

## Output Format

The extension generates a JSON file with this structure:

```json
{
  "settings": {
    "colors": {
      "brand": "#5D4396FF",
      "text": "#4E4A58FF",
      "headings": "#121212FF",
      "links": "#2E78DAFF",
      "background": "#FFFFFFFF",
      "palette": {
        "colors": [...],
        "gradients": []
      }
    },
    "buttons": {
      "primary": {...},
      "secondary": {...}
    },
    "typography": {
      "heading_font": "gfont-opensans",
      "body_font": "gfont-roboto",
      "base_size": {...},
      "advanced": {...}
    }
  }
}
```

## Troubleshooting

**Extension won't load**
- Make sure all files are in the same directory
- Check that icon files exist and are named correctly
- Verify manifest.json has no syntax errors

**Extraction fails**
- Ensure you're on a public website (not chrome:// pages)
- Try refreshing the target page before extracting
- Check browser console for error messages

**Styles look incorrect**
- Some sites use complex CSS that may not extract perfectly
- Review and manually adjust imported styles in Breakdance
- Try extracting from a simpler page section

**Font names are wrong**
- Manually edit font names in Breakdance after import
- Change `gfont-` prefix if using non-Google fonts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use and modify for your projects.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

**Note**: This extension is not affiliated with or endorsed by Breakdance. It's a community tool to help streamline the workflow of Breakdance users.