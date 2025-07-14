export interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai' | 'counselor';
  timestamp: string;
  isLoading?: boolean;
}

export interface HealthcareProfessional {
  id: number;
  name: string;
  title: string;
  specialization: string;
  image: string;
  availability: {
    nextAvailable: string;
    availableDays: string[];
  };
  rating: number;
  totalReviews: number;
  experience: number;
  languages: string[];
  consultationFee: number;
}

export interface AIResponse {
  content: string;
  suggestProfessional: boolean;
}
