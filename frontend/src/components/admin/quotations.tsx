import {
    FileText,
    Search,
    Plus,
    Filter,
    Download,
    Eye,
    Clock,
    XCircle,
    Printer,
    CheckCircle,
} from 'lucide-react';
import { useState } from 'react';
const Quotations = () => {
    const [searchQueries, setSearchQueries] = useState({
        quotation: ''
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
                    <FileText className="h-8 w-8 text-indigo-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Quotation Management</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search quotations..."
                            value={searchQueries.quotation}
                            onChange={(e) => handleSearchChange('quotation', e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-64 text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Filter className="h-4 w-4" />
                        <span>Filter</span>
                    </button>
                    <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Plus className="h-4 w-4" />
                        <span>Create Quotation</span>
                    </button>
                </div>
            </div>

            {/* Quotation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-indigo-600 font-medium">Total Quotations</p>
                            <p className="text-2xl font-bold text-gray-900">532</p>
                        </div>
                        <FileText className="h-8 w-8 text-indigo-500" />
                    </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Accepted</p>
                            <p className="text-2xl font-bold text-gray-900">289</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium">Pending</p>
                            <p className="text-2xl font-bold text-gray-900">158</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-600 font-medium">Rejected</p>
                            <p className="text-2xl font-bold text-gray-900">85</p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Quotation Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quote ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Products
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
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
                            { id: 'QT-001', customer: 'Memorial Hospital', products: 'Surgical Implants', total: '$8,750', date: '2025-08-06', status: 'Pending' },
                            { id: 'QT-002', customer: 'City Medical Center', products: 'Orthopedic Tools', total: '$12,320', date: '2025-08-05', status: 'Accepted' },
                            { id: 'QT-003', customer: 'Regional Healthcare', products: 'Surgical Equipment', total: '$24,150', date: '2025-08-04', status: 'Accepted' },
                            { id: 'QT-004', customer: 'University Hospital', products: 'Diagnostic Kits', total: '$9,870', date: '2025-08-02', status: 'Rejected' },
                            { id: 'QT-005', customer: 'Private Clinic Group', products: 'Surgical Tools', total: '$16,530', date: '2025-08-01', status: 'Pending' }
                        ].filter(quote =>
                            searchQueries.quotation === '' ||
                            quote.id.toLowerCase().includes(searchQueries.quotation.toLowerCase()) ||
                            quote.customer.toLowerCase().includes(searchQueries.quotation.toLowerCase()) ||
                            quote.products.toLowerCase().includes(searchQueries.quotation.toLowerCase())
                        ).map((quote, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-indigo-600">{quote.id}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{quote.customer}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">{quote.products}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{quote.total}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-700">{quote.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                        quote.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {quote.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end space-x-2">
                                        <button className="text-indigo-600 hover:text-indigo-900">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                        <button className="text-green-600 hover:text-green-900">
                                            <Printer className="h-4 w-4" />
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
                    Showing 1 to 5 of 532 quotations
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Previous</button>
                    <button className="px-3 py-1 bg-indigo-600 text-white rounded-md">1</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">2</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">3</button>
                    <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Next</button>
                </div>
            </div>
        </div>
    );
};

export default Quotations;