import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Banknote, Building, Truck } from "lucide-react";
import { useStore } from "@/context/store-context";
import { ONLINE_PAYMENT_METHODS, BOUTIQUE_PAYMENT_METHODS } from "@shared/schema";

interface PaymentMethodsProps {
  value: string;
  onValueChange: (value: string) => void;
}

const paymentMethodsConfig = {
  'cash': { 
    icon: Banknote, 
    label: 'كاش', 
    description: 'دفع نقدي',
    color: 'text-green-600'
  },
  'visa': { 
    icon: CreditCard, 
    label: 'فيزا', 
    description: 'ضريبة 5%',
    color: 'text-blue-600'
  },
  'bank-transfer': { 
    icon: Building, 
    label: 'حوالة بنكية', 
    description: 'تحويل بنكي',
    color: 'text-purple-600'
  },
  'cash-on-delivery': { 
    icon: Truck, 
    label: 'دفع عند الاستلام', 
    description: 'الدفع عند التوصيل',
    color: 'text-orange-600'
  }
};

export default function PaymentMethods({ value, onValueChange }: PaymentMethodsProps) {
  const { storeType } = useStore();
  
  // الحصول على طرق الدفع المسموحة حسب نوع المتجر
  const allowedMethods = storeType === 'online' 
    ? ONLINE_PAYMENT_METHODS 
    : BOUTIQUE_PAYMENT_METHODS;

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">طريقة الدفع</Label>
      
      {/* عرض نوع المتجر */}
      <div className="flex items-center gap-2 mb-3">
        <Badge variant={storeType === 'online' ? 'default' : 'secondary'}>
          {storeType === 'online' ? 'أونلاين' : 'بوتيك'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {storeType === 'online' 
            ? 'طرق الدفع للأونلاين' 
            : 'طرق الدفع للبوتيك'
          }
        </span>
      </div>

      <RadioGroup value={value} onValueChange={onValueChange}>
        <div className="grid gap-3">
          {allowedMethods.map((method) => {
            const config = paymentMethodsConfig[method];
            const Icon = config.icon;
            
            return (
              <div key={method} className="relative">
                <RadioGroupItem
                  value={method}
                  id={method}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={method}
                  className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5"
                >
                  <Icon className={`h-5 w-5 ${config.color}`} />
                  <div className="flex-1">
                    <div className="font-medium">{config.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                  {method === 'visa' && storeType === 'boutique' && (
                    <Badge variant="outline" className="text-xs">
                      +5%
                    </Badge>
                  )}
                </Label>
              </div>
            );
          })}
        </div>
      </RadioGroup>

      {/* تحذير ضريبة الفيزا */}
      {value === 'visa' && storeType === 'boutique' && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800 text-sm">
            <CreditCard className="h-4 w-4" />
            <span className="font-medium">
              سيتم إضافة ضريبة 5% للدفع بالفيزا
            </span>
          </div>
        </div>
      )}
    </div>
  );
}