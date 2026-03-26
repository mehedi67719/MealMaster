'use client';

import React, { useState, useEffect } from 'react';
import { Users, ChevronRight, Mail, Phone, Home, Calendar, Loader, MapPin, User, Award, CreditCard, MoreVertical, Edit2, Trash2, X } from 'lucide-react';

interface Member {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  joinDate: string;
  room?: string;
  status?: string;
  monthlyPayment?: number;
  role?: string;
  emergencyContact?: string;
  bloodGroup?: string;
}

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/members');
      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setMembers(result.data);
      }
    } catch (error) {
      console.error('❌ Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg">
                  <Users className="text-white" size={28} />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  Member Management
                </h1>
              </div>
              <p className="text-slate-500 ml-14">Manage and view all mess members</p>
            </div>
       
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Members List Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">
                  All Members ({members.length})
                </h2>
                <div className="mt-4 relative">
                  <input
                    type="text"
                    placeholder="Search members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 pl-10 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                  <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader className="animate-spin text-indigo-600" size={32} />
                </div>
              ) : filteredMembers.length > 0 ? (
                <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
                  {filteredMembers.map((member) => (
                    <button
                      key={member._id}
                      onClick={() => setSelectedMember(member)}
                      className={`w-full text-left px-6 py-4 transition-all duration-200 group ${
                        selectedMember?._id === member._id
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-l-4 border-indigo-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                              selectedMember?._id === member._id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
                                : 'bg-gradient-to-r from-slate-400 to-slate-500'
                            }`}>
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-semibold text-slate-800 truncate">
                              {member.name}
                            </p>
                          </div>
                          <p className="text-xs text-slate-500 ml-10 truncate">
                            {member.email}
                          </p>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`text-slate-400 transition-all ${
                            selectedMember?._id === member._id ? 'translate-x-1 text-indigo-600' : ''
                          }`}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="mx-auto text-slate-300 mb-3" size={48} />
                  <p className="text-slate-500">No members found</p>
                </div>
              )}
            </div>
          </div>

          {/* Member Details Section */}
          <div className="lg:col-span-2">
            {selectedMember ? (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                {/* Profile Header */}
                <div className="relative h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
                <div className="relative px-8 pb-8">
                  <div className="flex justify-between items-start">
                    <div className="relative -mt-16 mb-4">
                      <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-xl">
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">
                            {selectedMember.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                      <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                      {selectedMember.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        selectedMember.status === 'active'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          selectedMember.status === 'active' ? 'bg-emerald-500' : 'bg-red-500'
                        }`}></span>
                        {selectedMember.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                      {selectedMember.role && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                          <Award size={12} />
                          {selectedMember.role}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Contact Information */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Contact Information
                      </h3>
                      
                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Mail className="text-indigo-600 flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Email</p>
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {selectedMember.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <Phone className="text-indigo-600 flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Phone</p>
                          <p className="text-sm font-medium text-slate-800">
                            {selectedMember.phone}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                        <MapPin className="text-indigo-600 flex-shrink-0" size={20} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500">Address</p>
                          <p className="text-sm font-medium text-slate-800">
                            {selectedMember.address}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        Additional Details
                      </h3>
                      
                      {selectedMember.room && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <Home className="text-indigo-600 flex-shrink-0" size={20} />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">Room Number</p>
                            <p className="text-sm font-medium text-slate-800">
                              {selectedMember.room}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedMember.monthlyPayment && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <CreditCard className="text-indigo-600 flex-shrink-0" size={20} />
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">Monthly Payment</p>
                            <p className="text-sm font-medium text-slate-800">
                              ৳{selectedMember.monthlyPayment.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedMember.bloodGroup && (
                        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                          <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs text-slate-500">Blood Group</p>
                            <p className="text-sm font-medium text-slate-800">
                              {selectedMember.bloodGroup}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Join Date Section */}
                  <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                      <Calendar className="text-indigo-600 flex-shrink-0" size={24} />
                      <div>
                        <p className="text-xs text-slate-500">Member Since</p>
                        <p className="text-base font-semibold text-slate-800">
                          {new Date(selectedMember.joinDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-12 flex flex-col items-center justify-center min-h-[500px]">
                <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center mb-4">
                  <Users className="text-slate-400" size={48} />
                </div>
                <p className="text-slate-500 text-lg font-medium mb-2">No Member Selected</p>
                <p className="text-slate-400 text-sm">Select a member from the list to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembersPage;