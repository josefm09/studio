import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  PlaneTakeoff,
  PlaneLand,
  ArrowRight,
  DollarSign,
} from "lucide-react";

type Flight = {
  departureTime: string;
  arrivalTime: string;
  price: number;
};

interface FlightCardProps {
  flight: Flight;
  isBestDeal?: boolean;
}

export function FlightCard({ flight, isBestDeal = false }: FlightCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-md ${
        isBestDeal ? "border-accent border-2" : ""
      }`}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex grow items-center gap-4">
            <div className="flex items-center gap-2">
              <PlaneTakeoff className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-lg font-medium">
                {flight.departureTime}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <PlaneLand className="h-5 w-5 text-muted-foreground" />
              <span className="font-mono text-lg font-medium">
                {flight.arrivalTime}
              </span>
            </div>
          </div>
          <div className="flex w-full items-center justify-between sm:w-auto sm:justify-end sm:gap-4">
            <div className="flex items-center gap-2 font-headline text-2xl font-bold text-foreground">
              <span>
                {new Intl.NumberFormat("es-MX", {
                  style: "currency",
                  currency: "MXN",
                }).format(flight.price)}
              </span>
            </div>
            {isBestDeal && (
              <Badge variant="default" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Mejor Opción
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
