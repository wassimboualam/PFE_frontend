'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { PageHeader } from '@/components/layout/page-header';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Parking } from '@/lib/types';
import { mockParkings } from '@/lib/mock-data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const searchSchema = z.object({
  maxPrice: z.number({
    required_error: "Veuillez entrer un prix maximum",
  }).positive({
    message: "Le prix doit être un nombre positif",
  }),
});

export default function SearchParkingPage() {
  const [searchResults, setSearchResults] = useState<Parking[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedParking, setSelectedParking] = useState<Parking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      maxPrice: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter parkings by max price
    const results = mockParkings.filter(parking => parking.price <= values.maxPrice);
    setSearchResults(results);
    setHasSearched(true);
  }

  function handleParkingSelect(parking: Parking) {
    setSelectedParking(parking);
    setDialogOpen(true);
  }

  return (
    <div>
      <PageHeader
        title="Recherche de parking"
        description="Trouvez un parking selon votre budget"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Critères de recherche</CardTitle>
            <CardDescription>
              Définissez un prix maximum pour trouver les parkings correspondants
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="maxPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix maximum (€/heure)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Rechercher
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Résultats de la recherche</CardTitle>
              <CardDescription>
                {hasSearched 
                  ? searchResults.length > 0 
                    ? `${searchResults.length} parking(s) trouvé(s)` 
                    : "Aucun parking ne correspond à vos critères" 
                  : "Veuillez effectuer une recherche"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasSearched && (
                <div className="space-y-4">
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {searchResults.map((parking) => (
                        <Card 
                          key={parking.id} 
                          className="cursor-pointer transition-all hover:shadow-md"
                          onClick={() => handleParkingSelect(parking)}
                        >
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">{parking.name}</CardTitle>
                            <CardDescription>{parking.city}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium">Places disponibles</p>
                                <p className="text-2xl font-bold">{parking.availableSpots}</p>
                              </div>
                              <div>
                                <p className="text-sm font-medium">Prix</p>
                                <p className="text-2xl font-bold">{parking.price.toFixed(2)} €</p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button variant="ghost" className="w-full">
                              Voir détails
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        Aucun parking ne correspond à vos critères de prix.
                      </p>
                      <p className="text-sm mt-2">
                        Essayez avec un prix maximum plus élevé.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedParking?.name}</DialogTitle>
            <DialogDescription>
              Détails du parking
            </DialogDescription>
          </DialogHeader>
          {selectedParking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Adresse</h4>
                  <p className="text-sm">{selectedParking.address}</p>
                  <p className="text-sm">{selectedParking.city}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Disponibilité</h4>
                  <p className="text-sm">
                    {selectedParking.availableSpots} places sur {selectedParking.totalSpots}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Tarifs</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Horaire</span>
                    <span className="text-sm font-medium">{selectedParking.pricePerHour?.toFixed(2)} €/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Journalier</span>
                    <span className="text-sm font-medium">{selectedParking.pricePerDay?.toFixed(2)} €/jour</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Fermer
                </Button>
                <Button className="ml-2">
                  Réserver
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}