import {
    Package,
    X,
    ShoppingCart,
    Calendar,
    FileText,
    Plus,
    Minus,
    Loader2,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Weight,
    Ruler,
    Clock,
    Info
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { post } from '@/lib/api';

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
    stockQuantity: number;
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
    orderNumber: string;
    items: OrderItem[];
    notes: string;
    requestedDeliveryDate: string;
}

interface ProductDetailProps {
    product: Product | null;
    isOpen: boolean;
    onClose: () => void;
}

const ProductDetail = ({ product, isOpen, onClose }: ProductDetailProps) => {
    const [orderForm, setOrderForm] = useState<OrderForm>({
        orderNumber: '',
        items: [],
        notes: '',
        requestedDeliveryDate: ''
    });
    const [orderQuantity, setOrderQuantity] = useState(1);
    const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'specifications' | 'ordering'>('details');

    useEffect(() => {
        if (product && isOpen) {
            setOrderQuantity(product.minOrderQuantity);
            setOrderForm({
                orderNumber: `ORD-${Date.now()}`,
                items: [],
                notes: '',
                requestedDeliveryDate: ''
            });
        }
    }, [product, isOpen]);

    const calculateLineTotal = (quantity: number, unitPrice: number) => {
        return quantity * unitPrice;
    };

    const submitOrder = async () => {
        if (!product) return;

        setIsSubmittingOrder(true);
        try {
            const unitPrice = parseFloat(product.listPrice);
            const lineTotal = calculateLineTotal(orderQuantity, unitPrice);

            const orderData = {
                orderNumber: orderForm.orderNumber,
                items: [{
                    productId: product.id,
                    quantity: orderQuantity,
                    unitPrice: unitPrice,
                    listPrice: unitPrice,
                    discountPercent: 0,
                    discountAmount: 0,
                    lineTotal: lineTotal
                }],
                notes: orderForm.notes,
                requestedDeliveryDate: orderForm.requestedDeliveryDate || null
            };

            await post("/distributor/placeorder", orderData, {
                withCredentials: true
            });

            alert("Order placed successfully!");
            onClose();
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Failed to place order. Please try again.");
        } finally {
            setIsSubmittingOrder(false);
        }
    };

    const getStockStatus = (stockQuantity: number) => {
        if (stockQuantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50 border-red-200', icon: XCircle };
        if (stockQuantity < 10) return { text: 'Low Stock', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: AlertTriangle };
        if (stockQuantity < 50) return { text: 'Limited Stock', color: 'text-orange-600 bg-orange-50 border-orange-200', icon: AlertTriangle };
        return { text: 'In Stock', color: 'text-green-600 bg-green-50 border-green-200', icon: CheckCircle };
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Not specified';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (!isOpen || !product) return null;

    const stockStatus = getStockStatus(product.stockQuantity);
    const StockIcon = stockStatus.icon;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999] overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200 my-4">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <Package className="h-8 w-8 text-blue-600" />
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                                <p className="text-gray-600">{product.brand} • {product.category}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Product Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Product Image Placeholder */}
                        <div className="lg:col-span-1">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 flex items-center justify-center h-80">
                                <Package className="h-24 w-24 text-blue-400" />
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Basic Info */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        SKU: {product.sku}
                                    </span>
                                    <span className={`text-sm px-3 py-1 rounded-full border flex items-center space-x-2 ${stockStatus.color}`}>
                                        <StockIcon className="h-4 w-4" />
                                        <span>{stockStatus.text}</span>
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                                    <p className="text-lg text-gray-600 leading-relaxed">{product.description}</p>
                                </div>

                                {/* Price */}
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-4xl font-bold text-blue-600">
                                        ${parseFloat(product.listPrice).toFixed(2)}
                                    </span>
                                    <span className="text-gray-500">per unit</span>
                                </div>

                                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <Info className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Color</p>
                                                <p className="font-medium text-gray-900">{product.color}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex items-center space-x-2">
                                            <Package className="h-5 w-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Stock</p>
                                                <p className="font-medium text-gray-900">{product.stockQuantity} units</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Order Section */}
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Order</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-gray-600">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg">
                                            <button
                                                onClick={() => setOrderQuantity(Math.max(product.minOrderQuantity, orderQuantity - 1))}
                                                className="p-2 hover:bg-gray-100 rounded-l-lg"
                                            >
                                                <Minus className="h-4 w-4" />
                                            </button>
                                            <input
                                                type="number"
                                                value={orderQuantity}
                                                onChange={(e) => setOrderQuantity(Math.max(product.minOrderQuantity, parseInt(e.target.value) || product.minOrderQuantity))}
                                                min={product.minOrderQuantity}
                                                max={product.maxOrderQuantity || product.stockQuantity}
                                                className="w-20 px-3 py-2 text-center border-0 focus:ring-0 bg-transparent"
                                            />
                                            <button
                                                onClick={() => setOrderQuantity(Math.min(product.maxOrderQuantity || product.stockQuantity, orderQuantity + 1))}
                                                className="p-2 hover:bg-gray-100 rounded-r-lg"
                                            >
                                                <Plus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Total:</p>
                                        <p className="text-xl font-bold text-blue-600">
                                            ${calculateLineTotal(orderQuantity, parseFloat(product.listPrice)).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setActiveTab('ordering')}
                                        disabled={product.stockQuantity === 0}
                                        className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                                            product.stockQuantity === 0
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        <span>Order Now</span>
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Min: {product.minOrderQuantity} units • Max: {product.maxOrderQuantity || product.stockQuantity} units
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 mb-6">
                        <nav className="flex space-x-8">
                            {[
                                { id: 'details', label: 'Product Details', icon: Info },
                                { id: 'specifications', label: 'Specifications', icon: Package },
                                { id: 'ordering', label: 'Place Order', icon: ShoppingCart }
                            ].map((tab) => {
                                const TabIcon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                                            activeTab === tab.id
                                                ? 'border-blue-500 text-blue-600'
                                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <TabIcon className="h-4 w-4" />
                                        <span>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">
                        {/* Details Tab */}
                        {activeTab === 'details' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Product Information</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Brand</span>
                                                <span className="font-medium">{product.brand}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Category</span>
                                                <span className="font-medium">{product.category}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Color</span>
                                                <span className="font-medium">{product.color}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Status</span>
                                                <span className={`font-medium ${product.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                    {product.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Inventory Details</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Stock Quantity</span>
                                                <span className="font-medium">{product.stockQuantity} units</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Min Order</span>
                                                <span className="font-medium">{product.minOrderQuantity} units</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">Max Order</span>
                                                <span className="font-medium">{product.maxOrderQuantity || 'No limit'}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-100">
                                                <span className="text-gray-600">List Price</span>
                                                <span className="font-medium text-blue-600">${parseFloat(product.listPrice).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Description</h3>
                                    <p className="text-gray-700 leading-relaxed">{product.description}</p>
                                </div>
                            </div>
                        )}

                        {/* Specifications Tab */}
                        {activeTab === 'specifications' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Physical Specifications</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 py-2">
                                                <Weight className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-gray-600">Weight:</span>
                                                    <span className="ml-2 font-medium">{product.weight}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 py-2">
                                                <Ruler className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-gray-600">Dimensions:</span>
                                                    <span className="ml-2 font-medium">
                                                        {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.length} {product.dimensions.unit}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Product Dates</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 py-2">
                                                <Clock className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-gray-600">Manufacture Date:</span>
                                                    <span className="ml-2 font-medium">{formatDate(product.dateOfManufacture)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 py-2">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-gray-600">Expiry Date:</span>
                                                    <span className="ml-2 font-medium">{formatDate(product.dateOfExpiry)}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 py-2">
                                                <Calendar className="h-5 w-5 text-gray-400" />
                                                <div>
                                                    <span className="text-gray-600">Created:</span>
                                                    <span className="ml-2 font-medium">{formatDate(product.createdAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Ordering Tab */}
                        {activeTab === 'ordering' && (
                            <div className="space-y-6">
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Product:</span>
                                                <span className="font-medium">{product.name}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">SKU:</span>
                                                <span className="font-medium">{product.sku}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Unit Price:</span>
                                                <span className="font-medium">${parseFloat(product.listPrice).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Available Stock:</span>
                                                <span className="font-medium">{product.stockQuantity} units</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Quantity:</span>
                                                <span className="font-medium">{orderQuantity}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Subtotal:</span>
                                                <span className="font-medium">${(orderQuantity * parseFloat(product.listPrice)).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b border-gray-200">
                                                <span className="text-gray-600">Tax:</span>
                                                <span className="font-medium">$0.00</span>
                                            </div>
                                            <div className="flex justify-between py-2">
                                                <span className="text-lg font-semibold text-gray-900">Total:</span>
                                                <span className="text-xl font-bold text-blue-600">
                                                    ${calculateLineTotal(orderQuantity, parseFloat(product.listPrice)).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Order Number */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Number
                                        </label>
                                        <input
                                            type="text"
                                            value={orderForm.orderNumber}
                                            onChange={(e) => setOrderForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter order number"
                                        />
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center border border-gray-300 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => setOrderQuantity(Math.max(product.minOrderQuantity, orderQuantity - 1))}
                                                    className="p-3 hover:bg-gray-50 rounded-l-lg transition-colors"
                                                >
                                                    <Minus className="h-5 w-5" />
                                                </button>
                                                <input
                                                    type="number"
                                                    value={orderQuantity}
                                                    onChange={(e) => setOrderQuantity(Math.max(product.minOrderQuantity, parseInt(e.target.value) || product.minOrderQuantity))}
                                                    min={product.minOrderQuantity}
                                                    max={product.maxOrderQuantity || product.stockQuantity}
                                                    className="w-24 px-4 py-3 text-center border-0 focus:ring-0 bg-transparent"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setOrderQuantity(Math.min(product.maxOrderQuantity || product.stockQuantity, orderQuantity + 1))}
                                                    className="p-3 hover:bg-gray-50 rounded-r-lg transition-colors"
                                                >
                                                    <Plus className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <span className="text-sm text-gray-600">
                                                Min: {product.minOrderQuantity} • Max: {product.maxOrderQuantity || product.stockQuantity}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Delivery Date */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Requested Delivery Date (Optional)
                                        </label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="date"
                                                value={orderForm.requestedDeliveryDate}
                                                onChange={(e) => setOrderForm(prev => ({ ...prev, requestedDeliveryDate: e.target.value }))}
                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Order Notes (Optional)
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-4 top-4 text-gray-400 h-5 w-5" />
                                            <textarea
                                                value={orderForm.notes}
                                                onChange={(e) => setOrderForm(prev => ({ ...prev, notes: e.target.value }))}
                                                rows={4}
                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Any special instructions, delivery preferences, or additional notes..."
                                            />
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex space-x-4 pt-6">
                                        <button
                                            onClick={() => setActiveTab('details')}
                                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                        >
                                            Back to Details
                                        </button>
                                        <button
                                            onClick={submitOrder}
                                            disabled={isSubmittingOrder || !orderForm.orderNumber.trim() || product.stockQuantity === 0}
                                            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors"
                                        >
                                            {isSubmittingOrder ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    <span>Placing Order...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-5 w-5" />
                                                    <span>Place Order</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
