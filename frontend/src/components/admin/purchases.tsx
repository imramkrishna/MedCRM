import { get, post } from '@/lib/api';
import {
    Search,
    DollarSign,
    ShoppingBag,
    Plus,
    Filter,
    Check,
    Clock,
    X,
    AlertCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import ViewButton from '@/components/ui/buttons/ViewButton';
import EditButton from '@/components/ui/buttons/EditButton';
import DownloadButton from '@/components/ui/buttons/DownloadButton';
import Loading from '@/components/ui/buttons/Loading';

// TypeScript Interfaces
interface Product {
    id: number;
    sku: string;
    name: string;
    brand: string;
    category: string;
}

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
    product: Product;
}

interface Distributor {
    companyName: string;
    ownerName: string;
    email: string;
}

interface Order {
    id: string;
    orderNumber: string;
    distributorId: number;
    paymentStatus: string;
    specialOrder: boolean;
    status: string;
    paymentMode: string;
    transactionId: string | null;
    confirmationSlip: string | null;
    subTotal: string;
    taxAmount: string;
    discountAmount: string;
    totalAmount: string;
    notes: string;
    internalNotes: string | null;
    requestedDeliveryDate: string | null;
    approvedAt: string | null;
    rejectedAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
    distributor: Distributor;
    orderItems: OrderItem[];
}

interface PaymentRequest {
    id: number;
    orderId: string;
    PaymentMode: string;
    TxnId: string | null;
    ConfirmationSlip: string | null;
    requestedAt: string;
    updatedAt: string;
    paymentRequestAt: string;
    paymentUpdatedAt: string;
    order: Order;
}

