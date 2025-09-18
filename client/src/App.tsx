import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider, useStore } from "@/context/store-context";
import EmployeeSelection from "@/pages/employee-selection";
import Dashboard from "@/pages/dashboard";
import Inventory from "@/pages/inventory";
import Sales from "@/pages/sales";
import Returns from "@/pages/returns";
import Accounting from "@/pages/accounting";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, login } = useStore();

  if (!isAuthenticated) {
    return <EmployeeSelection onSelection={login} />;
  }

  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/sales" component={Sales} />
      <Route path="/returns" component={Returns} />
      <Route path="/accounting" component={Accounting} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background text-foreground" dir="rtl">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
