import {
    Search,
    DollarSign,
    ShoppingBag,
    Plus,
    Filter,
    Download,
    Eye,
    Check,
    Clock,
} from 'lucide-react';
import { useState } from 'react';
const Purchases = () => {
    const [searchQueries, setSearchQueries] = useState({
        purchases: ''
    });
    const handleSearchChange = (section: string, value: string) => {
        setSearchQueries(prev => ({
            ...prev,
            [section]: value
        }));
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div className="flex items-center space-x-3">
                    <ShoppingBag className="h-8 w-8 text-blue-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Purchase Management</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search purchases..."
                            value={searchQueries.purchases}
                            onChange={(e) => handleSearchChange('purchases', e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>New Purchase</span>
                    </button>
                </div>
            </div>

            {/* Purchase Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Purchases</p>
                            <p className="text-2xl font-bold text-gray-900">1,783</p>
                        </div>
                        <ShoppingBag className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Completed</p>
                            <p className="text-2xl font-bold text-gray-900">1,521</p>
                        </div>
                        <Check className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">187</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">$3.6M</p>
                        </div>
                        <DollarSign className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Purchase Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Purchase ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Supplier
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Value
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {[
                            { id: 'PUR-001', supplier: 'Medical Supplies Co.', items: 'Surgical Equipment', value: '$12,450', date: '2025-08-05', status: 'Completed' },
                            { id: 'PUR-002', supplier: 'Healthcare Products Ltd', items: 'Diagnostic Tools', value: '$8,320', date: '2025-08-03', status: 'Pending' },
                            { id: 'PUR-003', supplier: 'Surgical Instruments Inc', items: 'Surgical Kits', value: '$15,780', date: '2025-08-01', status: 'Completed' },
                            { id: 'PUR-004', supplier: 'MediTech Global', items: 'Monitoring Equipment', value: '$23,150', date: '2025-07-28', status: 'Completed' },
                            { id: 'PUR-005', supplier: 'Healthcare Innovations', items: 'Surgical Instruments', value: '$9,870', date: '2025-07-25', status: 'Processing' }
                        ].filter(purchase =>
                            searchQueries.purchases === '' ||
                            purchase.id.toLowerCase().includes(searchQueries.purchases.toLowerCase()) ||
                            purchase.supplier.toLowerCase().includes(searchQueries.purchases.toLowerCase()) ||
                            purchase.items.toLowerCase().includes(searchQueries.purchases.toLowerCase())
                        ).map((purchase, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-blue-600">{purchase.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{purchase.supplier}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{purchase.items}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{purchase.value}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{purchase.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${purchase.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        purchase.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {purchase.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900">
                                            <Download className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                    Showing 1 to 5 of 24 purchases
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Previous</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">2</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">3</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Next</button>
                </div>
            </div>
        </div>
    );
}

export default Purchases