const Purchases = () => {
    const [purchases, setPurchases] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPurchase, setSelectedPurchase] = useState<PaymentRequest | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchPurchases = async () => {
        try {
            setLoading(true);
            const response = await get("/admin/getpayments");
            setPurchases(response.data.data);
        } catch (e) {
            console.log("Error fetching purchases:", e);
        } finally {
            setLoading(false);
        }
    };

    const [searchQueries, setSearchQueries] = useState({
        purchases: ''
    });

    const handleSearchChange = (section: string, value: string) => {
        setSearchQueries(prev => ({
            ...prev,
            [section]: value
        }));
    };

    useEffect(() => {
        fetchPurchases();
    }, []);

    // Calculate stats
    const stats = {
        total: purchases.length,
        completed: purchases.filter(p => p.order.status === 'DELIVERED').length,
        pending: purchases.filter(p => p.order.status === 'PENDING').length,
        totalValue: purchases.reduce((sum, p) => sum + parseFloat(p.order.totalAmount), 0)
    };

    // Filter purchases
    const filteredPurchases = purchases.filter(purchase =>
        searchQueries.purchases === '' ||
        purchase.order.orderNumber.toLowerCase().includes(searchQueries.purchases.toLowerCase()) ||
        purchase.order.distributor.companyName.toLowerCase().includes(searchQueries.purchases.toLowerCase()) ||
        purchase.order.distributor.ownerName.toLowerCase().includes(searchQueries.purchases.toLowerCase()) ||
        purchase.order.orderItems.some(item =>
            item.productName.toLowerCase().includes(searchQueries.purchases.toLowerCase())
        )
    );

    const getStatusColor = (status: string) => {
        const colors: { [key: string]: string } = {
            'DELIVERED': 'bg-green-100 text-green-800',
            'PENDING': 'bg-yellow-100 text-yellow-800',
            'CONFIRMED': 'bg-blue-100 text-blue-800',
            'PROCESSING': 'bg-purple-100 text-purple-800',
            'CANCELLED': 'bg-red-100 text-red-800',
            'REJECTED': 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getPaymentStatusColor = (status: string) => {
        return status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: string) => {
        return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const handleDownloadBill = (purchase: PaymentRequest) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const billHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Invoice - ${purchase.order.orderNumber}</title>
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Arial', sans-serif;
                        padding: 40px;
                        color: #333;
                    }
                    .invoice-container {
                        max-width: 800px;
                        margin: 0 auto;
                        border: 1px solid #ddd;
                        padding: 40px;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #2563eb;
                        padding-bottom: 20px;
                    }
                    .header h1 {
                        color: #2563eb;
                        font-size: 32px;
                        margin-bottom: 5px;
                    }
                    .header p {
                        color: #666;
                        font-size: 14px;
                    }
                    .info-section {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                    }
                    .info-box {
                        width: 48%;
                    }
                    .info-box h3 {
                        color: #2563eb;
                        font-size: 14px;
                        margin-bottom: 10px;
                        text-transform: uppercase;
                    }
                    .info-box p {
                        font-size: 13px;
                        line-height: 1.6;
                        color: #555;
                    }
                    .invoice-details {
                        background: #f9fafb;
                        padding: 15px;
                        margin-bottom: 30px;
                        border-radius: 5px;
                    }
                    .invoice-details p {
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 8px;
                        font-size: 13px;
                    }
                    .invoice-details strong {
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                    }
                    thead {
                        background: #2563eb;
                        color: white;
                    }
                    th {
                        padding: 12px;
                        text-align: left;
                        font-size: 12px;
                        text-transform: uppercase;
                        font-weight: 600;
                    }
                    td {
                        padding: 12px;
                        border-bottom: 1px solid #e5e7eb;
                        font-size: 13px;
                    }
                    tbody tr:hover {
                        background: #f9fafb;
                    }
                    .totals {
                        margin-top: 20px;
                        text-align: right;
                    }
                    .totals-row {
                        display: flex;
                        justify-content: flex-end;
                        margin-bottom: 8px;
                    }
                    .totals-label {
                        width: 150px;
                        text-align: right;
                        padding-right: 20px;
                        color: #666;
                        font-size: 14px;
                    }
                    .totals-value {
                        width: 120px;
                        text-align: right;
                        font-weight: 600;
                        font-size: 14px;
                    }
                    .total-line {
                        border-top: 2px solid #2563eb;
                        padding-top: 12px;
                        margin-top: 12px;
                    }
                    .total-line .totals-label,
                    .total-line .totals-value {
                        font-size: 18px;
                        color: #2563eb;
                    }
                    .footer {
                        margin-top: 40px;
                        text-align: center;
                        color: #666;
                        font-size: 12px;
                        border-top: 1px solid #e5e7eb;
                        padding-top: 20px;
                    }
                    .status-badge {
                        display: inline-block;
                        padding: 4px 12px;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                        text-transform: uppercase;
                    }
                    .status-paid {
                        background: #d1fae5;
                        color: #065f46;
                    }
                    .status-unpaid {
                        background: #fed7aa;
                        color: #92400e;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                        .no-print {
                            display: none;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="invoice-container">
                    <div class="header">
                        <h1>INVOICE</h1>
                        <p>MedCRM - Medical Supply Management</p>
                    </div>

                    <div class="info-section">
                        <div class="info-box">
                            <h3>Bill To</h3>
                            <p>
                                <strong>${purchase.order.distributor.companyName}</strong><br>
                                ${purchase.order.distributor.ownerName}<br>
                                ${purchase.order.distributor.email}
                            </p>
                        </div>
                        <div class="info-box">
                            <h3>Invoice Details</h3>
                            <p>
                                <strong>Invoice #:</strong> ${purchase.order.orderNumber.substring(0, 16)}<br>
                                <strong>Date:</strong> ${formatDate(purchase.requestedAt)}<br>
                                <strong>Payment Status:</strong> 
                                <span class="status-badge status-${purchase.order.paymentStatus.toLowerCase()}">
                                    ${purchase.order.paymentStatus.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div class="invoice-details">
                        <p>
                            <span><strong>Payment Mode:</strong></span>
                            <span>${purchase.PaymentMode.replace(/_/g, ' ')}</span>
                        </p>
                        ${purchase.TxnId ? `
                        <p>
                            <span><strong>Transaction ID:</strong></span>
                            <span>${purchase.TxnId}</span>
                        </p>
                        ` : ''}
                        <p>
                            <span><strong>Order Status:</strong></span>
                            <span>${purchase.order.status}</span>
                        </p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th style="text-align: right;">Qty</th>
                                <th style="text-align: right;">Unit Price</th>
                                <th style="text-align: right;">Discount</th>
                                <th style="text-align: right;">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${purchase.order.orderItems.map(item => `
                                <tr>
                                    <td>
                                        <strong>${item.productName}</strong><br>
                                        <small style="color: #666;">${item.productBrand}</small>
                                    </td>
                                    <td>${item.productSku}</td>
                                    <td style="text-align: right;">${item.quantity}</td>
                                    <td style="text-align: right;">${formatCurrency(item.unitPrice)}</td>
                                    <td style="text-align: right;">${item.discountPercent}%</td>
                                    <td style="text-align: right;"><strong>${formatCurrency(item.lineTotal)}</strong></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>

                    <div class="totals">
                        <div class="totals-row">
                            <div class="totals-label">Subtotal:</div>
                            <div class="totals-value">${formatCurrency(purchase.order.subTotal)}</div>
                        </div>
                        <div class="totals-row">
                            <div class="totals-label">Tax:</div>
                            <div class="totals-value">${formatCurrency(purchase.order.taxAmount)}</div>
                        </div>
                        <div class="totals-row">
                            <div class="totals-label">Discount:</div>
                            <div class="totals-value">-${formatCurrency(purchase.order.discountAmount)}</div>
                        </div>
                        <div class="totals-row total-line">
                            <div class="totals-label">Total Amount:</div>
                            <div class="totals-value">${formatCurrency(purchase.order.totalAmount)}</div>
                        </div>
                    </div>

                    ${purchase.order.notes ? `
                    <div style="margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 5px;">
                        <strong>Notes:</strong><br>
                        <p style="margin-top: 8px; color: #555; font-size: 13px;">${purchase.order.notes}</p>
                    </div>
                    ` : ''}

                    <div class="footer">
                        <p>Thank you for your business!</p>
                        <p style="margin-top: 8px;">This is a computer-generated invoice and does not require a signature.</p>
                    </div>

                    <div class="no-print" style="margin-top: 30px; text-align: center;">
                        <button onclick="window.print()" style="
                            background: #2563eb;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                            margin-right: 10px;
                        ">Print Invoice</button>
                        <button onclick="window.close()" style="
                            background: #6b7280;
                            color: white;
                            border: none;
                            padding: 12px 24px;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 600;
                        ">Close</button>
                    </div>
                </div>
            </body>
            </html>
        `;

        printWindow.document.write(billHTML);
        printWindow.document.close();
    };

    const handleUpdatePaymentStatus = async () => {
        if (!selectedPurchase) return;

        try {
            setIsUpdating(true);
            await post('/admin/update-payment-status', {
                orderId: selectedPurchase.orderId
            });

            // Refresh purchases list
            await fetchPurchases();
            setShowEditModal(false);
            setSelectedPurchase(null);
        } catch (error) {
            console.error('Error updating payment status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Payment Management</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search payments..."
                            value={searchQueries.purchases}
                            onChange={(e) => handleSearchChange('purchases', e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Payment Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Payments</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                        </div>
                        <Check className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue.toString())}</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Payment Table */}
            {loading ? (
                <Loading message="payment requests" />
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order Number
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Distributor
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Items
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Mode
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Payment Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-36">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPurchases.map((purchase) => (
                                <tr key={purchase.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-blue-600">
                                            {purchase.order.orderNumber.substring(0, 8)}...
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {purchase.order.distributor.companyName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {purchase.order.distributor.ownerName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {purchase.order.orderItems.length} item(s)
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {purchase.order.orderItems[0]?.productName.substring(0, 30)}
                                            {purchase.order.orderItems.length > 1 && '...'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {purchase.PaymentMode.replace(/_/g, ' ')}
                                        </div>
                                        {purchase.TxnId && (
                                            <div className="text-xs text-gray-500">
                                                TxnID: {purchase.TxnId.substring(0, 10)}...
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {formatCurrency(purchase.order.totalAmount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">
                                            {formatDate(purchase.requestedAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(purchase.order.status)}`}>
                                            {purchase.order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(purchase.order.paymentStatus)}`}>
                                            {purchase.order.paymentStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium w-36">
                                        <div className="flex items-center justify-end gap-2">
                                            <ViewButton
                                                onClick={() => {
                                                    setSelectedPurchase(purchase);
                                                    setShowDetailsModal(true);
                                                }}
                                                size="sm"
                                            />
                                            <EditButton
                                                onClick={() => {
                                                    setSelectedPurchase(purchase);
                                                    setShowEditModal(true);
                                                }}
                                                size="sm"
                                            />
                                            <DownloadButton
                                                onClick={() => handleDownloadBill(purchase)}
                                                size="sm"
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredPurchases.length === 0 && !loading && (
                        <div className="text-center py-12">
                            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No payment requests found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Pagination */}
            {filteredPurchases.length > 0 && (
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                        Showing {filteredPurchases.length} of {purchases.length} payments
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Previous</button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Next</button>
                    </div>
                </div>
            )}

            {/* Details Modal */}
            {showDetailsModal && selectedPurchase && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl my-8">
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
                            <h3 className="text-xl font-bold text-gray-900">Payment Details</h3>
                            <button
                                onClick={() => setShowDetailsModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {/* Order Information */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Order Information</h4>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <p className="text-sm text-gray-600">Order Number</p>
                                        <p className="font-medium text-gray-900">{selectedPurchase.order.orderNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Order Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedPurchase.order.status)}`}>
                                            {selectedPurchase.order.status}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Mode</p>
                                        <p className="font-medium text-gray-900">{selectedPurchase.PaymentMode.replace(/_/g, ' ')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">Payment Status</p>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedPurchase.order.paymentStatus)}`}>
                                            {selectedPurchase.order.paymentStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    {selectedPurchase.TxnId && (
                                        <div>
                                            <p className="text-sm text-gray-600">Transaction ID</p>
                                            <p className="font-medium text-gray-900">{selectedPurchase.TxnId}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Requested Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(selectedPurchase.requestedAt)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Distributor Information */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Distributor Information</h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium text-gray-900">{selectedPurchase.order.distributor.companyName}</p>
                                    <p className="text-sm text-gray-600">{selectedPurchase.order.distributor.ownerName}</p>
                                    <p className="text-sm text-gray-600">{selectedPurchase.order.distributor.email}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedPurchase.order.orderItems.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                                        <div className="text-xs text-gray-500">{item.productBrand} • {item.productCategory}</div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900">{item.productSku}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">{formatCurrency(item.unitPrice)}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">{formatCurrency(item.lineTotal)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(selectedPurchase.order.subTotal)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium text-gray-900">{formatCurrency(selectedPurchase.order.taxAmount)}</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Discount</span>
                                    <span className="font-medium text-gray-900">-{formatCurrency(selectedPurchase.order.discountAmount)}</span>
                                </div>
                                <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between">
                                    <span className="font-semibold text-gray-900">Total Amount</span>
                                    <span className="font-bold text-gray-900 text-lg">{formatCurrency(selectedPurchase.order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Payment Status Modal */}
            {showEditModal && selectedPurchase && (
                <div 
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowEditModal(false);
                            setSelectedPurchase(null);
                        }
                    }}
                >
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Update Payment Status</h3>
                            <button
                                onClick={() => {
                                    setShowEditModal(false);
                                    setSelectedPurchase(null);
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Order Details */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600">Order Number:</span>
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        {selectedPurchase.order.orderNumber}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600">Distributor:</span>
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        {selectedPurchase.order.distributor.companyName}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600">Payment Mode:</span>
                                    <span className="ml-2 text-sm font-medium text-gray-900">
                                        {selectedPurchase.PaymentMode.replace(/_/g, ' ')}
                                    </span>
                                </div>
                                <div className="mb-2">
                                    <span className="text-sm text-gray-600">Total Amount:</span>
                                    <span className="ml-2 text-sm font-bold text-gray-900">
                                        {formatCurrency(selectedPurchase.order.totalAmount)}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-sm text-gray-600">Current Status:</span>
                                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedPurchase.order.paymentStatus)}`}>
                                        {selectedPurchase.order.paymentStatus.toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Warning Message */}
                            {selectedPurchase.order.paymentStatus === 'paid' ? (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start">
                                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
                                    <p className="text-sm text-yellow-800">
                                        This order is already marked as paid.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <p className="text-sm text-blue-800">
                                        This will mark the payment as PAID and update the order status accordingly.
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowEditModal(false);
                                        setSelectedPurchase(null);
                                    }}
                                    disabled={isUpdating}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdatePaymentStatus}
                                    disabled={isUpdating || selectedPurchase.order.paymentStatus === 'paid'}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {isUpdating ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="h-4 w-4 mr-1" />
                                            Mark as Paid
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Purchases;