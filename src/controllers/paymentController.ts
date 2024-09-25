import  { Request, Response, NextFunction } from "express";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { createHash } from "crypto";
import Payment from "../models/payment";

export interface data {
    mihpayid: string
    mode: string
    status: string
    unmappedstatus: string
    txnid: string
    amount: string
    discount: string
    net_amount_debit: string
    addedon: string
    productinfo: string
    firstname: string
    email: string
    phone: string
    payment_source: string
    meCode: string
    PG_TYPE: string
    bank_ref_num: string
    bankcode: string
    error_Message: string
    udf1:number
    udf2:number
}
async function savePaymentData(paymentData:data) {
    //
    const connection = await dbUtils.getDefaultConnection();
    const paymentRepo = connection.getRepository(Payment)
    const memberRepo = connection.getRepository(Member)
    const memberId:any = paymentData.udf1;
    const productId:any = paymentData.udf2;

    const memberExists:any =await memberRepo.createQueryBuilder('member')
    .where('id =:id', {id:memberId})
    .getOne();
    if(memberExists) {
        const paymentResult = paymentRepo.create({
            status:paymentData.status,
            transactionId:paymentData.txnid,
            amount:paymentData.amount,
            discount:paymentData.discount,
            firstname:paymentData.firstname,
            email:paymentData.email,
            phone:paymentData.phone,
            paymentSource:paymentData.payment_source,
            PG_TYPE:paymentData.PG_TYPE,
            bank_ref_num:paymentData.bank_ref_num,
            bankCode:paymentData.bankcode,
            date:paymentData.addedon,
            mihPayId:paymentData.mihpayid,
            mode:paymentData.mode,
            unMappedStatus:paymentData.unmappedstatus,
            errorMessage:paymentData.error_Message,
            memberId:memberExists.id
        })        
        await paymentRepo.save(paymentResult)
    }
}
class PaymentController {
    async MakePayment(req: Request, res: Response, next: NextFunction) {
        //
        const { name, email, amount, producInfo, transactionId,productId ,time , date} = req.body; 
        const memberId = req.decoded.member.id;
        // this fields are requires
        const data = {  
            key: "cgo249", 
            salt: "BwJgLtmD9cnTT0we6xjrQYOc4qzG7QQV",
            txnid: transactionId, 
            amount: amount, 
            productinfo: producInfo,
            firstname: name, 
            email: email, 
            udf1: memberId,
            udf2: productId, 
            udf3: time, 
            udf4: date, 
            udf5: 'details5',
        }
        const cryp = createHash("sha512") 
        const string = data.key + '|' + data.txnid + '|' + data.amount + '|' + data.productinfo + '|' + 
                       data.firstname + '|' + data.email + '|' + data.udf1 + '|' + data.udf2 + '|' + data.udf3 + '|' +  
                       data.udf4 + '|' + data.udf5 + '||||||' + data.salt;
                       
        cryp.update(string) 
        const hash = cryp.digest('hex')
        console.log(hash) 
        return res.status(200).send({ 
            hash:hash, 
            transactionId:transactionId,
            memberId:memberId
        })
    } 
    async success(req: Request, res: Response, next: NextFunction) {
        //
        try {
            const paymentData: data = req.body;
            // savePaymentData(paymentData)
            return res.redirect("http://localhost:3000/admin/payment/success")
        } catch (error) {
            console.log(error)
        }
    }   
    async failure(req: Request, res: Response, next: NextFunction) {
        try {            
            // const data = JSON.stringify(req.body)
            // console.log(data)
            const paymentData: data = req.body;
            savePaymentData(paymentData)
            return res.redirect("http://localhost:3000/admin/payment-fail")
        } catch (error) {
            console.log(error)
        }
    }
    async paymentHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const memberId:any =req.decoded.member.id
            const connection = await dbUtils.getDefaultConnection()
            const paymentRepo = connection.getRepository(Payment)
            const getHistory =await paymentRepo.createQueryBuilder('payment')
            .cache(true)
            .where('payment.memberId =:memberId',{memberId:memberId})
            .getRawMany();
            return res.status(200).json(getHistory)
        } catch (error) {
            console.log(error)
            return res.json({ error: error});
        }
    }
}

export default new PaymentController();