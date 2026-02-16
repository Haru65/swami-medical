
import React from 'react';
import { CartItem } from '../types';

interface CartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartSheet: React.FC<CartSheetProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end">
      <div 
        className="absolute inset-0" 
        onClick={onClose} 
      />
      <div className="bg-white w-full rounded-t-[32px] z-10 max-h-[85vh] flex flex-col animate-in slide-in-from-bottom duration-300 pb-safe shadow-[0_-10px_30px_rgba(0,0,0,0.1)]">
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-4 mb-2 shrink-0"></div>
        
        <div className="px-6 py-4 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-black text-slate-800">My Cart</h2>
          <span className="bg-teal-50 text-teal-600 text-xs font-black px-2.5 py-1 rounded-lg">{items.length} Items</span>
        </div>

        <div className="flex-grow overflow-y-auto px-6 py-2 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <p className="text-slate-400 font-bold">Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.medicine.id} className="flex gap-4 items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1">{item.medicine.name}</h4>
                  <p className="text-xs font-extrabold text-slate-900">₹{item.medicine.price}</p>
                </div>
                <div className="flex items-center bg-white border border-slate-200 rounded-xl px-1">
                  <button onClick={() => onUpdateQuantity(item.medicine.id, -1)} className="p-1.5 text-slate-400 font-bold">-</button>
                  <span className="w-6 text-center text-xs font-black text-slate-700">{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.medicine.id, 1)} className="p-1.5 text-teal-600 font-bold">+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-slate-100 shrink-0">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Estimated Total</span>
              <span className="text-2xl font-black text-slate-900">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-slate-900 text-white py-4 rounded-[20px] font-bold text-lg shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartSheet;
