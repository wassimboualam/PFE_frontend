'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { mockParkings, getParkingSessionsCount } from '@/lib/mock-data';

const testFormSchema = z.object({
  parkingId: z.string({
    required_error: "Veuillez sélectionner un parking",
  }),
  date: z.date({
    required_error: "La date est requise",
  }),
});

export default function TestServicePage() {
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const form = useForm<z.infer<typeof testFormSchema>>({
    resolver: zodResolver(testFormSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof testFormSchema>) {
    setIsLoading(true);
    setHasError(false);
    setResult(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get sessions count using the mock function
      const count = getParkingSessionsCount(
        values.parkingId, 
        format(values.date, 'yyyy-MM-dd')
      );
      
      setResult(count);
    } catch (error) {
      setHasError(true);
      console.error('Test service error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const selectedParking = form.watch('parkingId') 
    ? mockParkings.find(p => p.id === form.watch('parkingId'))?.name
    : null;

  return (
    <div>
      <PageHeader
        title="Test du service web"
        description="Testez le service qui retourne le nombre de stationnements pour un parking et une date"
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Paramètres du test</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="parkingId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parking</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un parking" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {mockParkings.map((parking) => (
                            <SelectItem key={parking.id} value={parking.id}>
                              {parking.name} - {parking.city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: fr })
                              ) : (
                                <span>Sélectionnez une date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Test en cours..." : "Tester"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Résultat du test</CardTitle>
          </CardHeader>
          <CardContent>
            {result !== null ? (
              <Alert className="bg-primary/10 border-primary/20">
                <AlertTitle className="text-primary">Résultat du service</AlertTitle>
                <AlertDescription className="mt-2">
                  <p className="text-lg">
                    <strong>{result}</strong> stationnement{result !== 1 ? 's' : ''} pour le parking 
                    <strong> {selectedParking}</strong> en date du 
                    <strong> {format(form.getValues('date'), 'PPP', { locale: fr })}</strong>.
                  </p>
                </AlertDescription>
              </Alert>
            ) : hasError ? (
              <Alert variant="destructive">
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>
                  Une erreur s'est produite lors de l'appel du service. Veuillez réessayer.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                <p>Veuillez effectuer un test pour voir le résultat</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}