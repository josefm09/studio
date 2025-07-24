"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Plane,
  Search,
  LoaderCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { findFlightsAction } from "./actions";
import type { SummarizeFlightsOutput } from "@/ai/flows/summarize-flights";
import { FlightCard } from "@/components/flight-card";

const origins = [
  { value: "CUL", label: "Culiacán (CUL)" },
  { value: "GDL", label: "Guadalajara (GDL)" },
  { value: "MEX", label: "Ciudad de México (MEX)" },
];

const destinations = [
  { value: "LAP", label: "La Paz (LAP)" },
  { value:_("cdmx"), label: "Ciudad de México (MEX)" },
  { value: "TIJ", label: "Tijuana (TIJ)" },
];

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [origin, setOrigin] = useState("CUL");
  const [destination, setDestination] = useState("LAP");

  const [results, setResults] = useState<SummarizeFlightsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      setError("Por favor, selecciona una fecha.");
      return;
    }
    setLoading(true);
    setError(null);
    setResults(null);

    const formattedDate = format(date, "yyyy-MM-dd");
    const response = await findFlightsAction({
      origin,
      destination,
      date: formattedDate,
    });

    setLoading(false);
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setResults(response.data);
    }
  };

  return (
    <main className="min-h-screen w-full bg-background font-body text-foreground">
      <div className="container mx-auto flex flex-col items-center p-4 sm:p-6 md:p-8">
        <header className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-3">
            <Plane className="h-10 w-10 text-primary" />
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Vuelo Facilito
            </h1>
          </div>
          <p className="text-lg text-muted-foreground">
            ¡Hola, mamá! Encuentra aquí tu próximo viaje, fácil y sin prisas.
          </p>
        </header>

        <Card className="w-full max-w-3xl shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              Buscar Vuelos
            </CardTitle>
            <CardDescription>
              Elige tu origen, destino y fecha para ver los mejores vuelos de
              día.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 md:gap-6">
                <div>
                  <label htmlFor="origin" className="mb-2 block text-sm font-medium">Origen</label>
                  <Select value={origin} onValueChange={setOrigin}>
                    <SelectTrigger id="origin" className="w-full">
                      <SelectValue placeholder="Selecciona un origen" />
                    </SelectTrigger>
                    <SelectContent>
                      {origins.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="hidden items-center md:flex">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <label htmlFor="destination" className="mb-2 block text-sm font-medium">Destino</label>
                  <Select value={destination} onValueChange={setDestination}>
                    <SelectTrigger id="destination" className="w-full">
                      <SelectValue placeholder="Selecciona un destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((d) => (
                        <SelectItem key={d.value} value={d.value}>
                          {d.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row">
                 <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium">Fecha</label>
                    <Popover>
                        <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-full justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? (
                            format(date, "PPP", { locale: es })
                            ) : (
                            <span>Elige una fecha</span>
                            )}
                        </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            locale={es}
                            disabled={(d) => d < new Date(new Date().setDate(new Date().getDate() - 1))}
                        />
                        </PopoverContent>
                    </Popover>
                 </div>
                <Button
                  type="submit"
                  className="w-full sm:w-auto sm:self-end"
                  disabled={loading}
                  size="lg"
                >
                  {loading ? (
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="mr-2 h-4 w-4" />
                  )}
                  Buscar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <section className="mt-10 w-full max-w-3xl">
          {loading && (
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>¡Ups! Algo salió mal</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {results && (
            <div className="animate-in fade-in-50 duration-500">
              <h2 className="mb-4 font-headline text-2xl font-semibold tracking-tight">
                Resumen de tu Viaje
              </h2>
              <p className="mb-6 text-muted-foreground">{results.summary}</p>
              {results.flights.length > 0 ? (
                <div className="space-y-4">
                  {results.flights.map((flight, index) => (
                    <FlightCard
                      key={index}
                      flight={flight}
                      isBestDeal={index === 0}
                    />
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>No se encontraron vuelos</AlertTitle>
                  <AlertDescription>
                    No hay vuelos diurnos disponibles para esta ruta y fecha. Intenta con otra fecha.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
