// Free AI Chat Support Service using Hugging Face Inference API
// Uses free tier - no API key required for basic models

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface ChatResponse {
  message: string;
  confidence: number;
  suggestions?: string[];
  resources?: string[];
  isEmergency?: boolean;
}

// Free Hugging Face API endpoint
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

class ChatSupportAPI {
  private conversationHistory: ChatMessage[] = [];
  private emergencyKeywords = [
    'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm',
    'want to die', 'no point', 'hopeless', 'can\'t go on', 'give up',
    'overdose', 'cutting', 'hanging', 'jumping', 'pills'
  ];

  private mentalHealthResponses = {
    anxiety: [
      "I understand you're feeling anxious. Anxiety is very common and treatable. Try taking slow, deep breaths - in for 4 counts, hold for 4, out for 4.",
      "Anxiety can feel overwhelming, but you're not alone. Grounding techniques can help - try naming 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
      "When anxiety strikes, remember that feelings are temporary. Consider talking to a mental health professional who can provide personalized coping strategies."
    ],
    depression: [
      "I hear that you're struggling with difficult feelings. Depression is a real medical condition, and seeking help is a sign of strength, not weakness.",
      "It's important to know that depression is treatable. Small steps like getting sunlight, gentle exercise, or connecting with a friend can help alongside professional support.",
      "You matter, and your feelings are valid. Consider reaching out to a mental health professional or a trusted person in your life."
    ],
    stress: [
      "Stress is a normal part of life, but chronic stress can impact your wellbeing. Let's explore some healthy coping strategies together.",
      "Managing stress is a skill that can be learned. Regular exercise, adequate sleep, and mindfulness practices can be very effective.",
      "It sounds like you're dealing with a lot right now. Breaking down overwhelming tasks into smaller, manageable steps can help reduce stress."
    ],
    panic: [
      "If you're having a panic attack, remember that it will pass. Focus on your breathing - breathe slowly and deeply.",
      "Panic attacks are frightening but not dangerous. Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      "You're safe right now. Panic attacks typically peak within 10 minutes. Focus on slow, controlled breathing."
    ],
    general: [
      "Thank you for sharing that with me. It takes courage to talk about mental health concerns.",
      "I'm here to listen and provide support. How are you feeling right now?",
      "Mental health is just as important as physical health. What would be most helpful for you today?",
      "Everyone's mental health journey is unique. What kind of support are you looking for?"
    ]
  };

  private resources = {
    crisis: [
      "🆘 National Suicide Prevention Lifeline: 988 (US)",
      "🆘 Crisis Text Line: Text HOME to 741741",
      "🆘 International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/",
      "🆘 If you're in immediate danger, please call emergency services (911, 999, 112)"
    ],
    therapy: [
      "💬 BetterHelp: Online therapy platform",
      "💬 Talkspace: Text-based therapy",
      "💬 Psychology Today: Find local therapists",
      "💬 Open Path Collective: Affordable therapy options"
    ],
    selfHelp: [
      "📱 Headspace: Meditation and mindfulness",
      "📱 Calm: Sleep stories and relaxation",
      "📱 Sanvello: Anxiety and mood tracking",
      "📱 MindShift: CBT-based anxiety management"
    ]
  };

  // Detect if message indicates emergency
  private detectEmergency(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return this.emergencyKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  // Analyze message sentiment and topic
  private analyzeMessage(message: string): { topic: string; sentiment: string; urgency: number } {
    const lowerMessage = message.toLowerCase();
    
    // Topic detection
    let topic = 'general';
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried') || lowerMessage.includes('nervous')) {
      topic = 'anxiety';
    } else if (lowerMessage.includes('depressed') || lowerMessage.includes('depression') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) {
      topic = 'depression';
    } else if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      topic = 'stress';
    } else if (lowerMessage.includes('panic') || lowerMessage.includes('panic attack') || lowerMessage.includes('heart racing')) {
      topic = 'panic';
    }

    // Sentiment analysis (basic)
    const positiveWords = ['good', 'better', 'happy', 'grateful', 'thankful', 'improving'];
    const negativeWords = ['bad', 'worse', 'terrible', 'awful', 'horrible', 'struggling'];
    
