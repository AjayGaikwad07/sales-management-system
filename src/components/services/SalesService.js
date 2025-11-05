import { fetchShops, fetchProducts, createSale, updateShop, updateShopBalance } from "../../api/apifile";

class SalesService {
    async processSaleTransaction(saleData) {
        try {
            // 1. Validate sale data
            this.validateSaleData(saleData);

            //Calculate Balance 

            const shop = await fetchShops(saleData.shopId);
            const prevBalance = shop.balanceAmount;
            const currentBalance = prevBalance + saleData.totalAmount - saleData.paidAmount;

            const salesMaster = {
                billNo: saleData.billNo,
                billDate: saleData.billDate,
                shopId: saleData.shopId,
                totalAmount: saleData.totalAmount,
                paidAmount: saleData.paidAmount,
                prevBalance: prevBalance,
                currentBalance: currentBalance
            };

            const salesDetails = saleData.items.map(item => ({
                productId: item.productId,
                rate: item.rate,
                quantity: item.quantity,
                amount: item.amount
            }));

            // 5. Save to database
            const savedSale = await createSale({
                ...salesMaster,
                salesDetails: salesDetails
            });

            await updateShopBalance(saleData.shopId, currentBalance);

            return savedSale;

        } catch (error) {
            console.error('Sales transaction failed:', error);
            throw error;
        }
    }

    validateSaleData(saleData) {

        if (!saleData.billNo) throw new Error('Bill number is required');
        if (!saleData.shopId) throw new Error('Shop selection is required');
        if (!saleData.items || saleData.items.length === 0) {
            throw new Error('At least one product must be added');
        }

        // Validate payment doesn't create negative balance
        const totalAmount = saleData.items.reduce((sum, item) => sum + item.amount, 0);
        if (saleData.paidAmount > (saleData.prevBalance + totalAmount)) {
            throw new Error('Payment cannot exceed total amount due');
        }

    }

    async calculateCurrentBalance(shopId, newItems, paymentGiven) {
        const shop = await fetchShops(shopId);
        const prevBalance = shop.balanceAmount;
        const newItemsTotal = newItems.reduce((sum, item) => sum + item.amount, 0);
        return prevBalance + newItemsTotal - paymentGiven;
      }
    }
    
export default new SalesService();
