
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-teal-600 text-white">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            <h2 className="text-xl font-bold">Shopping Cart</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <p className="text-slate-500 font-medium">Your cart is empty</p>
              <button onClick={onClose} className="mt-4 text-teal-600 font-bold hover:underline">Start Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.medicine.id} className="flex gap-4 group">
                <div className="w-16 h-16 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-800 leading-tight pr-2">{item.medicine.name}</h4>
                    <span className="font-bold text-slate-900">₹{(item.medicine.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">{item.medicine.category}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                      <button 
                        onClick={() => onUpdateQuantity(item.medicine.id, -1)}
                        className="p-1 px-3 hover:bg-slate-100 text-slate-600 transition-colors"
                      >-</button>
                      <span className="px-2 text-sm font-bold text-slate-700 min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.medicine.id, 1)}
                        disabled={item.quantity >= item.medicine.stock}
                        className="p-1 px-3 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition-colors"
                      >+</button>
                    </div>
                    <button 
                      onClick={() => onUpdateQuantity(item.medicine.id, -item.quantity)}
                      className="text-xs text-red-500 font-bold hover:underline"
                    >Remove</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-slate-100 space-y-4 bg-slate-50">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-slate-900">₹{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-teal-600 shadow-xl transition-all active:scale-[0.98]"
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
