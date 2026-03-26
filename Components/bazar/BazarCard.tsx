'use client';

import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

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
}

interface BazarCardProps {
  entry: BazarEntry;
  onEdit: (entry: BazarEntry) => void;
  onDelete: (id: string) => void;
}

const BazarCard = ({ entry, onEdit, onDelete }: BazarCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-green-600">
      <div className="flex justify-between items-start mb-4 pb-4 border-b">
        <div>
          <h3 className="text-xl font-bold text-green-700">
            📅 {new Date(entry.date).toLocaleDateString('bn-BD', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </h3>
          {entry.notes && (
            <p className="text-gray-600 text-sm mt-1">📝 {entry.notes}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(entry)}
            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(entry._id!)}
            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto mb-4">
        <table className="w-full text-sm">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-green-900">পণ্য</th>
              <th className="px-4 py-2 text-center font-semibold text-green-900">পরিমাণ</th>
              <th className="px-4 py-2 text-center font-semibold text-green-900">দাম</th>
              <th className="px-4 py-2 text-right font-semibold text-green-900">মোট</th>
            </tr>
          </thead>
          <tbody>
            {entry.items.map((item, idx) => (
              <tr key={idx} className="border-b hover:bg-green-50">
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2 text-center">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-4 py-2 text-center">৳{item.unitPrice}</td>
                <td className="px-4 py-2 text-right font-semibold text-green-600">
                  ৳{item.totalPrice.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-green-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-900">মোট খরচ:</span>
          <span className="text-3xl font-bold text-green-600">
            ৳{entry.totalAmount.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BazarCard;