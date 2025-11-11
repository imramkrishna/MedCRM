import {
    Package,
    Search,
    AlertTriangle,
    CheckCircle,
    XCircle,
    ShoppingCart,
    X,
    Plus,
    Minus,
    Calendar,
    FileText,
    Loader2,
    Eye
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { get, post } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useCommonToasts } from '@/hooks/useCommonToasts';
import ProductDetail from '@/components/products/productDetail';
import Loading from '../ui/buttons/Loading';

interface Product {
    id: number;
    sku: string;
    barcode: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    color: string;
    listPrice: string;
    costPrice?: number;
    stockQuantity: number;
    reservedQuantity: number;
    minOrderQuantity: number;
    maxOrderQuantity: number | null;
    weight: string;
    dimensions: {
        unit: string;
        width: number;
        height: number;
        length: number;
    };
    isActive: boolean;
    isDiscontinued: boolean;
    dateOfManufacture: string | null;
    dateOfExpiry: string | null;
    createdAt: string;
    updatedAt: string;
}

interface OrderItem {
    productId: number;
    quantity: number;
    unitPrice: number;
    listPrice: number;
    discountPercent: number;
    discountAmount: number;
    lineTotal: number;
}

interface OrderForm {
    items: OrderItem[];
    notes: string;
    requestedDeliveryDate: string;
}

enum PaymentMode {
    CHEQUE_ON_DELIVERY = 'CHEQUE_ON_DELIVERY',
    CASH_ON_DELIVERY = 'CASH_ON_DELIVERY',
    WALLET = 'WALLET',
    ONLINE_BANKING = 'ONLINE_BANKING',
    CARD = 'CARD'
}

interface PaymentInfo {
    paymentMode: PaymentMode;
    txnId?: string;
    confirmationSlip?: string;
}

