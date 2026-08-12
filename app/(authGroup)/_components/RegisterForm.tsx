'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { User, Mail, Lock, UserCog } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { apiClient } from '@/lib/api';

type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  role: 'CUSTOMER' | 'PROVIDER';
};

type Errors = {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
};

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value as 'CUSTOMER' | 'PROVIDER' }));
    if (errors.role) {
      setErrors((prev) => ({ ...prev, role: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Errors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    else if (formData.name.length < 2) newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+$/i.test(formData.email)) newErrors.email = 'Invalid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';

    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await apiClient.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={handleChange}
            className={`pl-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
        </div>
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            className={`pl-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 ${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
          />
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      {/* Role */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-sm font-medium">I want to</Label>
        <div className="relative">
          <UserCog className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground z-10" />
          <Select onValueChange={handleRoleChange} defaultValue={formData.role} value={formData.role}>
            <SelectTrigger
              id="role"
              className={`pl-10 ${errors.role ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            >
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Rent gear (Customer)</SelectItem>
              <SelectItem value="PROVIDER">List my gear (Provider)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-white font-semibold py-2.5"
      >
        {isLoading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-sm text-center text-muted-foreground">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition">
          Sign in
        </Link>
      </p>
    </form>
  );
}