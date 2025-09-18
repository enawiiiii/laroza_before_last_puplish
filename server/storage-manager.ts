import { IStorage, DatabaseStorage, MemStorage } from "./storage";
import { onlineFirestore, onlineDatabase } from "./firebase-online";
import { boutiqueFirestore, boutiqueDatabase } from "./firebase-boutique";

// مدير التخزين المنفصل للأونلاين والبوتيك
export class StorageManager {
  private onlineStorage: IStorage;
  private boutiqueStorage: IStorage;

  constructor() {
    // استخدام القاعدة المحلية حاليا، سيتم التبديل إلى Firebase لاحقا
    this.onlineStorage = new DatabaseStorage();
    this.boutiqueStorage = new DatabaseStorage();
  }

  // الحصول على التخزين المناسب حسب نوع المتجر
  getStorage(storeType: 'online' | 'boutique'): IStorage {
    return storeType === 'online' ? this.onlineStorage : this.boutiqueStorage;
  }

  // الحصول على Firebase المناسب حسب نوع المتجر
  getFirestore(storeType: 'online' | 'boutique') {
    return storeType === 'online' ? onlineFirestore : boutiqueFirestore;
  }

  getRealtimeDatabase(storeType: 'online' | 'boutique') {
    return storeType === 'online' ? onlineDatabase : boutiqueDatabase;
  }
}

export const storageManager = new StorageManager();