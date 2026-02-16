
import React from 'react';
import { User, Order } from '../types';

interface AccountProps {
  user: User;
  orders: Order[];
  onLogout: () => void;
}

const Account: React.FC<AccountProps> = ({ user, orders, onLogout }) => {
  const userOrders = orders.filter(o => o.customerName === user.username);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-500 via-teal-600 to-teal-700 px-4 md:px-6 py-12 md:py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/20 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400/20 rounded-full -ml-32 -mb-32"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/30 flex-shrink-0">
              <span className="text-5xl md:text-6xl font-black text-white">{user.username.charAt(0).toUpperCase()}</span>
            </div>
            <div className="text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-1">{user.username}</h2>
              <p className="text-teal-100 text-base md:text-lg font-medium">{user.email}</p>
              <p className="text-teal-100 text-sm md:text-base font-medium mt-2">Member since 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 text-center shadow-sm">
            <p className="text-slate-500 text-sm md:text-base font-medium">Total Orders</p>
            <p className="text-3xl md:text-4xl font-bold text-teal-600 mt-2">{userOrders.length}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 text-center shadow-sm">
            <p className="text-slate-500 text-sm md:text-base font-medium">Confirmed</p>
            <p className="text-3xl md:text-4xl font-bold text-green-600 mt-2">{userOrders.filter(o => o.status === 'Confirmed').length}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-xl border border-slate-200 text-center shadow-sm">
            <p className="text-slate-500 text-sm md:text-base font-medium">Total Spent</p>
            <p className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">₹{userOrders.reduce((sum, o) => sum + o.total, 0)}</p>
          </div>
        </div>

        {/* Purchase History */}
        <div>
          <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-teal-600"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
            Purchase History
          </h3>

          {userOrders.length === 0 ? (
            <div className="bg-white p-12 md:p-16 rounded-xl border border-slate-200 text-center shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-300 mx-auto mb-4"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              <p className="text-slate-500 text-lg md:text-xl font-medium mt-4">You haven't ordered anything yet</p>
              <p className="text-slate-400 text-base md:text-lg font-normal mt-2">Start browsing medicines and place your first order</p>
            </div>
          ) : (
            <div className="grid gap-4 md:gap-6">
              {userOrders.map(order => (
                <div key={order.id} className="bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm md:text-base font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">Order #{order.id}</span>
                        <span className={`text-sm md:text-base font-bold px-3 py-1 rounded-lg ${
                          order.status === 'Confirmed' 
                            ? 'bg-green-50 text-green-700' 
                            : order.status === 'Pending Payment'
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm md:text-base font-medium">{order.date || 'Recently ordered'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-600 text-sm md:text-base font-medium mb-1">Total Amount</p>
                      <p className="text-3xl md:text-4xl font-bold text-slate-900">₹{order.total}</p>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-slate-200">
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">Items</p>
                      <p className="text-lg md:text-xl font-bold text-slate-900">{order.items.length}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">Payment Method</p>
                      <p className="text-base md:text-lg font-bold text-slate-900">
                        {order.paymentMethod === 'Online Payment' ? '💳 UPI' : '🚚 COD'}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">Delivery</p>
                      <p className="text-base md:text-lg font-bold text-slate-900">{order.deliveryAddress ? order.deliveryAddress.split(',')[0] : 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-sm font-medium mb-1">Order Date</p>
                      <p className="text-base md:text-lg font-bold text-slate-900">{order.date && typeof order.date === 'string' ? order.date : 'Recently ordered'}</p>
                    </div>
                  </div>

                  {/* Status Message */}
                  {order.status === 'Pending Payment' && (
                    <div className="bg-orange-50/80 backdrop-blur border-2 border-orange-200 rounded-lg p-4 flex items-start gap-3 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" className="flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      <div>
                        <p className="text-orange-900 text-sm md:text-base font-bold mb-1">Payment Pending</p>
                        <p className="text-orange-800 text-sm md:text-base font-medium">Admin is verifying your online payment. Check back soon!</p>
                      </div>
                    </div>
                  )}
                  {order.status === 'Confirmed' && (
                    <div className="bg-green-50/80 backdrop-blur border-2 border-green-200 rounded-lg p-4 flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="flex-shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
                      <div>
                        <p className="text-green-900 text-sm md:text-base font-bold mb-1">Order Confirmed</p>
                        <p className="text-green-800 text-sm md:text-base font-medium">Payment received. Your medicines are being prepared for dispatch!</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full mt-12 py-4 md:py-5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold text-lg md:text-xl shadow-lg shadow-red-500/30 hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
          Logout from App
        </button>
      </div>
    </div>
  );
};

export default Account;
