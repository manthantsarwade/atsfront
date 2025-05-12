import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';
import LoadingAnimation from '../components/LoadingAnimation';
import EnhancedSuggestions from '../components/EnhancedSuggestions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, FileCheck, CheckCircle, AlertCircle, Copy } from 'lucide-react';
import analysisService, { EnhancedAnalysisResponse, EnhancedIssueHighlight } from '../api/analysisService';

const JobMatch = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [enhancedAnalysisResult, setEnhancedAnalysisResult] = useState<EnhancedAnalysisResponse | null>(null);
  const [activeIssue, setActiveIssue] = useState<EnhancedIssueHighlight | null>(null);
  const resumePreviewRef = React.useRef<HTMLDivElement>(null);

  const handleAnalyze = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please upload a resume file first",
        variant: "destructive"
      });
      return;
    }
    
    if (!jobDescription) {
      toast({
        title: "Error",
        description: "Please enter a job description",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    setShowResults(false);
    setActiveIssue(null);
    setEnhancedAnalysisResult(null);

    try {
      const response = await analysisService.analyzeResumeWithJobDescriptionEnhanced(file, jobDescription);
      setEnhancedAnalysisResult(response);
      
      setShowResults(true);
      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed against the job description"
      });
    } catch (err) {
      console.error("Analysis error:", err);
      toast({
        title: "Error",
        description: "Failed to analyze resume against job description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleIssueClick = (issue: EnhancedIssueHighlight) => {
    setActiveIssue(issue);
    
    if (!resumePreviewRef.current) return;
    if (!issue || !issue.context || !issue.resumeSection) {
        return;
    }
    
    setTimeout(() => {
        if (!resumePreviewRef.current) return;
        let selector = '';
        try {
            const contextSelectorValue = issue.context.replace(/"/g, '\\"');
            const sectionSelectorValue = issue.resumeSection.replace(/"/g, '\\"');
            selector = `span[data-context="${contextSelectorValue}"][data-section="${sectionSelectorValue}"]`;
            const element = resumePreviewRef.current?.querySelector(selector);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                element.classList.add('ring-2', 'ring-red-500', 'ring-offset-2');
                setTimeout(() => element.classList.remove('ring-2', 'ring-red-500', 'ring-offset-2'), 1500);
            } else {
                 const previewText = resumePreviewRef.current.innerText;
                 const position = previewText.indexOf(issue.context);
                 if (position > -1) {
                     const lineHeight = 20;
                     const linesAbove = previewText.substring(0, position).split('\n').length;
                     const estimatedScrollTop = Math.max(0, linesAbove * lineHeight - 100);
                     resumePreviewRef.current.scrollTo({ top: estimatedScrollTop, behavior: 'smooth' });
                 }
            }
        } catch (e) {
             try {
                 const previewText = resumePreviewRef.current.innerText;
                 const position = previewText.indexOf(issue.context);
                 if (position > -1) {
                     const lineHeight = 20;
                     const linesAbove = previewText.substring(0, position).split('\n').length;
                     const estimatedScrollTop = Math.max(0, linesAbove * lineHeight - 100);
                     resumePreviewRef.current.scrollTo({ top: estimatedScrollTop, behavior: 'smooth' });
                 } 
             } catch (fallbackError) { /* Ignore inner error */ }
        }
    }, 50);
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setShowResults(false);
    setActiveIssue(null);
    setEnhancedAnalysisResult(null);
  };
  
  const renderHighlightedResume = () => {
    if (!enhancedAnalysisResult) return null;
    const { resumeText } = enhancedAnalysisResult;
    if (!activeIssue || !activeIssue.context || !activeIssue.resumeSection) {
      return <>{resumeText}</>;
    }
    const context = activeIssue.context;
    const section = activeIssue.resumeSection;
    const parts = resumeText ? resumeText.split(context) : [];
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <span 
            className="bg-yellow-100 border-b-2 border-yellow-400 px-1 rounded animate-pulse"
            data-context={context}
            data-section={section}
          >
            {context}
          </span>
        )}
      </span>
    ));
  };
  
  const handleCopyResume = () => {
      if (enhancedAnalysisResult?.resumeText) {
          navigator.clipboard.writeText(enhancedAnalysisResult.resumeText);
          toast({ title: "Success", description: "Resume text copied to clipboard." });
      } else {
          toast({ title: "Error", description: "No resume text available to copy.", variant: "destructive" });
      }
  };

  return (
    <div className="min-h-screen bg-[#fffbeb]">
      <div className={`mx-auto py-2 ${!showResults ? 'max-w-4xl px-4' : 'max-w-[98%]'}`}>
        <div className="mb-2 px-2 md:px-0">
          <Link to="/" className="text-indigo-600 hover:text-indigo-800 hover:underline flex items-center group">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
        
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800">Job Description Match</h1>
        </div>
        
        {!showResults ? (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">1. Upload Your Resume</h2>
                <FileUpload
                  label="Drag & drop your resume or click to browse"
                  onChange={(uploadedFile) => setFile(uploadedFile)}
                />
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4">2. Paste Job Description</h2>
                <Textarea
                  placeholder="Paste the full job description here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full h-48 resize-none mb-4 p-3 border rounded"
                />
              </div>
            </div>

            {(file || jobDescription) && (
              <div className="pt-4 border-t mt-6">
                {file && (
                  <div className="flex items-center mb-4 text-sm text-gray-600">
                    <FileCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Selected file: <span className="font-medium">{file.name}</span></span>
                  </div>
                )}
                <Button
                  onClick={handleAnalyze}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2"
                  disabled={isAnalyzing || !file || !jobDescription}
                  size="lg"
                >
                  {isAnalyzing ? "Analyzing..." : "Compare Resume to Job"}
                </Button>
              </div>
            )}
              
            {isAnalyzing && (
              <div className="mt-8 flex justify-center">
                <LoadingAnimation />
              </div>
            )}
          </div>
        ) : null}

        {showResults && enhancedAnalysisResult && (
          <>
            <div className="text-center mb-4">
              <Button 
                variant="outline" 
                onClick={handleReset}
                className="mx-auto"
                size="lg"
              >
                Analyze Another Job
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col items-center justify-start h-auto md:h-[450px]">
                <h2 className="text-2xl font-semibold mb-4 flex items-center">
                  Match Score
                </h2>
                <div className="mb-4 mt-4">
                  <svg className="w-32 h-32 md:w-36 md:h-36" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={enhancedAnalysisResult.score >= 80 ? '#22c55e' : enhancedAnalysisResult.score >= 60 ? '#eab308' : '#ef4444'}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 45}
                      strokeDashoffset={2 * Math.PI * 45 * (1 - enhancedAnalysisResult.score / 100)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)' }}
                    />
                    <text
                      x="50"
                      y="56"
                      textAnchor="middle"
                      className={`text-2xl md:text-3xl font-bold ${
                        enhancedAnalysisResult.score >= 80 ? 'text-green-500' : 
                        enhancedAnalysisResult.score >= 60 ? 'text-yellow-500' : 
                        'text-red-500'
                      }`}
                      fontFamily="inherit"
                      fill="currentColor"
                    >
                      {enhancedAnalysisResult.score}
                    </text>
                  </svg>
                </div>
                <div className={`flex items-center justify-center gap-2 text-md md:text-lg font-semibold mb-6 mt-4 ${
                  enhancedAnalysisResult.score >= 80 ? 'text-green-500' : 
                  enhancedAnalysisResult.score >= 60 ? 'text-yellow-500' : 
                  'text-red-500'
                }`}>
                  {enhancedAnalysisResult.score >= 80 ? <CheckCircle className="w-5 h-5 md:w-6 md:h-6" /> : <AlertCircle className="w-5 h-5 md:w-6 md:h-6" />}
                  {enhancedAnalysisResult.score >= 80 ? 'Strong Match!' : 
                   enhancedAnalysisResult.score >= 60 ? 'Good Match' : 
                   'Needs Improvement'}
                </div>

                <p className="text-sm text-center text-gray-600 mt-4 px-2">
                  {enhancedAnalysisResult.score >= 80 ? 
                    'This resume strongly aligns with the key requirements of the job description. Minor tweaks could further enhance its impact.' : 
                   enhancedAnalysisResult.score >= 60 ? 
                    'This resume shows a good alignment with the job description, but could be improved by highlighting relevant skills and experience more effectively.' : 
                    'This resume requires significant adjustments to better match the requirements outlined in the job description.'
                  }
                </p>

              </div>

              <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col h-auto md:h-[450px]">
                <EnhancedSuggestions 
                  data={enhancedAnalysisResult}
                  onIssueClick={handleIssueClick}
                  activeIssue={activeIssue}
                />
              </div>

              <div className="bg-white rounded-xl shadow p-4 md:p-6 flex flex-col h-auto md:h-[450px]">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold flex items-center gap-2">Resume Preview</h2>
                  <Button variant="ghost" size="sm" onClick={handleCopyResume} title="Copy Resume Text">
                    <Copy className="w-4 h-4 mr-1"/> Copy Text
                  </Button>
                </div>
                <div 
                  ref={resumePreviewRef} 
                  className="flex-grow whitespace-pre-wrap font-mono text-xs md:text-sm bg-gray-50 p-3 rounded-lg h-[350px] overflow-y-auto border border-gray-200 shadow-inner"
                >
                  {renderHighlightedResume()}
                </div>
              </div>
            </div>
          </>
        )}

        {showResults && !isAnalyzing && !enhancedAnalysisResult && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mt-8">
            <h2 className="text-xl font-bold mb-4">Error Loading Results</h2>
            <p className="text-gray-600 mb-4">
              Something went wrong during the analysis. Please check your inputs and try again.
            </p>
            <Button onClick={handleReset}>Try Again</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatch;
