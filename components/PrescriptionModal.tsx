
import React, { useState, useRef } from 'react';
import { Medicine } from '../types';

interface PrescriptionModalProps {
  medicine: Medicine;
  onClose: () => void;
  onApproved: (imageBase64: string) => void;
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ medicine, onClose, onApproved }) => {
  const [step, setStep] = useState<'upload' | 'verifying'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleUpload();
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    setStep('verifying');
    // In a real app we'd convert to base64. Here we use a high-quality placeholder to simulate.
    const fakeImage = "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=60";
    setTimeout(() => {
      onApproved(fakeImage);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[150] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl transform transition-all scale-100 animate-in fade-in zoom-in duration-300">
        <div className="bg-teal-600 p-6 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <div className="flex items-center gap-3 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <h2 className="text-2xl font-bold">Prescription Required</h2>
          </div>
          <p className="text-teal-50 text-sm opacity-90">Regulatory requirement for <b>{medicine.name}</b></p>
        </div>

        <div className="p-8">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*,application/pdf"
            onChange={handleFileChange}
          />
          
          {step === 'upload' ? (
            <div className="space-y-6">
              <div 
                className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-teal-500 transition-colors cursor-pointer group" 
                onClick={triggerUpload}
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                </div>
                <h3 className="font-bold text-slate-800 text-lg">Click to select from device</h3>
                <p className="text-slate-500 text-sm mt-2">PDF, PNG or JPG files allowed (Max 5MB)</p>
              </div>

              <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
                <svg className="flex-shrink-0" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                <div className="text-xs text-orange-800 leading-relaxed font-medium">
                  Upload a valid prescription signed by a registered practitioner.
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={onClose}
                  className="flex-1 py-3 text-slate-600 font-bold border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={triggerUpload}
                  className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-500/20 transition-all active:scale-[0.98]"
                >
                  Select File
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 space-y-6">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-teal-600 border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-slate-800">Uploading...</h3>
                <p className="text-slate-500 font-medium">Attaching to your order</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionModal;
