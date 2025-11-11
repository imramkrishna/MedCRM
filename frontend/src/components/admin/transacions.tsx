import {
    Search,
    Filter,
    Download,
    Eye,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    RefreshCw,
    Printer,
} from 'lucide-react';
import { useState } from 'react';
const Transactions = () => {
    const [searchQueries, setSearchQueries] = useState({
        transactions: ''
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
                    <RefreshCw className="h-8 w-8 text-teal-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchQueries.transactions}
                            onChange={(e) => handleSearchChange('transactions', e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="date"
                            className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm text-gray-900"
                        />
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </button>
                </div>
            </div>

            {/* Transaction Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-teal-600 font-medium">Total Transactions</p>
                            <p className="text-2xl font-bold text-gray-900">3,476</p>
                        </div>
                        <RefreshCw className="h-8 w-8 text-teal-500" />
                    </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Income</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-bold text-gray-900">$852,430</p>
                                <span className="ml-2 flex items-center text-green-600 text-xs">
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                    5.3%
                                </span>
                            </div>
                        </div>
                        <ArrowUpRight className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium">Expenses</p>
                            <div className="flex items-center">
                                <p className="text-2xl font-bold text-gray-900">$268,720</p>
                                <span className="ml-2 flex items-center text-red-600 text-xs">
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                    2.8%
                                </span>
                            </div>
                        </div>
                        <ArrowDownRight className="h-8 w-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Transaction Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
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
                            {
                                id: 'TRX-001',
                                date: '2025-08-06 09:32 AM',
                                description: 'Order payment from City Medical Center',
                                category: 'Sales',
                                amount: '+$12,560.00',
                                type: 'income',
                                status: 'Completed'
                            },
                            {
                                id: 'TRX-002',
                                date: '2025-08-05 11:15 AM',
                                description: 'Supplier payment to MedSupplies Inc.',
                                category: 'Purchase',
                                amount: '-$8,750.00',
                                type: 'expense',
                                status: 'Completed'
                            },
                            {
                                id: 'TRX-003',
                                date: '2025-08-04 03:45 PM',
                                description: 'Order payment from Regional Hospital',
                                category: 'Sales',
                                amount: '+$23,450.00',
                                type: 'income',
                                status: 'Completed'
                            },
                            {
                                id: 'TRX-004',
                                date: '2025-08-03 02:20 PM',
                                description: 'Monthly office rent payment',
                                category: 'Expense',
                                amount: '-$3,500.00',
                                type: 'expense',
                                status: 'Completed'
                            },
                            {
                                id: 'TRX-005',
                                date: '2025-08-02 10:10 AM',
                                description: 'Refund to Memorial Hospital',
                                category: 'Refund',
                                amount: '-$4,200.00',
                                type: 'expense',
                                status: 'Processing'
                            }
                        ].filter(transaction =>
                            searchQueries.transactions === '' ||
                            transaction.id.toLowerCase().includes(searchQueries.transactions.toLowerCase()) ||
                            transaction.description.toLowerCase().includes(searchQueries.transactions.toLowerCase()) ||
                            transaction.category.toLowerCase().includes(searchQueries.transactions.toLowerCase())
                        ).map((transaction, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-teal-600">{transaction.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{transaction.date}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">{transaction.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.category === 'Sales' ? 'bg-blue-100 text-blue-800' :
                                        transaction.category === 'Purchase' ? 'bg-purple-100 text-purple-800' :
                                            transaction.category === 'Refund' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>{transaction.amount}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                        'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button className="text-teal-600 hover:text-teal-900">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="text-gray-600 hover:text-gray-900">
                                            <Printer className="h-4 w-4" />
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
                    Showing 1 to 5 of 3,476 transactions
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Previous</button>
                    <button className="px-3 py-1 bg-teal-600 text-white rounded-md">1</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">2</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">3</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Transactions;