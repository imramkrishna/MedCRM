import { useState, useEffect } from "react";
import {
    Users,
    Search,
    Plus,
    Eye,
    Edit,
    UserPlus,
    UserCheck,
    MapPin,
    Phone,
    Mail,
    X,
    Building,
    User,
} from 'lucide-react';
import { get, post, put } from "@/lib/api";
import EditButton from "../ui/buttons/EditButton";
import ViewButton from "../ui/buttons/ViewButton";
import Loading from "../ui/buttons/Loading";

interface Distributor {
    id: number;
    ownerName: string;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    createdAt: string;
    updatedAt: string;
}

interface DistributorsResponse {
    distributors: Distributor[];
}

const Customers = () => {
    const [distributors, setDistributors] = useState<Distributor[]>([]);
    const [filteredDistributors, setFilteredDistributors] = useState<Distributor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal states
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedDistributor, setSelectedDistributor] = useState<Distributor | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        ownerName: '',
        email: '',
        phone: '',
        countryCode: '+1',
        companyName: '',
        password: '',
        address: '',
        message: ''
    });
    const [formLoading, setFormLoading] = useState(false);

    // Search states for different sections
    const [searchQueries, setSearchQueries] = useState({
        customers: '',
    });

    const handleSearchChange = (section: string, value: string) => {
        setSearchQueries(prev => ({
            ...prev,
            [section]: value
        }));
    };

    const fetchDistributors = async () => {
        try {
            setLoading(true);
            const response = await get('/admin/distributors', {
                withCredentials: true
            });

            if (response.data && response.data.distributors) {
                setDistributors(response.data.distributors);
                setFilteredDistributors(response.data.distributors);
            }
        } catch (err) {
            console.error('Error fetching distributors:', err);
            setError('Failed to fetch distributors');
        } finally {
            setLoading(false);
        }
    };

    // Filter distributors based on search query
    useEffect(() => {
        if (!searchQueries.customers) {
            setFilteredDistributors(distributors);
        } else {
            const filtered = distributors.filter(distributor =>
                distributor.companyName.toLowerCase().includes(searchQueries.customers.toLowerCase()) ||
                distributor.ownerName.toLowerCase().includes(searchQueries.customers.toLowerCase()) ||
                distributor.email.toLowerCase().includes(searchQueries.customers.toLowerCase())
            );
            setFilteredDistributors(filtered);
        }
    }, [searchQueries.customers, distributors]);

    useEffect(() => {
        fetchDistributors();
    }, []);

    // Calculate metrics
    const totalDistributors = distributors.length;
    const activeDistributors = distributors.length; // All fetched distributors are active
    const newThisMonth = distributors.filter(dist => {
        const createdDate = new Date(dist.createdAt);
        const currentDate = new Date();
        return createdDate.getMonth() === currentDate.getMonth() &&
            createdDate.getFullYear() === currentDate.getFullYear();
    }).length;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatAddress = (address: string) => {
        // Truncate long addresses
        return address.length > 50 ? address.substring(0, 50) + '...' : address;
    };

    // Modal handlers
    const handleViewDistributor = (distributor: Distributor) => {
        setSelectedDistributor(distributor);
        setShowViewModal(true);
    };

    const handleEditDistributor = (distributor: Distributor) => {
        setSelectedDistributor(distributor);
        setFormData({
            ownerName: distributor.ownerName,
            email: distributor.email,
            phone: distributor.phone,
            countryCode: '+1',
            companyName: distributor.companyName,
            password: '',
            address: distributor.address,
            message: ''
        });
        setShowEditModal(true);
    };

    const handleAddDistributor = () => {
        setFormData({
            ownerName: '',
            email: '',
            phone: '',
            countryCode: '+1',
            companyName: '',
            password: '',
            address: '',
            message: ''
        });
        setShowAddModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmitAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            const response = await post('/auth/register', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Refresh the distributors list
            await fetchDistributors();
            setShowAddModal(false);
            setFormData({
                ownerName: '',
                email: '',
                phone: '',
                countryCode: '+1',
                companyName: '',
                password: '',
                address: '',
                message: ''
            });
        } catch (err) {
            console.error('Error adding distributor:', err);
            setError('Failed to add distributor');
        } finally {
            setFormLoading(false);
        }
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDistributor) return;

        setFormLoading(true);
        try {
            const updateData = {
                id: selectedDistributor.id,
                ownerName: formData.ownerName,
                email: formData.email,
                phone: formData.phone,
                companyName: formData.companyName,
                address: formData.address,
                ...(formData.password && { password: formData.password })
            };

            const response = await put(`/admin/updatedistributor/${selectedDistributor.id}`, updateData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Refresh the distributors list
            await fetchDistributors();
            setShowEditModal(false);
            setSelectedDistributor(null);
        } catch (err) {
            console.error('Error updating distributor:', err);
            setError('Failed to update distributor');
        } finally {
            setFormLoading(false);
        }
    };

    const closeModals = () => {
        setShowViewModal(false);
        setShowEditModal(false);
        setShowAddModal(false);
        setSelectedDistributor(null);
        setFormData({
            ownerName: '',
            email: '',
            phone: '',
            countryCode: '+1',
            companyName: '',
            password: '',
            address: '',
            message: ''
        });
    };
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Customer List (Distributors)</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search distributors..."
                            value={searchQueries.customers}
                            onChange={(e) => handleSearchChange('customers', e.target.value)}
                            className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm w-full text-gray-900 placeholder-gray-500"
                        />
                    </div>
                    <button
                        onClick={handleAddDistributor}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        <span>Add Distributor</span>
                    </button>
                </div>
            </div>

            {/* Customer/Distributor Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 font-medium">Total Distributors</p>
                            <p className="text-2xl font-bold text-gray-900">{totalDistributors}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 font-medium">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{activeDistributors}</p>
                        </div>
                        <UserCheck className="h-8 w-8 text-green-500" />
                    </div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-600 font-medium">New This Month</p>
                            <p className="text-2xl font-bold text-gray-900">{newThisMonth}</p>
                        </div>
                        <UserPlus className="h-8 w-8 text-yellow-500" />
                    </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 font-medium">Search Results</p>
                            <p className="text-2xl font-bold text-gray-900">{filteredDistributors.length}</p>
                        </div>
                        <Search className="h-8 w-8 text-purple-500" />
                    </div>
                </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
                <Loading message="distributors"/>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                    <div className="text-red-800">{error}</div>
                </div>
            )}

            {/* Customer/Distributor List */}
            {!loading && !error && (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Company & Owner
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact Info
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Joined Date
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
                            {filteredDistributors.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        {searchQueries.customers ? 'No distributors found matching your search.' : 'No distributors found.'}
                                    </td>
                                </tr>
                            ) : (
                                filteredDistributors.map((distributor) => (
                                    <tr key={distributor.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-sm font-medium text-blue-600">
                                                            {distributor.companyName.substring(0, 2).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {distributor.companyName}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        Owner: {distributor.ownerName}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="flex items-center mb-1">
                                                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span className="truncate" style={{ maxWidth: '200px' }}>
                                                        {distributor.email}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                                    <span>{distributor.phone}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-start">
                                                <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                                                <div className="text-sm text-gray-500 break-words" style={{ maxWidth: '200px' }}>
                                                    {formatAddress(distributor.address)}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(distributor.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end space-x-2">
                                                <ViewButton
                                                    onClick={() => handleViewDistributor(distributor)}
                                                />
                                                <EditButton
                                                    onClick={() => handleEditDistributor(distributor)}
                                                />

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination */}
            {!loading && !error && filteredDistributors.length > 0 && (
                <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                        Showing {filteredDistributors.length} of {totalDistributors} distributors
                        {searchQueries.customers && (
                            <span className="text-blue-600 ml-1">
                                (filtered by "{searchQueries.customers}")
                            </span>
                        )}
                    </div>
                    <div className="flex space-x-2">
                        <button
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            disabled={true} // Implement pagination logic here
                        >
                            Previous
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded-md">
                            1
                        </button>
                        <button
                            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50"
                            disabled={true} // Implement pagination logic here
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* View Distributor Modal */}
            {showViewModal && selectedDistributor && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 drop-shadow-2xl pointer-events-auto">
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <Eye className="h-6 w-6 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Distributor Details</h3>
                            </div>
                            <button
                                onClick={closeModals}
                                className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Basic Information Card */}
                                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-blue-500 p-2 rounded-lg">
                                            <Building className="h-5 w-5 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-blue-900">Basic Information</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700 mb-1">Company Name</label>
                                            <p className="text-gray-900 font-medium">{selectedDistributor.companyName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700 mb-1">Owner Name</label>
                                            <p className="text-gray-900 font-medium">{selectedDistributor.ownerName}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-blue-700 mb-1">Email</label>
                                            <p className="text-gray-900 font-medium">{selectedDistributor.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Status Card */}
                                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="bg-green-500 p-2 rounded-lg">
                                            <Phone className="h-5 w-5 text-white" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-green-900">Contact & Status</h4>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-1">Phone</label>
                                            <p className="text-gray-900 font-medium">{selectedDistributor.phone}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-1">Created Date</label>
                                            <p className="text-gray-900 font-medium">{formatDate(selectedDistributor.createdAt)}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-green-700 mb-1">Last Updated</label>
                                            <p className="text-gray-900 font-medium">{formatDate(selectedDistributor.updatedAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Card - Full Width */}
                            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100 mt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="bg-purple-500 p-2 rounded-lg">
                                        <MapPin className="h-5 w-5 text-white" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-purple-900">Address</h4>
                                </div>
                                <p className="text-gray-900 font-medium">{selectedDistributor.address}</p>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-white border-t border-gray-200 rounded-b-2xl">
                            <div className="flex justify-end">
                                <button
                                    onClick={closeModals}
                                    className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Distributor Modal */}
            {showEditModal && selectedDistributor && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 drop-shadow-2xl pointer-events-auto">
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <Edit className="h-6 w-6 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Edit Distributor</h3>
                            </div>
                            <button
                                onClick={closeModals}
                                className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitEdit} className="p-6 bg-gray-50 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="edit-ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Owner Name *
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="edit-ownerName"
                                            name="ownerName"
                                            required
                                            value={formData.ownerName}
                                            onChange={handleFormChange}
                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Owner name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit-companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name *
                                    </label>
                                    <div className="relative">
                                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="text"
                                            id="edit-companyName"
                                            name="companyName"
                                            required
                                            value={formData.companyName}
                                            onChange={handleFormChange}
                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Company name"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            type="email"
                                            id="edit-email"
                                            name="email"
                                            required
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Email address"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="edit-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone *
                                    </label>
                                    <div className="flex">

                                        <div className="relative flex-1">
                                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                id="edit-phone"
                                                name="phone"
                                                required
                                                value={formData.phone}
                                                onChange={handleFormChange}
                                                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="edit-address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                                    <textarea
                                        id="edit-address"
                                        name="address"
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={handleFormChange}
                                        className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Full address"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                                >
                                    {formLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    {formLoading ? 'Updating...' : 'Update Distributor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Distributor Modal */}
            {showAddModal && (
                <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 drop-shadow-2xl pointer-events-auto">
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-purple-700 rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                                    <Plus className="h-6 w-6 text-purple-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-white">Add New Distributor</h3>
                            </div>
                            <button
                                onClick={closeModals}
                                className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white hover:bg-opacity-20"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitAdd} className="p-6 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="add-ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Owner Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="add-ownerName"
                                        name="ownerName"
                                        required
                                        value={formData.ownerName}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Owner name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="add-companyName" className="block text-sm font-medium text-gray-700 mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="add-companyName"
                                        name="companyName"
                                        required
                                        value={formData.companyName}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Company name"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="add-email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        id="add-email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleFormChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                        placeholder="Email address"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="add-phone" className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone *
                                    </label>
                                    <div className="flex">
                                        <select
                                            name="countryCode"
                                            value={formData.countryCode}
                                            onChange={handleFormChange}
                                            className="px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm"
                                        >
                                            <option value="+1">🇺🇸 +1</option>
                                            <option value="+91">🇮🇳 +91</option>
                                            <option value="+44">🇬🇧 +44</option>
                                            <option value="+86">🇨🇳 +86</option>
                                            <option value="+49">🇩🇪 +49</option>
                                            <option value="+33">🇫🇷 +33</option>
                                            <option value="+81">🇯🇵 +81</option>
                                            <option value="+82">🇰🇷 +82</option>
                                            <option value="+61">🇦🇺 +61</option>
                                            <option value="+7">🇷🇺 +7</option>
                                        </select>
                                        <input
                                            type="tel"
                                            id="add-phone"
                                            name="phone"
                                            required
                                            value={formData.phone}
                                            onChange={handleFormChange}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                            placeholder="Phone number"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="add-password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password *
                                </label>
                                <input
                                    type="password"
                                    id="add-password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Password"
                                />
                            </div>

                            <div>
                                <label htmlFor="add-address" className="block text-sm font-medium text-gray-700 mb-2">
                                    Address *
                                </label>
                                <textarea
                                    id="add-address"
                                    name="address"
                                    required
                                    rows={3}
                                    value={formData.address}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Full address"
                                />
                            </div>

                            <div>
                                <label htmlFor="add-message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Additional Information
                                </label>
                                <textarea
                                    id="add-message"
                                    name="message"
                                    rows={3}
                                    value={formData.message}
                                    onChange={handleFormChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                    placeholder="Additional information or notes..."
                                />
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={closeModals}
                                    className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium"
                                >
                                    {formLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                                    {formLoading ? 'Adding...' : 'Add Distributor'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customers;