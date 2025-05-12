import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Interface for enhanced issue highlight
interface EnhancedIssueHighlight {
  section: string;
  issue: string;
  suggestion: string;
  context: string;
  severity?: 'CRITICAL' | 'IMPORTANT' | 'MINOR';
  category?: string;
  resumeSection?: string;
  exampleFix?: string;
}

// Interface for the categorized issues map
interface CategorizedIssues {
  [category: string]: EnhancedIssueHighlight[];
}

// Interface for detected sections
interface DetectedSections {
  [section: string]: string;
}

// Interface for enhanced analysis response
interface EnhancedAnalysisResponse {
  score: number;
  resumeText: string;
  issues: EnhancedIssueHighlight[];
  enhancedIssues?: EnhancedIssueHighlight[];
  categorizedIssues?: CategorizedIssues;
  detectedSections?: DetectedSections;
}

interface EnhancedSuggestionsProps {
  data: EnhancedAnalysisResponse;
  onIssueClick: (issue: EnhancedIssueHighlight) => void;
  activeIssue: EnhancedIssueHighlight | null;
}

// Helper function to convert camelCase to Title Case
const formatCategoryName = (name: string): string => {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
};

// Helper to determine badge variant based on category
const getCategoryBadgeVariant = (category: string): string => {
  const lowerCategory = category.toLowerCase().replace(/\s+/g, '');
  const knownCategories = [
    'formatting', 'keywords', 'atscompatibility', 'contactinfo', 
    'experience', 'skills', 'education', 'achievements',
    'contentquality', 'jobmatch', 'grammar'
  ];
  
  return knownCategories.includes(lowerCategory) ? lowerCategory : 'other';
};

const EnhancedSuggestions = ({ data, onIssueClick, activeIssue }: EnhancedSuggestionsProps) => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  
  // Use enhancedIssues if available, otherwise fall back to regular issues
  const issues = data.enhancedIssues || data.issues;
  const categorizedIssues = data.categorizedIssues || {};
  
  // Get categories with issues for the tabs
  const categoriesWithIssues = Object.keys(categorizedIssues || {})
    .filter(category => categorizedIssues[category]?.length > 0)
    .sort();
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    if (expandedCategories.includes(category)) {
      setExpandedCategories(expandedCategories.filter(c => c !== category));
    } else {
      setExpandedCategories([...expandedCategories, category]);
    }
  };
  
  // Render an issue item with enhanced features
  const renderIssueItem = (issue: EnhancedIssueHighlight) => {
    const isActive = activeIssue === issue;
    const severityVariant = issue.severity?.toLowerCase() || 'important';
    const categoryVariant = getCategoryBadgeVariant(issue.category || issue.section);
    
    // Determine badge color based on severity
    let severityBadgeColor = 'bg-gray-100 text-gray-800'; // Default for IMPORTANT or undefined
    if (issue.severity === 'CRITICAL') {
      severityBadgeColor = 'bg-red-100 text-red-800';
    } else if (issue.severity === 'MINOR') {
      severityBadgeColor = 'bg-yellow-100 text-yellow-800';
    }
    
    // Check if the category/section is the same as the parent category
    // to avoid repetition in badges
    const parentCategory = Object.keys(categorizedIssues).find(category => 
      categorizedIssues[category]?.some(i => 
        i.section === issue.section && i.issue === issue.issue && i.context === issue.context
      )
    );
    
    // Skip the category badge if it repeats the parent category
    const shouldShowCategoryBadge = (issue.category || issue.section) !== parentCategory;
    
    return (
      <div
        key={`${issue.section}-${issue.issue}-${issue.context}`}
        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 mb-3 ${
          isActive
            ? 'bg-red-50 border-red-400 shadow-md'
            : 'bg-white border-gray-200 hover:border-red-300 hover:shadow-sm'
        }`}
        onClick={() => onIssueClick(issue)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 flex-wrap">
            {issue.severity && (
              <Badge variant="outline" size="sm" className={`font-medium ${severityBadgeColor}`}>
                {issue.severity}
              </Badge>
            )}
            {/* Only show category badge if it's different from parent category */}
            {shouldShowCategoryBadge && (issue.category || issue.section).toLowerCase() !== parentCategory?.toLowerCase() && (
              <Badge variant={categoryVariant as any} size="sm">
                {issue.category || issue.section}
              </Badge>
            )}
            {/* Always show resume section and other descriptive badges */}
            {issue.resumeSection && (
              <Badge variant="outline" size="sm">{issue.resumeSection}</Badge>
            )}
          </div>
        </div>
        
        <p className="text-sm text-red-700 font-medium mb-1">{issue.issue}</p>
        <p className="text-sm text-gray-600 bg-green-50 p-1.5 rounded border border-green-100">
          <strong>Suggestion:</strong> {issue.suggestion}
        </p>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-3">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Info className="h-6 w-6 text-indigo-600" /> Enhanced Suggestions
        </h2>
      </div>
      
      <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-2 w-full flex overflow-x-auto pb-px">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="critical" className="flex-1">Critical</TabsTrigger>
          <TabsTrigger value="sections" className="flex-1">By Section</TabsTrigger>
        </TabsList>
        
        <ScrollArea className="flex-grow pr-4 pt-1 h-[320px]">
          <TabsContent value="all" className="mt-0">
            <Accordion 
              type="multiple" 
              defaultValue={categoriesWithIssues.slice(0, 2)} 
              className="w-full"
            >
              {categoriesWithIssues.map(category => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center">
                      <Badge variant={getCategoryBadgeVariant(category) as any} className="mr-2">
                        {categorizedIssues[category]?.length || 0}
                      </Badge>
                      {formatCategoryName(category)}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {categorizedIssues[category]?.map((issue) => 
                      renderIssueItem(issue)
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
          
          <TabsContent value="critical" className="mt-0">
            <div className="space-y-3">
              {issues
                .filter(issue => issue.severity === 'CRITICAL')
                .map((issue) => renderIssueItem(issue))}
              
              {issues.filter(issue => issue.severity === 'CRITICAL').length === 0 && (
                <div className="p-4 bg-green-50 rounded border border-green-200 text-green-700">
                  <CheckCircle className="h-5 w-5 inline-block mr-2" />
                  No critical issues found. Good job!
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="sections" className="mt-0">
            <Accordion 
              type="multiple" 
              className="w-full"
            >
              {Object.keys(data.detectedSections || {}).map(section => (
                <AccordionItem key={section} value={section}>
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center">
                      <Badge variant="outline" className="mr-2">
                        {issues.filter(i => i.resumeSection === section).length || 0}
                      </Badge>
                      {section}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {issues
                      .filter(issue => issue.resumeSection === section)
                      .map((issue) => renderIssueItem(issue))}
                    
                    {issues.filter(issue => issue.resumeSection === section).length === 0 && (
                      <div className="p-2 text-sm text-gray-500 italic">
                        No specific issues found in this section.
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default EnhancedSuggestions; 