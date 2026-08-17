import { Suspense } from 'react';
import AuthShell from '../_components/AuthShell';
import LoginForm from '../_components/LoginForm';

export default function LoginPage() {
  return (
    <AuthShell>
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}