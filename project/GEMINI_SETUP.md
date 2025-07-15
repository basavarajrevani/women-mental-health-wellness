# 🤖 Gemini AI Chat Setup Guide

## Quick Setup Instructions

### 1. Get Your Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the Environment
1. Open the `.env` file in the project root
2. Replace the line:
   ```
   # VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   with:
   ```
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Save the file

### 3. Restart the Development Server
```bash
npm run dev
```

## ✅ Features Enabled

- **Real-time AI responses** powered by Google Gemini Pro
- **Mental health specialized prompts** for appropriate responses
- **Crisis detection** with immediate alert system
- **Professional help suggestions** when appropriate
- **Conversation context** maintained throughout the chat
- **Error handling** with fallback messages

## 🔒 Security Notes

- Your API key is stored locally in the `.env` file
- Never commit your `.env` file to version control
- The API key is only used client-side for this demo
- For production, consider using a backend proxy for API calls

## 🆘 Crisis Support

The chat automatically detects crisis keywords and provides immediate resources:
- National Suicide Prevention Lifeline: 988
- Crisis Text Line: Text HOME to 741741
- Emergency Services: 911

## 💡 Usage Tips

1. **Natural conversation**: The AI understands context and maintains conversation flow
2. **Specific questions**: Ask specific mental health questions for better responses
3. **Professional guidance**: The AI will suggest professional help when appropriate
4. **Emergency support**: Crisis keywords trigger immediate resource alerts

## 🔧 Troubleshooting

**Chat not responding?**
- Check if your API key is correctly set in `.env`
- Ensure you've restarted the development server
- Check browser console for any errors

**API quota exceeded?**
- Gemini has generous free tier limits
- Check your usage at [Google AI Studio](https://makersuite.google.com/)

**Need help?**
- The chat falls back to helpful error messages if API fails
- Emergency resources are always available regardless of API status
