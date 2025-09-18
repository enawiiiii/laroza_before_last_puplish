import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingCart, User } from "lucide-react";

interface EmployeeSelectionProps {
  onSelection: (employee: string, storeType: 'online' | 'boutique') => void;
}

const employees = [
  { id: "abdulrahman", name: "عبدالرحمن" },
  { id: "heba", name: "هبه" },
  { id: "hadeel", name: "هديل" }
];

const storeTypes = [
  { 
    id: "online", 
    name: "الأونلاين", 
    description: "البيع عبر الإنترنت",
    icon: ShoppingCart,
    color: "bg-blue-500"
  },
  { 
    id: "boutique", 
    name: "البوتيك", 
    description: "المتجر الفعلي",
    icon: Store,
    color: "bg-purple-500"
  }
];

export default function EmployeeSelection({ onSelection }: EmployeeSelectionProps) {
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [selectedStoreType, setSelectedStoreType] = useState<string>("");

  const handleContinue = () => {
    if (selectedEmployee && selectedStoreType) {
      onSelection(selectedEmployee, selectedStoreType as 'online' | 'boutique');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
              <img 
                src="/logo.png" 
                alt="شعار لاروزا" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-primary">مرحباً بك في لاروزا</CardTitle>
          <CardDescription className="text-lg">
            الرجاء اختيار الموظف ونوع المتجر للمتابعة
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* اختيار الموظف */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5" />
              <Label className="text-lg font-semibold">اختر الموظف</Label>
            </div>
            <RadioGroup value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <div className="grid grid-cols-3 gap-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="relative">
                    <RadioGroupItem
                      value={employee.id}
                      id={employee.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={employee.id}
                      className="flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-2">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-medium">{employee.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* اختيار نوع المتجر */}
          <div className="space-y-4">
            <Label className="text-lg font-semibold">اختر نوع المتجر</Label>
            <RadioGroup value={selectedStoreType} onValueChange={setSelectedStoreType}>
              <div className="grid grid-cols-2 gap-4">
                {storeTypes.map((storeType) => {
                  const Icon = storeType.icon;
                  return (
                    <div key={storeType.id} className="relative">
                      <RadioGroupItem
                        value={storeType.id}
                        id={storeType.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={storeType.id}
                        className="flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all hover:bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 min-h-[120px]"
                      >
                        <div className={`w-12 h-12 rounded-full ${storeType.color} flex items-center justify-center mb-3`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-semibold text-lg mb-1">{storeType.name}</span>
                        <span className="text-sm text-muted-foreground text-center">
                          {storeType.description}
                        </span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </div>

          {/* معلومات إضافية */}
          {selectedStoreType && (
            <div className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">
                  {selectedStoreType === 'online' ? 'أونلاين' : 'بوتيك'}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedStoreType === 'online' 
                  ? "طرق الدفع: دفع عند الاستلام، حوالة بنكية"
                  : "طرق الدفع: كاش، فيزا (+ ضريبة 5%)"
                }
              </p>
            </div>
          )}

          <Button 
            onClick={handleContinue}
            disabled={!selectedEmployee || !selectedStoreType}
            className="w-full py-3 text-lg"
          >
            المتابعة إلى النظام
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}