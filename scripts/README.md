Run the bottom-sheet accessibility test locally.

Prerequisites:
- Node.js (v14+)
- `npm install jsdom` in the repo root (one-time)

Commands:

```bash
cd /Users/fadil369/nphies-ai-healthcare-platform
npm install jsdom
node scripts/test-bottom-sheet.js
```

The script loads `static/profile.html`, mounts the `BottomSheet`, simulates a Tab and Escape key, and prints results.
