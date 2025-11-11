import {
    TrendingUp,
    Users,
    ShoppingCart,
    DollarSign,
    Filter,
    Download,
    ArrowUpRight,
    Calendar,
    FileBarChart
} from 'lucide-react';
import { useState } from 'react';
const Reports = () => {
    const [searchQueries, setSearchQueries] = useState({
        reports: ''
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
                    <FileBarChart className="h-8 w-8 text-emerald-600" />
                    <h2 className="text-2xl font-bold text-gray-900">Analytics & Reports</h2>
                </div>
                <div className="flex flex-wrap gap-3">
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
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>Export Reports</span>
                    </button>
                </div>
            </div>

            {/* Report Navigation Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <div className="flex space-x-6">
                    <button className="px-2 py-3 border-b-2 border-emerald-600 font-medium text-emerald-600">
                        Sales Report
                    </button>
                    <button className="px-2 py-3 text-gray-600 hover:text-gray-900">
                        Inventory Report
                    </button>
                    <button className="px-2 py-3 text-gray-600 hover:text-gray-900">
                        Financial Report
                    </button>
                    <button className="px-2 py-3 text-gray-600 hover:text-gray-900">
                        Customer Insights
                    </button>
                </div>
            </div>

            {/* Report Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-emerald-600 font-medium">Total Sales</p>
                            <p className="text-2xl font-bold text-gray-900">$1.24M</p>
                        </div>
                        <div className="p-2 bg-emerald-100 rounded-lg">
                            <TrendingUp className="h-6 w-6 text-emerald-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <ArrowUpRight className="h-3 w-3 text-emerald-600 mr-1" />
                        <span className="text-emerald-600 font-medium">12.5%</span>
                        <span className="text-gray-600 ml-1">vs last month</span>
                    </div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Orders</p>
                            <p className="text-2xl font-bold text-gray-900">846</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <ArrowUpRight className="h-3 w-3 text-blue-600 mr-1" />
                        <span className="text-blue-600 font-medium">8.2%</span>
                        <span className="text-gray-600 ml-1">vs last month</span>
                    </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Avg. Order Value</p>
                            <p className="text-2xl font-bold text-gray-900">$1,465</p>
                        </div>
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <DollarSign className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <ArrowUpRight className="h-3 w-3 text-purple-600 mr-1" />
                        <span className="text-purple-600 font-medium">4.3%</span>
                        <span className="text-gray-600 ml-1">vs last month</span>
                    </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-600 font-medium">Active Customers</p>
                            <p className="text-2xl font-bold text-gray-900">194</p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Users className="h-6 w-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm">
                        <ArrowUpRight className="h-3 w-3 text-orange-600 mr-1" />
                        <span className="text-orange-600 font-medium">6.8%</span>
                        <span className="text-gray-600 ml-1">vs last month</span>
                    </div>
                </div>
            </div>

            {/* Sales Graph */}
            <div className="mb-6 bg-gray-50 rounded-lg p-6 border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-gray-900">Monthly Sales Trend</h3>
                    <div className="flex space-x-2">
                        <button className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded-full">2025</button>
                        <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">2024</button>
                    </div>
                </div>
                <div className="h-80 flex items-end space-x-4 mt-4 pt-10 border-t border-l border-gray-200 relative">
                    {/* Y-Axis Labels */}
                    <div className="absolute left-0 top-0 h-full flex flex-col justify-between py-2 text-xs text-gray-600">
                        <span>$200K</span>
                        <span>$150K</span>
                        <span>$100K</span>
                        <span>$50K</span>
                        <span>$0</span>
                    </div>

                    {/* X-Axis with Bars */}
                    <div className="flex-1 flex items-end justify-around pl-10">
                        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-12 bg-gradient-to-t from-emerald-500 to-emerald-300 rounded-t-sm"
                                    style={{
                                        height: `${[60, 85, 70, 95, 110, 130, 125, 140][index]}%`,
                                        maxHeight: "90%"
                                    }}>
                                </div>
                                <span className="mt-2 text-xs font-medium text-gray-600">{month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Performance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg border border-gray-100 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Top Selling Products</h3>
                        <button className="text-sm text-emerald-600">View All</button>
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: "Surgical Instruments Kit A", sales: 185, growth: "+12%", amount: "$56,200" },
                            { name: "Advanced Monitoring System", sales: 120, growth: "+8%", amount: "$43,800" },
                            { name: "Diagnostic Equipment Set", sales: 95, growth: "+15%", amount: "$38,450" },
                            { name: "Orthopedic Implants", sales: 78, growth: "+5%", amount: "$32,760" },
                            { name: "Sterilization Equipment", sales: 64, growth: "+10%", amount: "$28,350" }
                        ].map((product, index) => (
                            <div key={index} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900">{product.name}</p>
                                    <div className="flex items-center mt-1">
                                        <span className="text-xs text-gray-600">{product.sales} units</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-xs text-emerald-600">{product.growth}</span>
                                    </div>
                                </div>
                                <span className="font-semibold text-gray-900">{product.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-100 p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-900">Sales by Region</h3>
                        <button className="text-sm text-emerald-600">View All</button>
                    </div>
                    <div className="h-64 flex items-center justify-center">
                        {/* Simple donut chart */}
                        <div className="relative w-48 h-48">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#d1fae5" strokeWidth="3"></circle>
                                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="40 100" strokeDashoffset="25"></circle>
                                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#3b82f6" strokeWidth="3" strokeDasharray="25 100" strokeDashoffset="85"></circle>
                                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="15 100" strokeDashoffset="60"></circle>
                                <circle cx="18" cy="18" r="15.91549430918954" fill="transparent" stroke="#f59e0b" strokeWidth="3" strokeDasharray="10 100" strokeDashoffset="45"></circle>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-900">$1.24M</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">North (40%)</p>
                                <p className="text-xs text-gray-600">$496K</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">East (25%)</p>
                                <p className="text-xs text-gray-600">$310K</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">South (15%)</p>
                                <p className="text-xs text-gray-600">$186K</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                            <div>
                                <p className="text-xs font-medium text-gray-900">West (10%)</p>
                                <p className="text-xs text-gray-600">$124K</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Sales Table */}
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-900">Recent Sales</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Product
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {[
                                { id: "ORD-7865", customer: "Memorial Hospital", product: "Surgical Kits", date: "Aug 08, 2025", amount: "$12,580", status: "Completed" },
                                { id: "ORD-7864", customer: "City Medical Center", product: "Monitoring Systems", date: "Aug 07, 2025", amount: "$8,790", status: "Completed" },
                                { id: "ORD-7863", customer: "Regional Healthcare", product: "Diagnostic Equipment", date: "Aug 07, 2025", amount: "$15,450", status: "Processing" },
                                { id: "ORD-7862", customer: "University Hospital", product: "Sterilization Units", date: "Aug 06, 2025", amount: "$23,100", status: "Completed" },
                                { id: "ORD-7861", customer: "Private Clinic Group", product: "Surgical Instruments", date: "Aug 05, 2025", amount: "$6,720", status: "Processing" }
                            ].map((order, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-blue-600">{order.id}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{order.customer}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{order.product}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-700">{order.date}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">{order.amount}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 border-t border-gray-100 flex justify-center">
                    <button className="text-sm text-emerald-600 font-medium hover:text-emerald-700">
                        View All Sales Reports
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Reports;
