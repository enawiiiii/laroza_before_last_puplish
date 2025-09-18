import { 
  type Product, 
  type InsertProduct, 
  type ProductInventory, 
  type InsertProductInventory,
  type Sale,
  type InsertSale,
  type SaleItem,
  type InsertSaleItem,
  type Return,
  type InsertReturn,
  type ReturnItem,
  type InsertReturnItem,
  type Expense,
  type InsertExpense,
  type Purchase,
  type InsertPurchase,
  type ProductWithInventory,
  type SaleWithItems,
  type ReturnWithItems,
  COLORS,
  SIZES
} from "@shared/schema";
import { boutiqueDatabase } from "./firebase-config";
import { IStorage } from "./storage";

export class RealtimeStorage implements IStorage {
  
  // Products
  async getProducts(): Promise<ProductWithInventory[]> {
    if (!boutiqueDatabase) throw new Error('Firebase not initialized for boutique');
    const productsSnapshot = await boutiqueDatabase.ref('products').once('value');
    const productsData = productsSnapshot.val() || {};
    
    const productsWithInventory = await Promise.all(
      Object.entries(productsData).map(async ([id, product]: [string, any]) => {
        const inventory = await this.getProductInventory(id);
        const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
        let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
        
        if (totalQuantity === 0) {
          status = 'out-of-stock';
        } else if (totalQuantity < 10) {
          status = 'low-stock';
        }

        return {
          ...product,
          id,
          inventory,
          totalQuantity,
          status,
        } as ProductWithInventory;
      })
    );
    
    return productsWithInventory;
  }

  async getProductById(id: string): Promise<ProductWithInventory | undefined> {
    const productSnapshot = await boutiqueDatabase!.ref(`products/${id}`).once('value');
    const product = productSnapshot.val();
    if (!product) return undefined;

    const inventory = await this.getProductInventory(id);
    const totalQuantity = inventory.reduce((sum, item) => sum + item.quantity, 0);
    let status: 'in-stock' | 'low-stock' | 'out-of-stock' = 'in-stock';
    
    if (totalQuantity === 0) {
      status = 'out-of-stock';
    } else if (totalQuantity < 10) {
      status = 'low-stock';
    }

    return {
      ...product,
      id,
      inventory,
      totalQuantity,
      status,
    } as ProductWithInventory;
  }

