# 🔒 Security Guidelines

## Environment Variables Setup

### 🚨 IMPORTANT: Never commit real API keys to version control!

### Setup Instructions

1. **Copy the environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Add your real API keys to `.env`:**
   ```bash
   # Edit .env file with your actual keys
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   VITE_OPENAI_API_KEY=your_actual_openai_api_key_here
   ```

3. **The `.env` file is automatically ignored by Git** - it will never be committed.

### Getting API Keys

#### Google Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and add it to your `.env` file

#### OpenAI API Key (Optional)
1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key and add it to your `.env` file

### Security Best Practices

#### ✅ DO:
- Use `.env.example` as a template
- Keep real API keys in `.env` (which is gitignored)
- Use environment variables for all sensitive data
- Regularly rotate your API keys
- Use different keys for development and production

#### ❌ DON'T:
- Commit `.env` files to version control
- Share API keys in chat, email, or documentation
- Use production keys in development
- Hardcode API keys in source code
- Push sensitive data to public repositories

### File Security

The following files and patterns are automatically ignored:

```
# Environment files
.env*

# API Keys and credentials
*.key
*.pem
credentials.json
service-account.json

# Database files
*.db
*.sqlite

# Temporary files
.cache/
.temp/
*.tmp
```

### Emergency Response

If you accidentally commit sensitive data:

1. **Immediately revoke the exposed API key**
2. **Generate a new API key**
3. **Update your `.env` file with the new key**
4. **Contact the repository administrator**

### Deployment Security

For production deployment:

1. **Use platform environment variables** (Netlify, Vercel, etc.)
2. **Never use development keys in production**
3. **Enable API key restrictions** (domain/IP restrictions)
4. **Monitor API key usage** for unusual activity

### Contact

For security concerns, contact the repository maintainer immediately.
