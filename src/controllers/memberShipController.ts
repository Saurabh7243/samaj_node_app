import { Request, Response, NextFunction } from "express";

const calculateFinancialYear = (customDate:any={}) => {
    var today = new Date();
    var currentFinancialYear = ""
    if((today.getMonth() + 1) <= 3) {
        currentFinancialYear = (today.getFullYear() - 1) + "-" + today.getFullYear()
    } else {
        currentFinancialYear = (today.getFullYear()) + "-" + (today.getFullYear() + 1)
    }

    return currentFinancialYear
}
class MemberShipController {

    async createMemberShip(req:Request,res:Response,next:NextFunction) {
        try {
            calculateFinancialYear()
            return 
        } catch (error) {
            return res.status(404).json({"error":error})
        }
    }

    async expiredMemberShip(req:Request,res:Response,next:NextFunction){        

        function hasMembershipExpired() {
            //
            const financialYearStart = new Date('2023-04-01');
            const financialYearEnd = new Date('2024-03-31');
                    
            const membershipStatus = new Date('2020-06-15');
          
            if(membershipStatus >= financialYearStart && membershipStatus <= financialYearEnd) {
                res.json('Membership is still valid.');                
            } else {
                res.json('Membership has expired.');
            }
          }
          
          hasMembershipExpired()
          const membershipEndDate = '2020-06-15';
          
        //   if (hasMembershipExpired(membershipEndDate)) {
        //     res.json('Membership has expired.');
        //   } else {
        //     res.json('Membership is still valid.');
        //   }
          
        // if(currentFinancialYear === (currentDate.getFullYear())) {
        //     console.log("this is currentFinancialYear financial year: " + currentFinancialYear)
        // } else if(currentFinancialYear > (currentDate.getFullYear())) {
        //     console.log('old financial year'+ currentFinancialYear,(currentDate.getFullYear()))
        // } else {
        //     console.log("future financial year: ", currentFinancialYear,(currentDate.getFullYear()))
        // }
    }
}

export default new MemberShipController();