
import React, { useState, useRef } from 'react';
import { QRCode } from 'qrcode.react';
import { CartItem } from '../types';

interface CheckoutProps {
  cart: CartItem[];
  onSuccess: (paymentMethod: 'Cash on Delivery' | 'Online Payment') => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onSuccess, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);
  
  const subtotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const shipping = 50.00;
  const total = subtotal + shipping;
  
  // UPI ID for the store
  const UPI_ID = 'swamimedical@okaxis';
  const PAYEE_NAME = 'Swami Medical Store';
  
  // Generate UPI payment link
  const generateUpiLink = () => {
    const upiString = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&am=${total}&tn=Order%20at%20${PAYEE_NAME}`;
    return upiString;
  };

  const handleOrder = () => {
    if (paymentMethod === 'online') {
      setShowUpiModal(true);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        onSuccess('Cash on Delivery');
      }, 2000);
    }
  };

  const confirmOnlinePayment = () => {
    setShowUpiModal(false);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('Online Payment');
    }, 2000);
  };

  const downloadQR = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `payment-qr-${Date.now()}.png`;
        link.click();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-32">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200">
          <div className="px-4 md:px-6 py-4 flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Checkout</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 px-4 md:px-6 py-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Information */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg">1</div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Delivery Information</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base font-medium transition-all"
                />
                <input 
                  type="tel" 
                  placeholder="Mobile Number" 
                  className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base font-medium transition-all"
                />
                <textarea 
                  rows={3} 
                  placeholder="Full Delivery Address" 
                  className="col-span-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base font-medium transition-all resize-none"
                ></textarea>
                <input 
                  type="text" 
                  placeholder="City" 
                  className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base font-medium transition-all"
                />
                <input 
                  type="text" 
                  placeholder="PIN Code" 
                  className="px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-base font-medium transition-all"
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold text-lg">2</div>
                <h2 className="text-lg md:text-xl font-bold text-slate-900">Payment Method</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {/* COD Option */}
                <button 
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                    paymentMethod === 'cod' 
                      ? 'border-teal-600 bg-teal-50' 
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    paymentMethod === 'cod' ? 'border-teal-600 bg-teal-600' : 'border-slate-400'
                  }`}>
                    {paymentMethod === 'cod' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base">Cash on Delivery (COD)</h3>
                    <p className="text-slate-600 text-sm font-medium">Pay when you receive your order</p>
                  </div>
                </button>

                {/* Online Payment Option */}
                <button 
                  onClick={() => setPaymentMethod('online')}
                  className={`p-5 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                    paymentMethod === 'online' 
                      ? 'border-teal-600 bg-teal-50' 
                      : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    paymentMethod === 'online' ? 'border-teal-600 bg-teal-600' : 'border-slate-400'
                  }`}>
                    {paymentMethod === 'online' && (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-base">UPI Payment (Google Pay, PhonePe, etc.)</h3>
                    <p className="text-slate-600 text-sm font-medium">Quick and secure payment via QR code</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Order Items Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Order Items</h3>
              <div className="space-y-3 divide-y divide-slate-200">
                {cart.map((item) => (
                  <div key={item.medicine.id} className="py-3 flex justify-between items-center">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.medicine.name}</p>
                      <p className="text-sm text-slate-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-bold text-teal-600 text-lg">₹{(item.medicine.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Order Summary</h2>
              
              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Subtotal</span>
                  <span className="font-bold text-slate-900">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600 font-medium">Shipping</span>
                  <span className="font-bold text-slate-900">₹{shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-b border-slate-200 pb-4">
                <span className="text-slate-900 font-bold text-lg">Total</span>
                <span className="text-2xl font-bold text-teal-600">₹{total.toFixed(2)}</span>
              </div>

              <button 
                onClick={handleOrder}
                disabled={isProcessing}
                className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-teal-200 hover:shadow-xl hover:shadow-teal-300 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  'Place Order'
                )}
              </button>

              <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
                <p className="text-teal-900 text-sm font-medium">
                  ✓ Free on orders above ₹500
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPI Payment QR Modal */}
      {showUpiModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[160] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300 shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-teal-700 p-8 text-white text-center">
              <h2 className="text-2xl font-bold mb-1">Secure Payment</h2>
              <p className="text-teal-100 font-medium">Scan to pay with UPI</p>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* QR Code */}
              <div className="bg-slate-50 p-6 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center gap-4">
                <div ref={qrRef} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                  <QRCode 
                    value={generateUpiLink()} 
                    size={200}
                    level="H"
                    includeMargin={true}
                    quietZone={10}
                  />
                </div>
                <button 
                  onClick={downloadQR}
                  className="text-sm text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" y2="3"/></svg>
                  Download QR
                </button>
              </div>

              {/* UPI Details */}
              <div className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl border border-teal-200">
                <div className="text-center space-y-2">
                  <p className="text-slate-600 text-sm font-medium">UPI ID</p>
                  <p className="text-xl font-bold text-slate-900 font-mono">{UPI_ID}</p>
                  <p className="text-slate-600 text-sm font-medium mt-4">Amount to Pay</p>
                  <p className="text-3xl font-bold text-teal-600">₹{total.toFixed(2)}</p>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex gap-3">
                  <svg className="flex-shrink-0 w-5 h-5 text-blue-600 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-1">How to Pay:</p>
                    <ol className="list-decimal list-inside space-y-1 text-blue-800">
                      <li>Open Google Pay, PhonePe, or any UPI app</li>
                      <li>Scan this QR code</li>
                      <li>Verify amount and confirm payment</li>
                      <li>Click "I have paid" after successful payment</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setShowUpiModal(false)} 
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmOnlinePayment} 
                  className="flex-1 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-teal-200 active:scale-95 transition-all"
                >
                  Payment Confirmed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
