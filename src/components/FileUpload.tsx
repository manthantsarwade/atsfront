
import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File) => void;
}

const FileUpload = ({ label, accept = ".pdf,.doc,.docx", onChange }: FileUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-10 h-10 text-ats-primary mb-3" />
          <p className="mb-2 text-sm text-gray-500">{label}</p>
          <p className="text-xs text-gray-500">PDF, DOC, or DOCX (MAX. 10MB)</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
