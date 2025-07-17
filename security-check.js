#!/usr/bin/env node

/**
 * Security Check Script
 * Run this before committing to GitHub to ensure no sensitive data is exposed
 */

const fs = require('fs');
const path = require('path');

console.log('🔒 Running Security Check...\n');

// Files that should NOT exist in the repository
const sensitiveFiles = [
  '.env',
  'backend/.env',
  'project/.env',
  '.env.local',
  '.env.development.local',
  '.env.production.local',
  'config/secrets.json',
  'credentials.json',
  'api-keys.json'
];

// Patterns that should NOT appear in committed files
const sensitivePatterns = [
  /mongodb\+srv:\/\/[^:]+:[^@]+@/i,  // MongoDB connection strings
  /jwt_secret\s*=\s*[a-zA-Z0-9]{20,}/i, // JWT secrets
  /password\s*=\s*['"][^'"]{6,}['"]/i,  // Hardcoded passwords in quotes
  /api_key\s*=\s*[a-zA-Z0-9]{20,}/i,   // API keys
  /bassuprojects/i,                   // Specific username
  /KQBHjk5Ni2sllE4p/i,               // Specific password
  /basavarajrevani123@gmail\.com/i,   // Specific email
  /Basu@15032002/i                    // Specific password
];

let hasIssues = false;

// Check for sensitive files
console.log('📁 Checking for sensitive files...');
sensitiveFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`❌ FOUND SENSITIVE FILE: ${file}`);
    hasIssues = true;
  }
});

// Check for sensitive patterns in source files
console.log('\n🔍 Scanning source files for sensitive patterns...');

function scanDirectory(dir, extensions = ['.js', '.ts', '.tsx', '.json', '.md']) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(filePath, extensions);
    } else if (stat.isFile() && extensions.some(ext => file.endsWith(ext))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        
        sensitivePatterns.forEach((pattern, index) => {
          if (pattern.test(content)) {
            console.log(`❌ SENSITIVE PATTERN FOUND in ${filePath}`);
            console.log(`   Pattern ${index + 1}: ${pattern}`);
            hasIssues = true;
          }
        });
      } catch (error) {
        // Skip files that can't be read
      }
    }
  });
}

// Scan project directories
const dirsToScan = ['backend/src', 'project/src'];
dirsToScan.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    scanDirectory(fullPath);
  }
});

// Check .gitignore files
console.log('\n📋 Checking .gitignore files...');
const gitignoreFiles = ['.gitignore', 'backend/.gitignore', 'project/.gitignore'];

gitignoreFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('.env')) {
      console.log(`❌ .env not found in ${file}`);
      hasIssues = true;
    } else {
      console.log(`✅ ${file} properly configured`);
    }
  }
});

// Check for .env.example files
console.log('\n📄 Checking for .env.example files...');
const exampleFiles = ['backend/.env.example', 'project/.env.example'];

exampleFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if example file contains real credentials (not placeholders)
    const realCredentialPatterns = [
      /bassuprojects/i,                   // Specific username
      /KQBHjk5Ni2sllE4p/i,               // Specific password
      /basavarajrevani123@gmail\.com/i,   // Specific email
      /Basu@15032002/i                    // Specific password
    ];

    realCredentialPatterns.forEach((pattern, index) => {
      if (pattern.test(content)) {
        console.log(`❌ REAL CREDENTIALS in ${file}`);
        hasIssues = true;
      }
    });
    
    if (!hasIssues) {
      console.log(`✅ ${file} is secure`);
    }
  } else {
    console.log(`⚠️  Missing ${file}`);
  }
});

// Final result
console.log('\n' + '='.repeat(50));
if (hasIssues) {
  console.log('❌ SECURITY CHECK FAILED!');
  console.log('\n🚨 CRITICAL: Do NOT upload to GitHub until these issues are fixed!');
  console.log('\n📋 Action Items:');
  console.log('1. Remove or secure all sensitive files');
  console.log('2. Replace hardcoded credentials with environment variables');
  console.log('3. Ensure all .env files are in .gitignore');
  console.log('4. Use .env.example files with placeholders only');
  console.log('5. Review SECURITY_SETUP.md for complete instructions');
  process.exit(1);
} else {
  console.log('✅ SECURITY CHECK PASSED!');
  console.log('\n🎉 Safe to upload to GitHub');
  console.log('\n📋 Final Checklist:');
  console.log('✅ No sensitive files found');
  console.log('✅ No hardcoded credentials detected');
  console.log('✅ .gitignore files properly configured');
  console.log('✅ .env.example files are secure');
  console.log('\n🚀 Ready for GitHub upload!');
}

console.log('\n📚 For setup instructions, see: SECURITY_SETUP.md');
console.log('='.repeat(50));
