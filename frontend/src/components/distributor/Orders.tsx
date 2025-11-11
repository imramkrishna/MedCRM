'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
    Calendar,
    CheckCircle,
    XCircle,
    Package,
    Search,
    Trash2,
    Clock,
    AlertTriangle,
    RefreshCw,
    ArrowUpDown,
    Plus,
    ChevronLeft,
    ChevronRight,
    FileText,
    X,
    Loader2
} from 'lucide-react';
import { get, put, del } from '@/lib/api';
import OrderDetails from './OrderDetails';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/hooks';
import ViewButton from '@/components/ui/buttons/ViewButton';
import EditButton from '@/components/ui/buttons/EditButton';
import DeleteButton from '@/components/ui/buttons/DeleteButton';
import Loading from '../ui/buttons/Loading';
interface OrderItem {
    id: string;
    orderId: string;
    productId: number;
    quantity: number;
    unitPrice: string;
    listPrice: string;
    discountPercent: string;
    discountAmount: string;
    lineTotal: string;
    productSku: string;
    productName: string;
    productDescription: string;
    productBrand: string;
    productCategory: string;
    notes: string | null;
    requestedDeliveryDate: string | null;
    quantityFulfilled: number;
    fulfilledAt: string | null;
    createdAt: string;
    updatedAt: string;
}

interface Order {
    id: string;
    orderNumber: string;
    distributorId: number;
    status: string;
    subTotal: string;
    taxAmount: string;
    discountAmount: string;
    totalAmount: string;
    notes: string | null;
    internalNotes: string | null;
    requestedDeliveryDate: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
}

// Place Order Modal Component
interface PlaceOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPlaceOrder: (orderData: any) => Promise<void>;
}

interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    listPrice: string;
    stockQuantity: number;
    minOrderQuantity: number;
    maxOrderQuantity: number | null;
    isActive: boolean;
}

interface OrderItemInput {
    productId: number;
    quantity: number;
    unitPrice: number;
    listPrice: number;
    discountPercent: number;
    discountAmount: number;
    lineTotal: number;
}

