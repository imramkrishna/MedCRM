'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/slices/authSlice';
import { get, post } from "@/lib/api"
// Theme imports removed
import {
    LayoutDashboard,
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
    LogOut,
    Menu,
    X,
    ChevronDown,
    BarChart3,
    DollarSign,
    ShoppingBag,
    AlertTriangle,
    Check,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    UserPlus,
    UserCheck,
    RefreshCw,
    CheckCircle,
    FileBarChart
} from 'lucide-react';
import { DistributorApplication } from '@/types';
import { ActivityLogType } from '@/types';
import Customers from '@/components/admin/customers';
import Purchases from '@/components/admin/purchases';
import Orders from '@/components/admin/orders';
import ManualRequest from '@/components/admin/manual-request';
import VerifyDistributor from '@/components/admin/verifyDistributor';
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
    
    // Recent activity state - MUST be defined before early returns
    const [recentActivity, setRecentActivity] = useState<ActivityLogType[]>([]);



    // Distributor verification functions

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch data based on the active section and search queries
            //adding withCredentials true for cross origin request
            const response = await get('/admin/dashboard');
            // Handle the fetched data
        } catch (error) {
            console.error("Error fetching data:", error);
            router.push('/auth/admin-login');
        } finally {
            setLoading(false);
        }
    };
    const fetchActivityLog=async()=>{
        try{
            const response=await get('/admin/recent-activity',{});
            const recent=response.data.activityLog;
            setRecentActivity(recent);
        } catch (error) {
            console.error("Error fetching activity log:", error);
        }
    }

    useEffect(() => {
        // Only check authentication after auth state is initialized
        if (isInitialized && (!isAuthenticated || user?.role !== 'admin')) {
            router.push('/auth/admin-login');
            return;
        }

        // Only fetch data if authenticated as admin
        if (isAuthenticated && user?.role === 'admin') {
            fetchData();
            fetchActivityLog();
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
        {id:'purchases',label:'Purchases',icon:ShoppingBag},
        { id: 'verify-distributor', label: 'Verify Distributor', icon: UserCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
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

    const upcomingRestock = [
        { product: 'Waterproof Arctic Boots', days: '30 days', status: 'pending' },
        { product: 'Digital Learning Torch Ring', days: '40 days', status: 'pending' },
        { product: 'Nordic Running Sneakers', days: '60 days', status: 'pending' },
        { product: 'Luxury Watch Collection', days: '20 days', status: 'urgent' },
        { product: 'Nordic Leather Wallet', days: '60 days', status: 'pending' }
    ];

    const renderDashboard = () => (
        <div className="space-y-6 sm:space-y-8">
            {/* Enhanced search bar for dashboard */}
            <div className="relative">
                <div className="flex items-center">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5 pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Search products, orders, customers..."
                        value={searchQueries['dashboard'] || ''}
                        onChange={(e) => handleSearchChange('dashboard', e.target.value)}
                        className="pl-12 pr-4 py-3.5 bg-white border border-gray-200 w-full rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md placeholder-gray-400 text-gray-900"
                        aria-label="Search dashboard"
                    />
                </div>
            </div>

            {/* Enhanced Stats Grid with modern card design */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mx-5">
                {/* Total Products Card - Enhanced with better shadows and hover effects */}
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden group cursor-pointer transform hover:-translate-y-1">
                    {/* Animated gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Content */}
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <h3 className="text-4xl font-bold mb-2 tracking-tight">26K</h3>
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-red-200 text-sm font-semibold">-12.4%</span>
                                <ArrowDownRight className="h-3.5 w-3.5 text-red-200" />
                            </div>
                            <p className="text-indigo-100 font-medium text-sm">Total Products</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-300">
                            <Package className="h-7 w-7" />
                        </div>
                    </div>
                    
                    {/* Decorative chart at bottom */}
                    <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" className="text-white">
                            <path d="M0 50 C20 50, 20 30, 35 30 S50 20, 60 20 S70 30, 85 30 S100 20, 120 20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <circle cx="35" cy="30" r="3" fill="currentColor" />
                            <circle cx="60" cy="20" r="3" fill="currentColor" />
                            <circle cx="85" cy="30" r="3" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Available Stock Card */}
                <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden group cursor-pointer transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <h3 className="text-4xl font-bold mb-2 tracking-tight">$6,200</h3>
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-green-200 text-sm font-semibold">+40.9%</span>
                                <ArrowUpRight className="h-3.5 w-3.5 text-green-200" />
                            </div>
                            <p className="text-blue-100 font-medium text-sm">Available Stock</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-300">
                            <BarChart3 className="h-7 w-7" />
                        </div>
                    </div>
                    
                    <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" className="text-white">
                            <path d="M0 40 C15 40, 20 35, 30 30 S40 20, 50 25 S60 35, 75 30 S90 15, 120 20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <circle cx="30" cy="30" r="3" fill="currentColor" />
                            <circle cx="50" cy="25" r="3" fill="currentColor" />
                            <circle cx="75" cy="30" r="3" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Low Stock Card */}
                <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden group cursor-pointer transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <h3 className="text-4xl font-bold mb-2 tracking-tight">2.49%</h3>
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-green-200 text-sm font-semibold">+34.7%</span>
                                <ArrowUpRight className="h-3.5 w-3.5 text-green-200" />
                            </div>
                            <p className="text-amber-100 font-medium text-sm">Low Stock</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                    </div>
                    
                    <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" className="text-white">
                            <path d="M0 30 C15 30, 25 20, 35 25 S50 40, 60 45 S75 10, 90 25 S105 40, 120 30" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                            <circle cx="35" cy="25" r="3" fill="currentColor" />
                            <circle cx="60" cy="45" r="3" fill="currentColor" />
                            <circle cx="90" cy="25" r="3" fill="currentColor" />
                        </svg>
                    </div>
                </div>

                {/* Out of Stock Card */}
                <div className="bg-gradient-to-br from-rose-500 via-rose-600 to-rose-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 text-white relative overflow-hidden group cursor-pointer transform hover:-translate-y-1">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <h3 className="text-4xl font-bold mb-2 tracking-tight">44K</h3>
                            <div className="flex items-center gap-1.5 mb-2">
                                <span className="text-red-200 text-sm font-semibold">-23.6%</span>
                                <ArrowDownRight className="h-3.5 w-3.5 text-red-200" />
                            </div>
                            <p className="text-rose-100 font-medium text-sm">Out of Stock</p>
                        </div>
                        <div className="h-14 w-14 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg ring-1 ring-white/20 group-hover:scale-110 transition-transform duration-300">
                            <Package className="h-7 w-7" />
                        </div>
                    </div>
                    
                    <div className="absolute right-0 bottom-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
                        <svg width="120" height="70" viewBox="0 0 120 70" fill="none" className="text-white">
                            <rect x="10" y="25" width="8" height="35" rx="2" fill="currentColor" />
                            <rect x="25" y="30" width="8" height="30" rx="2" fill="currentColor" />
                            <rect x="40" y="20" width="8" height="40" rx="2" fill="currentColor" />
                            <rect x="55" y="35" width="8" height="25" rx="2" fill="currentColor" />
                            <rect x="70" y="25" width="8" height="35" rx="2" fill="currentColor" />
                            <rect x="85" y="15" width="8" height="45" rx="2" fill="currentColor" />
                            <rect x="100" y="20" width="8" height="40" rx="2" fill="currentColor" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Main Dashboard Content - Enhanced grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
                {/* Recent Activity - Modern card design with better visual hierarchy */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white shadow-md">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center text-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 px-4 py-2 rounded-xl shadow-sm hover:shadow active:scale-95">
                            <span>View All</span>
                            <ChevronDown className="h-4 w-4 ml-1.5" />
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {recentActivity.length > 0 ? (
                                recentActivity.slice(0, 5).map((activity, index) => {
                                    const iconMap: { [key: string]: any } = {
                                        'ORDER': ShoppingCart,
                                        'PAYMENT': DollarSign,
                                        'INVENTORY': Package,
                                        'DISTRIBUTOR': UserPlus,
                                        'QUOTATION': CheckCircle
                                    };
                                    const Icon = iconMap[activity.action] || Package;
                                    
                                    const colorMap: { [key: string]: string } = {
                                        'ORDER': 'from-blue-500 to-blue-600',
                                        'PAYMENT': 'from-green-500 to-emerald-600',
                                        'INVENTORY': 'from-purple-500 to-indigo-600',
                                        'DISTRIBUTOR': 'from-orange-500 to-amber-600',
                                        'QUOTATION': 'from-green-500 to-teal-600'
                                    };
                                    const bgColor = colorMap[activity.action] || 'from-gray-500 to-gray-600';
                                    
                                    return (
                                        <div key={activity.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 transition-all duration-200 border border-transparent hover:border-blue-100 hover:shadow-md cursor-pointer group">
                                            <div className="flex-shrink-0">
                                                <div className={`p-3 bg-gradient-to-br ${bgColor} rounded-xl shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-200`}>
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 mb-1">{activity.action}</h4>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {activity.details?.description || 'Activity performed'}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2 flex items-center">
                                                    <Clock className="h-3.5 w-3.5 mr-1.5" />
                                                    {new Date(activity.timestamp).toLocaleString()}
                                                    {activity.distributor && (
                                                        <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-gray-700 font-medium">
                                                            {activity.distributor.ownerName}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <History className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <p className="font-medium">No recent activity</p>
                                    <p className="text-sm text-gray-400 mt-1">Activity will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Order Summary - Enhanced card with modern styling */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-indigo-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white shadow-md">
                                <ShoppingCart className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Order Summary</h3>
                        </div>
                        <div className="text-xs font-semibold text-blue-700 bg-blue-100 px-3 py-1.5 rounded-full">
                            This Month
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="mb-8 text-center">
                            <div className="inline-flex flex-col items-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                                <h2 className="text-4xl font-bold text-gray-900 mb-3">$8,870</h2>
                                <div className="inline-flex items-center text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transition-shadow duration-200">
                                    <ArrowUpRight className="h-4 w-4 mr-2" />
                                    <span className="text-sm font-semibold">$2.6k vs last month</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-blue-100 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-md group-hover:scale-125 transition-transform duration-200"></div>
                                    <span className="text-gray-700 font-medium text-sm">Direct Sales</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-sm">27%</span>
                                    <div className="w-20 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-300" style={{ width: '27%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-green-100 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full shadow-md group-hover:scale-125 transition-transform duration-200"></div>
                                    <span className="text-gray-700 font-medium text-sm">Distributors</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-sm">53%</span>
                                    <div className="w-20 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-300" style={{ width: '53%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-amber-100 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-md group-hover:scale-125 transition-transform duration-200"></div>
                                    <span className="text-gray-700 font-medium text-sm">Online Orders</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-sm">18%</span>
                                    <div className="w-20 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full transition-all duration-300" style={{ width: '18%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50/50 rounded-xl transition-all duration-200 border border-transparent hover:border-purple-100 cursor-pointer group">
                                <div className="flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full shadow-md group-hover:scale-125 transition-transform duration-200"></div>
                                    <span className="text-gray-700 font-medium text-sm">International</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-gray-900 text-sm">10%</span>
                                    <div className="w-20 h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full transition-all duration-300" style={{ width: '10%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stock Level and Upcoming Restock - Enhanced grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                {/* Stock Level - Modern card design */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl text-white shadow-md">
                                <BarChart3 className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Stock Level</h3>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-xs font-semibold text-purple-700 bg-purple-100 px-3 py-1.5 rounded-full">
                                This Week
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="flex flex-col items-center mb-8">
                            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-blue-500 flex items-center justify-center mb-4 shadow-lg ring-4 ring-green-100">
                                <span className="text-2xl font-bold text-white">225</span>
                            </div>
                            <span className="inline-flex items-center bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl border border-green-200 shadow-sm">
                                <Check className="h-4 w-4 mr-2" />
                                In Stock
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-emerald-50/30 border border-green-100 hover:shadow-md transition-all duration-200">
                                <div className="flex justify-between mb-3">
                                    <span className="font-semibold text-gray-900 text-sm">Surgical Scalpel Set</span>
                                    <span className="text-xs text-green-700 font-bold bg-green-100 px-2 py-1 rounded-lg">52 of 100</span>
                                </div>
                                <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
                                        style={{ width: '52%' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/50 to-yellow-50/30 border border-amber-100 hover:shadow-md transition-all duration-200">
                                <div className="flex justify-between mb-3">
                                    <span className="font-semibold text-gray-900 text-sm">Digital Blood Pressure Monitor</span>
                                    <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2 py-1 rounded-lg">42 of 100</span>
                                </div>
                                <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full transition-all duration-500 shadow-sm"
                                        style={{ width: '42%' }}
                                    ></div>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-cyan-50/30 border border-blue-100 hover:shadow-md transition-all duration-200">
                                <div className="flex justify-between mb-3">
                                    <span className="font-semibold text-gray-900 text-sm">Disposable Syringes</span>
                                    <span className="text-xs text-blue-700 font-bold bg-blue-100 px-2 py-1 rounded-lg">65 of 100</span>
                                </div>
                                <div className="w-full h-3 bg-white rounded-full overflow-hidden shadow-inner">
                                    <div
                                        className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full transition-all duration-500 shadow-sm"
                                        style={{ width: '65%' }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Upcoming Restock - Modern card design */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-amber-50/50 to-orange-50/30">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl text-white shadow-md">
                                <Clock className="h-5 w-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">Upcoming Restock</h3>
                        </div>
                        <div className="flex gap-2">
                            <div className="text-xs font-semibold text-amber-700 bg-amber-100 px-3 py-1.5 rounded-full">
                                Next 60 Days
                            </div>
                        </div>
                    </div>
                    <div className="p-6">
                        <div className="space-y-3">
                            {upcomingRestock.map((item, index) => (
                                <div key={index} className={`flex items-center justify-between p-4 rounded-xl shadow-md border hover:shadow-lg transition-all duration-200 cursor-pointer group ${item.status === 'urgent'
                                    ? 'bg-gradient-to-r from-red-50 to-rose-50 border-red-100 hover:border-red-200'
                                    : 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-100 hover:border-amber-200'
                                    }`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-1.5 h-14 rounded-full shadow-md ${item.status === 'urgent'
                                            ? 'bg-gradient-to-b from-red-400 via-red-500 to-red-600'
                                            : 'bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600'
                                            }`}></div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1.5 group-hover:text-gray-700 transition-colors">{item.product}</h4>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                                                <span className="font-medium">Arriving in {item.days}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold shadow-sm ${item.status === 'urgent'
                                            ? 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border border-red-200'
                                            : 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200'
                                            }`}>
                                            {item.status === 'urgent' ? (
                                                <>
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    Urgent
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="h-4 w-4 mr-2" />
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

            {/* Recent Activity - Bottom Section with Grid Layout */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50/50 to-indigo-50/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl text-white shadow-md">
                            <History className="h-5 w-5" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-lg">Recent Activity</h3>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 hover:bg-blue-100 transition-all duration-200 px-4 py-2 rounded-xl shadow-sm hover:shadow active:scale-95">
                        View All
                    </button>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentActivity.length > 0 ? (
                            recentActivity.map((activity, index) => (
                                <div key={activity.id} className="flex flex-col p-5 rounded-xl border border-gray-100 bg-gradient-to-br from-white to-gray-50/50 hover:shadow-lg hover:border-gray-200 transition-all duration-300 cursor-pointer group">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold shadow-md group-hover:scale-110 transition-transform duration-200 ${
                                            index % 4 === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white' :
                                            index % 4 === 1 ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' :
                                            index % 4 === 2 ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white' :
                                            'bg-gradient-to-br from-orange-500 to-amber-600 text-white'
                                        }`}>
                                            {activity.distributor?.ownerName?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-gray-900 text-sm mb-1">
                                                <span className="font-bold">{activity.distributor?.ownerName || 'Admin'}</span>
                                            </p>
                                            <p className="text-xs text-gray-500 font-medium">{activity.action}</p>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-sm shadow-green-400/50"></div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                                        {activity.details?.description || 'Activity performed'}
                                    </p>
                                    <div className="flex items-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                                        <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                                        <span className="font-medium">{new Date(activity.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-12 text-gray-500">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                                    <History className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="font-semibold text-gray-700">No recent activity to display</p>
                                <p className="text-sm text-gray-400 mt-2">Activity will appear here once actions are performed</p>
                            </div>
                        )}
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
            // case 'quotation':
            //     return <Quotations />;
            // case 'transactions':
            //     return <Transactions />;
            // case 'payments':
            //     return <Payments />;
            // case 'reports':
            //     return <Reports />;
            case 'verify-distributor':
                return <VerifyDistributor />;
            default:
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100/50 p-8 sm:p-12 hover:shadow-xl transition-all duration-300">
                            <div className="text-center py-8">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-blue-100">
                                    <Package className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight">
                                    {menuItems.find(item => item.id === activeSection)?.label || 'Section'}
                                </h2>
                                <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                                    This section is under development. Professional UI components will be implemented here.
                                </p>
                                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95">
                                    Coming Soon
                                </button>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 flex">
            {/* Sidebar - Enhanced with better shadows and modern styling */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800/50 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out shadow-2xl backdrop-blur-xl`}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header - Logo with enhanced visual hierarchy */}
                    <div className="flex items-center h-20 px-5 border-b border-slate-800/80 bg-gradient-to-r from-slate-950 to-slate-900 relative overflow-hidden">
                        {/* Decorative gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
                        
                        <div className="flex items-center space-x-3 relative z-10">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-2 ring-blue-400/30 hover:ring-blue-400/50 transition-all duration-300">
                                <Package className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="font-bold text-base text-white tracking-tight">Med CRM</h1>
                                <p className="text-xs text-blue-300/80 font-medium">Admin Panel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="md:hidden p-2 ml-auto rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-200 relative z-10"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Nav Menu - Enhanced with better spacing and hover effects */}
                    <nav className="flex-1 py-5 px-3 space-y-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.id}>
                                    <button
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3.5 text-left rounded-xl transition-all duration-300 group relative overflow-hidden ${activeSection === item.id
                                            ? 'bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25'
                                            : 'text-slate-300 hover:bg-slate-800/60 hover:text-white hover:shadow-md'
                                            }`}
                                    >
                                        {/* Active indicator line */}
                                        {activeSection === item.id && (
                                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-lg"></div>
                                        )}
                                        
                                        <div className={`p-2 rounded-lg transition-all duration-300 ${activeSection === item.id ? 'bg-white/15 shadow-inner' : 'bg-slate-800/80 group-hover:bg-slate-700/80'}`}>
                                            <Icon className={`h-4 w-4 ${activeSection === item.id ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} transition-colors duration-300`} />
                                        </div>
                                        <span className={`text-sm font-medium flex-1 ${activeSection === item.id ? 'font-semibold' : ''}`}>{item.label}</span>
                                    </button>
                                </div>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer - Enhanced with modern card design */}
                    <div className="px-3 py-5 border-t border-slate-800/80 mt-auto bg-gradient-to-b from-slate-900 to-slate-950 relative">
                        {/* Decorative glow */}
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
                        
                        <div className="flex items-center space-x-3 mb-4 p-3.5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 shadow-xl hover:border-slate-600/50 transition-all duration-300 relative">
                            <div className="w-11 h-11 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/30">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                                <div className="flex items-center text-xs text-blue-300/90 mt-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                                    <span className="font-medium">Super Admin</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-semibold text-slate-300 hover:text-red-300 hover:bg-slate-800/80 rounded-xl transition-all duration-300 border border-slate-700/80 hover:border-red-400/50 shadow-lg hover:shadow-xl hover:shadow-red-500/10 group relative"
                        >
                            <LogOut className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content - Enhanced with better spacing */}
            <div className="flex-1 md:ml-64 w-full min-h-screen">
                {/* Header - Modern design with glassmorphism effect */}
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="md:hidden p-2.5 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 active:scale-95"
                                aria-label="Open menu"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div className="flex items-center">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full mr-3 hidden sm:block shadow-sm"></div>
                                <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate tracking-tight">
                                    {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
                                </h2>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Enhanced search bar with better focus states */}
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 pointer-events-none" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQueries['global'] || ''}
                                    onChange={(e) => handleSearchChange('global', e.target.value)}
                                    className="pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:bg-white text-sm w-56 xl:w-64 text-gray-900 placeholder-gray-400 transition-all duration-200 shadow-sm hover:border-gray-300"
                                    aria-label="Search"
                                />
                            </div>

                            {/* Notification bell with modern badge */}
                            <button 
                                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl relative transition-all duration-200 active:scale-95 group"
                                aria-label="Notifications"
                            >
                                <Search className="h-5 w-5 sm:hidden" />
                                <Bell className="h-5 w-5 hidden sm:block" />
                                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                                <span className="absolute top-0.5 right-0.5 h-3 w-3 bg-red-500/30 rounded-full animate-ping"></span>
                            </button>

                            {/* Enhanced user profile dropdown */}
                            <div className="flex items-center space-x-2 sm:space-x-2.5 border-l border-gray-200 pl-3 ml-1 sm:ml-2 group cursor-pointer">
                                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-md group-hover:shadow-lg transition-all duration-200 ring-2 ring-blue-100 group-hover:ring-blue-200">
                                    {user?.name?.charAt(0) || 'A'}
                                </div>
                                <span className="hidden sm:inline text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                                    {user?.name?.split(' ')[0] || 'Admin'}
                                </span>
                                <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-y-0.5" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content - Enhanced with better background and padding */}
                <main className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/20 min-h-[calc(100vh-4rem)]">
                    {loading ? (
                        <div className="flex items-center justify-center min-h-[60vh]">
                            <Loading />
                        </div>
                    ) : (
                        renderContent()
                    )}
                </main>
            </div>

            {/* Mobile Sidebar Overlay - Enhanced with smooth animation */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 md:hidden bg-gray-900/80 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
};

export default AdminDashboard;
