# 🔒 Security Setup Guide

## ⚠️ CRITICAL: Before Uploading to GitHub

**NEVER commit the following files to version control:**
- `.env` files (all environments)
- Any files containing real credentials
- Database connection strings
- API keys or secrets

## 🛡️ Security Checklist

### ✅ Files Already Protected by .gitignore:
- [x] `.env` files (backend and frontend)
- [x] `node_modules/`
- [x] Database files
- [x] Log files
- [x] Temporary files
- [x] API keys and credentials

### 🔧 Setup Instructions

#### 1. Backend Environment Setup
1. Copy `.env.example` to `.env` in the backend folder:
   ```bash
   cd WMH/backend
   cp .env.example .env
   ```

2. Edit `.env` and replace placeholders with your actual values:
   ```bash
   # Replace these with your actual credentials:
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DATABASE
   JWT_SECRET=your_super_secure_jwt_secret_minimum_32_characters
   ADMIN_EMAIL=your_admin_email@example.com
   ADMIN_PASSWORD=your_secure_admin_password
   ```

#### 2. Frontend Environment Setup
1. Copy `.env.example` to `.env` in the project folder:
   ```bash
   cd WMH/project
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys (if needed):
   ```bash
   # Only add if you're using AI features:
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key
   VITE_OPENAI_API_KEY=your_actual_openai_api_key
   ```

### 🔐 Generate Secure Credentials

#### JWT Secret Generation
Use one of these methods to generate a secure JWT secret:

**Method 1: Node.js**
```javascript
require('crypto').randomBytes(64).toString('hex')
```

**Method 2: OpenSSL**
```bash
openssl rand -hex 64
```

**Method 3: Online Generator**
Visit: https://www.allkeysgenerator.com/Random/Security-Encryption-Key-Generator.aspx

#### MongoDB Atlas Setup
1. Create account at https://cloud.mongodb.com/
2. Create a new cluster
3. Create a database user
4. Get connection string
5. Replace placeholders in `.env`

### 🚨 Security Warnings

#### NEVER Commit These:
- Real database passwords
- JWT secrets
- Admin credentials
- API keys
- SSL certificates
- User uploaded files

#### Safe to Commit:
- `.env.example` files (with placeholders)
- Source code (without credentials)
- Documentation
- Configuration files (without secrets)

### 🔍 Pre-Commit Security Check

Before committing to GitHub, run this check:

```bash
# Check for potential secrets in staged files
git diff --cached | grep -E "(password|secret|key|token|api)" -i

# Ensure .env files are not staged
git status | grep ".env"
```

If any `.env` files appear in `git status`, run:
```bash
git reset HEAD .env
git reset HEAD backend/.env
git reset HEAD project/.env
```

### 🛠️ Additional Security Measures

#### 1. Environment-Specific Configurations
- Development: Use `.env.development`
- Production: Use `.env.production`
- Testing: Use `.env.test`

#### 2. Secret Management (Production)
Consider using:
- AWS Secrets Manager
- Azure Key Vault
- Google Secret Manager
- HashiCorp Vault

#### 3. Database Security
- Use strong passwords
- Enable IP whitelisting
- Use SSL/TLS connections
- Regular backups

### 📋 Deployment Checklist

#### Before Deploying:
- [ ] All `.env` files are in `.gitignore`
- [ ] No hardcoded credentials in source code
- [ ] Strong JWT secret generated
- [ ] Database credentials secured
- [ ] API keys properly configured
- [ ] CORS settings configured for production
- [ ] Rate limiting enabled
- [ ] SSL/HTTPS enabled

### 🆘 If Credentials Are Accidentally Committed

#### Immediate Actions:
1. **Change all exposed credentials immediately**
2. **Revoke API keys**
3. **Generate new JWT secrets**
4. **Update database passwords**
5. **Remove from Git history:**
   ```bash
   git filter-branch --force --index-filter \
   'git rm --cached --ignore-unmatch .env' \
   --prune-empty --tag-name-filter cat -- --all
   ```

### 📞 Security Contact

If you discover security vulnerabilities:
1. Do NOT create public GitHub issues
2. Contact the development team privately
3. Allow time for fixes before disclosure

---

## 🎯 Quick Start (Secure)

1. Clone repository
2. Copy `.env.example` to `.env` in both folders
3. Replace placeholders with your credentials
4. Never commit `.env` files
5. Deploy securely

**Remember: Security is everyone's responsibility!** 🔒
