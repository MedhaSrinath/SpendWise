import React, { useState } from 'react';
import { User, Shield, CheckCircle, Mail, Lock, LogOut } from 'lucide-react';

export const Profile = () => {
  const [profileData, setProfileData] = useState({
    fullName: 'Medha Srinath',
    email: 'medha.srinath@rvu.edu.in',
    accountType: 'Student Account',
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Profile Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 rounded-3xl p-8 text-white text-center shadow-md relative overflow-hidden">
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-3 text-white border-2 border-white/40 shadow-inner">
          <User size={40} />
        </div>
        <h2 className="text-2xl font-bold">{profileData.fullName}</h2>
        <p className="text-teal-100 text-sm mt-0.5">{profileData.email}</p>
        <span className="inline-block mt-3 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold">
          {profileData.accountType}
        </span>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle size={15} />
          <span>Profile information updated successfully!</span>
        </div>
      )}

      {/* Profile Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center space-x-2 text-teal-700 font-bold text-base mb-4 pb-3 border-b border-gray-100">
            <User size={18} />
            <span>Personal Information</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/30"
              />
            </div>

            <div className="pt-2 flex items-center space-x-3">
              <button
                type="submit"
                className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setProfileData({ fullName: 'Medha Srinath', email: 'medha.srinath@rvu.edu.in', accountType: 'Student Account' })}
                className="px-4 py-2 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Account Security */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-teal-700 font-bold text-base mb-4 pb-3 border-b border-gray-100">
              <Shield size={18} />
              <span>Account Security</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="password"
                    disabled
                    value="••••••••••••"
                    className="w-full px-3.5 py-2 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={() => alert('Password update simulation enabled for CIE-2.')}
                    className="px-3 py-2 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-xl border border-teal-200"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-500">
                Logged in as <strong>{profileData.fullName}</strong>. CS3301 Full Stack Mini Project session.
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => alert('Logged out successfully (simulation).')}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              <LogOut size={15} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
