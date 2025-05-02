import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface OptionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
}

const OptionCard = ({ title, description, icon, to }: OptionCardProps) => {
  return (
    <Link 
      to={to}
      className="flex flex-col p-8 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 cursor-pointer w-full max-w-md group"
    >
      <div className="flex items-start mb-6">
        <div className="w-16 h-16 flex items-center justify-center bg-ats-primary/10 rounded-full mr-4 group-hover:bg-ats-primary/20 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
      
      <div className="mt-auto pt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-ats-primary flex items-center">
          Get Started <ArrowRight className="w-4 h-4 ml-1" />
        </span>
      </div>
    </Link>
  );
};

export default OptionCard;
