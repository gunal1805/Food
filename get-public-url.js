#!/usr/bin/env node

/**
 * GGS Food Services - Public URL Generator
 * Uses ngrok to create instant public URL for mobile testing
 */

const { execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 GGS Food Services - Opening Public URLs...\n');
console.log('═'.repeat(60));

// Check if ngrok is installed
try {
    execSync('ngrok --version', { stdio: 'ignore' });
    console.log('✅ ngrok is installed');
} catch {
    console.log('❌ ngrok not found. Installing globally...');
    execSync('npm install -g ngrok');
    console.log('✅ ngrok installed!');
}

console.log('');
console.log('📱 PUBLIC URL FOR MOBILE:');
console.log('═'.repeat(60));
console.log('');
console.log('Local URL: http://localhost:5000');
console.log('');
console.log('To get a PUBLIC URL for mobile:');
console.log('');
console.log('Option 1: Use this command in PowerShell:');
console.log('');
console.log('  ngrok http 5000');
console.log('');
console.log('Then open the "Forwarding" URL in your phone browser!');
console.log('');
console.log('━'.repeat(60));
console.log('');
console.log('Option 2: Use Railway (Permanent URL):');
console.log('');
console.log('1. Go to: https://railway.app/');
console.log('2. Click "Start Project"');
console.log('3. Select "Deploy from GitHub"');
console.log('4. Connect GitHub or create account');
console.log('5. Push code and Railway auto-deploys!');
console.log('');
console.log('━'.repeat(60));
console.log('');
console.log('Your website is ready! 🎉');
console.log('');
