import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingAnimation from '../components/LoadingAnimation';
import AnalysisResults from '../components/AnalysisResults';
import { Button } from '@/components/ui/button';
import { toast } from "@/components/ui/use-toast";
import axios from 'axios';

const ScoreCheck = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a resume file first",
        variant: "destructive"
      });
      return;
    }
    setIsAnalyzing(true);
    setShowResults(false);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('/api/score-check', formData, {
        baseURL: 'http://localhost:8084',
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAnalysisResult(response.data);
      setShowResults(true);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to analyze resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <Link to="/" className="text-indigo-600 hover:underline flex items-center">
            ← Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Quick Score Check</h1>
        
        {!showResults ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-6 mb-8">
            <div className={file ? "max-h-28 overflow-hidden transition-all duration-300" : "transition-all duration-300"}>
              <FileUpload
                label="Upload your resume"
                onChange={(file) => {
                  setFile(file);
                  setShowResults(false);
                }}
              />
            </div>
            
            {file && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">
                  Selected file: <span className="font-medium">{file.name}</span>
                </p>
                <Button
                  onClick={handleAnalyze}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
                </Button>
              </div>
            )}
            
            {isAnalyzing && (
              <div className="mt-6 flex justify-center">
                <LoadingAnimation />
              </div>
            )}
          </div>
        ) : null}

        {showResults && analysisResult && typeof analysisResult === 'object' && Array.isArray(analysisResult.issues) && (
          <>
            <div className="text-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => setShowResults(false)} 
                className="mx-auto"
              >
                Upload Another Resume
              </Button>
            </div>
            <AnalysisResults 
              score={analysisResult.score}
              resumeText={analysisResult.resumeText}
              issues={analysisResult.issues}
            />
          </>
        )}

        {showResults && analysisResult && (!analysisResult.issues || typeof analysisResult !== 'object') && (
          <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-4">Extracted Resume Text</h2>
            <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded border">{typeof analysisResult === 'string' ? analysisResult : JSON.stringify(analysisResult, null, 2)}</pre>
            <Button 
              variant="outline" 
              onClick={() => setShowResults(false)} 
              className="mt-4"
            >
              Upload Another Resume
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScoreCheck;
