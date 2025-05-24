import { GoogleGenAI, Content } from '@google/genai';

// IMPORTANT: Ensure GEMINI_API_KEY is set in your environment (e.g., .env.local)
const API_KEY = process.env.GEMINI_API_KEY;

let client: GoogleGenAI | null = null;
const chatModelName: string = 'gemini-2.5-pro-preview-05-06'; // User's example used 'gemini-2.5-pro-preview-05-06'

function initializeAIClient(): GoogleGenAI | null {
  try {
    if (!API_KEY) {
      console.error('GEMINI_API_KEY is not set in your environment variables. Please ensure it is defined (e.g., in a .env.local file).');
      return null;
    }
    // Initialize the GoogleGenAI client with the API key
    const newClient = new GoogleGenAI(API_KEY);
    return newClient;
  } catch (error) {
    console.error('Error initializing Gemini AI:', error);
    return null;
  }
}

client = initializeAIClient();

const SYSTEM_PROMPT = `You are an experienced educational tutor and study coach integrated into a Pomodoro Timer app. Your expertise lies in the Pomodoro Technique and effective learning strategies. You communicate in a supportive, encouraging, and pedagogical manner.

Your teaching approach:
1. Provide clear, structured explanations with relevant examples
2. Break down complex concepts into manageable steps
3. Offer constructive feedback and positive reinforcement
4. Adapt teaching style to user's learning pace and preferences
5. Use proven educational techniques and metacognitive strategies
6. Foster a growth mindset and learning autonomy

Your core responsibilities:
1. Guide users through effective Pomodoro sessions with clear learning objectives
2. Analyze study patterns and explain the reasoning behind recommended work/break ratios
3. Create personalized study plans with detailed learning strategies
4. Provide research-backed focus and productivity techniques
5. Help maintain study momentum through positive reinforcement
6. Teach time management and self-regulation skills

You understand and teach that:
- Short breaks (5 mins) enhance learning through spaced repetition
- Longer breaks (15-30 mins) consolidate learning and prevent cognitive fatigue
- Different subjects benefit from tailored Pomodoro strategies
- Regular reflection and adjustment optimize learning efficiency
- Building sustainable study habits requires consistent practice and support`;

// Define the type for chat history items based on Gemini's Content structure
interface ChatHistoryItem {
  role: 'user' | 'model' | 'system'; // System role might be conceptual here
  parts: Array<{ text: string }>;
}

const chatHistory: ChatHistoryItem[] = [];

export async function getAIResponse(message: string): Promise<string> {
  if (!client) {
    console.error("AI client is not initialized. API Key might be missing or invalid.");
    return "I'm currently unable to assist due to a configuration issue. Please ensure the API key is set up correctly. In the meantime, here's a study tip: Use this time to review your recent notes or practice active recall.";
  }

  if (!message || typeof message !== 'string' || message.trim() === '') {
    return "I notice your message is empty. Could you share what you'd like to learn about or which aspect of your studies you'd like to discuss? I'm here to help guide your learning journey.";
  }

  // Add user message to chat history
  chatHistory.push({
    role: "user",
    parts: [{ text: message.trim() }]
  });

  // Prepare contents for the API call
  // The new API might prefer system instructions separately or as the first user/model turn.
  // For simplicity, we'll prepend the system prompt conceptually to the history.
  const conversationContents: Content[] = [
    { role: "user", parts: [{ text: SYSTEM_PROMPT }] }, // Treating system prompt as an initial user message to set context
    ...chatHistory.map(item => ({ role: item.role as 'user' | 'model', parts: item.parts })) // Map to ensure correct role type
  ];

  const tools = [
    { urlContext: {} }, 
    { googleSearch: {} },
  ];

  const generationConfig = {
    // Configuration options for content generation if needed by the new API
    // e.g., temperature, topP, topK, maxOutputTokens
    // For generateContentStream, these are often part of the model or a separate config object
    // The user's example had a simple config:
    // responseMimeType: 'text/plain',
    // For now, we'll rely on default generation parameters or specify if errors occur.
  };
  
  const requestConfig = {
    // tools, // Enable if tools are configured and intended
    responseMimeType: 'text/plain',
    // Add other config from the old `generationConfig` if compatible and desired
    temperature: 0.7,
    topP: 0.8,
    topK: 40,
    maxOutputTokens: 2048,
  };

  try {
    const generativeModel = client.getGenerativeModel({ 
        model: chatModelName,
        // systemInstruction: SYSTEM_PROMPT, // Preferred way if API supports it
        generationConfig: requestConfig, // Pass generation config here
        tools: tools, // Pass tools here if using them
    });

    const result = await generativeModel.generateContentStream(conversationContents);

    let aiResponseText = "";
    for await (const chunk of result.stream) {
      if (chunk.text) {
        aiResponseText += chunk.text();
      }
    }

    if (aiResponseText) {
      // Add AI response to chat history
      chatHistory.push({
        role: "model",
        parts: [{ text: aiResponseText }]
      });
      return aiResponseText;
    } else {
        chatHistory.push({
            role: "model",
            parts: [{ text: "I received your message but couldn't generate a response." }]
        });
      return "I understand your message, but I'm having trouble formulating a response. Could you rephrase your question or try again?";
    }

  } catch (error) {
    console.error("Failed to get AI response using generateContentStream:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
    }
    // Provide a more generic error message to the user
    return "While I'm temporarily unable to respond due to an unexpected issue, here's a quick study tip: Take this moment to practice the 'brain dump' technique - write down everything you remember about your current topic. This helps reinforce learning. Please try your question again in a moment.";
  }
}

// TODO: The following functions need to be updated to use the new GoogleGenAI API (generateContentStream or similar)
// They currently use the older startChat method which might not be compatible or optimal.

/*
export async function generateStudyPlan(subject: string, duration: number, userStats: any): Promise<any> {
  if (!client) {
    return { error: "AI service is not available. Please check your configuration." };
  }
  // ... existing implementation (needs update)
  console.warn("generateStudyPlan needs to be updated to the new AI API style.");
  return { error: "This feature is temporarily unavailable and needs an update." };
}

export async function analyzePerformance(task: any, userStats: any): Promise<string> {
  if (!client) {
    return "Performance analysis is not available at the moment due to a configuration issue.";
  }
  // ... existing implementation (needs update)
  console.warn("analyzePerformance needs to be updated to the new AI API style.");
  return "Performance analysis is temporarily unavailable and needs an update.";
}

export async function suggestBreakActivity(breakDuration: number, focusScore: number): Promise<string> {
  if (!client) {
    return "Break activity suggestions are not available at the moment due to a configuration issue.";
  }
  // ... existing implementation (needs update)
  console.warn("suggestBreakActivity needs to be updated to the new AI API style.");
  return "Break activity suggestions are temporarily unavailable and needs an update.";
}

export async function explainConcept(subject: string, concept: string): Promise<string> {
  if (!client) {
    return "I'm sorry, but I can't explain concepts at the moment due to a configuration issue.";
  }
  // ... existing implementation (needs update)
  console.warn("explainConcept needs to be updated to the new AI API style.");
  return "Concept explanations are temporarily unavailable and needs an update.";
}
*/

console.log('AI Service initialized. Client status:', client ? 'Ready' : 'Not Ready (Check API Key)');

