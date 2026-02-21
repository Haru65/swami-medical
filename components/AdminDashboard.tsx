
import React, { useState } from 'react';
import { Order, Medicine, OrderStatus, User, View } from '../types';

interface AdminDashboardProps {
  orders: Order[];
  medicines: Medicine[];
  currentUser: User | null;
  onRestock: (id: string, amount: number) => void;
  onAddMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onNavigate: (view: View) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  medicines,
  currentUser,
  onRestock,
  onAddMedicine,
  onUpdateOrderStatus,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'addmedicine'>('orders');
  const [viewPrescription, setViewPrescription] = useState<string | null>(null);
  const [loadingMedicines, setLoadingMedicines] = useState(false);
  const [medicinesError, setMedicinesError] = useState<string | null>(null);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    category: '',
    price: 0,
    stock: 0,
    requiresPrescription: false,
    description: '',
    usage: '',
    sideEffects: ''
  });
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [addMedicineError, setAddMedicineError] = useState<string | null>(null);
  const [addMedicineSuccess, setAddMedicineSuccess] = useState(false);

  const handleAddMedicine = async () => {
    setAddMedicineError(null);
    
    if (!newMedicine.name || !newMedicine.name.trim()) {
      setAddMedicineError('Medicine name is required');
      return;
    }
    if (!newMedicine.category) {
      setAddMedicineError('Category is required');
      return;
    }
    if (newMedicine.price <= 0) {
      setAddMedicineError('Price must be greater than 0');
      return;
    }
    if (newMedicine.stock <= 0) {
      setAddMedicineError('Stock must be at least 1 unit');
      return;
    }

    setAddingMedicine(true);
    try {
      await onAddMedicine({
        ...newMedicine,
        price: parseFloat(newMedicine.price.toString()),
        stock: parseInt(newMedicine.stock.toString())
      });
      
      setAddMedicineSuccess(true);
      setNewMedicine({
        name: '',
        category: '',
        price: 0,
        stock: 0,
        requiresPrescription: false,
        description: '',
        usage: '',
        sideEffects: ''
      });

      // Clear success message after 2 seconds and switch tab
      setTimeout(() => {
        setAddMedicineSuccess(false);
        setActiveTab('inventory');
      }, 2000);
    } catch (error) {
      console.error('Error adding medicine:', error);
      setAddMedicineError('Failed to add medicine. Please try again.');
    } finally {
      setAddingMedicine(false);
    }
  };

  const pendingCount = orders.filter(o => o.status === 'Pending Payment').length;

  const totalSalesRevenue = orders
    .filter(o => o.status === 'Confirmed' || o.status === 'Dispatched' || o.status === 'Delivered')
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* Admin Mode Header */}
      <div className="flex items-center justify-between gap-4 -mx-4 px-4 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-b-2xl shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-red-400"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Current Mode</p>
            <p className="text-base font-black">Admin Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => onNavigate(View.HOME)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black text-[9px] uppercase tracking-widest transition-colors shadow-lg flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Browse
        </button>
      </div>

      {/* Financial Summary Card */}
      <div className="bg-slate-900 -mx-4 -mt-4 p-6 rounded-b-[40px] text-white shadow-xl">
        <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Sales Revenue</h2>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black">₹{totalSalesRevenue.toFixed(0)}</span>
          <span className="text-teal-400 text-[10px] font-bold mb-1.5">+12.5% vs Last Month</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Active Orders</p>
            <p className="text-lg font-black">{orders.length}</p>
          </div>
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <p className="text-[8px] font-black uppercase text-slate-500 mb-1">Stock Items</p>
            <p className="text-lg font-black">{medicines.reduce((sum, m) => sum + m.stock, 0)}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-[24px] overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-white text-teal-600 shadow-md' : 'text-slate-500'
          }`}
        >
          Verify Orders
          {pendingCount > 0 && (
            <span className="w-4 h-4 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'inventory' ? 'bg-white text-teal-600 shadow-md' : 'text-slate-500'
          }`}
        >
          Manage Stock
        </button>
        <button
          onClick={() => setActiveTab('addmedicine')}
          className={`px-4 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
            activeTab === 'addmedicine' ? 'bg-white text-teal-600 shadow-md' : 'text-slate-500'
          }`}
        >
          Add Medicine
        </button>
      </div>

      {activeTab === 'orders' ? (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[32px] border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mx-auto mb-3"><path d="M9 2h6a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/></svg>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No recent transactions</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-black text-slate-800">{order.customerName}</h4>
                    <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{order.id}</span>
                  </div>
                  <div
                    className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider ${
                      order.status === 'Confirmed'
                        ? 'bg-teal-50 text-teal-600'
                        : order.status === 'Dispatched'
                        ? 'bg-blue-50 text-blue-600'
                        : order.status === 'Delivered'
                        ? 'bg-green-50 text-green-600'
                        : 'bg-orange-50 text-orange-600'
                    }`}
                  >
                    {order.status}
                  </div>
                </div>

                {order.prescriptionImage && (
                  <button
                    onClick={() => setViewPrescription(order.prescriptionImage!)}
                    className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest border border-blue-100 flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                    </svg>
                    Check Prescription
                  </button>
                )}

                <div className="space-y-1 bg-slate-50 p-3 rounded-2xl">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between text-[10px] font-bold text-slate-600">
                      <span>
                        {it.quantity}x {it.medicine.name}
                      </span>
                      <span>₹{it.medicine.price * it.quantity}</span>
                    </div>
                  ))}
                  <div className="pt-2 mt-1 border-t border-slate-200 flex justify-between text-[11px] font-black text-slate-900">
                    <span>Order Total</span>
                    <span className="text-teal-600">₹{order.total}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!order.createdByAdmin && order.status === 'Pending Payment' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Confirmed')}
                      disabled={currentUser?.id === order.userId}
                      className="flex-1 py-3 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={currentUser?.id === order.userId ? "Cannot confirm your own order" : ""}
                    >
                      Confirm Payment
                    </button>
                  )}
                  {!order.createdByAdmin && (order.status === 'Confirmed' || order.status === 'Pending Payment') && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Dispatched')}
                      disabled={currentUser?.id === order.userId}
                      className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title={currentUser?.id === order.userId ? "Cannot dispatch your own order" : ""}
                    >
                      Mark Dispatched
                    </button>
                  )}
                  {!order.createdByAdmin && order.status === 'Dispatched' && (
                    <button
                      onClick={() => onUpdateOrderStatus(order.id, 'Delivered')}
                      className="flex-1 py-3 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all"
                    >
                      Mark Delivered
                    </button>
                  )}
                  {order.createdByAdmin && (
                    <div className="w-full py-3 bg-slate-100 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest text-center">
                      Admin Order - External
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'inventory' ? (
        <div className="space-y-2.5">
          {loadingMedicines ? (
            <div className="text-center py-12 bg-white rounded-[32px] border border-slate-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-3"></div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Loading medicines...</p>
            </div>
          ) : medicinesError ? (
            <div className="text-center py-12 bg-red-50 rounded-[32px] border border-red-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" className="mx-auto mb-3"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-red-600 font-bold text-xs uppercase tracking-widest">{medicinesError}</p>
            </div>
          ) : medicines.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-[32px] border border-slate-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" className="mx-auto mb-3"><path d="M21 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5m16 0h-4V3h-8v2H3m6 0v4m6-4v4"/></svg>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No medicines available</p>
              <p className="text-slate-300 text-[10px] mt-2">Add a new medicine to get started</p>
            </div>
          ) : (
            medicines.map(med => (
              <div key={med.id} className="bg-white p-3 rounded-[24px] border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2.5">
                    <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
                  </svg>
                </div>
                <div className="flex-grow">
                  <h4 className="text-[11px] font-black text-slate-800">{med.name}</h4>
                  <p className="text-[9px] font-bold text-slate-400">
                    Stock: <span className={med.stock < 10 ? 'text-red-500' : 'text-teal-600'}>{med.stock} Units</span>
                  </p>
                </div>
                <button
                  onClick={() => onRestock(med.id, 50)}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl text-[9px] font-black uppercase"
                >
                  +50
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-100 p-6 space-y-4">
          <h3 className="font-black text-slate-800">Add New Medicine</h3>

          {addMedicineError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              <p className="text-red-600 text-[11px] font-bold">{addMedicineError}</p>
            </div>
          )}

          {addMedicineSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl flex gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" className="shrink-0 mt-0.5"><polyline points="20 6 9 17 4 12"/></svg>
              <p className="text-green-600 text-[11px] font-bold">Medicine added successfully!</p>
            </div>
          )}

          <input
            type="text"
            placeholder="Medicine Name *"
            value={newMedicine.name}
            onChange={e => setNewMedicine({...newMedicine, name: e.target.value})}
            disabled={addingMedicine}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          />

          <select
            value={newMedicine.category}
            onChange={e => setNewMedicine({...newMedicine, category: e.target.value})}
            disabled={addingMedicine}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          >
            <option value="">Select Category *</option>
            <option value="Tablets & Capsules">Tablets & Capsules</option>
            <option value="Syrups">Syrups</option>
            <option value="Injections">Injections</option>
            <option value="Oints & Creams">Oints & Creams</option>
            <option value="Vitamins & Supplements">Vitamins & Supplements</option>
            <option value="Immunity Boosters">Immunity Boosters</option>
            <option value="Protein & Nutrition">Protein & Nutrition</option>
            <option value="Herbal Products">Herbal Products</option>
          </select>

          <input
            type="number"
            placeholder="Price (₹) *"
            value={newMedicine.price || ''}
            onChange={e => setNewMedicine({...newMedicine, price: parseFloat(e.target.value) || 0})}
            disabled={addingMedicine}
            min="0"
            step="0.01"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          />

          <input
            type="number"
            placeholder="Initial Stock *"
            value={newMedicine.stock || ''}
            onChange={e => setNewMedicine({...newMedicine, stock: parseInt(e.target.value) || 0})}
            disabled={addingMedicine}
            min="1"
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          />

          <textarea
            placeholder="Description"
            value={newMedicine.description}
            onChange={e => setNewMedicine({...newMedicine, description: e.target.value})}
            disabled={addingMedicine}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          />

          <textarea
            placeholder="Usage Instructions"
            value={newMedicine.usage}
            onChange={e => setNewMedicine({...newMedicine, usage: e.target.value})}
            disabled={addingMedicine}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          />

          <textarea
            placeholder="Side Effects"
            value={newMedicine.sideEffects}
            onChange={e => setNewMedicine({...newMedicine, sideEffects: e.target.value})}
            disabled={addingMedicine}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 disabled:opacity-50"
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={newMedicine.requiresPrescription}
              onChange={e => setNewMedicine({...newMedicine, requiresPrescription: e.target.checked})}
              disabled={addingMedicine}
              className="w-4 h-4"
            />
            <span className="text-sm font-bold text-slate-700">Requires Prescription</span>
          </label>

          <button
            onClick={handleAddMedicine}
            disabled={addingMedicine}
            className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {addingMedicine ? 'Adding Medicine...' : 'Add Medicine'}
          </button>
        </div>
      )}

      {viewPrescription && (
        <div className="fixed inset-0 bg-slate-900/95 z-[300] flex flex-col p-6 items-center justify-center animate-in fade-in duration-300">
          <div className="bg-white rounded-[32px] p-4 w-full max-w-sm flex flex-col items-center">
            <h3 className="text-sm font-black mb-4">Verification Check</h3>
            <img src={viewPrescription} className="max-w-full max-h-[60vh] rounded-2xl object-contain shadow-lg mb-6" alt="Prescription" />
            <button onClick={() => setViewPrescription(null)} className="w-full py-4 bg-slate-900 text-white font-black text-[10px] uppercase rounded-2xl">
              Close Viewer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
