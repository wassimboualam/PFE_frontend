'use client';

import { useAuthStore } from '@/lib/auth';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Car, Search, PieChart, TestTube } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const features = [
    {
      title: 'Ajout de stationnement',
      description: 'Enregistrez un nouveau stationnement dans le système',
      icon: <Car className="h-8 w-8 text-primary" />,
      href: '/parking/add',
    },
    {
      title: 'Recherche de parking',
      description: 'Trouvez un parking selon votre budget',
      icon: <Search className="h-8 w-8 text-primary" />,
      href: '/parking/search',
    },
    {
      title: 'Consultation des dépenses',
      description: 'Visualisez vos dépenses sur une période donnée',
      icon: <PieChart className="h-8 w-8 text-primary" />,
      href: '/expenses',
    },
    {
      title: 'Test du service web',
      description: 'Testez le service de comptage des stationnements',
      icon: <TestTube className="h-8 w-8 text-primary" />,
      href: '/test',
    },
  ];

  return (
    <div>
      <PageHeader 
        title={`Bienvenue, ${user?.name || 'Utilisateur'}`}
        description="Gérez vos stationnements et consultez vos dépenses"
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {features.map((feature) => (
          <Card key={feature.title} className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center gap-2">
                {feature.icon}
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <Button asChild className="w-full">
                <Link href={feature.href}>Accéder</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}