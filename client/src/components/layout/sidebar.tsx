import { Link, useLocation } from "wouter";
import { Gem, Home, Package, TrendingUp, RotateCcw, BarChart, User, LogOut, Store, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/store-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Sidebar() {
  const [location] = useLocation();
  const { employee, storeType, logout } = useStore();

  const navigation = [
    { name: "لوحة التحكم", href: "/dashboard", icon: Home },
    { name: "إدارة المخزون", href: "/inventory", icon: Package },
    { name: "المبيعات", href: "/sales", icon: TrendingUp },
    { name: "المرتجعات", href: "/returns", icon: RotateCcw },
    { name: "المحاسبة", href: "/accounting", icon: BarChart },
  ];

  return (
    <nav className="w-64 bg-card border-l border-border shadow-lg">
      <div className="p-6 border-b border-border">
        {/* Logo and Brand */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1">
            <img 
              src="/logo.png" 
              alt="شعار لاروزا" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary">لاروزا</h1>
            <p className="text-sm text-muted-foreground">LAROZA</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">نظام إدارة المتجر الداخلي</p>
        
        {/* معلومات الموظف ونوع المتجر */}
        <div className="mt-4 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{employee}</span>
          </div>
          <div className="flex items-center gap-2">
            {storeType === 'online' ? (
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            ) : (
              <Store className="h-4 w-4 text-purple-500" />
            )}
            <Badge variant={storeType === 'online' ? 'default' : 'secondary'}>
              {storeType === 'online' ? 'أونلاين' : 'بوتيك'}
            </Badge>
          </div>
        </div>
      </div>
      
      {/* Navigation Menu */}
      <div className="p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href || (item.href === "/dashboard" && location === "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground sidebar-active"
                  : "hover:bg-muted"
              )}
              data-testid={`nav-${item.name.replace(/\s+/g, '-')}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      
      {/* زر تسجيل الخروج */}
      <div className="mt-auto p-4 border-t border-border">
        <Button 
          onClick={logout}
          variant="outline" 
          className="w-full flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          تسجيل الخروج
        </Button>
      </div>
    </nav>
  );
}
