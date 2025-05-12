import React from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Target } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #fff8e1 0%, #fffde7 100%)' }}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">ATS Score Checker</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Analyze your resume against ATS systems or compare it with specific job
            descriptions to improve your chances of landing your dream job.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Link to="/score-check" className="block">
            <div className="bg-white rounded-xl shadow-md p-8 h-full flex flex-col transition-all hover:shadow-lg border border-transparent hover:border-purple-200">
              <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Quick Score Check</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Get an instant ATS compatibility score for your resume and receive improvement suggestions.
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 group">
                  Get Started <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>

          <Link to="/job-match" className="block">
            <div className="bg-white rounded-xl shadow-md p-8 h-full flex flex-col transition-all hover:shadow-lg border border-transparent hover:border-purple-200">
              <div className="bg-purple-100 p-3 rounded-full w-fit mb-4">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-3">Compare with Job Description</h2>
              <p className="text-gray-600 mb-6 flex-grow">
                Match your resume against a specific job description for targeted improvements.
              </p>
              <div className="flex justify-end">
                <Button variant="ghost" className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 group">
                  Get Started <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16 text-center text-gray-500 text-sm">
          <p className="max-w-3xl mx-auto">
            Powered by AI, our tool helps you optimize your resume for Applicant Tracking Systems
            and provides actionable suggestions to increase your interview chances.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
