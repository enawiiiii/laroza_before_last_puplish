import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Truck, CheckCircle, XCircle } from "lucide-react";
import { useStore } from "@/context/store-context";
import { ORDER_STATUSES } from "@shared/schema";

interface OrderStatusProps {
  value: string;
  onValueChange: (value: string) => void;
}

const statusConfig = {
  'pending-delivery': { 
    icon: Truck, 
    label: 'قيد التوصيل', 
    description: 'الطلب في طريقه للعميل',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  'delivered': { 
    icon: CheckCircle, 
    label: 'تم التوصيل', 
    description: 'وصل الطلب للعميل',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  'cancelled': { 
    icon: XCircle, 
    label: 'تم الإلغاء', 
    description: 'تم إلغاء الطلب',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};

export default function OrderStatus({ value, onValueChange }: OrderStatusProps) {
  const { storeType } = useStore();
  
  // حالات الطلبات للأونلاين فقط
  if (storeType !== 'online') {
    return null;
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">حالة الطلب</Label>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="default">أونلاين</Badge>
        <span className="text-sm text-muted-foreground">
          حالات طلبات الأونلاين
        </span>
      </div>

      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="grid gap-3">
          {ORDER_STATUSES.map((status) => {
            const config = statusConfig[status];
            const Icon = config.icon;
            
            return (
              <div key={status} className="relative">
                <RadioGroupItem
                  value={status}
                  id={status}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={status}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:${config.bgColor} peer-checked:border-primary peer-checked:${config.bgColor}`}
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{config.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>
    </div>
  );
}