
import React, { useState } from 'react';
import { Medicine } from '../types';

interface MedicineGridProps {
  medicines: Medicine[];
  onAddToCart: (m: Medicine) => void;
  onPrescriptionFlow: () => void;
}

const MedicineGrid: React.FC<MedicineGridProps> = ({ medicines, onAddToCart, onPrescriptionFlow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);
  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);

  const categories: string[] = Array.from(new Set(medicines.map(m => m.category)));
  const conditions: string[] = Array.from(new Set(medicines.filter(m => m.condition).map(m => m.condition!)));

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType ? (med.category === filterType || med.condition === filterType) : true;
    return matchesSearch && matchesFilter;
  });

  const getMedicineImage = (med: Medicine) => {
    // Use server image proxy for reliability
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    return `${apiUrl}/api/image/${med.id}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Search medicines, conditions..." 
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-slate-100 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base md:text-lg font-medium placeholder-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Categories */}
          {!searchTerm && (
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              <button 
                onClick={() => setFilterType(null)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                  filterType === null 
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                All
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterType(cat)}
                  className={`px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap transition-all ${
                    filterType === cat 
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8">
        {/* Quick Upload Banner */}
        <button 
          onClick={onPrescriptionFlow}
          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 md:p-8 text-white shadow-lg hover:shadow-xl hover:from-slate-800 active:scale-95 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-1">Need Prescription Medicines?</h3>
            <p className="text-slate-300 text-sm font-medium">Upload prescription for fast checkout on Rx medicines</p>
          </div>
          <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
          </div>
        </button>

        {/* Results Count */}
        {filteredMedicines.length > 0 && (
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                {filterType ? `${filterType}` : 'All Medicines'}
              </h2>
              <p className="text-slate-600 text-sm mt-1">{filteredMedicines.length} products available</p>
            </div>
          </div>
        )}

        {/* Medicine Grid - Responsive */}
        {filteredMedicines.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredMedicines.map((med) => (
              <div 
                key={med.id} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
              >
                {/* Medicine Image */}
                <div 
                  className="w-full aspect-square bg-slate-100 overflow-hidden cursor-pointer group relative"
                  onClick={() => setSelectedMed(med)}
                >
                  <img 
                    src={getMedicineImage(med)} 
                    alt={med.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/400x400/e0e7ff/6366f1?text=${encodeURIComponent(med.name.substring(0, 15))}`;
                    }}
                  />
                  {med.requiresPrescription && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                      Rx Required
                    </div>
                  )}
                  {med.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md">
                      Low Stock
                    </div>
                  )}
                </div>

                {/* Medicine Info */}
                <div className="p-4 flex flex-col flex-1 gap-3">
                  <div className="cursor-pointer" onClick={() => setSelectedMed(med)}>
                    <h3 className="font-bold text-slate-900 text-sm md:text-base line-clamp-2 hover:text-teal-600 transition-colors">
                      {med.name}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm font-medium mt-1">{med.category}</p>
                  </div>

                  {/* Price and Stock */}
                  <div className="space-y-2 mt-auto border-t border-slate-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg md:text-xl font-bold text-teal-600">₹{med.price}</span>
                      <span className={`text-xs font-semibold px-2 py-1 rounded ${
                        med.stock > 10 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {med.stock} left
                      </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(med);
                      }}
                      disabled={med.stock === 0}
                      className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 md:py-3 rounded-lg font-bold text-sm transition-colors active:scale-95 flex items-center justify-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 md:py-24">
            <svg className="w-16 h-16 md:w-20 md:h-20 text-slate-300 mb-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <h3 className="text-lg md:text-xl font-bold text-slate-800 mb-1">No medicines found</h3>
            <p className="text-slate-600 text-sm md:text-base">Try searching with different keywords</p>
          </div>
        )}
      </div>

      {/* Medicine Detail Modal */}
      {selectedMed && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto md:shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center md:hidden">
              <h2 className="text-lg font-bold text-slate-900">Medicine Details</h2>
              <button 
                onClick={() => setSelectedMed(null)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6l-12 12"/><path d="M6 6l12 12"/></svg>
              </button>
            </div>

            <div className="px-6 py-8 space-y-6">
              {/* Image and Title */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img 
                    src={getMedicineImage(selectedMed)}
                    alt={selectedMed.name}
                    className="w-full aspect-square object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/600x600/e0e7ff/6366f1?text=${encodeURIComponent(selectedMed.name.substring(0, 15))}`;
                    }}
                  />
                </div>

                <div className="md:w-2/3 space-y-4">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{selectedMed.name}</h2>
                    <p className="text-lg text-teal-600 font-semibold">{selectedMed.category}</p>
                    {selectedMed.condition && (
                      <p className="text-slate-600 text-base mt-2">For: {selectedMed.condition}</p>
                    )}
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-xl p-4">
                    <div className="text-center">
                      <p className="text-slate-600 text-sm font-medium mb-1">Price</p>
                      <p className="text-4xl font-bold text-teal-600">₹{selectedMed.price}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1 text-center bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <p className="text-slate-600 text-xs md:text-sm font-medium">Stock Available</p>
                      <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-1">{selectedMed.stock}</p>
                    </div>
                    {selectedMed.requiresPrescription && (
                      <div className="flex-1 text-center bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-700 text-xs md:text-sm font-bold">⚕️ PRESCRIPTION</p>
                        <p className="text-red-600 text-xs mt-1 font-medium">Upload required</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2">About</h3>
                <p className="text-slate-700 text-base leading-relaxed">{selectedMed.description}</p>
              </div>

              {/* Usage */}
              <div className="bg-teal-50 border-2 border-teal-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <h4 className="text-lg font-bold text-teal-900">How to Use</h4>
                </div>
                <p className="text-teal-800 text-base font-semibold">{selectedMed.usage}</p>
              </div>

              {/* Side Effects */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                  <h4 className="text-lg font-bold text-orange-900">Possible Side Effects</h4>
                </div>
                <p className="text-orange-800 text-base font-semibold">{selectedMed.sideEffects}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 sticky bottom-0 bg-white -mx-6 px-6 py-4 border-t border-slate-200">
                <button 
                  onClick={() => setSelectedMed(null)}
                  className="flex-1 py-3 md:py-4 bg-slate-200 text-slate-700 font-bold rounded-lg text-base hover:bg-slate-300 transition-colors active:scale-95"
                >
                  Close
                </button>
                <button 
                  onClick={() => {
                    onAddToCart(selectedMed);
                    setSelectedMed(null);
                  }}
                  disabled={selectedMed.stock === 0}
                  className="flex-[2] py-3 md:py-4 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-bold rounded-lg text-base shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineGrid;
