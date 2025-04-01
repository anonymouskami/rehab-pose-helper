
// This service will handle AI recommendation API calls

export interface AiRequestData {
  age: string;
  bmi: string;
  weight: string;
  injuryType: string;
  painLevel: string;
}

export interface AiResponse {
  recommendation: string;
  exerciseIds?: string[];
}

// Hard-coded API key for demonstration (in a real application, this would be in a secure backend environment)
const BACKEND_API_KEY = "default-mock-key"; 

export const getAiRecommendation = async (data: AiRequestData): Promise<AiResponse> => {
  try {
    // In a real application, this would be a backend API call
    // The backend would securely store and use the API key
    
    // For demo purposes we're using the mock response
    console.log("Using backend API key for AI recommendation");
    return mockAiResponse(data);
    
    // In a real implementation with a backend:
    /*
    const response = await fetch('/api/ai-recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
    */
  } catch (error) {
    console.error("Error getting AI recommendation:", error);
    throw error;
  }
};

// Mock function to generate responses until the API is integrated
function mockAiResponse(data: AiRequestData): AiResponse {
  const painLevel = parseInt(data.painLevel);
  const age = parseInt(data.age);
  const bmi = parseFloat(data.bmi);
  
  let recommendation = "";
  let exerciseIds: string[] = [];
  
  // Generate recommendation based on injury type and pain level
  if (painLevel > 7) {
    recommendation = `Based on your high pain level (${data.painLevel}/10), I recommend consulting a medical professional before starting any exercise routine. For your ${data.injuryType}, focus on rest and gentle movement within your pain-free range.`;
  } else if (painLevel > 4) {
    recommendation = `For your ${data.injuryType} with a moderate pain level (${data.painLevel}/10), I recommend starting with gentle mobility exercises. Begin with short sessions (5-10 minutes) daily and gradually increase as tolerated.`;
  } else {
    recommendation = `With your ${data.injuryType} and relatively low pain level (${data.painLevel}/10), you can proceed with targeted strengthening exercises. Focus on form rather than intensity.`;
  }
  
  // Add age-specific advice
  if (age > 65) {
    recommendation += " Given your age, take extra care to move slowly and focus on proper form rather than intensity.";
  } else if (age < 18) {
    recommendation += " Since you're still growing, make sure to avoid excessive strain and focus on proper technique.";
  }
  
  // Add BMI-specific advice
  if (bmi > 30) {
    recommendation += " Consider low-impact exercises initially to reduce joint stress.";
  } else if (bmi < 18.5) {
    recommendation += " Focus on strengthening exercises and proper nutrition to support recovery.";
  }
  
  // Recommend exercises based on injury type
  const lowerInjuryType = data.injuryType.toLowerCase();
  
  if (lowerInjuryType.includes("knee") || lowerInjuryType.includes("acl")) {
    exerciseIds = ["knee-extension"];
    recommendation += " The knee extension exercise would be particularly beneficial for your condition.";
  } else if (lowerInjuryType.includes("shoulder")) {
    exerciseIds = ["shoulder-flexion"];
    recommendation += " The shoulder flexion exercise is recommended for your specific injury.";
  } else if (lowerInjuryType.includes("ankle") || lowerInjuryType.includes("foot")) {
    exerciseIds = ["ankle-dorsiflexion"];
    recommendation += " The ankle dorsiflexion exercise would help strengthen the affected area.";
  } else if (lowerInjuryType.includes("hip") || lowerInjuryType.includes("back") || lowerInjuryType.includes("spine")) {
    exerciseIds = ["hip-bridge"];
    recommendation += " The hip bridge exercise may help alleviate your symptoms and strengthen supporting muscles.";
  } else {
    // For other injuries, recommend a mix of exercises
    exerciseIds = ["knee-extension", "shoulder-flexion"];
    recommendation += " A combination of different exercises may benefit your overall rehabilitation.";
  }
  
  return {
    recommendation,
    exerciseIds
  };
}
