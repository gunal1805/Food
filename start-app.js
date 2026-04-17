#!/usr/bin/env node

/**
 * GGS Food Services - Auto Startup Script
 * Installs dependencies and starts the server automatically
 * Opens the browser with the landing page
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const open = require('open');

const backendDir = path.join(__dirname, 'backend');
const packageJsonPath = path.join(backendDir, 'package.json');

console.log('🚀 GGS Food Services - Starting Application...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(backendDir, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 Installing dependencies... (This may take a moment)\n');
    
    const npm = spawn('npm', ['install'], {
        cwd: backendDir,
        stdio: 'inherit',
        shell: true
    });

    npm.on('close', (code) => {
        if (code === 0) {
            console.log('\n✅ Dependencies installed successfully\n');
            startServer();
        } else {
            console.error('\n❌ Failed to install dependencies\n');
            process.exit(1);
        }
    });
} else {
    startServer();
}

function startServer() {
    console.log('🔧 Starting GGS Food Services Backend Server...\n');
    
    const server = spawn('npm', ['start'], {
        cwd: backendDir,
        stdio: 'inherit',
        shell: true
    });

    server.on('close', (code) => {
        console.log('\n⏹️  Server stopped\n');
        process.exit(code);
    });

    // Give server 2 seconds to start, then open browser
    setTimeout(() => {
        const landingPage = path.join(__dirname, 'ggs-landing.html');
        const fileUrl = `file://${landingPage}`;
        
        console.log('\n🌐 Opening GGS Food Services in browser...\n');
        open(fileUrl).catch(() => {
            console.log('📌 Please open in browser: ' + fileUrl);
        });
    }, 2000);
}