const PlaceOrderModal: React.FC<PlaceOrderModalProps> = ({ isOpen, onClose, onPlaceOrder }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedItems, setSelectedItems] = useState<OrderItemInput[]>([]);
    const [notes, setNotes] = useState('');
    const [requestedDeliveryDate, setRequestedDeliveryDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showProductSelector, setShowProductSelector] = useState(false);

    // Get current user from auth state
    const { user } = useAppSelector((state) => state.auth);

    // Fetch products when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            const response = await get('/distributor/products', { withCredentials: true });
            setProducts(response.data.filter((p: Product) => p.isActive));
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const addProductToOrder = (product: Product) => {
        const existingItem = selectedItems.find(item => item.productId === product.id);
        if (existingItem) {
            updateQuantity(product.id, existingItem.quantity + 1);
        } else {
            const unitPrice = parseFloat(product.listPrice);
            const quantity = product.minOrderQuantity || 1;
            const lineTotal = unitPrice * quantity;

            const newItem: OrderItemInput = {
                productId: product.id,
                quantity,
                unitPrice,
                listPrice: unitPrice,
                discountPercent: 0,
                discountAmount: 0,
                lineTotal
            };

            setSelectedItems([...selectedItems, newItem]);
        }
        setShowProductSelector(false);
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeItem(productId);
            return;
        }

        setSelectedItems(items =>
            items.map(item => {
                if (item.productId === productId) {
                    const lineTotal = item.unitPrice * newQuantity;
                    return { ...item, quantity: newQuantity, lineTotal };
                }
                return item;
            })
        );
    };

    const updateDiscount = (productId: number, discountPercent: number) => {
        setSelectedItems(items =>
            items.map(item => {
                if (item.productId === productId) {
                    const subtotal = item.unitPrice * item.quantity;
                    const discountAmount = (subtotal * discountPercent) / 100;
                    const lineTotal = subtotal - discountAmount;
                    return {
                        ...item,
                        discountPercent,
                        discountAmount,
                        lineTotal
                    };
                }
                return item;
            })
        );
    };

    const removeItem = (productId: number) => {
        setSelectedItems(items => items.filter(item => item.productId !== productId));
    };

    const handleSubmit = async () => {
        if (selectedItems.length === 0) {
            alert('Please add at least one item to the order');
            return;
        }

        if (!user?.id) {
            alert('User not authenticated. Please log in again.');
            return;
        }

        try {
            setLoading(true);

            const orderData = {
                distributorId: parseInt(user.id), // Use actual user ID from auth state
                items: selectedItems,
                notes: notes || null,
                requestedDeliveryDate: requestedDeliveryDate || null
            };

            await onPlaceOrder(orderData);

            // Reset form
            setSelectedItems([]);
            setNotes('');
            setRequestedDeliveryDate('');
            onClose();
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getProductById = (productId: number) => products.find(p => p.id === productId);

    const calculateTotal = () => {
        return selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Place New Order</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-md font-semibold text-gray-700">Order Items</h4>
                        <button
                            onClick={() => setShowProductSelector(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                        >
                            <Plus className="h-4 w-4" />
                            <span>Add Product</span>
                        </button>
                    </div>

                    {selectedItems.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No items added yet</p>
                            <p className="text-sm">Click "Add Product" to start building your order</p>
                        </div>
                    ) : (
                        <div className="space-y-4 max-h-60 overflow-y-auto">
                            {selectedItems.map((item) => {
                                const product = getProductById(item.productId);
                                return (
                                    <div key={item.productId} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h5 className="font-medium text-gray-900">{product?.name}</h5>
                                                <p className="text-sm text-gray-500">SKU: {product?.sku}</p>
                                                <p className="text-sm text-gray-600">${item.unitPrice.toFixed(2)} per unit</p>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mt-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Quantity</label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Discount %</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    step="0.1"
                                                    value={item.discountPercent}
                                                    onChange={(e) => updateDiscount(item.productId, parseFloat(e.target.value) || 0)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Line Total</label>
                                                <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-900">
                                                    ${item.lineTotal.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Special instructions or notes..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Requested Delivery Date (Optional)</label>
                        <input
                            type="date"
                            value={requestedDeliveryDate}
                            onChange={(e) => setRequestedDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Order Summary */}
                {selectedItems.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Order Summary</h4>
                        <div className="flex justify-between text-lg font-bold">
                            <span>Total Amount:</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || selectedItems.length === 0}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <span>{loading ? 'Placing Order...' : 'Place Order'}</span>
                    </button>
                </div>

                {/* Product Selector Modal */}
                {showProductSelector && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
                        <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-gray-900">Select Product</h3>
                                <button
                                    onClick={() => setShowProductSelector(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="border rounded-lg p-4 mb-2 hover:bg-gray-50 cursor-pointer"
                                        onClick={() => addProductToOrder(product)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                                                <p className="text-sm text-gray-600">{product.description}</p>
                                                <p className="text-sm text-blue-600 font-medium">${parseFloat(product.listPrice).toFixed(2)}</p>
                                            </div>
                                            <div className="text-right text-sm text-gray-500">
                                                <p>Stock: {product.stockQuantity}</p>
                                                <p>Min Qty: {product.minOrderQuantity}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// View Order Modal Component
interface ViewOrderModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
}

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({ order, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                                <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                        {/* Order Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Order Summary Card */}
                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                                    <Package className="h-4 w-4 mr-2" />
                                    Order Summary
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Status:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${order.status === 'APPROVED' ? 'bg-green-100 text-green-800' : order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Subtotal:</span>
                                        <span className="font-medium">${parseFloat(order.subTotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Tax:</span>
                                        <span className="font-medium">${parseFloat(order.taxAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-700">Discount:</span>
                                        <span className="font-medium">-${parseFloat(order.discountAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-blue-200 pt-2">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-blue-900">Total:</span>
                                            <span className="font-bold text-blue-900">${parseFloat(order.totalAmount).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Details Card */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Order Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Created:</span>
                                        <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Updated:</span>
                                        <span className="font-medium">{new Date(order.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                    {order.requestedDeliveryDate && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Delivery Date:</span>
                                            <span className="font-medium">{new Date(order.requestedDeliveryDate).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                    {order.approvedAt && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Approved:</span>
                                            <span className="font-medium">{new Date(order.approvedAt).toLocaleDateString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="mb-6">
                            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                <Package className="h-4 w-4 mr-2" />
                                Order Items ({order.orderItems.length})
                            </h4>
                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.orderItems.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                                            <div className="text-sm text-gray-500">{item.productBrand}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{item.productSku}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">${parseFloat(item.unitPrice).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900">${parseFloat(item.lineTotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                                    <FileText className="h-4 w-4 mr-2" />
                                    Order Notes
                                </h4>
                                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                                    <p className="text-sm text-gray-700">{order.notes}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Edit Order Modal Component
interface EditOrderModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (order: Order) => void;
}

const EditOrderModal: React.FC<EditOrderModalProps> = ({ order, isOpen, onClose, onUpdate }) => {
    const [editedOrder, setEditedOrder] = useState<Order>(order);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSave = async () => {
        setLoading(true);
        try {
            // Prepare data for update - only send what can be updated
            const updateData: any = {
                notes: editedOrder.notes || null
            };

            // Convert date to ISO-8601 DateTime format if provided
            if (editedOrder.requestedDeliveryDate) {
                // Create a date object and convert to ISO string
                const date = new Date(editedOrder.requestedDeliveryDate);
                updateData.requestedDeliveryDate = date.toISOString();
            }

            console.log('Sending update data:', updateData); // Debug log

            const response = await put(
                `/distributor/update-order/${order.id}`,
                updateData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Update response:', response); // Debug log

            // Update the order in parent component
            onUpdate(response.data);

            alert('Order updated successfully!');
            onClose();
        } catch (error: any) {
            console.error('Error updating order:', error);
            const errorMessage = error?.response?.data?.message || 'Failed to update order. Please try again.';
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Edit Order</h3>
                                <p className="text-sm text-gray-600">Order #{order.orderNumber}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white px-6 py-4 max-h-96 overflow-y-auto">
                        {/* Edit Form */}
                        <div className="space-y-6">
                            {/* Order Items (Read-only for now) */}
                            <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                                <div className="bg-gray-50 rounded-lg p-4 border">
                                    <p className="text-sm text-gray-600 mb-2">
                                        {order.orderItems.length} item(s) - Total: ${parseFloat(order.totalAmount).toFixed(2)}
                                    </p>
                                    <div className="space-y-2">
                                        {order.orderItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <span>{item.productName} x {item.quantity}</span>
                                                <span className="font-medium">${parseFloat(item.lineTotal).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Requested Delivery Date
                                </label>
                                <input
                                    type="date"
                                    value={editedOrder.requestedDeliveryDate ? editedOrder.requestedDeliveryDate.split('T')[0] : ''}
                                    onChange={(e) => setEditedOrder(prev => ({
                                        ...prev,
                                        requestedDeliveryDate: e.target.value
                                    }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            {/* Notes */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Order Notes
                                </label>
                                <textarea
                                    value={editedOrder.notes || ''}
                                    onChange={(e) => setEditedOrder(prev => ({
                                        ...prev,
                                        notes: e.target.value
                                    }))}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Add any special instructions or notes..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300 flex items-center space-x-2"
                            >
                                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal Component
interface DeleteConfirmModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({ order, isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    {/* Header */}
                    <div className="bg-white px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-red-600 flex items-center">
                                <AlertTriangle className="h-5 w-5 mr-2" />
                                Delete Order
                            </h3>
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="bg-white px-6 py-4">
                        <div className="mb-4">
                            <p className="text-sm text-gray-600 mb-4">
                                Are you sure you want to delete this order? This action cannot be undone.
                            </p>

                            {/* Order Summary */}
                            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                                <h4 className="font-semibold text-red-900 mb-2">Order to be deleted:</h4>
                                <div className="space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-red-700">Order Number:</span>
                                        <span className="font-medium">{order.orderNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-700">Total Amount:</span>
                                        <span className="font-medium">${parseFloat(order.totalAmount).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-700">Status:</span>
                                        <span className="font-medium">{order.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-red-700">Items:</span>
                                        <span className="font-medium">{order.orderItems.length} item(s)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center space-x-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                <span>Delete Order</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Orders = () => {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [dateFilter, setDateFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [ordersPerPage] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

    // Fetch orders from backend
    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await get('/distributor/get-orders', {
                withCredentials: true
            });

            // Handle the API response structure with orders array
            const ordersData = response.data?.orders && Array.isArray(response.data.orders)
                ? response.data.orders
                : [];
            setOrders(ordersData);
            setFilteredOrders(ordersData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Set empty arrays on error
            setOrders([]);
            setFilteredOrders([]);
            alert('Failed to fetch orders. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Filter and search logic
    useEffect(() => {
        // Ensure orders is always an array
        if (!Array.isArray(orders)) {
            setFilteredOrders([]);
            return;
        }

        let filtered = [...orders];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(order =>
                order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (order.orderItems && Array.isArray(order.orderItems) &&
                    order.orderItems.some(item =>
                        item.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.productSku?.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                )
            );
        }

        // Status filter
        if (statusFilter !== 'ALL') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Date filter
        if (dateFilter !== 'ALL') {
            const now = new Date();
            const cutoffDate = new Date();

            switch (dateFilter) {
                case 'TODAY':
                    cutoffDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
                    break;
                case 'WEEK':
                    cutoffDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
                    break;
                case 'MONTH':
                    cutoffDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(order => new Date(order.createdAt) >= cutoffDate);
                    break;
            }
        }

        // Sorting
        filtered.sort((a, b) => {
            let aValue, bValue;

            switch (sortBy) {
                case 'orderNumber':
                    aValue = a.orderNumber || '';
                    bValue = b.orderNumber || '';
                    break;
                case 'totalAmount':
                    aValue = parseFloat(a.totalAmount || '0');
                    bValue = parseFloat(b.totalAmount || '0');
                    break;
                case 'status':
                    aValue = a.status || '';
                    bValue = b.status || '';
                    break;
                default:
                    aValue = new Date(a.createdAt || 0);
                    bValue = new Date(b.createdAt || 0);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        setFilteredOrders(filtered);
        setCurrentPage(1);
    }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

    // Get status color and icon
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DRAFT': return 'bg-gray-100 text-gray-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'REJECTED': return 'bg-red-100 text-red-800';
            case 'CANCELLED': return 'bg-red-100 text-red-800';
            case 'PROCESSING': return 'bg-blue-100 text-blue-800';
            case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
            case 'DELIVERED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
            case 'REJECTED':
            case 'CANCELLED': return <XCircle className="h-4 w-4" />;
            case 'PENDING': return <Clock className="h-4 w-4" />;
            case 'PROCESSING': return <RefreshCw className="h-4 w-4" />;
            default: return <Package className="h-4 w-4" />;
        }
    };

    // Handle order operations
    const handleViewOrder = (order: Order) => {
        console.log(order)
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    const handleUpdateOrder = (updatedOrder: Order) => {
        try {
            const response = put(`/distributor/update-order/${updatedOrder.id}`, updatedOrder, { withCredentials: true });
            // Update order in local state
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === updatedOrder.id ? updatedOrder : order
                )
            );
            console.log("Response after updating order:", response);
        } catch (error) {
            console.log("Error while updating order:", error);
        }
    };
    const handleCancelOrder = async (orderId: string) => {
        try {
            const response = await get(`/distributor/cancel-order/${orderId}`, {
                withCredentials: true
            });
            console.log('Cancel order response:', response);

            // Update order status locally
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: 'CANCELLED' } : order
                )
            );

            alert('Order cancelled successfully!');
        } catch (error) {
            console.error('Error cancelling order:', error);
            alert('Failed to cancel order. Please try again.');
            throw error;
        }
        // Remove the finally block with router.push
    };

    // New handlers for view, edit, and delete modals
    const handleViewOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setShowViewModal(true);
    };

    const handleEditOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setShowEditModal(true);
    };

    const handleDeleteOrderModal = (order: Order) => {
        setOrderToDelete(order);
        setShowDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (!orderToDelete) return;

        try {
            await get(`/distributor/cancel-order/${orderToDelete.id}`, {
                withCredentials: true
            });

            // Remove order from list
            setOrders(prevOrders =>
                prevOrders.filter(order => order.id !== orderToDelete.id)
            );

            // Close modal
            setShowDeleteConfirm(false);
            setOrderToDelete(null);

            alert('Order deleted successfully!');
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order. Please try again.');
        }
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    // Ensure filteredOrders is an array before slicing
    const currentOrders = Array.isArray(filteredOrders)
        ? filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
        : [];
    const totalPages = Array.isArray(filteredOrders)
        ? Math.ceil(filteredOrders.length / ordersPerPage)
        : 0;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <Loading message="orders" />
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
                    <p className="text-gray-600 mt-1">
                        Manage your orders and track their status
                    </p>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={fetchOrders}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh</span>
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Status</option>
                        <option value="DRAFT">Draft</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                    </select>

                    {/* Date Filter */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                    >
                        <option value="ALL">All Time</option>
                        <option value="TODAY">Today</option>
                        <option value="WEEK">Last 7 Days</option>
                        <option value="MONTH">Last Month</option>
                    </select>

                    {/* Sort */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split('-');
                            setSortBy(field);
                            setSortOrder(order as 'asc' | 'desc');
                        }}
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="orderNumber-asc">Order Number A-Z</option>
                        <option value="orderNumber-desc">Order Number Z-A</option>
                        <option value="totalAmount-desc">Highest Amount</option>
                        <option value="totalAmount-asc">Lowest Amount</option>
                        <option value="status-asc">Status A-Z</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('orderNumber')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Order Number</span>
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('totalAmount')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Total Amount</span>
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('status')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Status</span>
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    onClick={() => handleSort('createdAt')}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>Created Date</span>
                                        <ArrowUpDown className="h-3 w-3" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500 text-lg">No orders found</p>
                                        <p className="text-gray-400 text-sm">Try adjusting your filters or search terms</p>
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center space-x-3">
                                                <Package className="h-5 w-5 text-blue-600" />
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {order.orderNumber}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {order.id.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {Array.isArray(order.orderItems) ? order.orderItems.length : 0} item{(Array.isArray(order.orderItems) ? order.orderItems.length : 0) !== 1 ? 's' : ''}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {Array.isArray(order.orderItems)
                                                    ? order.orderItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
                                                    : 0
                                                } total qty
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                ${parseFloat(order.totalAmount).toFixed(2)}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                Subtotal: ${parseFloat(order.subTotal).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span>{order.status}</span>
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                            <div>{new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center space-x-2">
                                                <ViewButton
                                                    onClick={() => handleViewOrderModal(order)}
                                                    size="md"
                                                />
                                                {(order.status === 'DRAFT' || order.status === 'PENDING') && (
                                                    <>
                                                        <EditButton
                                                            onClick={() => handleEditOrderModal(order)}
                                                            size="md"
                                                        />
                                                        <DeleteButton
                                                            onClick={() => handleDeleteOrderModal(order)}
                                                            size="md"
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                                    <span className="font-medium">
                                        {Math.min(indexOfLastOrder, Array.isArray(filteredOrders) ? filteredOrders.length : 0)}
                                    </span>{' '}
                                    of <span className="font-medium">{Array.isArray(filteredOrders) ? filteredOrders.length : 0}</span> results
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="h-5 w-5" />
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => paginate(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetails
                    order={selectedOrder}
                    isOpen={showOrderDetails}
                    onClose={() => {
                        setShowOrderDetails(false);
                        setSelectedOrder(null);
                    }}
                    onUpdate={handleUpdateOrder}
                    onCancel={handleCancelOrder}
                />
            )}

            {/* View Order Modal */}
            {selectedOrder && showViewModal && (
                <ViewOrderModal
                    order={selectedOrder}
                    isOpen={showViewModal}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedOrder(null);
                    }}
                />
            )}

            {/* Edit Order Modal */}
            {selectedOrder && showEditModal && (
                <EditOrderModal
                    order={selectedOrder}
                    isOpen={showEditModal}
                    onClose={() => {
                        setShowEditModal(false);
                        setSelectedOrder(null);
                    }}
                    onUpdate={handleUpdateOrder}
                />
            )}

            {/* Delete Confirmation Modal */}
            {orderToDelete && showDeleteConfirm && (
                <DeleteConfirmModal
                    order={orderToDelete}
                    isOpen={showDeleteConfirm}
                    onClose={() => {
                        setShowDeleteConfirm(false);
                        setOrderToDelete(null);
                    }}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </div>
    );
};

export default Orders;
