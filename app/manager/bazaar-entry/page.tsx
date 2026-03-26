'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import { deleteBazar, getBazar, postBazar, putBazar } from '@/actions/server/Bazar';
import BazarForm from '@/Components/bazar/BazarForm';
import BazarCard from '@/Components/bazar/BazarCard';


interface BazarItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  category: string;
}

interface BazarEntry {
  _id?: string;
  date: string;
  items: BazarItem[];
  totalAmount: number;
  notes?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
}

const BazarPage = () => {
  const [bazarEntries, setBazarEntries] = useState<BazarEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState<BazarItem[]>([
    { id: 1, name: '', quantity: 0, unit: 'kg', unitPrice: 0, totalPrice: 0, category: 'vegetables' }
  ]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadBazarEntries();
  }, []);

  const loadBazarEntries = async () => {
    try {
      setLoading(true);
      const result = await getBazar();
      if (result.success) {
        setBazarEntries(result.data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBazar = async (data: any) => {
    try {
      setLoading(true);
      const result = await postBazar(data);
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'সফল!',
          text: result.message,
          confirmButtonColor: '#16a34a',
          timer: 2000,
          showConfirmButton: true
        });
        await loadBazarEntries();
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: error.message,
        confirmButtonColor: '#dc2626'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBazar = async (id: string, data: any) => {
    try {
      setLoading(true);
      const result = await putBazar(id, data);
      
      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'আপডেট সফল!',
          text: result.message,
          confirmButtonColor: '#16a34a',
          timer: 2000,
          showConfirmButton: true
        });
        await loadBazarEntries();
        return true;
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      await Swal.fire({
        icon: 'error',
        title: 'ত্রুটি!',
        text: error.message,
        confirmButtonColor: '#dc2626'
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBazar = async (id: string) => {
    const confirm = await Swal.fire({
      icon: 'warning',
      title: 'নিশ্চিত?',
      text: 'এই এন্ট্রি ডিলিট করতে চান?',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'হ্যাঁ, ডিলিট',
      cancelButtonText: 'না'
    });

    if (confirm.isConfirmed) {
      try {
        setLoading(true);
        const result = await deleteBazar(id);
        
        if (result.success) {
          await Swal.fire({
            icon: 'success',
            title: 'ডিলিট সফল!',
            text: result.message,
            confirmButtonColor: '#16a34a',
            timer: 1500,
            showConfirmButton: true
          });
          await loadBazarEntries();
        } else {
          throw new Error(result.message);
        }
      } catch (error: any) {
        await Swal.fire({
          icon: 'error',
          title: 'ত্রুটি!',
          text: error.message,
          confirmButtonColor: '#dc2626'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const addItemRow = () => {
    setItems([...items, { 
      id: Date.now(), 
      name: '', 
      quantity: 0, 
      unit: 'kg', 
      unitPrice: 0, 
      totalPrice: 0, 
      category: 'vegetables' 
    }]);
  };

  const updateItem = (id: number, field: string, value: any) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.totalPrice = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const removeItem = (id: number) => {
    if (items.length === 1) {
      Swal.fire({
        icon: 'warning',
        title: 'সতর্কতা',
        text: 'কমপক্ষে একটি আইটেম থাকা আবশ্যক',
        confirmButtonColor: '#16a34a'
      });
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
  };

  const handleSubmit = async () => {
    const invalidItems = items.filter(item => !item.name.trim() || item.quantity <= 0);
    if (invalidItems.length > 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'সতর্কতা',
        text: 'সব আইটেমের নাম এবং পরিমাণ সঠিকভাবে পূরণ করুন!',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    const submissionData = {
      date: currentDate,
      items: items.map(item => ({ 
        ...item, 
        totalPrice: item.quantity * item.unitPrice 
      })),
      totalAmount: calculateTotal(),
      notes: notes.trim() || undefined,
      timestamp: new Date().toISOString()
    };

    let success = false;
    if (editingEntry) {
      success = await handleUpdateBazar(editingEntry, submissionData);
    } else {
      success = await handleAddBazar(submissionData);
    }

    if (success) {
      setItems([{ id: 1, name: '', quantity: 0, unit: 'kg', unitPrice: 0, totalPrice: 0, category: 'vegetables' }]);
      setNotes('');
      setCurrentDate(new Date().toISOString().split('T')[0]);
      setShowForm(false);
      setEditingEntry(null);
    }
  };

  const startEdit = (entry: BazarEntry) => {
    setCurrentDate(entry.date);
    setItems(entry.items.map(item => ({ ...item, id: Date.now() + Math.random() })));
    setNotes(entry.notes || '');
    setEditingEntry(entry._id || null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingEntry(null);
    setItems([{ id: 1, name: '', quantity: 0, unit: 'kg', unitPrice: 0, totalPrice: 0, category: 'vegetables' }]);
    setNotes('');
    setCurrentDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="min-h-screen max-w-7xl mx-auto bg-white ">
      <div className=" px-4">
        <header className="py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-green-700">📊 বাজার এন্ট্রি</h1>
              <p className="text-green-600 text-sm mt-1">দৈনিক বাজার খরচ ট্র্যাক করুন</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center gap-2 hover:bg-green-700 transition-colors shadow-md"
              >
                <Plus size={20} /> নতুন এন্ট্রি
              </button>
            )}
          </div>
        </header>

        <main className="py-8">
          {loading && !showForm && (
            <div className="flex justify-center items-center py-20">
              <Loader className="animate-spin text-green-600" size={40} />
            </div>
          )}

          {showForm && (
            <BazarForm
              editingEntry={editingEntry}
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              items={items}
              updateItem={updateItem}
              removeItem={removeItem}
              addItemRow={addItemRow}
              notes={notes}
              setNotes={setNotes}
              calculateTotal={calculateTotal}
              loading={loading}
              closeForm={closeForm}
              handleSubmit={handleSubmit}
            />
          )}

          {!showForm && !loading && bazarEntries.length > 0 && (
            <div className="space-y-6">
              {bazarEntries.map(entry => (
                <BazarCard
                  key={entry._id}
                  entry={entry}
                  onEdit={startEdit}
                  onDelete={handleDeleteBazar}
                />
              ))}
            </div>
          )}

          {!showForm && !loading && bazarEntries.length === 0 && (
            <div className="text-center py-16">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <p className="text-gray-500 text-lg mb-6">এখনো কোনো এন্ট্রি নেই</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold inline-flex items-center gap-2"
                >
                  <Plus size={20} /> প্রথম এন্ট্রি যোগ করুন
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BazarPage;