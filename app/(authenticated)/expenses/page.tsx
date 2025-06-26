'use client';

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar as CalendarIcon, Download } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Expense } from '@/lib/types';
import { mockExpenses } from '@/lib/mock-data';

const dateRangeSchema = z.object({
  startDate: z.date({
    required_error: "La date de début est requise",
  }),
  endDate: z.date({
    required_error: "La date de fin est requise",
  }),
}).refine(data => data.startDate <= data.endDate, {
  message: "La date de fin doit être supérieure ou égale à la date de début",
  path: ["endDate"],
});

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const form = useForm<z.infer<typeof dateRangeSchema>>({
    resolver: zodResolver(dateRangeSchema),
    defaultValues: {
      startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      endDate: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof dateRangeSchema>) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter expenses by date range
    const filteredExpenses = mockExpenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= values.startDate && expenseDate <= values.endDate;
    });
    
    setExpenses(filteredExpenses);
    setHasSearched(true);
  }

  // Calculate total amount
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.totalAmount, 0);

  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    
    // Create CSV content
    const headers = ['Parking', 'Ville', 'Prix unitaire (€)', 'Nombre d\'unités', 'Montant total (€)', 'Date'];
    const rows = expenses.map(expense => [
      expense.parkingName,
      expense.city,
      expense.pricePerUnit.toFixed(2),
      expense.units.toString(),
      expense.totalAmount.toFixed(2),
      expense.date
    ]);
    
    // Add total row
    rows.push(['TOTAL', '', '', '', totalAmount.toFixed(2), '']);
    
    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `depenses_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <PageHeader
        title="Consultation des dépenses"
        description="Visualisez vos dépenses sur une période donnée"
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Sélectionnez une période</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date de début</FormLabel>
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
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Date de fin</FormLabel>
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
              
              <Button type="submit" className="sm:self-end">
                Afficher
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {hasSearched && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Résultats</CardTitle>
            {expenses.length > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 gap-1"
                onClick={handleExportCSV}
              >
                <Download className="h-4 w-4" />
                Exporter CSV
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {expenses.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Parking</TableHead>
                      <TableHead>Ville</TableHead>
                      <TableHead className="text-right">Prix unitaire (€)</TableHead>
                      <TableHead className="text-right">Nombre d'unités</TableHead>
                      <TableHead className="text-right">Montant total (€)</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.parkingName}</TableCell>
                        <TableCell>{expense.city}</TableCell>
                        <TableCell className="text-right">{expense.pricePerUnit.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{expense.units}</TableCell>
                        <TableCell className="text-right">{expense.totalAmount.toFixed(2)}</TableCell>
                        <TableCell>{format(new Date(expense.date), 'dd/MM/yyyy')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4} className="text-right font-bold">Total</TableCell>
                      <TableCell className="text-right font-bold">{totalAmount.toFixed(2)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Aucune dépense trouvée pour cette période.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}