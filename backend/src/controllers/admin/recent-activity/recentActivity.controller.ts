import { StatusCode } from "../../../types";
import prisma from "../../../utils/prismaClient"
import { Request,Response } from "express";

const recentActivityController=async(req:Request,res:Response):Promise<Response|void>=>{
    try{
    const activity=await prisma.activityLog.findMany({
        include: {
            distributor: {
                select: {
                    id: true,
                    ownerName: true,
                    companyName: true,
                    email: true
                }
            }
        },
        orderBy: {
            timestamp: 'desc'
        },
        take: 20 // Limit to last 20 activities
    });
    return res.status(StatusCode.SUCCESS).json({
        message:"activity log fetched",
        activityLog:activity
    })
    }catch(e){
        return res.status(StatusCode.BAD_REQUEST).json({
            error:"error while fetching activity log"
        })
    }
    
}
export default recentActivityController