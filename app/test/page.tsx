// app/test-data/page.tsx
'use client';

import { dummyGear, dummyCategories, dummyRentals, dummyUser } from "@/lib/dummyData";

export default function TestDataPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">✅ Dummy Data Loaded Successfully</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h2 className="font-semibold text-green-800">Users</h2>
          <p>{dummyUser.name} ({dummyUser.role})</p>
          <p className="text-sm text-gray-600">{dummyUser.email}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h2 className="font-semibold text-blue-800">Gear Items</h2>
          <p>{dummyGear.length} items loaded</p>
          <p className="text-sm text-gray-600">Latest: {dummyGear[0]?.name}</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h2 className="font-semibold text-purple-800">Categories</h2>
          <p>{dummyCategories.length} categories</p>
          <p className="text-sm text-gray-600">{dummyCategories.map(c => c.name).join(', ')}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h2 className="font-semibold text-yellow-800">Rentals</h2>
          <p>{dummyRentals.length} rentals</p>
          <p className="text-sm text-gray-600">Status: {dummyRentals.map(r => r.status).join(', ')}</p>
        </div>
      </div>
    </div>
  );
}