'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/slices/authSlice';
import { get, post } from "@/lib/api"
// Theme imports removed
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    FileText,
    Package,
    ShoppingCart,
    Receipt,
    RotateCcw,
    History,
    CreditCard,
    Search,
    Bell,
    Settings,
    Moon,
    Sun,
    LogOut,
    Menu,
    X,
    ChevronDown,
    BarChart3,
    DollarSign,
    ShoppingBag,
    AlertTriangle,
    Plus,
    Filter,
    Download,
    Eye,
    Edit,
    Trash2,
    Check,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    UserPlus,
    UserCheck,
    UserX,
    Calendar,
    Star,
    Building,
    Phone,
    Mail,
    MapPin,
    Truck,
    RefreshCw,
    XCircle,
    Printer,
    CheckCircle,
    FileBarChart
} from 'lucide-react';
import { DistributorApplication } from '@/types';
import SellDetails from '@/components/admin/sellDetails';
import Customers from '@/components/admin/customers';
import Orders from '@/components/admin/orders';
import ManualRequest from '@/components/admin/manual-request';
import Purchases from '@/components/admin/purchases';
import Transactions from '@/components/admin/transacions';
import Reports from '@/components/admin/reports';
import VerifyDistributor from '@/components/admin/verifyDistributor';
import Payments from '@/components/admin/payments';
import Quotations from '@/components/admin/quotations';
import Inventory from '@/components/admin/inventory';
import Loading from '@/components/ui/buttons/Loading';
// Make sure Customers is a valid React component that returns JSX

