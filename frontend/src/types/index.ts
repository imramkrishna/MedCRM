export interface Product {
    id: number;
    sku: string;
    barcode: string;
    name: string;
    description: string;
    category: string;
    brand: string;
    color: string;
    listPrice: string;
    costPrice?: number;
    stockQuantity: number;
    reservedQuantity: number;
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

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'distributor' | 'user';
    phone?: string;
    address?: string;
    companyName?: string;
}

export interface DistributorApplication {
    id: string;
    ownerName: string;
    email: string;
    phone: string;
    companyName: string;
    address: string;
    message: string;
    password: string;
    status?: 'pending' | 'approved' | 'rejected';
    createdAt?: string;
    updatedAt?: string;
}
export interface ActivityLogType {
    id: number;
    distributorId?: number;
    action: string;
    timestamp: string;
    details?: any;
    distributor?: {
        id: number;
        ownerName: string;
        companyName: string;
        email: string;
    };
} 