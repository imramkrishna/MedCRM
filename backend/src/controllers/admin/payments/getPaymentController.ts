import { Request, Response } from "express";
import prisma from "../../../utils/prismaClient";
import { StatusCode } from "../../../types";

const getPaymentController = async (req: Request, res: Response) => {
    try {
        // Single query that fetches everything at once
        const paymentStatusRequests = await prisma.paymentStatusRequest.findMany({
            include: {
                order: {
                    include: {
                        distributor: {
                            select: {
                                companyName: true,
                                ownerName: true,
                                email: true,
                            }
                        },
                        orderItems: {
                            include: {
                                product: {
                                    select: {
                                        id: true,
                                        sku: true,
                                        name: true,
                                        brand: true,
                                        category: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                requestedAt: 'desc' // Most recent first
            }
        });

        return res.status(StatusCode.SUCCESS).json({
            message: "Payment requests fetched successfully",
            data: paymentStatusRequests,
        });
    } catch (e: any) {
        console.error("Error fetching payment requests:", e);
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
            error: "Error while fetching payment requests",
            message: e.message
        });
    }
};

export default getPaymentController;