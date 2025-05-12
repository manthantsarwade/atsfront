import axios from 'axios';

const API_BASE_URL = 'http://localhost:8084/api';

// Standard AnalysisResponse interface
export interface IssueHighlight {
  section: string;
  issue: string;
  suggestion: string;
  context: string;
}

export interface AnalysisResponse {
  score: number;
  resumeText: string;
  issues: IssueHighlight[];
}

// Enhanced AnalysisResponse interface
export interface EnhancedIssueHighlight extends IssueHighlight {
  severity?: 'CRITICAL' | 'IMPORTANT' | 'MINOR';
  category?: string;
  resumeSection?: string;
  exampleFix?: string;
}

export interface CategorizedIssues {
  [category: string]: EnhancedIssueHighlight[];
}

export interface DetectedSections {
  [section: string]: string;
}

export interface EnhancedAnalysisResponse {
  score: number;
  resumeText: string;
  issues: EnhancedIssueHighlight[];
  enhancedIssues?: EnhancedIssueHighlight[];
  categorizedIssues?: CategorizedIssues;
  detectedSections?: DetectedSections;
}

// Regular analysis without job description
export const analyzeResume = async (file: File): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post<AnalysisResponse>(
    `${API_BASE_URL}/score-check`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  
  return response.data;
};

// Enhanced analysis without job description
export const analyzeResumeEnhanced = async (file: File): Promise<EnhancedAnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post<EnhancedAnalysisResponse>(
    `${API_BASE_URL}/enhanced-score-check`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  
  return response.data;
};

// Regular analysis with job description
export const analyzeResumeWithJobDescription = async (file: File, jobDescription: string): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jd', jobDescription);
  
  const response = await axios.post<AnalysisResponse>(
    `${API_BASE_URL}/job-match`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  
  return response.data;
};

// Enhanced analysis with job description
export const analyzeResumeWithJobDescriptionEnhanced = async (file: File, jobDescription: string): Promise<EnhancedAnalysisResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('jd', jobDescription);
  
  const response = await axios.post<EnhancedAnalysisResponse>(
    `${API_BASE_URL}/enhanced-job-match`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );
  
  return response.data;
};

// Get available suggestion categories
export const getSuggestionCategories = async (): Promise<string[]> => {
  const response = await axios.get<string[]>(`${API_BASE_URL}/suggestion-categories`);
  return response.data;
};

// Extract text from PDF only
export const extractTextFromPdf = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post<string>(
    `${API_BASE_URL}/pdf-extract`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      responseType: 'text'
    }
  );
  
  return response.data;
};

export default {
  analyzeResume,
  analyzeResumeEnhanced,
  analyzeResumeWithJobDescription,
  analyzeResumeWithJobDescriptionEnhanced,
  getSuggestionCategories,
  extractTextFromPdf
}; 