  async getProductByModelNumber(modelNumber: string): Promise<Product | undefined> {
    const productsSnapshot = await boutiqueDatabase!.ref('products').orderByChild('modelNumber').equalTo(modelNumber).once('value');
    const productsData = productsSnapshot.val();
    
    if (!productsData) return undefined;
    
    const productId = Object.keys(productsData)[0];
    return { ...productsData[productId], id: productId } as Product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const productRef = boutiqueDatabase!.ref('products').push();
    const productId = productRef.key!;
    
    const newProduct: Product = {
      ...product,
      id: productId,
      imageUrl: product.imageUrl || null,
      specifications: product.specifications || null,
      createdAt: new Date(Date.now()),
    };
    
    await productRef.set(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const productRef = boutiqueDatabase!.ref(`products/${id}`);
    const snapshot = await productRef.once('value');
    const existingProduct = snapshot.val();
    
    if (!existingProduct) return undefined;
    
    const updatedProduct = { ...existingProduct, ...product };
    await productRef.set(updatedProduct);
    
    return updatedProduct as Product;
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await boutiqueDatabase!.ref(`products/${id}`).remove();
      await boutiqueDatabase!.ref(`product_inventory/${id}`).remove();
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Product Inventory
  async getProductInventory(productId: string): Promise<ProductInventory[]> {
    const inventorySnapshot = await boutiqueDatabase!.ref(`product_inventory/${productId}`).once('value');
    const inventoryData = inventorySnapshot.val() || {};
    
    return Object.entries(inventoryData).map(([id, item]: [string, any]) => ({
      ...item,
      id,
    })) as ProductInventory[];
  }

  async updateInventory(productId: string, color: string, size: string, quantity: number): Promise<ProductInventory> {
    const inventoryRef = boutiqueDatabase!.ref(`product_inventory/${productId}`);
    const snapshot = await inventoryRef.once('value');
    const inventoryData = snapshot.val() || {};
    
    // Find existing inventory item
    const existingKey = Object.keys(inventoryData).find(key => 
      inventoryData[key].color === color && inventoryData[key].size === size
    );
    
    if (existingKey) {
      const updatedItem = { ...inventoryData[existingKey], quantity };
      await inventoryRef.child(existingKey).set(updatedItem);
      return { ...updatedItem, id: existingKey } as ProductInventory;
    } else {
      // Create new inventory item
      const newItemRef = inventoryRef.push();
      const newItem: ProductInventory = {
        id: newItemRef.key!,
        productId,
        color,
        size,
        quantity,
      };
      await newItemRef.set(newItem);
      return newItem;
    }
  }

  async bulkUpdateInventory(inventoryItems: (InsertProductInventory & { productId: string })[]): Promise<ProductInventory[]> {
    const updates: Record<string, any> = {};
    const results: ProductInventory[] = [];
    
    for (const item of inventoryItems) {
      const inventoryRef = boutiqueDatabase!.ref(`product_inventory/${item.productId}`);
      const newItemRef = inventoryRef.push();
      const inventoryItem: ProductInventory = {
        ...item,
        id: newItemRef.key!,
        quantity: item.quantity || 0,
      };
      
      updates[`product_inventory/${item.productId}/${newItemRef.key}`] = inventoryItem;
      results.push(inventoryItem);
    }
    
    await boutiqueDatabase!.ref().update(updates);
    return results;
  }

  async deleteProductInventory(productId: string): Promise<boolean> {
    try {
      await boutiqueDatabase!.ref(`product_inventory/${productId}`).remove();
      return true;
    } catch (error) {
      return false;
    }
  }
  
  // Sales
  async getSales(): Promise<SaleWithItems[]> {
    const salesSnapshot = await boutiqueDatabase!.ref('sales').once('value');
    const salesData = salesSnapshot.val() || {};
    
    const salesWithItems = await Promise.all(
      Object.entries(salesData).map(async ([id, sale]: [string, any]) => {
        const itemsSnapshot = await boutiqueDatabase!.ref(`sale_items/${id}`).once('value');
        const itemsData = itemsSnapshot.val() || {};
        
        const items = await Promise.all(
          Object.entries(itemsData).map(async ([itemId, item]: [string, any]) => {
            const productSnapshot = await boutiqueDatabase!.ref(`products/${item.productId}`).once('value');
            const product = productSnapshot.val();
            
            return {
              ...item,
              id: itemId,
              product,
            };
          })
        );
        
        return {
          ...sale,
          id,
          items,
        } as SaleWithItems;
      })
    );
    
    return salesWithItems;
  }

  async getSaleById(id: string): Promise<SaleWithItems | undefined> {
    const saleSnapshot = await boutiqueDatabase!.ref(`sales/${id}`).once('value');
    const sale = saleSnapshot.val();
    if (!sale) return undefined;

    const itemsSnapshot = await boutiqueDatabase!.ref(`sale_items/${id}`).once('value');
    const itemsData = itemsSnapshot.val() || {};
    
    const items = await Promise.all(
      Object.entries(itemsData).map(async ([itemId, item]: [string, any]) => {
        const productSnapshot = await boutiqueDatabase!.ref(`products/${item.productId}`).once('value');
        const product = productSnapshot.val();
        
        return {
          ...item,
          id: itemId,
          product,
        };
      })
    );

    return {
      ...sale,
      id,
      items,
    } as SaleWithItems;
  }

  async createSale(sale: InsertSale, items: InsertSaleItem[]): Promise<SaleWithItems> {
    const saleRef = boutiqueDatabase!.ref('sales').push();
    const saleId = saleRef.key!;
    
    // Validate inventory availability
    for (const item of items) {
      const inventorySnapshot = await boutiqueDatabase!.ref(`product_inventory/${item.productId}`).once('value');
      const inventoryData = inventorySnapshot.val() || {};
      
      const inventoryItem = Object.values(inventoryData).find((inv: any) => 
        inv.color === item.color && inv.size === item.size
      ) as any;
      
      if (!inventoryItem || inventoryItem.quantity < item.quantity) {
        throw new Error(`Insufficient inventory for product ${item.productId}, color ${item.color}, size ${item.size}`);
      }
    }
    
    // Generate invoice number for the sale
    const invoiceNumber = `INV-${Date.now()}-${saleId.slice(-6)}`;
    
    const newSale: Sale = {
      ...sale,
      id: saleId,
      invoiceNumber,
      trackingNumber: sale.trackingNumber || null,
      fees: sale.fees || "0",
      createdAt: new Date(Date.now()),
    };
    
    // Create updates for sale, sale items, and inventory decrements
    const updates: Record<string, any> = {};
    updates[`sales/${saleId}`] = newSale;
    
    const saleItemsWithProducts = [];
    
    for (const item of items) {
      const saleItemRef = boutiqueDatabase!.ref(`sale_items/${saleId}`).push();
      const saleItemId = saleItemRef.key!;
      
      const saleItem: SaleItem = {
        ...item,
        id: saleItemId,
        saleId,
      };
      
      updates[`sale_items/${saleId}/${saleItemId}`] = saleItem;
      
      // Get product details for response
      const productSnapshot = await boutiqueDatabase!.ref(`products/${item.productId}`).once('value');
      const product = productSnapshot.val();
      
      saleItemsWithProducts.push({
        ...saleItem,
        product,
      });
      
      // Decrement inventory
      const inventorySnapshot = await boutiqueDatabase!.ref(`product_inventory/${item.productId}`).once('value');
      const inventoryData = inventorySnapshot.val() || {};
      
      const inventoryKey = Object.keys(inventoryData).find(key => 
        inventoryData[key].color === item.color && inventoryData[key].size === item.size
      );
      
      if (inventoryKey) {
        const currentQuantity = inventoryData[inventoryKey].quantity;
        updates[`product_inventory/${item.productId}/${inventoryKey}/quantity`] = currentQuantity - item.quantity;
      }
    }
    
    await boutiqueDatabase!.ref().update(updates);
    
    return {
      ...newSale,
      items: saleItemsWithProducts,
    } as SaleWithItems;
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<SaleWithItems[]> {
    const sales = await this.getSales();
    return sales.filter(sale => {
      const saleDate = new Date(sale.createdAt);
      return saleDate >= startDate && saleDate <= endDate;
    });
  }
  
  // Returns
  async getReturns(): Promise<ReturnWithItems[]> {
    const returnsSnapshot = await boutiqueDatabase!.ref('returns').once('value');
    const returnsData = returnsSnapshot.val() || {};
    
    const returnsWithItems = await Promise.all(
      Object.entries(returnsData).map(async ([id, returnData]: [string, any]) => {
        const itemsSnapshot = await boutiqueDatabase!.ref(`return_items/${id}`).once('value');
        const itemsData = itemsSnapshot.val() || {};
        
        const items = await Promise.all(
          Object.entries(itemsData).map(async ([itemId, item]: [string, any]) => {
            const productSnapshot = await boutiqueDatabase!.ref(`products/${item.productId}`).once('value');
            const product = productSnapshot.val();
            
            return {
              ...item,
              id: itemId,
              product,
            };
          })
        );
        
        const originalSaleSnapshot = await boutiqueDatabase!.ref(`sales/${returnData.originalSaleId}`).once('value');
        const originalSale = originalSaleSnapshot.val();
        
        return {
          ...returnData,
          id,
          items,
          originalSale,
        } as ReturnWithItems;
      })
    );
    
    return returnsWithItems;
  }

  async getReturnById(id: string): Promise<ReturnWithItems | undefined> {
    const returnSnapshot = await boutiqueDatabase!.ref(`returns/${id}`).once('value');
    const returnData = returnSnapshot.val();
    if (!returnData) return undefined;

    const itemsSnapshot = await boutiqueDatabase!.ref(`return_items/${id}`).once('value');
    const itemsData = itemsSnapshot.val() || {};
    
    const items = await Promise.all(
      Object.entries(itemsData).map(async ([itemId, item]: [string, any]) => {
        const productSnapshot = await boutiqueDatabase!.ref(`products/${item.productId}`).once('value');
        const product = productSnapshot.val();
        
        return {
          ...item,
          id: itemId,
          product,
        };
      })
    );

    const originalSaleSnapshot = await boutiqueDatabase!.ref(`sales/${returnData.originalSaleId}`).once('value');
    const originalSale = originalSaleSnapshot.val();

    return {
      ...returnData,
      id,
      items,
      originalSale,
    } as ReturnWithItems;
  }

  async createReturn(insertReturn: InsertReturn, items: InsertReturnItem[]): Promise<ReturnWithItems> {
    const returnRef = boutiqueDatabase!.ref('returns').push();
    const returnId = returnRef.key!;
    
    const returnData: Return = {
      ...insertReturn,
      id: returnId,
      exchangeType: insertReturn.exchangeType || null,
      newProductId: insertReturn.newProductId || null,
      newColor: insertReturn.newColor || null,
      newSize: insertReturn.newSize || null,
      refundAmount: insertReturn.refundAmount || "0",
      createdAt: new Date(Date.now()),
    };

    const updates: Record<string, any> = {};
    updates[`returns/${returnId}`] = returnData;

    const returnItemsWithProducts = [];
    
    for (const item of items) {
      const returnItemRef = boutiqueDatabase!.ref(`return_items/${returnId}`).push();
      const returnItemId = returnItemRef.key!;
      
      const returnItem: ReturnItem = {
        ...item,
        id: returnItemId,
        returnId,
      };
      
      updates[`return_items/${returnId}/${returnItemId}`] = returnItem;
      
      // Get product details for response
      const productSnapshot = await boutiqueDatabase!.ref(`products/${item.productId}`).once('value');
      const product = productSnapshot.val();
      
      returnItemsWithProducts.push({
        ...returnItem,
        product,
      });
      
      // Handle inventory updates based on return type
      if (returnData.returnType === 'refund') {
        // For refunds: simply return items to original inventory
        await this.incrementInventory(item.productId, item.color, item.size, item.quantity, updates);
      } else if (returnData.returnType === 'exchange') {
        // Handle different types of exchanges
        if (returnData.exchangeType === 'product-to-product') {
          // Exchange with different product: return original item and deduct from new product
          await this.incrementInventory(item.productId, item.color, item.size, item.quantity, updates);
          
          // Deduct from new product using the specified new color and size
          if (returnData.newProductId && returnData.newColor && returnData.newSize) {
            await this.decrementInventory(returnData.newProductId, returnData.newColor, returnData.newSize, item.quantity, updates);
          }
        } else if (returnData.exchangeType === 'color-change') {
          // Color change: return old color and deduct from new color
          await this.incrementInventory(item.productId, item.color, item.size, item.quantity, updates);
          
          // Deduct from new color
          if (returnData.newColor) {
            await this.decrementInventory(item.productId, returnData.newColor, item.size, item.quantity, updates);
          }
        } else if (returnData.exchangeType === 'size-change') {
          // Size change: return old size and deduct from new size
          await this.incrementInventory(item.productId, item.color, item.size, item.quantity, updates);
          
          // Deduct from new size
          if (returnData.newSize) {
            await this.decrementInventory(item.productId, item.color, returnData.newSize, item.quantity, updates);
          }
        }
      }
    }
    
    await boutiqueDatabase!.ref().update(updates);
    
    const originalSaleSnapshot = await boutiqueDatabase!.ref(`sales/${insertReturn.originalSaleId}`).once('value');
    const originalSale = originalSaleSnapshot.val();

    return {
      ...returnData,
      items: returnItemsWithProducts,
      originalSale,
    } as ReturnWithItems;
  }
  
  private async incrementInventory(productId: string, color: string, size: string, quantity: number, updates: Record<string, any>) {
    const inventorySnapshot = await boutiqueDatabase!.ref(`product_inventory/${productId}`).once('value');
    const inventoryData = inventorySnapshot.val() || {};
    
    const inventoryKey = Object.keys(inventoryData).find(key => 
      inventoryData[key].color === color && inventoryData[key].size === size
    );
    
    if (inventoryKey) {
      const currentQuantity = inventoryData[inventoryKey].quantity;
      updates[`product_inventory/${productId}/${inventoryKey}/quantity`] = currentQuantity + quantity;
    }
  }
  
  private async decrementInventory(productId: string, color: string, size: string, quantity: number, updates: Record<string, any>) {
    const inventorySnapshot = await boutiqueDatabase!.ref(`product_inventory/${productId}`).once('value');
    const inventoryData = inventorySnapshot.val() || {};
    
    const inventoryKey = Object.keys(inventoryData).find(key => 
      inventoryData[key].color === color && inventoryData[key].size === size
    );
    
    if (inventoryKey) {
      const currentQuantity = inventoryData[inventoryKey].quantity;
      updates[`product_inventory/${productId}/${inventoryKey}/quantity`] = Math.max(0, currentQuantity - quantity);
    }
  }
  
  // Expenses
  async getExpenses(): Promise<Expense[]> {
    const expensesSnapshot = await boutiqueDatabase!.ref('expenses').once('value');
    const expensesData = expensesSnapshot.val() || {};
    
    return Object.entries(expensesData).map(([id, expense]: [string, any]) => ({
      ...expense,
      id,
      date: new Date(expense.date),
    })) as Expense[];
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const expenseRef = boutiqueDatabase!.ref('expenses').push();
    const expenseId = expenseRef.key!;
    
    const expense: Expense = {
      ...insertExpense,
      id: expenseId,
      date: insertExpense.date || new Date(Date.now()),
    };
    
    await expenseRef.set({
      ...expense,
      date: expense.date.getTime(), // Store as timestamp
    });
    
    return expense;
  }

  async getExpensesByDateRange(startDate: Date, endDate: Date): Promise<Expense[]> {
    const expenses = await this.getExpenses();
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate >= startDate && expenseDate <= endDate;
    });
  }
  
  // Purchases
  async getPurchases(): Promise<Purchase[]> {
    const purchasesSnapshot = await boutiqueDatabase!.ref('purchases').once('value');
    const purchasesData = purchasesSnapshot.val() || {};
    
    return Object.entries(purchasesData).map(([id, purchase]: [string, any]) => ({
      ...purchase,
      id,
      date: new Date(purchase.date),
    })) as Purchase[];
  }

  async createPurchase(insertPurchase: InsertPurchase): Promise<Purchase> {
    const purchaseRef = boutiqueDatabase!.ref('purchases').push();
    const purchaseId = purchaseRef.key!;
    
    const purchase: Purchase = {
      ...insertPurchase,
      id: purchaseId,
      date: insertPurchase.date || new Date(Date.now()),
    };
    
    await purchaseRef.set({
      ...purchase,
      date: purchase.date.getTime(), // Store as timestamp
    });
    
    return purchase;
  }

  async getPurchasesByDateRange(startDate: Date, endDate: Date): Promise<Purchase[]> {
    const purchases = await this.getPurchases();
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      return purchaseDate >= startDate && purchaseDate <= endDate;
    });
  }
  
  // Analytics
  async getDashboardStats(): Promise<{
    totalProducts: number;
    todaySales: number;
    outOfStockCount: number;
    onlineOrdersCount: number;
  }> {
    const products = await this.getProducts();
    const totalProducts = products.length;
    const outOfStockCount = products.filter(p => p.status === 'out-of-stock').length;

    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const sales = await this.getSalesByDateRange(todayStart, todayEnd);
    const todaySales = sales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    const onlineOrdersCount = sales.filter(sale => sale.channel === 'online').length;

    return {
      totalProducts,
      todaySales,
      outOfStockCount,
      onlineOrdersCount,
    };
  }
}

export const storage = new RealtimeStorage();