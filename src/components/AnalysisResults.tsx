import React, { useState, useRef, useEffect, Fragment } from 'react';
import { FileText, Info, AlertCircle, CheckCircle, Download, Copy, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface IssueHighlight {
  section: string;
  issue: string;
  suggestion: string;
  context: string;
  lineRange?: [number, number];
}

interface AnalysisResultsProps {
  score: number;
  resumeText: string;
  issues: IssueHighlight[];
  onReanalyze?: () => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  return 'text-red-500';
};

const getScoreStroke = (score: number) => {
  if (score >= 80) return '#22c55e';
  if (score >= 60) return '#eab308';
  return '#ef4444';
};

const AnalysisResults = ({ score, resumeText, issues, onReanalyze }: AnalysisResultsProps) => {
  const [activeIssueIndex, setActiveIssueIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'original' | 'highlighted'>('highlighted');
  const [showDebug, setShowDebug] = useState(false);
  const resumePreviewRef = useRef<HTMLDivElement>(null);
  const highlightedRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    highlightedRefs.current = [];
  }, [resumeText, issues]);

  // Download suggestions as text
  const handleDownload = () => {
    const text = issues.map((i, idx) => `${idx + 1}. [${i.section}]
Issue: ${i.issue}
Suggestion: ${i.suggestion}
`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ats-suggestions.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy resume text
  const handleCopy = () => {
    navigator.clipboard.writeText(resumeText);
  };

  const handleIssueClick = (index: number) => {
    setActiveIssueIndex(index);
    const targetRef = highlightedRefs.current[index];
    if (targetRef && resumePreviewRef.current) {
        resumePreviewRef.current.scrollTo({
            top: targetRef.offsetTop - resumePreviewRef.current.offsetTop - 50,
            behavior: 'smooth'
        });
    }
  };

  // Highlight issues in resume using context
  const processResumeWithHighlights = () => {
    if (viewMode === 'original' || !resumeText || errorIssue) {
      // For original mode, just render the plain text with line breaks
      return (
        <div 
          ref={resumePreviewRef} 
          className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded-lg h-[420px] overflow-y-auto border border-gray-200 shadow-inner"
        >
          {resumeText}
        </div>
      );
    }

    // For highlighted mode, find and highlight the contexts
    const segments: { text: string; isHighlight: boolean; issueIndex?: number }[] = [];
    const highlights: { index: number; start: number; end: number }[] = [];

    // Find all highlights
    issues.forEach((issue, index) => {
      if (issue.context) {
        let startIndex = 0;
        let position = resumeText.indexOf(issue.context, startIndex);
        while (position !== -1) {
          const overlaps = highlights.some(h => 
            (position >= h.start && position < h.end) ||
            (position + issue.context.length > h.start && position + issue.context.length <= h.end)
          );
          if (!overlaps) {
            highlights.push({ index, start: position, end: position + issue.context.length });
          }
          startIndex = position + 1;
          position = resumeText.indexOf(issue.context, startIndex);
        }
      }
    });

    highlights.sort((a, b) => a.start - b.start);
    
    // Create text segments for rendering
    let lastIndex = 0;
    highlights.forEach(h => {
      // Add text before the highlight
      if (h.start > lastIndex) {
        segments.push({ text: resumeText.substring(lastIndex, h.start), isHighlight: false });
      }
      
      // Add the highlighted segment
      segments.push({ 
        text: resumeText.substring(h.start, h.end), 
        isHighlight: true, 
        issueIndex: h.index 
      });
      
      lastIndex = h.end;
    });
    
    // Add any remaining text after the last highlight
    if (lastIndex < resumeText.length) {
      segments.push({ text: resumeText.substring(lastIndex), isHighlight: false });
    }

    // Render the segments with proper React components
    return (
      <div 
        ref={resumePreviewRef} 
        className="whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded-lg h-[420px] overflow-y-auto border border-gray-200 shadow-inner"
      >
        {segments.map((segment, idx) => {
          if (!segment.isHighlight) {
            // Replace newlines with <br /> for non-highlighted text
            const parts = segment.text.split('\n');
            return (
              <Fragment key={idx}>
                {parts.map((part, partIdx) => (
                  <Fragment key={`${idx}-${partIdx}`}>
                    {part}
                    {partIdx < parts.length - 1 && <br />}
                  </Fragment>
                ))}
              </Fragment>
            );
          }
          
          const isActiveIssue = segment.issueIndex === activeIssueIndex;
          return (
            <div
              key={idx}
              className={`inline-block rounded px-1 py-0.5 my-0.5 ${
                isActiveIssue 
                  ? 'bg-red-100 border-l-4 border-red-500 animate-pulse' 
                  : 'bg-yellow-50 border-l-4 border-yellow-400'
              } transition-all duration-300`}
              ref={el => {
                if (el && segment.issueIndex !== undefined) {
                  highlightedRefs.current[segment.issueIndex] = el;
                }
              }}
            >
              {segment.text}
            </div>
          );
        })}
      </div>
    );
  };

  // Error handling
  const errorIssue = issues.find(i => i.section === 'AI Response Error');

  // New consistent card layout
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mx-auto max-w-7xl">
      {/* First Card: Score */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col items-center justify-center h-[480px]">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          Your Score
        </h2>
        <div className="relative flex items-center justify-center w-32 h-32 my-4">
          <svg className="absolute top-0 left-0" width="128" height="128">
            <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="12" fill="none" />
            <circle
              cx="64" cy="64" r="56"
              stroke={getScoreStroke(score)}
              strokeWidth="12"
              fill="none"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - score / 100)}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,2,.6,1)' }}
            />
          </svg>
          <span className={`absolute text-4xl font-bold ${getScoreColor(score)}`}>{score}</span>
        </div>
        <div className={`flex items-center justify-center gap-2 font-semibold ${getScoreColor(score)} mb-6`}>
          {score >= 80 ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {score >= 80 ? 'Great Match!' : score >= 60 ? 'Needs Improvement' : 'Poor Match'}
        </div>
        {onReanalyze && (
          <Button 
            variant="outline" 
            onClick={onReanalyze} 
            className="w-full flex items-center justify-center gap-2 mt-auto"
          >
            <RefreshCw className="w-4 h-4" /> Re-analyze Resume
          </Button>
        )}
      </div>

      {/* Second Card: Suggestions */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col h-[480px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Info className="h-5 w-5 text-indigo-600" /> Suggestions
          </h2>
          <Button variant="ghost" size="icon" onClick={handleDownload} title="Download Suggestions">
            <Download className="w-4 h-4" />
          </Button>
        </div>
        
        <ScrollArea className="flex-grow pr-4">
          {errorIssue ? (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              <strong>Error:</strong> {errorIssue.issue}<br />
              <span className="text-xs">{errorIssue.suggestion}</span>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                    activeIssueIndex === index
                      ? 'bg-red-50 border-red-400'
                      : 'bg-white border-gray-200 hover:border-red-300'
                  }`}
                  onClick={() => handleIssueClick(index)}
                >
                  <h4 className="font-semibold text-sm text-gray-800 flex items-center mb-1">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 inline-flex items-center justify-center mr-2 text-xs font-bold">
                      {index + 1}
                    </span>
                    {issue.section}
                  </h4>
                  <p className="text-xs text-red-700 font-medium ml-7 mb-1">{issue.issue}</p>
                  <p className="text-xs text-gray-600 ml-7 bg-green-50 p-1.5 rounded border border-green-100">
                    <strong>Suggestion:</strong> {issue.suggestion}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="mt-3 pt-3 border-t flex justify-end">
          <Button variant="outline" size="sm" onClick={() => setShowDebug(v => !v)}>
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </Button>
        </div>
      </div>

      {/* Third Card: Resume Preview */}
      <div className="bg-white rounded-xl shadow p-5 flex flex-col h-[480px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-600" /> Resume Preview
          </h2>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'original' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('original')}
              className="px-3 py-1 h-8"
            >
              Original
            </Button>
            <Button 
              variant={viewMode === 'highlighted' ? 'default' : 'outline'} 
              size="sm" 
              onClick={() => setViewMode('highlighted')}
              className="px-3 py-1 h-8"
            >
              Highlighted
            </Button>
            <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy Resume Text">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-grow">
          {processResumeWithHighlights()}
        </div>
      </div>
      
      {showDebug && (
        <div className="fixed bottom-4 right-4 w-full md:w-1/3 bg-white shadow-lg rounded-lg p-4 border z-50 max-h-60 overflow-auto">
          <h3 className="text-sm font-semibold mb-2">Debug Info</h3>
          <pre className="text-xs whitespace-pre-wrap text-gray-700 bg-gray-100 p-2 rounded">
            {JSON.stringify({ score, resumeText, issues }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;
