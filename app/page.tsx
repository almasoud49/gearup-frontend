// app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function HomePage() {
  const [status, setStatus] = useState('Checking connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        // ✅ Test with /gear instead of /health
        const response = await apiClient.get('/gear');
        setStatus(`✅ Connected! Found ${response.data?.data?.length || 0} gear items`);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setStatus('⚠️ Backend running but route not found. Check your backend routes.');
        } else if (error.code === 'ERR_NETWORK' || error.code === 'ECONNREFUSED') {
          setStatus('❌ Cannot connect to backend. Make sure backend is running on port 5000');
        } else {
          setStatus(`❌ Error: ${error.message}`);
        }
      }
    };
    testConnection();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">GearUp</h1>
        <p className="text-gray-600">Rent Sports & Outdoor Gear Instantly</p>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm">
          <p className="font-semibold">Status:</p>
          <p className="mt-1">{status}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          <a 
            href="/login" 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
          >
            Login
          </a>
          <a 
            href="/register" 
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center"
          >
            Register
          </a>
          <a 
            href="/test" 
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
          >
            Test API
          </a>
        </div>
      </div>
    </main>
  );
}