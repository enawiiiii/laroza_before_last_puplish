// حساب ضريبة الفيزا للبوتيك
export function calculateVisaFees(amount: number): number {
  return amount * 0.05; // ضريبة 5%
}

// حساب الإجمالي مع ضريبة الفيزا
export function calculateTotalWithVisaFees(subtotal: number): number {
  const fees = calculateVisaFees(subtotal);
  return subtotal + fees;
}

// تحديد طرق الدفع المسموحة حسب نوع المتجر
export function getAllowedPaymentMethods(storeType: 'online' | 'boutique'): string[] {
  if (storeType === 'online') {
    return ['cash-on-delivery', 'bank-transfer'];
  } else {
    return ['cash', 'visa'];
  }
}

// حساب الرسوم حسب طريقة الدفع ونوع المتجر
export function calculateFees(
  subtotal: number, 
  paymentMethod: string, 
  storeType: 'online' | 'boutique'
): number {
  if (storeType === 'boutique' && paymentMethod === 'visa') {
    return calculateVisaFees(subtotal);
  }
  return 0;
}