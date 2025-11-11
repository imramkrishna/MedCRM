import { Request, Response } from "express";
import prisma from "../../utils/prismaClient";
import { logActivity } from "../../utils/activityLogger";
import { StatusCode } from "../../types";

const updateOrderController = async (req: Request, res: Response): Promise<void | Response> => {
    const { id } = req.params;
    const updateData = req.body;
    
    try {
        // First, check if the order exists
        const existingOrder = await prisma.order.findUnique({
            where: { id: id }
        });

        if (!existingOrder) {
            return res.status(StatusCode.NOT_FOUND).json({
                error: "Order not found",
                message: `No order found with ID: ${id}`
            });
        }

        // Validate update data - only allow certain fields to be updated
        const allowedFields = [
            'status', 
            'notes', 
            'internalNotes', 
            'requestedDeliveryDate',
            'paymentStatus'
        ];

        const sanitizedUpdateData: any = {};
        
        for (const field of allowedFields) {
            if (updateData[field] !== undefined) {
                sanitizedUpdateData[field] = updateData[field];
            }
        }

        // Handle date conversion if needed
        if (sanitizedUpdateData.requestedDeliveryDate) {
            sanitizedUpdateData.requestedDeliveryDate = new Date(sanitizedUpdateData.requestedDeliveryDate).toISOString();
        }

        // Update the order
        const updatedOrder = await prisma.order.update({
            where: { id: id },
            data: sanitizedUpdateData,
            include: {
                orderItems: {
                    include: {
                        product: true
                    }
                },
                distributor: {
                    select: {
                        id: true,
                        companyName: true,
                        ownerName: true,
                        email: true
                    }
                }
            }
        });
        
        // Log the activity
        const logData = {
            action: "Order Updated",
            details: {
                orderId: id,
                orderNumber: updatedOrder.orderNumber,
                changes: sanitizedUpdateData,
                previousStatus: existingOrder.status,
                newStatus: updatedOrder.status
            },
            distributorId: updatedOrder.distributorId || undefined
        };
        
        await logActivity(logData);
        
        return res.status(StatusCode.SUCCESS).json({
            message: "Order updated successfully",
            order: updatedOrder
        });
        
    } catch (e: any) {
        console.error("Error updating order:", e);
        
        // Handle specific Prisma errors
        if (e.code === 'P2025') {
            return res.status(StatusCode.NOT_FOUND).json({
                error: "Order not found",
                message: `No order exists with ID: ${id}`
            });
        }
        
        if (e.code === 'P2002') {
            return res.status(StatusCode.BAD_REQUEST).json({
                error: "Duplicate value error",
                message: "A unique constraint would be violated"
            });
        }
        
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            error: "Error updating order",
            message: e.message || "An unexpected error occurred"
        });
    }
}

export default updateOrderController;