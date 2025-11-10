import { Request, Response } from "express";
import prisma from "../../utils/prismaClient";
import { StatusCode } from "../../types";
import { logActivity } from "../../utils/activityLogger";

const placeOrderController = async (req: Request, res: Response): Promise<Response | void> => {
    try {
        const {
            distributorId,
            items,
            notes,
            PaymentMode,
            TxnId,
            ConfirmationSlip,
            requestedDeliveryDate
        } = req.body;

        if (!distributorId || !items || items.length === 0) {
            return res.status(StatusCode.BAD_REQUEST).json({ error: "Invalid order" });
        }

        // Validate that all required item fields are present
        for (const item of items) {
            if (!item.productId || !item.quantity || item.unitPrice === undefined || item.lineTotal === undefined) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    error: "Each item must have productId, quantity, unitPrice, and lineTotal"
                });
            }
        }

        // Calculate financial totals
        const subTotal = items.reduce((sum: number, item: any) => sum + parseFloat(item.lineTotal.toString()), 0);
        const totalDiscountAmount = items.reduce((sum: number, item: any) => sum + (parseFloat(item.discountAmount?.toString() || '0')), 0);

        // You might want to calculate tax based on your business logic
        const taxAmount = 0; // Implement tax calculation if needed
        const totalAmount = subTotal - totalDiscountAmount + taxAmount;

        // Fetch product details for snapshot
        const productIds = items.map((item: any) => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        // Create product lookup map
        const productMap = new Map(products.map(p => [p.id, p]));

        // Validate all products exist
        for (const item of items) {
            if (!productMap.has(item.productId)) {
                return res.status(StatusCode.BAD_REQUEST).json({
                    error: `Product with ID ${item.productId} not found`
                });
            }
        }

        // Create the order with all required fields
        const order = await prisma.order.create({
            data: {
                distributorId: parseInt(distributorId.toString()),
                subTotal,
                taxAmount,
                discountAmount: totalDiscountAmount,
                totalAmount,
                notes,
                paymentMode: PaymentMode,
                transactionId: TxnId,
                confirmationSlip: ConfirmationSlip,
                requestedDeliveryDate: requestedDeliveryDate ? new Date(requestedDeliveryDate) : null,
                orderItems: {
                    create: items.map((item: any) => {
                        const product = productMap.get(item.productId);
                        return {
                            productId: item.productId,
                            quantity: parseInt(item.quantity.toString()),
                            unitPrice: parseFloat(item.unitPrice.toString()),
                            listPrice: item.listPrice ? parseFloat(item.listPrice.toString()) : parseFloat(item.unitPrice.toString()),
                            discountPercent: item.discountPercent ? parseFloat(item.discountPercent.toString()) : 0,
                            discountAmount: item.discountAmount ? parseFloat(item.discountAmount.toString()) : 0,
                            lineTotal: parseFloat(item.lineTotal.toString()),
                            // Product snapshot fields
                            productSku: product?.sku || '',
                            productName: product?.name || '',
                            productDescription: product?.description,
                            productBrand: product?.brand,
                            productCategory: product?.category
                        };
                    })
                }
            },
            include: {
                orderItems: true,
                distributor: {
                    select: {
                        id: true,
                        companyName: true,
                        email: true
                    }
                }
            }
        });
        // Log activity
        await logActivity({
            distributorId: parseInt(distributorId.toString()),
            action: "Order Placed",
            details: {
                orderId: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                itemCount: order.orderItems.length
            }
        });

        return res.status(StatusCode.CREATED).json({
            message: "Order created successfully",
            order
        });

    } catch (error: any) {
        console.error("Error placing order:", error);

        // Handle specific Prisma errors
        if (error.code === 'P2002') {
            return res.status(StatusCode.BAD_REQUEST).json({
                error: "Order number already exists"
            });
        }

        if (error.code === 'P2003') {
            return res.status(StatusCode.BAD_REQUEST).json({
                error: "Invalid distributor ID or product ID"
            });
        }

        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            error: "Failed to place order"
        });
    }
};

export default placeOrderController;
