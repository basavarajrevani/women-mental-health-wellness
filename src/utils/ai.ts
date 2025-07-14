import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIResponse } from '../types/chat';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Initialize chat with context
const systemPrompt = `You are an empathetic mental health support assistant. Your responses should:
1. Be specific to the user's question or concern
2. Show understanding of mental health topics
3. Provide practical, actionable advice when appropriate
4. Recognize signs that require professional help
5. Never diagnose but offer supportive guidance
6. Be clear and direct in your responses
7. Maintain a warm, supportive tone

Common topics you should be knowledgeable about:
- Anxiety and stress management
- Depression and mood
- Work-life balance
- Relationship issues
- Self-care practices
- Mindfulness and meditation
- Sleep hygiene
- Emotional regulation
- Trauma support
- Crisis resources

If you detect any of these serious concerns, suggest professional help:
- Suicidal thoughts
- Self-harm
- Severe depression
- Panic attacks
- Trauma responses
- Eating disorders
- Substance abuse
- Domestic violence

Remember: Each response should be tailored to the specific question asked.`;

export async function getAIResponse(message: string, chatHistory: { role: string; parts: string }[] = []): Promise<AIResponse> {
  try {
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: systemPrompt
        },
        {
          role: "model",
          parts: "I understand my role and will provide specific, relevant responses to each user question while maintaining appropriate boundaries and suggesting professional help when needed."
        },
        ...chatHistory
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
        topK: 40,
        topP: 0.95,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const content = response.text();

    // Enhanced professional help detection
    const seriousKeywords = [
      "suicide", "self-harm", "crisis", "emergency", "severe",
      "trauma", "abuse", "violence", "panic", "hopeless",
      "professional", "therapist", "counselor", "psychiatrist",
      "medication", "treatment", "diagnosis"
    ];

    const suggestProfessional = seriousKeywords.some(keyword => 
      message.toLowerCase().includes(keyword) || content.toLowerCase().includes(keyword)
    );

    // Add some specific response validation
    if (content.length < 20) {
      throw new Error("Response too short");
    }

    if (content.includes("I apologize") && content.length < 50) {
      throw new Error("Generic apology response");
    }

    return {
      content,
      suggestProfessional
    };
  } catch (error) {
    console.error('Error getting AI response:', error);
    
    // Provide more specific error messages
    let errorMessage = "I apologize, but I'm experiencing technical difficulties. Please try again later.";
    
    if (error instanceof Error) {
      if (error.message.includes("Response too short")) {
        errorMessage = "I need more context to provide a helpful response. Could you please provide more details about your situation?";
      } else if (error.message.includes("Generic apology")) {
        errorMessage = "I want to make sure I provide a meaningful response. Could you rephrase your question?";
      }
    }

    return {
      content: errorMessage,
      suggestProfessional: false
    };
  }
}