const Products = () => {
    const router = useRouter();
    const user = useSelector((state: RootState) => state.auth.user);
    const { showOrderPlaced } = useCommonToasts();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All Products');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [orderForm, setOrderForm] = useState<OrderForm>({
        items: [],
        notes: '',
        requestedDeliveryDate: ''
    });
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
        paymentMode: PaymentMode.CASH_ON_DELIVERY,
        txnId: '',
        confirmationSlip: ''
    });
    const [showProductDetails, setShowProductDetails] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    // Update filtered products when search, category, or brand changes
    useEffect(() => {
        filterProducts();
    }, [products, searchQuery, selectedCategory, selectedBrand]);

    // Extract unique categories and brands when products change
    useEffect(() => {
        console.log("Products changed:", products?.length || 0); // Debug log
        if (products && Array.isArray(products)) {
            const uniqueCategories = [...new Set(products.map(p => p.category))];
            const uniqueBrands = [...new Set(products.map(p => p.brand))];
            setCategories(uniqueCategories);
            setBrands(uniqueBrands);
           
        } else {
            setCategories([]);
            setBrands([]);
        }
    }, [products]);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await get("/products", {
                withCredentials: true
            });
            
            // Debug log to see the actual response structure
            console.log("API Response:", response.data);
            
            // Handle the correct response structure
            const productsData = response.data.products || [];
            setProducts(productsData);
            setFilteredProducts(productsData);
        } catch (error) {
            console.error("Error fetching products:", error);
            setProducts([]);
            setFilteredProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filterProducts = () => {
        
        if (!products || !Array.isArray(products)) {
            
            setFilteredProducts([]);
            return;
        }
        
        let filtered = products;
        
        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                product.brand.toLowerCase().includes(searchQuery.toLowerCase())
            );
            console.log("After search filter:", filtered.length); // Debug log
        }

        // Filter by category
        if (selectedCategory !== 'All Products') {
            filtered = filtered.filter(product => product.category === selectedCategory);
            console.log("After category filter:", filtered.length); // Debug log
        }

        // Filter by brand
        if (selectedBrand) {
            filtered = filtered.filter(product => product.brand === selectedBrand);
            console.log("After brand filter:", filtered.length); // Debug log
        }

        console.log("Final filtered products:", filtered.length); // Debug log
        setFilteredProducts(filtered);
    };

    const openOrderModal = (product: Product) => {
        setSelectedProduct(product);
        setOrderQuantity(product.minOrderQuantity);
        setOrderForm({
            items: [],
            notes: '',
            requestedDeliveryDate: ''
        });
        setPaymentInfo({
            paymentMode: PaymentMode.CASH_ON_DELIVERY,
            txnId: '',
            confirmationSlip: ''
        });
        setShowOrderModal(true);
    };

    const calculateLineTotal = (quantity: number, unitPrice: number) => {
        return quantity * unitPrice;
    };

    const validatePaymentInfo = () => {
        if (paymentInfo.paymentMode === PaymentMode.CASH_ON_DELIVERY) {
            return true;
        }
        
        if (paymentInfo.paymentMode === PaymentMode.CHEQUE_ON_DELIVERY) {
            return !!paymentInfo.confirmationSlip;
        }
        
        // For WALLET, ONLINE_BANKING, CARD - require TxnId
        if ([PaymentMode.WALLET, PaymentMode.ONLINE_BANKING, PaymentMode.CARD].includes(paymentInfo.paymentMode)) {
            return !!paymentInfo.txnId;
        }
        
        return true;
    };

    const getValidationMessage = () => {
        if (paymentInfo.paymentMode === PaymentMode.CHEQUE_ON_DELIVERY && !paymentInfo.confirmationSlip) {
            return "Confirmation slip is required for Cheque on Delivery";
        }
        
        if ([PaymentMode.WALLET, PaymentMode.ONLINE_BANKING, PaymentMode.CARD].includes(paymentInfo.paymentMode) && !paymentInfo.txnId) {
            return "Transaction ID is required for digital payments";
        }
        
        return "";
    };

    const submitOrder = async () => {
        if (!selectedProduct || !user) return;

        // Validate payment information
        if (!validatePaymentInfo()) {
            const message = getValidationMessage();
            alert(message || "Please fill in all required payment information.");
            return;
        }

        setIsSubmittingOrder(true);
        try {
            const unitPrice = parseFloat(selectedProduct.listPrice);
            const lineTotal = calculateLineTotal(orderQuantity, unitPrice);

            const orderData = {
                distributorId: user.id,
                items: [{
                    productId: selectedProduct.id,
                    quantity: orderQuantity,
                    unitPrice: unitPrice,
                    listPrice: unitPrice,
                    discountPercent: 0,
                    discountAmount: 0,
                    lineTotal: lineTotal
                }],
                notes: orderForm.notes,
                PaymentMode: paymentInfo.paymentMode,
                TxnId: paymentInfo.txnId,
                ConfirmationSlip: paymentInfo.confirmationSlip,
                requestedDeliveryDate: orderForm.requestedDeliveryDate || null
            };

            // First, place the order
            const orderResponse = await post("/distributor/place-order", orderData, {
                withCredentials: true
            });

            // Get the order ID from the response
            const orderId = orderResponse.data.order?.id;
            
            if (!orderId) {
                throw new Error("Order ID not found in response");
            }       

            // Then, create the payment request
            const paymentData: any = {
                orderId: orderId,
                PaymentMode: paymentInfo.paymentMode,
                TxnId: paymentInfo.txnId,
                ConfirmationSlip: paymentInfo.confirmationSlip
            };

            // Add TxnId and ConfirmationSlip if not CASH_ON_DELIVERY
            if (paymentInfo.paymentMode !== PaymentMode.CASH_ON_DELIVERY) {
                if (paymentInfo.txnId) {
                    paymentData.TxnId = paymentInfo.txnId;
                }
                if (paymentInfo.confirmationSlip) {
                    paymentData.ConfirmationSlip = paymentInfo.confirmationSlip;
                }
            }

            await post("/distributor/payment-status", paymentData, {
                withCredentials: true
            });

            showOrderPlaced();
            setShowOrderModal(false);
            setSelectedProduct(null);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    const getStockStatus = (stockQuantity: number) => {
        if (stockQuantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200' };
        if (stockQuantity < 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' };
        if (stockQuantity < 50) return { text: 'Limited Stock', color: 'text-orange-600 bg-orange-50 border-orange-200' };
        return { text: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200' };
    };

    const stats = {
        total: products?.length || 0,
        available: products?.filter(p => p.stockQuantity > 0).length || 0,
        lowStock: products?.filter(p => p.stockQuantity > 0 && p.stockQuantity < 10).length || 0,
        outOfStock: products?.filter(p => p.stockQuantity === 0).length || 0
    };

    // Debug log before render
    console.log("Component render - Products:", products?.length || 0, "Filtered:", filteredProducts?.length || 0);
    console.log("Current products state:", products);
    console.log("Current filteredProducts state:", filteredProducts);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                    <div className="flex items-center space-x-3">
                        <Package className="h-8 w-8 text-blue-600" />
                        <h2 className="text-2xl font-bold text-gray-900">Product Catalog</h2>
                    </div>
                    
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64"
                            />
                        </div>
                        
                        {/* Brand Filter */}
                        <select
                            value={selectedBrand}
                            onChange={(e) => setSelectedBrand(e.target.value)}
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        >
                            <option value="">All Brands</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-blue-600 font-medium">Total Products</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <Package className="h-8 w-8 text-blue-500" />
                        </div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-green-600 font-medium">Available</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.available}</p>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-yellow-600 font-medium">Low Stock</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.lowStock}</p>
                            </div>
                            <AlertTriangle className="h-8 w-8 text-yellow-500" />
                        </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                                <p className="text-2xl font-bold text-gray-900">{stats.outOfStock}</p>
                            </div>
                            <XCircle className="h-8 w-8 text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Category Filter */}
                <div className="mb-6">
                    <div className="flex overflow-x-auto pb-2 space-x-2">
                        <button
                            onClick={() => setSelectedCategory('All Products')}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                                selectedCategory === 'All Products'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            All Products
                        </button>
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                                    selectedCategory === category
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <Loading message="products" />
                )}

                {/* Products Grid */}
                {!isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                        {filteredProducts.map((product) => {
                            const stockStatus = getStockStatus(product.stockQuantity);
                            return (
                                <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 max-w-sm mx-auto w-full">
                                    <div className="space-y-3 lg:space-y-4">
                                        {/* Product Header */}
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                                    {product.sku}
                                                </span>
                                                <span className={`text-xs px-2 py-1 rounded border ${stockStatus.color}`}>
                                                    {stockStatus.text}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
                                                {product.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                                {product.description}
                                            </p>
                                        </div>

                                        {/* Product Details */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Brand:</span>
                                                <span className="font-medium text-gray-900">{product.brand}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Category:</span>
                                                <span className="font-medium text-gray-900">{product.category}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Stock:</span>
                                                <span className="font-medium text-gray-900">{product.stockQuantity} units</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Min Order:</span>
                                                <span className="font-medium text-gray-900">{product.minOrderQuantity} units</span>
                                            </div>
                                        </div>

                                        {/* Price and Action */}
                                        <div className="pt-4 border-t border-gray-100">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-2xl font-bold text-blue-600">
                                                    ${product.listPrice}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {product.color}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setShowProductDetails(true);
                                                    }}
                                                    className="py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span>View Details</span>
                                                </button>
                                                <button
                                                    onClick={() => openOrderModal(product)}
                                                    disabled={product.stockQuantity === 0}
                                                    className={`py-2.5 px-4 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                                                        product.stockQuantity === 0
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                                    }`}
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                    <span>{product.stockQuantity === 0 ? 'Out of Stock' : 'Order'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* No Products Found */}
                {!isLoading && filteredProducts.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
                    </div>
                )}
            </div>

            {/* Order Modal */}
            {showOrderModal && selectedProduct && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 my-8">
                        <div className="p-6">
                            {/* Modal Header */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Place Order</h3>
                                    <p className="text-gray-600">{selectedProduct.name}</p>
                                </div>
                                <button
                                    onClick={() => setShowOrderModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            {/* Product Summary */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-600">SKU:</span>
                                        <span className="ml-2 font-medium">{selectedProduct.sku}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Price:</span>
                                        <span className="ml-2 font-medium">${selectedProduct.listPrice}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Available:</span>
                                        <span className="ml-2 font-medium">{selectedProduct.stockQuantity} units</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Min Order:</span>
                                        <span className="ml-2 font-medium">{selectedProduct.minOrderQuantity} units</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Form */}
                            <div className="space-y-6">
                                {/* Order Number */}
                                

                                {/* Quantity */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setOrderQuantity(Math.max(selectedProduct.minOrderQuantity, orderQuantity - 1))}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>
                                        <input
                                            type="number"
                                            value={orderQuantity}
                                            onChange={(e) => setOrderQuantity(Math.max(selectedProduct.minOrderQuantity, parseInt(e.target.value) || selectedProduct.minOrderQuantity))}
                                            min={selectedProduct.minOrderQuantity}
                                            max={selectedProduct.maxOrderQuantity || selectedProduct.stockQuantity}
                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setOrderQuantity(Math.min(selectedProduct.maxOrderQuantity || selectedProduct.stockQuantity, orderQuantity + 1))}
                                            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                        <span className="text-sm text-gray-600">
                                            (Min: {selectedProduct.minOrderQuantity}, Max: {selectedProduct.maxOrderQuantity || selectedProduct.stockQuantity})
                                        </span>
                                    </div>
                                </div>

                                {/* Delivery Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Requested Delivery Date (Optional)
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <input
                                            type="date"
                                            value={orderForm.requestedDeliveryDate}
                                            onChange={(e) => setOrderForm(prev => ({ ...prev, requestedDeliveryDate: e.target.value }))}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Notes (Optional)
                                    </label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                        <textarea
                                            value={orderForm.notes}
                                            onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                                            rows={3}
                                            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Any special instructions or notes..."
                                        />
                                    </div>
                                </div>

                                {/* Payment Information */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-4">Payment Information</h4>
                                    
                                    {/* Payment Mode */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Payment Mode *
                                        </label>
                                        <select
                                            value={paymentInfo.paymentMode}
                                            onChange={(e) => setPaymentInfo(prev => ({ 
                                                ...prev, 
                                                paymentMode: e.target.value as PaymentMode,
                                                txnId: '',
                                                confirmationSlip: ''
                                            }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            required
                                        >
                                            <option value={PaymentMode.CASH_ON_DELIVERY}>Cash on Delivery</option>
                                            <option value={PaymentMode.CHEQUE_ON_DELIVERY}>Cheque on Delivery</option>
                                            <option value={PaymentMode.WALLET}>Wallet</option>
                                            <option value={PaymentMode.ONLINE_BANKING}>Online Banking</option>
                                            <option value={PaymentMode.CARD}>Card</option>
                                        </select>
                                    </div>

                                    {/* Transaction ID - Show for all modes except CASH_ON_DELIVERY */}
                                    {paymentInfo.paymentMode !== PaymentMode.CASH_ON_DELIVERY && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Transaction ID {paymentInfo.paymentMode === PaymentMode.CHEQUE_ON_DELIVERY ? '(Optional)' : '*'}
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentInfo.txnId}
                                                onChange={(e) => setPaymentInfo(prev => ({ ...prev, txnId: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter transaction ID"
                                                required={paymentInfo.paymentMode !== PaymentMode.CHEQUE_ON_DELIVERY}
                                            />
                                        </div>
                                    )}

                                    {/* Confirmation Slip - Show for all modes except CASH_ON_DELIVERY */}
                                    {paymentInfo.paymentMode !== PaymentMode.CASH_ON_DELIVERY && (
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Confirmation Slip {paymentInfo.paymentMode === PaymentMode.CHEQUE_ON_DELIVERY ? '*' : '(Optional)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={paymentInfo.confirmationSlip}
                                                onChange={(e) => setPaymentInfo(prev => ({ ...prev, confirmationSlip: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter confirmation slip details"
                                                required={paymentInfo.paymentMode === PaymentMode.CHEQUE_ON_DELIVERY}
                                            />
                                        </div>
                                    )}

                                    {/* Payment Mode Info */}
                                    <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
                                        {paymentInfo.paymentMode === PaymentMode.CASH_ON_DELIVERY && 
                                            "Payment will be collected upon delivery."
                                        }
                                        {paymentInfo.paymentMode === PaymentMode.CHEQUE_ON_DELIVERY && 
                                            "Cheque will be collected upon delivery. Confirmation slip is required."
                                        }
                                        {(paymentInfo.paymentMode === PaymentMode.WALLET || 
                                          paymentInfo.paymentMode === PaymentMode.ONLINE_BANKING || 
                                          paymentInfo.paymentMode === PaymentMode.CARD) && 
                                            "Transaction ID is required for digital payments."
                                        }
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Unit Price:</span>
                                            <span className="font-medium">${selectedProduct.listPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Quantity:</span>
                                            <span className="font-medium">{orderQuantity}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Subtotal:</span>
                                            <span className="font-medium">${(orderQuantity * parseFloat(selectedProduct.listPrice)).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2">
                                            <div className="flex justify-between">
                                                <span className="font-semibold text-gray-900">Total:</span>
                                                <span className="font-bold text-blue-600 text-lg">
                                                    ${calculateLineTotal(orderQuantity, parseFloat(selectedProduct.listPrice)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col space-y-3 pt-4">
                                    {!validatePaymentInfo() && (
                                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                                            {getValidationMessage()}
                                        </div>
                                    )}
                                    
                                    <div className="flex space-x-3">
                                        <button
                                            onClick={() => setShowOrderModal(false)}
                                            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={submitOrder}
                                            disabled={isSubmittingOrder || !validatePaymentInfo()}
                                            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                        >
                                            {isSubmittingOrder ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    <span>Placing Order...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-4 w-4" />
                                                    <span>Place Order</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Detail Modal */}
            <ProductDetail
                product={selectedProduct}
                isOpen={showProductDetails}
                onClose={() => {
                    setShowProductDetails(false);
                    setSelectedProduct(null);
                }}
            />
        </div>
    </div>
);
};

export default Products;