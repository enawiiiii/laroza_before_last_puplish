import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface StoreContextType {
  employee: string;
  storeType: 'online' | 'boutique';
  isAuthenticated: boolean;
  setEmployee: (employee: string) => void;
  setStoreType: (storeType: 'online' | 'boutique') => void;
  login: (employee: string, storeType: 'online' | 'boutique') => void;
  logout: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const [employee, setEmployee] = useState<string>('');
  const [storeType, setStoreType] = useState<'online' | 'boutique'>('online');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (emp: string, store: 'online' | 'boutique') => {
    setEmployee(emp);
    setStoreType(store);
    setIsAuthenticated(true);
    // حفظ في localStorage للاستمرارية
    localStorage.setItem('laroza_employee', emp);
    localStorage.setItem('laroza_store_type', store);
    localStorage.setItem('laroza_authenticated', 'true');
  };

  const logout = () => {
    setEmployee('');
    setStoreType('online');
    setIsAuthenticated(false);
    // مسح من localStorage
    localStorage.removeItem('laroza_employee');
    localStorage.removeItem('laroza_store_type');
    localStorage.removeItem('laroza_authenticated');
  };

  // استرجاع البيانات من localStorage عند التحميل
  useEffect(() => {
    const savedEmployee = localStorage.getItem('laroza_employee');
    const savedStoreType = localStorage.getItem('laroza_store_type');
    const savedAuth = localStorage.getItem('laroza_authenticated');
    
    if (savedEmployee && savedStoreType && savedAuth === 'true') {
      setEmployee(savedEmployee);
      setStoreType(savedStoreType as 'online' | 'boutique');
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <StoreContext.Provider value={{
      employee,
      storeType,
      isAuthenticated,
      setEmployee,
      setStoreType,
      login,
      logout
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}