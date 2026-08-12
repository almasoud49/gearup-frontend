// app/(authGroup)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">GearUp</h1>
          <p className="text-gray-600 mt-1">Rent Sports & Outdoor Gear Instantly</p>
        </div>
        {children}
      </div>
    </div>
  );
}