    let sentiment = 'neutral';
    if (positiveWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'positive';
    } else if (negativeWords.some(word => lowerMessage.includes(word))) {
      sentiment = 'negative';
    }

    // Urgency level (1-10)
    let urgency = 3; // default
    if (this.detectEmergency(message)) {
      urgency = 10;
    } else if (lowerMessage.includes('urgent') || lowerMessage.includes('emergency') || lowerMessage.includes('crisis')) {
      urgency = 8;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('need support')) {
      urgency = 6;
    }

    return { topic, sentiment, urgency };
  }

  // Generate contextual response
  private generateResponse(message: string, analysis: any): ChatResponse {
    const { topic, sentiment, urgency } = analysis;
    
    // Emergency response
    if (urgency >= 8) {
      return {
        message: "🆘 I'm concerned about your safety. Please reach out for immediate help. You don't have to go through this alone.",
        confidence: 0.95,
        suggestions: [
          "Call emergency services if in immediate danger",
          "Contact a crisis helpline",
          "Reach out to a trusted friend or family member",
          "Go to the nearest emergency room"
        ],
        resources: this.resources.crisis,
        isEmergency: true
      };
    }

    // Get appropriate responses based on topic
    const responses = this.mentalHealthResponses[topic as keyof typeof this.mentalHealthResponses] || this.mentalHealthResponses.general;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Generate suggestions based on topic
    let suggestions: string[] = [];
    let resources: string[] = [];

    switch (topic) {
      case 'anxiety':
        suggestions = [
          "Try deep breathing exercises",
          "Practice grounding techniques",
          "Consider talking to a therapist",
          "Explore mindfulness apps"
        ];
        resources = this.resources.selfHelp;
        break;
      case 'depression':
        suggestions = [
          "Reach out to a mental health professional",
          "Connect with supportive friends or family",
          "Consider therapy or counseling",
          "Explore self-help resources"
        ];
        resources = this.resources.therapy;
        break;
      case 'stress':
        suggestions = [
          "Break tasks into smaller steps",
          "Practice stress management techniques",
          "Ensure adequate sleep and exercise",
          "Consider time management strategies"
        ];
        resources = this.resources.selfHelp;
        break;
      case 'panic':
        suggestions = [
          "Focus on slow, deep breathing",
          "Use grounding techniques",
          "Remember that panic attacks are temporary",
          "Consider learning panic management skills"
        ];
        resources = this.resources.selfHelp;
        break;
      default:
        suggestions = [
          "Share more about how you're feeling",
          "Consider what kind of support would help",
          "Explore available mental health resources",
          "Take care of your basic needs (sleep, food, exercise)"
        ];
        resources = [...this.resources.therapy, ...this.resources.selfHelp];
    }

    return {
      message: randomResponse,
      confidence: 0.8,
      suggestions: suggestions.slice(0, 3), // Limit to 3 suggestions
      resources: resources.slice(0, 3), // Limit to 3 resources
      isEmergency: false
    };
  }

  // Call Hugging Face API
  private async callHuggingFaceAPI(message: string): Promise<string> {
    try {
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: message,
          parameters: {
            max_length: 100,
            temperature: 0.7,
            do_sample: true,
            pad_token_id: 50256
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Extract generated text
      if (data.generated_text) {
        return data.generated_text.replace(message, '').trim();
      } else if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.replace(message, '').trim();
      }

      throw new Error('No generated text in response');

    } catch (error) {
      console.log('Hugging Face API unavailable, using local responses');
      throw error;
    }
  }

  // Enhanced response generation with API integration
  private async generateEnhancedResponse(message: string, analysis: any): Promise<ChatResponse> {
    const { topic, sentiment, urgency } = analysis;

    // Emergency response - always use local for safety
    if (urgency >= 8) {
      return {
        message: "🆘 I'm very concerned about your safety. Please reach out for immediate help. You don't have to go through this alone. Your life has value and meaning.",
        confidence: 0.95,
        suggestions: [
          "Call emergency services if in immediate danger",
          "Contact National Suicide Prevention Lifeline: 988",
          "Reach out to a trusted friend or family member",
          "Go to the nearest emergency room"
        ],
        resources: this.resources.crisis,
        isEmergency: true
      };
    }

    // Try to get AI response first, fallback to local
    let aiResponse = '';
    try {
      // Create a mental health context for the AI
      const contextualMessage = `As a mental health support assistant, please respond compassionately to: "${message}"`;
      aiResponse = await this.callHuggingFaceAPI(contextualMessage);

      // Validate AI response is appropriate
      if (aiResponse && aiResponse.length > 10 && !this.containsInappropriateContent(aiResponse)) {
        // Enhance AI response with suggestions and resources
        return {
          message: aiResponse,
          confidence: 0.85,
          suggestions: this.getSuggestionsForTopic(topic),
          resources: this.getResourcesForTopic(topic),
          isEmergency: false
        };
      }
    } catch (error) {
      console.log('Using local response due to API error:', error);
    }

    // Fallback to local response
    return this.generateResponse(message, analysis);
  }

  // Check for inappropriate content
  private containsInappropriateContent(text: string): boolean {
    const inappropriatePatterns = [
      /harmful/i, /dangerous/i, /illegal/i, /violence/i, /drug/i, /suicide.*method/i
    ];
    return inappropriatePatterns.some(pattern => pattern.test(text));
  }

  // Get suggestions based on topic
  private getSuggestionsForTopic(topic: string): string[] {
    const suggestions: { [key: string]: string[] } = {
      anxiety: [
        "Try deep breathing exercises (4-4-4 breathing)",
        "Practice grounding techniques",
        "Consider talking to a therapist",
        "Explore mindfulness meditation"
      ],
      depression: [
        "Reach out to a mental health professional",
        "Connect with supportive friends or family",
        "Consider therapy or counseling",
        "Try gentle physical activity"
      ],
      stress: [
        "Break overwhelming tasks into smaller steps",
        "Practice stress management techniques",
        "Ensure adequate sleep and exercise",
        "Consider time management strategies"
      ],
      panic: [
        "Focus on slow, deep breathing",
        "Use the 5-4-3-2-1 grounding technique",
        "Remember that panic attacks are temporary",
        "Find a safe, quiet space"
      ],
      general: [
        "Share more about how you're feeling",
        "Consider what kind of support would help",
        "Take care of your basic needs",
        "Reach out to someone you trust"
      ]
    };
    return suggestions[topic] || suggestions.general;
  }

  // Get resources based on topic
  private getResourcesForTopic(topic: string): string[] {
    switch (topic) {
      case 'anxiety':
      case 'panic':
        return this.resources.selfHelp;
      case 'depression':
        return this.resources.therapy;
      case 'stress':
        return this.resources.selfHelp;
      default:
        return [...this.resources.therapy.slice(0, 2), ...this.resources.selfHelp.slice(0, 2)];
    }
  }

  // Main chat function
  async sendMessage(userMessage: string): Promise<ChatResponse> {
    try {
      // Add user message to history
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString()
      });

      // Analyze the message
      const analysis = this.analyzeMessage(userMessage);

      // Generate enhanced response with AI
      const response = await this.generateEnhancedResponse(userMessage, analysis);

      // Add AI response to history
      this.conversationHistory.push({
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString()
      });

      // Simulate thinking time for better UX
      await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

      return response;

    } catch (error) {
      console.error('Chat API Error:', error);
      return {
        message: "I'm sorry, I'm having trouble responding right now. Please try again, or if this is an emergency, please contact emergency services or a crisis helpline immediately.",
        confidence: 0.5,
        suggestions: ["Try sending your message again", "Contact emergency services if urgent"],
        resources: this.resources.crisis
      };
    }
  }

  // Get conversation history
  getHistory(): ChatMessage[] {
    return this.conversationHistory;
  }

  // Clear conversation
  clearHistory(): void {
    this.conversationHistory = [];
  }

  // Get mental health resources
  getResources(category?: 'crisis' | 'therapy' | 'selfHelp'): string[] {
    if (category) {
      return this.resources[category];
    }
    return [...this.resources.crisis, ...this.resources.therapy, ...this.resources.selfHelp];
  }
}

// Export singleton instance
export const chatSupportAPI = new ChatSupportAPI();
export default chatSupportAPI;
