import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient.js";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Page Imports
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import AdminLogin from "./pages/admin/Login";
import AdminDashboard from "./pages/admin/Dashboard";
import CategoriesManage from "./pages/admin/CategoriesManage";
import SectionsManage from "./pages/admin/SectionsManage";
import MenuItemsManage from "./pages/admin/MenuItemsManage";
import TablesManage from "./pages/admin/TablesManage";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/menu" component={Menu} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/categories" component={CategoriesManage} />
      <Route path="/admin/sections" component={SectionsManage} />
      <Route path="/admin/items" component={MenuItemsManage} />
      <Route path="/admin/tables" component={TablesManage} />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