const AdminDashboard = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);
    // Theme-related code removed
    const [activeSection, setActiveSection] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const [searchQueries, setSearchQueries] = useState({
        global: '',
        dashboard: '',
        customers: '',
        orders: '',
        inventory: '',
        purchases: '',
        quotation: '',
        transactions: '',
        payments: '',
        verifyDistributor: '',
        reports: '',
        manualRequest: ''
    });
    const handleSearchChange = (section: string, value: string) => {
        setSearchQueries(prev => ({
            ...prev,
            [section]: value
        }));
    };
    // Distributor verification state
    const [distributors, setDistributors] = useState<DistributorApplication[]>([]);
    const [selectedDistributor, setSelectedDistributor] = useState<DistributorApplication | null>(null);
    const [isDistributorLoading, setIsDistributorLoading] = useState(false);



    // Distributor verification functions

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch data based on the active section and search queries
            //adding withCredentials true for cross origin request
            const response = await get('/admin/dashboard');
            console.log(response.data);
            // Handle the fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
            router.push('/auth/admin-login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Only check authentication after auth state is initialized
        if (isInitialized && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/auth/admin-login');
            return;
        }

        // Only fetch data if authenticated as admin
        if (isAuthenticated && user?.role === 'admin') {
            fetchData();
        }
    }, [isAuthenticated, isInitialized, user, router]);

    // Fetch distributors when verify-distributor section is active


    const handleLogout = () => {
        dispatch(logout());
        router.push('/');
    };

    // Loading state 
    // Theme mounting check removed

    // Show loading until auth is initialized
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'customers', label: 'Customer List (Distributors)', icon: Users },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'manual-request', label: 'Manual Request', icon: FileText },
        { id: 'inventory', label: 'Inventory', icon: Package },
        { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
        { id: 'quotation', label: 'Quotation', icon: Receipt },
        {
            id: 'returns',
            label: 'Returns',
            icon: RotateCcw,
            submenu: [
                { id: 'stock-return', label: 'Stock Return' },
                { id: 'supplier-return', label: 'Supplier Return' },
                { id: 'wastage-return', label: 'Wastage Return' }
            ]
        },
        { id: 'transactions', label: 'Transaction History', icon: RefreshCw },
        { id: 'payments', label: 'Payment Management', icon: CreditCard },
        { id: 'verify-distributor', label: 'Verify Distributor', icon: UserCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'reports', label: 'Reports', icon: FileBarChart }
    ];

    const stats = [
        {
            title: 'Total Products',
            value: '4,892',
            change: '+12%',
            trend: 'up',
            icon: Package,
            color: 'blue',
            bgGradient: 'bg-gradient-to-r from-blue-600 to-indigo-700',
            iconColor: 'text-white',
            chartColor: 'text-blue-200'
        },
        {
            title: 'Available Stock',
            value: '2,137',
            change: '+8%',
            trend: 'up',
            icon: BarChart3,
            color: 'green',
            bgGradient: 'bg-gradient-to-r from-emerald-500 to-green-600',
            iconColor: 'text-white',
            chartColor: 'text-emerald-200'
        },
        {
            title: 'Low Stock',
            value: '1,952',
            change: '-15%',
            trend: 'down',
            icon: AlertTriangle,
            color: 'yellow',
            bgGradient: 'bg-gradient-to-r from-amber-500 to-yellow-500',
            iconColor: 'text-white',
            chartColor: 'text-amber-200'
        },
        {
            title: 'Out of Stock',
            value: '803',
            change: '-5%',
            trend: 'down',
            icon: Package,
            color: 'red',
            bgGradient: 'bg-gradient-to-r from-rose-500 to-red-600',
            iconColor: 'text-white',
            chartColor: 'text-rose-200'
        }
    ];

    const recentActivity = [
        {
            user: 'Abram Workman',
            action: 'completed admin task 1 of 5',
            time: '2h ago',
            avatar: 'AW'
        },
        {
            user: 'David Alan Martin',
            action: 'updated Low Stock item',
            time: '4h ago',
            avatar: 'DM'
        },
        {
            user: 'Ann Grubner',
            action: 'added New Product Business',
            time: '6h ago',
            avatar: 'AG'
        }
    ];

    const upcomingRestock = [
        { product: 'Waterproof Arctic Boots', days: '30 days', status: 'pending' },
        { product: 'Digital Learning Torch Ring', days: '40 days', status: 'pending' },
        { product: 'Nordic Running Sneakers', days: '60 days', status: 'pending' },
        { product: 'Luxury Watch Collection', days: '20 days', status: 'urgent' },
        { product: 'Nordic Leather Wallet', days: '60 days', status: 'pending' }
    ];

    const renderDashboard = () => (
        <div className="space-y-6 bg-gray-50/50 p-5 rounded-2xl">
            {/* Search */}
            <div className="relative mb-6">
                <div className="flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                        type="text"
                        placeholder="Search in dashboard..."
                        value={searchQueries['dashboard'] || ''}
                        onChange={(e) => handleSearchChange('dashboard', e.target.value)}
                        className="pl-10 pr-4 py-3 bg-white border border-gray-200 w-full rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl p-5 shadow-md hover:shadow-lg transition-all text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-1">26K</h3>
                            <div className="flex items-center gap-1 opacity-80 text-sm">
                                <span className="text-red-300">(-12.4%</span>
                                <ArrowDownRight className="h-3 w-3" />
                                <span>)</span>
                            </div>
                            <p className="text-white/80 mt-1">Total Products</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-indigo-500/30 flex items-center justify-center">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="absolute right-1 bottom-0 opacity-70">
                        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" className="text-white/20">
                            <path d="M0 50 C20 50, 20 30, 30 30 S40 20, 50 20 S60 30, 70 30 S80 20, 90 20 L90 50 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="30" cy="30" r="2" fill="currentColor" />
                            <circle cx="50" cy="20" r="2" fill="currentColor" />
                            <circle cx="70" cy="30" r="2" fill="currentColor" />
                            <circle cx="90" cy="20" r="2" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-1">$6,200</h3>
                            <div className="flex items-center gap-1 opacity-80 text-sm">
                                <span className="text-green-200">(+40.9%</span>
                                <ArrowUpRight className="h-3 w-3" />
                                <span>)</span>
                            </div>
                            <p className="text-white/80 mt-1">Available Stock</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-blue-500/30 flex items-center justify-center">
                            <BarChart3 className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="absolute right-1 bottom-0 opacity-70">
                        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" className="text-white/20">
                            <path d="M0 40 C10 40, 15 35, 20 30 S30 20, 40 25 S50 35, 60 30 S70 15, 80 15 S90 20, 100 25" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="20" cy="30" r="2" fill="currentColor" />
                            <circle cx="40" cy="25" r="2" fill="currentColor" />
                            <circle cx="60" cy="30" r="2" fill="currentColor" />
                            <circle cx="80" cy="15" r="2" fill="currentColor" />
                            <circle cx="100" cy="25" r="2" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-1">2.49%</h3>
                            <div className="flex items-center gap-1 opacity-80 text-sm">
                                <span className="text-green-200">(+34.7%</span>
                                <ArrowUpRight className="h-3 w-3" />
                                <span>)</span>
                            </div>
                            <p className="text-white/80 mt-1">Low Stock</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-amber-500/30 flex items-center justify-center">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="absolute right-1 bottom-0 opacity-70">
                        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" className="text-white/20">
                            <path d="M0 30 C10 30, 20 20, 30 25 S40 40, 50 45 S60 10, 70 25 S80 40, 90 30 S100 25, 100 25" stroke="currentColor" strokeWidth="2" fill="none" />
                            <circle cx="30" cy="25" r="2" fill="currentColor" />
                            <circle cx="50" cy="45" r="2" fill="currentColor" />
                            <circle cx="70" cy="25" r="2" fill="currentColor" />
                            <circle cx="90" cy="30" r="2" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-rose-500 to-rose-700 rounded-xl p-5 shadow-md hover:shadow-lg transition-all text-white relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-3xl font-bold mb-1">44K</h3>
                            <div className="flex items-center gap-1 opacity-80 text-sm">
                                <span className="text-red-300">(-23.6%</span>
                                <ArrowDownRight className="h-3 w-3" />
                                <span>)</span>
                            </div>
                            <p className="text-white/80 mt-1">Out of Stock</p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-rose-500/30 flex items-center justify-center">
                            <Package className="h-6 w-6" />
                        </div>
                    </div>
                    <div className="absolute right-1 bottom-0 opacity-70">
                        <svg width="100" height="60" viewBox="0 0 100 60" fill="none" className="text-white/20">
                            <rect x="10" y="20" width="5" height="30" rx="1" fill="currentColor" />
                            <rect x="20" y="25" width="5" height="25" rx="1" fill="currentColor" />
                            <rect x="30" y="15" width="5" height="35" rx="1" fill="currentColor" />
                            <rect x="40" y="30" width="5" height="20" rx="1" fill="currentColor" />
                            <rect x="50" y="20" width="5" height="30" rx="1" fill="currentColor" />
                            <rect x="60" y="25" width="5" height="25" rx="1" fill="currentColor" />
                            <rect x="70" y="10" width="5" height="40" rx="1" fill="currentColor" />
                            <rect x="80" y="20" width="5" height="30" rx="1" fill="currentColor" />
                            <rect x="90" y="15" width="5" height="35" rx="1" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md text-white shadow-sm">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center text-sm bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-md">
                            <span>View All</span>
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-5">
                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-blue-50/40 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-sm">
                                        <ShoppingCart className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">New order received</h4>
                                    <p className="text-gray-600">Order #35782 from Memorial Hospital</p>
                                    <p className="text-sm text-gray-500 mt-1">10 minutes ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-green-50/40 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-sm">
                                        <DollarSign className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Payment received</h4>
                                    <p className="text-gray-600">Payment of $12,580 received from City Medical</p>
                                    <p className="text-sm text-gray-500 mt-1">45 minutes ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-purple-50/40 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-sm">
                                        <Package className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Inventory updated</h4>
                                    <p className="text-gray-600">15 items added to Surgical Instruments</p>
                                    <p className="text-sm text-gray-500 mt-1">2 hours ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-orange-50/40 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl shadow-sm">
                                        <UserPlus className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">New distributor application</h4>
                                    <p className="text-gray-600">MediEquip Inc. submitted an application</p>
                                    <p className="text-sm text-gray-500 mt-1">4 hours ago</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-xl hover:bg-green-50/40 transition-colors">
                                <div className="flex-shrink-0">
                                    <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-sm">
                                        <CheckCircle className="h-5 w-5 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-medium text-gray-900">Quotation approved</h4>
                                    <p className="text-gray-600">Quotation #QT-234 was approved</p>
                                    <p className="text-sm text-gray-500 mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-md text-white shadow-sm">
                                <ShoppingCart className="h-4 w-4" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Order Summary</h3>
                        </div>
                        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            This Month
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-8">
                            <div className="flex flex-col items-center">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">$8,870</h2>
                                <div className="inline-flex items-center text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full px-3 py-1.5 shadow-sm">
                                    <ArrowUpRight className="h-4 w-4 mr-1" />
                                    <span className="text-sm font-medium">$2.6k vs last month</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 mt-2">
                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                                    <span className="text-gray-600">Direct Sales</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">27%</span>
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" style={{ width: '27%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                                    <span className="text-gray-600">Distributors</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">53%</span>
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full" style={{ width: '53%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-sm"></div>
                                    <span className="text-gray-600">Online Orders</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">18%</span>
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full" style={{ width: '18%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"></div>
                                    <span className="text-gray-600">International</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-gray-900">10%</span>
                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Level and Upcoming Restock */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Stock Level */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-md text-white shadow-sm">
                                <BarChart3 className="h-4 w-4" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Stock Level</h3>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                This Week
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="h-16 w-16 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center mb-3">
                                <span className="text-xl font-bold text-white">225</span>
                            </div>
                            <span className="inline-flex items-center bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                                <Check className="h-4 w-4 mr-1" />
                                In Stock
                            </span>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-900">Surgical Scalpel Set</span>
                                    <span className="text-sm text-blue-600 font-medium">52 of 100 remaining</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                                        style={{ width: '52%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-900">Digital Blood Pressure Monitor</span>
                                    <span className="text-sm text-yellow-600 font-medium">42 of 100 remaining</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                                        style={{ width: '42%' }}
                                    ></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="font-medium text-gray-900">Disposable Syringes</span>
                                    <span className="text-sm text-green-600 font-medium">65 of 100 remaining</span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upcoming Restock */}
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-md text-white shadow-sm">
                                <Clock className="h-4 w-4" />
                            </div>
                            <h3 className="font-semibold text-gray-900">Upcoming Restock</h3>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                                Next 60 Days
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {upcomingRestock.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-xl shadow-sm border border-gray-100 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-12 rounded-full ${item.status === 'urgent'
                                            ? 'bg-gradient-to-b from-red-400 to-red-600'
                                            : 'bg-gradient-to-b from-yellow-400 to-yellow-600'
                                            }`}></div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">{item.product}</h4>
                                            <div className="flex items-center mt-1 text-sm text-gray-600">
                                                <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                Arriving in {item.days}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${item.status === 'urgent'
                                            ? 'bg-red-50 text-red-700'
                                            : 'bg-yellow-50 text-yellow-700'
                                            }`}>
                                            {item.status === 'urgent' ? (
                                                <>
                                                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                                                    Urgent
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-4 w-4 mr-1.5" />
                                                    Pending
                                                </>
                                            )}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-purple-600" />
                        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">
                        View All
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-all">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium shadow-sm ${index % 4 === 0 ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white' :
                                    index % 4 === 1 ? 'bg-gradient-to-br from-green-400 to-teal-600 text-white' :
                                        index % 4 === 2 ? 'bg-gradient-to-br from-purple-400 to-pink-600 text-white' :
                                            'bg-gradient-to-br from-orange-400 to-amber-600 text-white'
                                    }`}>
                                    {activity.avatar}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900">
                                        <span className="font-bold">{activity.user}</span> {activity.action}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1.5 flex items-center">
                                        <Clock className="h-3.5 w-3.5 mr-1.5" />
                                        {activity.time}
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return renderDashboard();
            // case 'sell-details':
            //     return <SellDetails />;
            case 'customers':
                return <Customers />;
            case 'orders':
                return <Orders />;
            case 'manual-request':
                return <ManualRequest />;
            case 'inventory':
                return <Inventory />;
            case 'purchases':
                return <Purchases />;
            case 'quotation':
                return <Quotations />;
            case 'transactions':
                return <Transactions />;
            case 'payments':
                return <Payments />;
            case 'reports':
                return <Reports />;
            case 'verify-distributor':
                return <VerifyDistributor />;
            default:
                return (
                    <div className="space-y-5">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="h-8 w-8 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 mb-2">
                                    {menuItems.find(item => item.id === activeSection)?.label || 'Section'}
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    This section is under development. Professional UI components will be implemented here.
                                </p>
                                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-56 bg-gradient-to-b from-slate-900 to-slate-950 border-r border-slate-800 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-xl`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header - Logo */}
                    <div className="flex items-center h-20 px-4 border-b border-slate-800 bg-gradient-to-r from-slate-950 to-slate-900">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-md flex items-center justify-center text-white shadow-lg border border-blue-400/20">
                                <Package className="h-5 w-5" />
                            </div>
                            <div>
                                <h1 className="font-bold text-base text-white">Med CRM</h1>
                                <p className="text-xs text-blue-300">Admin Dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-2 ml-auto rounded-md text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Nav Menu */}
                    <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-3 text-left rounded-lg transition-all duration-200 group ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md'
                                            : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                                            }`}
                                    >
                                        <div className={`p-1.5 rounded-md ${activeSection === item.id ? 'bg-white/20' : 'bg-slate-800'}`}>
                                            <Icon className={`h-4 w-4 ${activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                                        </div>
                                        <span className="text-sm font-medium">{item.label}</span>
                                        {item.submenu && <ChevronDown className={`h-4 w-4 ml-auto ${activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />}
                                        {activeSection === item.id && !item.submenu && (
                                            <div className="ml-auto w-1.5 h-6 bg-blue-400 rounded-sm"></div>
                                        )}
                                    </button>
                                    {item.submenu && activeSection === item.id && (
                                        <div className="ml-9 mt-2 space-y-1 py-1 border-l-2 border-slate-700 pl-2">
                                            {item.submenu.map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    className="w-full text-left px-3 py-2.5 text-xs text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-md transition-all flex items-center space-x-2 group"
                                                >
                                                    <div className="w-1 h-1 bg-slate-600 rounded-full group-hover:bg-blue-400"></div>
                                                    <span>{subItem.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="px-3 py-4 border-t border-slate-800 mt-auto bg-gradient-to-b from-slate-900 to-slate-950">
                        <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 shadow-lg">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-full flex items-center justify-center text-sm font-medium shadow-md ring-2 ring-blue-500/20">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{user?.name || 'Admin'}</p>
                                <div className="flex items-center text-xs text-blue-300 mt-0.5">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                                    Super Admin
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 text-sm font-medium text-slate-200 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-all duration-200 border border-slate-700 hover:border-red-400/50 shadow-sm hover:shadow"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-56 w-full min-h-screen">
                {/* Header */}
                <header className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center justify-between h-16 px-4">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate flex items-center">
                                <span className="w-1.5 h-5 bg-blue-600 rounded-sm mr-2 hidden sm:block"></span>
                                {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search across all sections..."
                                    value={searchQueries['global'] || ''}
                                    onChange={(e) => handleSearchChange('global', e.target.value)}
                                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-64 text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative transition-colors">
                                <Search className="h-5 w-5 sm:hidden" />
                                <Bell className="h-5 w-5 hidden sm:block" />
                                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                            </button>

                            <div className="flex items-center space-x-2 border-l pl-3 ml-1">
                                <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                                    {user?.name?.split(' ')[0] || 'Admin'}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Header Spacer - Ensures content doesn't overlap */}
                <div className="h-6"></div> {/* Increased spacer height */}

                {/* Page Content */}
                <main className="p-5 bg-gray-50 min-h-[calc(100vh-5.5rem)]">
                    {loading ? (
                        <Loading />
                    ) : (
                        renderContent()
                    )}
                </main>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden bg-gray-600 bg-opacity-75"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
