
const fs = require('fs');
const path = require('path');

// Read the current package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Add or update the scripts for Electron
packageJson.scripts = {
  ...packageJson.scripts,
  "dev": "vite",
  "build": "tsc && vite build",
  "electron:dev": "concurrently \"cross-env ELECTRON_START_URL=http://localhost:8080 vite\" \"wait-on http://localhost:8080 && electron electron/main.js\"",
  "electron:build": "npm run build && electron-builder build --config electron-builder.json",
  "electron:build:win": "npm run build && electron-builder build --win --config electron-builder.json",
  "electron:build:mac": "npm run build && electron-builder build --mac --config electron-builder.json",
  "electron:build:linux": "npm run build && electron-builder build --linux --config electron-builder.json"
};

// Add or update the main entry point for Electron
packageJson.main = "electron/main.js";

// Write the updated package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('package.json updated for Electron');
