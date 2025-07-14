interface Question {
  id: number;
  text: string;
  followUp?: Question[];
  answer?: string;
}

export const mentalHealthTopics: Question[] = [
  {
    id: 1,
    text: "Anxiety and Stress Management",
    followUp: [
      {
        id: 101,
        text: "Let's understand your anxiety better. Please answer all these questions (use comma-separated numbers):",
        followUp: [
          {
            id: 1001,
            text: "1. When do you typically experience anxiety?\n1) Morning\n2) Afternoon\n3) Evening\n4) Night\n5) Throughout the day",
            followUp: []
          },
          {
            id: 1002,
            text: "2. What physical symptoms do you experience?\n1) Rapid heartbeat\n2) Sweating\n3) Shortness of breath\n4) Trembling\n5) Multiple symptoms",
            followUp: []
          },
          {
            id: 1003,
            text: "3. What triggers your anxiety most?\n1) Work/School\n2) Social situations\n3) Specific fears\n4) Health concerns\n5) Uncertainty",
            followUp: []
          },
          {
            id: 1004,
            text: "4. How do you currently cope?\n1) Deep breathing\n2) Exercise\n3) Meditation\n4) Medication\n5) No specific method",
            followUp: []
          }
        ]
      },
      {
        id: 102,
        text: "Now, let's explore the impact. Answer all questions:",
        followUp: [
          {
            id: 2001,
            text: "1. How does anxiety affect your sleep?\n1) No effect\n2) Trouble falling asleep\n3) Waking up frequently\n4) Early morning awakening\n5) Severe insomnia",
            followUp: []
          },
          {
            id: 2002,
            text: "2. Impact on daily activities?\n1) Minimal\n2) Some tasks affected\n3) Regular disruption\n4) Major impact\n5) Unable to function",
            followUp: []
          },
          {
            id: 2003,
            text: "3. Effect on relationships?\n1) No effect\n2) Minor strain\n3) Moderate issues\n4) Significant problems\n5) Severe isolation",
            followUp: []
          },
          {
            id: 2004,
            text: "4. Work/School performance impact?\n1) No impact\n2) Slight decrease\n3) Noticeable decline\n4) Significant issues\n5) Unable to work/study",
            followUp: []
          }
        ]
      },
      {
        id: 103,
        text: "Let's discuss treatment and support. Answer all questions:",
        followUp: [
          {
            id: 3001,
            text: "1. Have you tried professional help?\n1) Never considered\n2) Considering it\n3) Had few sessions\n4) Regular therapy\n5) Multiple treatments",
            followUp: []
          },
          {
            id: 3002,
            text: "2. Support system availability?\n1) Strong support\n2) Some support\n3) Limited support\n4) Very little support\n5) No support",
            followUp: []
          },
          {
            id: 3003,
            text: "3. Interest in self-help methods?\n1) Very interested\n2) Somewhat interested\n3) Neutral\n4) Slightly interested\n5) Not interested",
            followUp: []
          },
          {
            id: 3004,
            text: "4. Preferred type of support?\n1) Individual therapy\n2) Group therapy\n3) Medication\n4) Alternative methods\n5) Combination approach",
            followUp: []
          }
        ]
      },
      {
        id: 104,
        text: "Final assessment questions:",
        followUp: [
          {
            id: 4001,
            text: "1. Overall anxiety severity?\n1) Mild\n2) Moderate\n3) Severe\n4) Very severe\n5) Crisis level",
            answer: `Based on your responses, here's a comprehensive anxiety management plan:

1. Immediate Relief Strategies:
   - Practice 4-7-8 breathing technique
   - Use grounding exercises (5-4-3-2-1 method)
   - Progressive muscle relaxation
   - Mindfulness meditation
   - Emergency contact list

2. Daily Management Plan:
   - Morning routine with meditation
   - Regular exercise schedule
   - Stress tracking journal
   - Healthy sleep hygiene
   - Balanced nutrition plan

3. Professional Support:
   - Individual therapy options
   - Support group recommendations
   - Medication evaluation if needed
   - Regular check-ins with healthcare provider
   - Crisis hotline information

4. Lifestyle Modifications:
   - Work/life balance adjustments
   - Social support building
   - Stress-reducing hobbies
   - Environmental modifications
   - Time management techniques

5. Long-term Strategies:
   - Cognitive Behavioral Therapy (CBT)
   - Exposure therapy if needed
   - Regular exercise routine
   - Mindfulness practice
   - Support network development

Would you like to:
1. Get more details about any of these strategies
2. Connect with a professional
3. Explore other topics
4. Share more about your experience`
          },
          {
            id: 4002,
            text: "2. Readiness for change?\n1) Very ready\n2) Somewhat ready\n3) Unsure\n4) Slightly hesitant\n5) Not ready",
            followUp: []
          },
          {
            id: 4003,
            text: "3. Preferred communication style?\n1) Direct and practical\n2) Supportive and emotional\n3) Educational\n4) Mix of approaches\n5) Minimal intervention",
            followUp: []
          },
          {
            id: 4004,
            text: "4. Goals for anxiety management?\n1) Complete resolution\n2) Better coping skills\n3) Specific situation handling\n4) Crisis prevention\n5) Understanding triggers",
            followUp: []
          }
        ]
      }
    ]
  },
  {
    id: 2,
    text: "Depression and Mood",
    followUp: [
      {
        id: 201,
        text: "How long have you been experiencing mood changes?",
        followUp: [
          {
            id: 2001,
            text: "What activities have you lost interest in?",
            followUp: [
              {
                id: 20001,
                text: "How has your sleep pattern changed?",
                followUp: [
                  {
                    id: 200001,
                    text: "Have you noticed changes in your appetite or weight?",
                    followUp: [
                      {
                        id: 2000001,
                        text: "Are you having difficulty concentrating or making decisions?",
                        answer: `Based on your responses about depression symptoms, here's a comprehensive support plan:

1. Immediate Support Strategies:
   - Create a daily routine with small, achievable goals
   - Schedule one enjoyable activity each day
   - Practice self-compassion exercises
   - Maintain basic self-care (hygiene, meals, sleep)

2. Lifestyle Interventions:
   - Regular physical activity (start with 10-minute walks)
   - Light therapy, especially during darker months
   - Balanced nutrition with mood-supporting foods
   - Consistent sleep schedule

3. Social Connection Plan:
   - Schedule regular check-ins with loved ones
   - Join depression support groups
   - Consider peer counseling
   - Share feelings with trusted friends/family

4. Professional Support:
   - Consider psychotherapy (CBT, IPT)
   - Regular mental health check-ups
   - Medication evaluation if recommended
   - Support group participation

5. Coping Techniques:
   - Journaling for emotional release
   - Art or music therapy
   - Mindfulness practices
   - Positive affirmations

Remember: Depression is treatable, and seeking help is a sign of strength. Professional support is crucial for recovery.`
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 3,
    text: "Sleep and Rest",
    followUp: [
      {
        id: 301,
        text: "How many hours of sleep do you typically get?",
        followUp: [
          {
            id: 3001,
            text: "Do you have trouble falling asleep or staying asleep?",
            followUp: [
              {
                id: 30001,
                text: "What is your bedtime routine like?",
                followUp: [
                  {
                    id: 300001,
                    text: "Do you use electronic devices before bed?",
                    followUp: [
                      {
                        id: 3000001,
                        text: "Have you tried any sleep improvement methods?",
                        answer: `Based on your sleep patterns, here's a comprehensive sleep improvement plan:

1. Sleep Environment Optimization:
   - Keep room temperature between 60-67°F (15-19°C)
   - Use blackout curtains or eye mask
   - Invest in a comfortable mattress and pillows
   - Use white noise machine if helpful

2. Evening Routine:
   - Stop electronic device use 1-2 hours before bed
   - Practice relaxation techniques
   - Dim lights gradually
   - Light stretching or yoga
   - Reading or calming activities

3. Lifestyle Adjustments:
   - Consistent sleep/wake schedule
   - No caffeine after 2 PM
   - Regular exercise (but not close to bedtime)
   - Light dinner 2-3 hours before bed

4. Natural Sleep Aids:
   - Chamomile tea
   - Lavender aromatherapy
   - Magnesium supplements (consult doctor)
   - Deep breathing exercises

5. Sleep Hygiene Practices:
   - Use bed only for sleep and intimacy
   - Get morning sunlight exposure
   - Keep a sleep diary
   - Practice stress management

If sleep problems persist, consider consulting a sleep specialist for professional evaluation.`
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 4,
    text: "Relationship Concerns",
    followUp: [
      {
        id: 401,
        text: "What type of relationship challenges are you facing?",
        followUp: [
          {
            id: 4001,
            text: "How do these challenges affect you emotionally?",
            followUp: [
              {
                id: 40001,
                text: "What support would be most helpful?",
                answer: "Understanding your relationship challenges, here's a supportive approach: 1) Practice open communication 2) Set healthy boundaries 3) Focus on self-care 4) Consider relationship counseling for additional guidance."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 5,
    text: "Work-Life Balance",
    followUp: [
      {
        id: 501,
        text: "How do you currently manage work and personal life?",
        followUp: [
          {
            id: 5001,
            text: "What aspects feel most challenging?",
            followUp: [
              {
                id: 50001,
                text: "What would an ideal balance look like for you?",
                answer: "Based on your work-life balance challenges, here's a structured approach: 1) Set clear boundaries between work and personal time 2) Prioritize essential tasks 3) Schedule regular breaks 4) Consider time management techniques and professional coaching."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 6,
    text: "Self-Esteem and Confidence",
    followUp: [
      {
        id: 601,
        text: "What situations affect your confidence most?",
        followUp: [
          {
            id: 6001,
            text: "How do you typically respond to these situations?",
            followUp: [
              {
                id: 60001,
                text: "What would help you feel more confident?",
                answer: "To build your self-esteem and confidence: 1) Practice positive self-talk 2) Set and achieve small goals 3) Celebrate your accomplishments 4) Consider confidence-building workshops or counseling."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 7,
    text: "Stress at Work",
    followUp: [
      {
        id: 701,
        text: "What are your main sources of work stress?",
        followUp: [
          {
            id: 7001,
            text: "How does this stress manifest?",
            followUp: [
              {
                id: 70001,
                text: "What resources would help you manage this stress?",
                answer: "To address your work-related stress: 1) Implement stress management techniques 2) Practice workplace boundaries 3) Use time management tools 4) Consider career counseling or workplace wellness programs."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 8,
    text: "Family Dynamics",
    followUp: [
      {
        id: 801,
        text: "What family situations concern you most?",
        followUp: [
          {
            id: 8001,
            text: "How do these situations impact you emotionally?",
            followUp: [
              {
                id: 80001,
                text: "What kind of family support would be helpful?",
                answer: "For managing family dynamics: 1) Establish healthy boundaries 2) Improve communication patterns 3) Practice self-care within family contexts 4) Consider family therapy for additional support."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 9,
    text: "Personal Growth",
    followUp: [
      {
        id: 901,
        text: "What areas of personal growth interest you?",
        followUp: [
          {
            id: 9001,
            text: "What obstacles do you face in these areas?",
            followUp: [
              {
                id: 90001,
                text: "What support would help you achieve your goals?",
                answer: "For your personal growth journey: 1) Create a personal development plan 2) Set SMART goals 3) Find accountability partners 4) Consider personal development coaching."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 10,
    text: "Social Connections",
    followUp: [
      {
        id: 1001,
        text: "How satisfied are you with your social connections?",
        followUp: [
          {
            id: 10001,
            text: "What would improve your social life?",
            followUp: [
              {
                id: 100001,
                text: "What support would help you build better connections?",
                answer: "To enhance your social connections: 1) Join community groups or activities 2) Practice social skills 3) Maintain existing relationships 4) Consider social anxiety support if needed."
              }
            ]
          }
        ]
      }
    ]
  }
];

export function findQuestionById(id: number, questions: Question[] = mentalHealthTopics): Question | null {
  for (const question of questions) {
    if (question.id === id) {
      return question;
    }
    if (question.followUp) {
      const found = findQuestionById(id, question.followUp);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

export function getNextQuestions(currentId: number | null): Question[] {
  if (!currentId) {
    return mentalHealthTopics;
  }

  const currentQuestion = findQuestionById(currentId);
  return currentQuestion?.followUp || [];
}

export function isLastQuestion(id: number): boolean {
  const question = findQuestionById(id);
  return question?.answer !== undefined;
}

export function getAnswer(id: number): string | undefined {
  const question = findQuestionById(id);
  return question?.answer;
}
