'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Car, 
  Search, 
  PieChart, 
  TestTube, 
  LogOut, 
  User as UserIcon, 
  Menu, 
  X, 
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems: NavItem[] = [
    {
      title: 'Ajout de stationnement',
      href: '/parking/add',
      icon: <Car className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Recherche de parking',
      href: '/parking/search',
      icon: <Search className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Consultation des dépenses',
      href: '/expenses',
      icon: <PieChart className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Test du service web',
      href: '/test',
      icon: <TestTube className="mr-2 h-4 w-4" />,
    },
    {
      title: 'Profil utilisateur',
      href: '/profile',
      icon: <UserIcon className="mr-2 h-4 w-4" />,
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Don't render anything during SSR to avoid hydration errors
  if (!mounted) return null;

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link 
            href="/dashboard" 
            className="mr-6 flex items-center space-x-2 font-bold"
          >
            <Car className="h-6 w-6" />
            <span>Gestion Parking</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center transition-colors hover:text-foreground/80 ${
                  pathname === item.href
                    ? 'text-foreground font-semibold'
                    : 'text-foreground/60'
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link
              href="/dashboard"
              className="flex items-center space-x-2 font-bold"
              onClick={() => setIsOpen(false)}
            >
              <Car className="h-6 w-6" />
              <span>Gestion Parking</span>
            </Link>
            <nav className="mt-8 flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center py-2 text-base transition-colors hover:text-foreground/80 ${
                    pathname === item.href
                      ? 'text-foreground font-semibold'
                      : 'text-foreground/60'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  {item.title}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="justify-start px-2 -ml-2"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 hidden md:flex"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Déconnexion</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" alt={user?.name || 'User'} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}