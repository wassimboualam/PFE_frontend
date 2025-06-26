import { LoginForm } from '@/components/auth/login-form';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30">
      <LoginForm />
    </div>
  );
}