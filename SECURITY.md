# Security Guidelines for Women's Mental Health & Wellness Platform

## 🔒 Critical Security Information

### ⚠️ NEVER COMMIT THESE TO VERSION CONTROL:

1. **Database Credentials**
   - MongoDB Atlas connection strings
   - Database usernames and passwords
   - Connection URIs with embedded credentials

2. **Authentication Secrets**
   - JWT secrets and signing keys
   - Session secrets
   - API keys and tokens

3. **Admin Credentials**
   - Admin email addresses
   - Admin passwords
   - Service account credentials

4. **Third-Party API Keys**
   - Google Maps API keys
   - OpenAI API keys
   - Gemini API keys
   - Email service credentials

## 🛡️ Protected Files and Directories

### Environment Files (NEVER COMMIT):
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.development
.env.production
.env.test
```

### Configuration Files (NEVER COMMIT):
```
config/database.json
config/secrets.json
credentials.json
service-account.json
firebase-adminsdk-*.json
api-keys.json
```

### Certificate Files (NEVER COMMIT):
```
*.key
*.pem
*.p12
*.pfx
```

## 📋 Security Checklist

### ✅ Before Deployment:

1. **Environment Variables**
   - [ ] All sensitive data moved to environment variables
   - [ ] .env files added to .gitignore
   - [ ] .env.example created with placeholder values
   - [ ] Production environment variables configured

2. **Database Security**
   - [ ] MongoDB Atlas IP whitelist configured
   - [ ] Strong database passwords used
   - [ ] Database user permissions restricted
   - [ ] Connection strings not in code

3. **Authentication**
   - [ ] Strong JWT secrets (minimum 32 characters)
   - [ ] Secure admin passwords
   - [ ] Password hashing implemented (bcrypt)
   - [ ] Session management secure

4. **API Security**
   - [ ] Rate limiting enabled
   - [ ] CORS properly configured
   - [ ] Input validation implemented
   - [ ] XSS protection enabled

## 🔧 Environment Setup

### 1. Backend Environment (.env):
```bash
# Copy example file
cp .env.example .env

# Edit with your actual credentials
nano .env
```

### 2. Frontend Environment (.env):
```bash
# Copy example file
cp .env.example .env

# Edit with your actual API keys
nano .env
```

## 🚨 Security Incident Response

### If Credentials Are Accidentally Committed:

1. **Immediate Actions:**
   - Change all exposed credentials immediately
   - Rotate JWT secrets
   - Update database passwords
   - Revoke and regenerate API keys

2. **Git History Cleanup:**
   - Remove sensitive data from git history
   - Force push cleaned history
   - Notify team members to re-clone repository

3. **Monitoring:**
   - Monitor for unauthorized access
   - Check database logs
   - Review API usage patterns

## 📞 Security Contacts

- **Security Issues**: Report immediately to development team
- **MongoDB Atlas**: Change credentials in Atlas dashboard
- **API Keys**: Revoke and regenerate in respective service dashboards

## 🔍 Regular Security Audits

### Monthly Checks:
- [ ] Review .gitignore effectiveness
- [ ] Audit environment variables
- [ ] Check for exposed credentials in code
- [ ] Verify database access logs
- [ ] Update dependencies for security patches

### Tools for Security Scanning:
- `git-secrets` - Prevent committing secrets
- `truffleHog` - Find secrets in git history
- `npm audit` - Check for vulnerable dependencies

## 📚 Additional Resources

- [OWASP Security Guidelines](https://owasp.org/)
- [MongoDB Security Checklist](https://docs.mongodb.com/manual/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Remember: Security is everyone's responsibility. When in doubt, ask the team!**
