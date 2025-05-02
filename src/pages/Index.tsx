import React from 'react';
import OptionCard from '../components/OptionCard';
import { FileText, FileUp, CheckCircle, Target } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)' }}>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-6">ATS Score Checker</h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Analyze your resume against ATS systems or compare it with specific job descriptions to improve your chances of landing your dream job.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <OptionCard
            title="Quick Score Check"
            description="Get an instant ATS compatibility score for your resume and receive improvement suggestions."
            icon={<CheckCircle className="w-10 h-10 text-ats-primary" />}
            to="/score-check"
          />
          
          <OptionCard
            title="Compare with Job Description"
            description="Match your resume against a specific job description for targeted improvements."
            icon={<Target className="w-10 h-10 text-ats-primary" />}
            to="/job-match"
          />
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-gray-600 max-w-2xl mx-auto text-sm">
            Powered by AI, our tool helps you optimize your resume for Applicant Tracking Systems
            and provides actionable suggestions to increase your interview chances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
