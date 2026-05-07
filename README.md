# StraftatFX

StraftatFX v3 is a lightweight browser-based text generator for creating gradient usernames, tags, and chat text for Straftat. It gives you a live visual preview, the exact formatted output string, and local tools for saving palettes and reusable clipboard entries.

## Current Features

- One to four color gradients with live draggable color stops
- Smooth per-letter gradients, stepped modes, single-color mode, and custom step count
- Preset palette browser with built-in presets, favorites, and user-created gradients
- Recent gradient swatches for quick restores
- Color temperature control for cooler, mixed, or warmer random colors
- Random color shuffle and color swap controls
- Verbal Arsenal drawer with categorized quick phrases and random refresh
- Advanced text effects with style toggles, small-caps/uppercase, alignment, spacing, and layout controls
- Gradient Controls with resettable intensity modes and color temperature
- Real-time visual preview and formatted output preview
- Manual copy, optional auto copy, and saved clipboard entries
- Remove mode for cleaning up saved clipboard items and user-created gradients
- Lightweight feedback link to a Google Form
- Output character counter, Steam-length indicator, and 500-character app limit warning
- Dark and light theme buttons
- Integrated in-app guide and header logo easter egg

## Usage

1. Type text in the main input, or open Verbal Arsenal and choose a quick phrase.
2. Choose a color count. Higher color counts unlock only when the visible text is long enough.
3. Adjust the gradient handles, shuffle colors, swap colors, or open the preset palette browser.
4. Open Advanced Controls for Text Effects or Gradient Controls.
5. Use Text Effects for style toggles, case, alignment, letter spacing, fixed width, position, width, rotation, and vertical offset.
6. Use Gradient Controls for intensity modes, custom steps, temperature, or reset the gradient controls to defaults.
7. Copy the generated output, enable Auto Copy, save the palette, or save the output to the in-app clipboard.

## Interface Notes

- The large preview shows the visual result.
- The output preview shows the generated formatting string in a readable form.
- The copied text removes internal closing tags that Straftat does not need.
- The total counter reflects the final formatted output length.
- The Steam indicator warns around 32 characters.
- Browser storage keeps saved gradients, favorites, recent gradients, clipboard items, and UI preferences.
- The Feedback link opens a Google Form in a new tab.

## Tech Stack

- HTML
- CSS
- JavaScript ES modules
- localStorage for persistence
- Pickr for color picking
- Font Awesome icons

## Project Structure

- `index.html` - App markup and control layout
- `styles/styles.css` - Responsive dark glass/light theme styling
- `js/main.mjs` - App initialization, UI logic, presets, effects, and event handling
- `js/gradientEngine.mjs` - Core gradient generation
- `js/gradient.mjs` - Color math and interpolation helpers
- `js/render.mjs` - Formatted output rendering and visual preview
- `js/formatter.mjs` - Text effect tag generation and value clamping
- `js/saved.mjs` - Saved clipboard rendering
- `js/storage.mjs` - localStorage helpers
- `js/state.mjs` - Shared state
- `js/guide.mjs` - In-app guide modal and live example
- `js/floating.mjs` - Floating background assets
- `js/logoAudio.mjs` - Header logo audio easter egg
- `gradients.json` - Preset gradient catalog

## Usage Notice

The name "StraftatFX" may not be used for redistributed versions without permission.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.
