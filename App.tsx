
import React, { useState, useEffect } from 'react';
import { Medicine, CartItem, User, View, Order, OrderStatus } from './types';
import BottomNav from './components/BottomNav';
import Auth from './components/Auth';
import MedicineGrid from './components/MedicineGrid';
import CartSheet from './components/CartSheet';
import Checkout from './components/Checkout';
import PrescriptionModal from './components/PrescriptionModal';
import OrderSuccess from './components/OrderSuccess';
import AdminDashboard from './components/AdminDashboard';
import AppHeader from './components/AppHeader';
import Account from './components/Account';

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.HOME);
  const [user, setUser] = useState<User | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [prescriptionPendingMed, setPrescriptionPendingMed] = useState<Medicine | null>(null);
  const [lastUploadedPrescription, setLastUploadedPrescription] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Load initial data
  useEffect(() => {
    const initApp = async () => {
      try {
        // Check for saved user session
        const savedUser = sessionStorage.getItem('currentUser');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Fetch medicines from API
        const medicinesRes = await fetch(`${API_URL}/api/medicines`);
        if (medicinesRes.ok) {
          const meds = await medicinesRes.json();
          setMedicines(meds);
        }

        // Fetch user orders if logged in
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          const ordersRes = await fetch(`${API_URL}/api/orders?userId=${parsedUser.id}`);
          if (ordersRes.ok) {
            const userOrders = await ordersRes.json();
            setOrders(userOrders);
          }
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    initApp();
  }, [API_URL]);

  const handleLogout = () => {
    sessionStorage.removeItem('currentUser');
    setUser(null);
    setView(View.HOME);
    setCart([]);
    setOrders([]);
  };

  const getEffectiveMedicines = () => {
    return medicines.map(med => {
      const cartItem = cart.find(ci => ci.medicine.id === med.id);
      const cartQty = cartItem ? cartItem.quantity : 0;
      return { ...med, stock: Math.max(0, med.stock - cartQty) };
    });
  };

  const addToCart = (medicine: Medicine) => {
    if (!user) {
      setView(View.LOGIN);
      return;
    }

    const currentMedInInventory = medicines.find(m => m.id === medicine.id);
    const cartItem = cart.find(ci => ci.medicine.id === medicine.id);
    const currentCartQty = cartItem ? cartItem.quantity : 0;

    if (!currentMedInInventory || currentMedInInventory.stock <= currentCartQty) return;

    if (medicine.requiresPrescription && !cartItem) {
      setPrescriptionPendingMed(medicine);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateCartQuantity = (id: string, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === id);
      if (!existing) return prev;

      const currentMedInInventory = medicines.find(m => m.id === id);
      if (delta > 0 && currentMedInInventory && currentMedInInventory.stock <= existing.quantity) {
        return prev;
      }

      return prev
        .map(item =>
          item.medicine.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  const handlePrescriptionApproved = (medicine: Medicine, imageBase64: string) => {
    setLastUploadedPrescription(imageBase64);
    setPrescriptionPendingMed(null);
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicine.id === medicine.id
            ? { ...item, quantity: item.quantity + 1, prescriptionAttached: imageBase64 }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1, prescriptionAttached: imageBase64 }];
    });
    setIsCartOpen(true);
  };

  const finalizeOrder = async (paymentMethod: 'Cash on Delivery' | 'Online Payment') => {
    if (!user) return;

    const subtotal = cart.reduce((sum, i) => sum + i.medicine.price * i.quantity, 0);

    try {
      const orderData = {
        userId: user.id,
        items: cart,
        total: subtotal + 50,
        customerName: user.username,
        paymentMethod,
        prescriptionImage: lastUploadedPrescription
      };

      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Failed to create order');

      const newOrder = await response.json();

      // Refresh medicines list to get updated stock
      const medicinesRes = await fetch(`${API_URL}/api/medicines`);
      if (medicinesRes.ok) {
        const updatedMeds = await medicinesRes.json();
        setMedicines(updatedMeds);
      }

      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setLastUploadedPrescription(undefined);
      setView(View.SUCCESS);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }
  };

  const restockMedicine = async (id: string, amount: number) => {
    const medicine = medicines.find(m => m.id === id);
    if (!medicine) return;

    try {
      const response = await fetch(`${API_URL}/api/medicines/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: medicine.stock + amount })
      });

      if (!response.ok) throw new Error('Failed to update medicine');

      const updated = await response.json();
      setMedicines(prev => prev.map(m => (m.id === id ? updated : m)));
    } catch (error) {
      console.error('Error restocking medicine:', error);
      alert('Failed to restock medicine');
    }
  };

  const addMedicine = async (medicine: Omit<Medicine, 'id'>) => {
    try {
      const response = await fetch(`${API_URL}/api/medicines`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicine)
      });

      if (!response.ok) throw new Error('Failed to add medicine');

      const newMedicine = await response.json();
      setMedicines(prev => [...prev, newMedicine]);
    } catch (error) {
      console.error('Error adding medicine:', error);
      alert('Failed to add medicine');
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error('Failed to update order');

      const updated = await response.json();
      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading...</p>
          </div>
        </div>
      );
    }

    const homeView = (
      <MedicineGrid
        medicines={getEffectiveMedicines()}
        onAddToCart={addToCart}
        onPrescriptionFlow={() => setPrescriptionPendingMed(medicines[0])}
      />
    );

    switch (view) {
      case View.HOME:
        return homeView;
      case View.LOGIN:
      case View.SIGNUP:
        return (
          <Auth
            mode={view === View.LOGIN ? 'login' : 'signup'}
            onSuccess={u => {
              setUser(u);
              setView(View.HOME);
            }}
            onToggle={() => setView(view === View.LOGIN ? View.SIGNUP : View.LOGIN)}
          />
        );
      case View.CHECKOUT:
        return <Checkout cart={cart} onSuccess={finalizeOrder} onBack={() => setView(View.HOME)} />;
      case View.SUCCESS:
        return <OrderSuccess orders={orders} onHome={() => setView(View.HOME)} />;
      case View.ADMIN:
        return user?.isAdmin ? (
          <AdminDashboard
            orders={orders}
            medicines={medicines}
            onRestock={restockMedicine}
            onAddMedicine={addMedicine}
            onUpdateOrderStatus={updateOrderStatus}
          />
        ) : homeView;
      case View.ACCOUNT:
        return user ? (
          <Account user={user} orders={orders} onLogout={handleLogout} />
        ) : (
          <Auth
            mode="login"
            onSuccess={u => {
              setUser(u);
              setView(View.HOME);
            }}
            onToggle={() => setView(View.SIGNUP)}
          />
        );
      default:
        return homeView;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <AppHeader user={user} onProfileClick={() => setView(user ? View.ACCOUNT : View.LOGIN)} />
      <main className="flex-grow pt-4 px-4 overflow-y-auto">
        {renderContent()}
      </main>
      <BottomNav
        activeView={view}
        onViewChange={setView}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        user={user}
        onCartOpen={() => setIsCartOpen(true)}
      />
      <CartSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onCheckout={() => {
          setIsCartOpen(false);
          setView(View.CHECKOUT);
        }}
      />
      {prescriptionPendingMed && (
        <PrescriptionModal
          medicine={prescriptionPendingMed}
          onClose={() => setPrescriptionPendingMed(null)}
          onApproved={img => handlePrescriptionApproved(prescriptionPendingMed, img)}
        />
      )}
    </div>
  );
};

export default App;
