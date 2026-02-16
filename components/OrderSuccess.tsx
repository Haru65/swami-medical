
import React from 'react';
import { Order } from '../types';

interface OrderSuccessProps {
  orders: Order[];
  onHome: () => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ orders, onHome }) => {
  const latestOrder = orders[0];
  const isPending = latestOrder?.status === 'Pending Payment';

  return (
    <div className="max-w-xl mx-auto text-center py-10 animate-in zoom-in fade-in duration-500 pb-20">
      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce ${isPending ? 'bg-blue-100' : 'bg-teal-100'}`}>
        {isPending ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        )}
      </div>
      
      <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
        {isPending ? 'Payment Awaiting Verification' : 'Order Placed Successfully!'}
      </h1>
      
      <p className="text-sm text-slate-500 mb-10 leading-relaxed font-medium px-6">
        {isPending 
          ? "We've received your request! Our admin team is verifying your online payment. You'll receive a confirmation notification once verified."
          : "Thank you for choosing Swami Medical Store. Your order has been confirmed and we're preparing it for dispatch."}
      </p>
      
      <div className="grid grid-cols-1 gap-4 mb-10 px-6">
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
          <p className="text-lg font-black text-slate-800">{latestOrder?.id || '#SMS-XXXXXX'}</p>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col items-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
          <div className={`px-4 py-1 rounded-full text-xs font-black mt-1 ${isPending ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}>
            {latestOrder?.status || 'Processing'}
          </div>
        </div>
      </div>

      <button 
        onClick={onHome}
        className="w-full max-w-xs mx-auto py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all"
      >
        Go to Home
      </button>
    </div>
  );
};

export default OrderSuccess;
