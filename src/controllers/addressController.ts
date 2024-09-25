import  { Request, Response, NextFunction } from "express";
import { Address_ } from "../models/address";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { validAddressData } from "../utils/validate";

class AddressController {
  async createAddress(req: Request, res: Response, next: NextFunction) {
    //
    try {
      // const {contactNumber,address_1,address_2,city,state,zipCode} = req.body.data.formData;
      const validData = validAddressData(req.body.data.formData)

      const memberId = req.decoded.member.id
      const childId  = req.body.data.childId;
      let mainId:any = "";
  
      const memberRole:any = req.body.data.memberRole;
  
      if (memberRole === "child") {
        mainId = childId;
      } else {
        mainId = memberId;
      }

      const connection = await dbUtils.getDefaultConnection();
      const addressRepo = connection.getRepository(Address_);
      const memberRepo = connection.getRepository(Member);      

      const member = await memberRepo.findOne({ where: { id: mainId } });
      if (!member) {
        return res.status(404).json({ message: "User not found" });
      }

      const address = addressRepo.create({
        member: member,
        City: validData.city,
        State: validData.state,
        Address_1: validData.address_1,
        Address_2: validData.address_2,
        Contact: validData.contactNumber,
        MaternalAddress: "Native",
        ZipCode: validData.zipCode,
      });
      await addressRepo.save(address);

      return res.status(200).json({ message: "address and business saved successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "error", error });
    }
  }

  async addressDetails(req: Request, res: Response, next: NextFunction) {
    //
    try {
      const memberId = req.decoded.member.id
      const childId  = req.body.childId;
      let mainId = "";
      const memberRole:any = req.body.memberRole;
      
      if (memberRole === "child") {
        mainId = childId;
      } else {
        mainId = memberId;
      }
      const connection = await dbUtils.getDefaultConnection();
      const addressRepo = connection.getRepository(Address_);

      const memberAddress:any = await addressRepo
        .createQueryBuilder("member")
        .select([
          "member.Address_1",
          "member.Address_2",
          "member.MaternalAddress",
          "member.City",
          "member.State",
          "member.Contact",
          "member.ZipCode",
          "member.id",
        ])
        .where("member.memberId = :memberId", { memberId: mainId })
        .cache(true)
        .getRawMany()

        res.json(memberAddress);
    } catch (error) {
      res.json("address not found");
      console.error(error);
    }
  }

  async addressUpdate(req: Request, res: Response, next: NextFunction) {
    //
    let mainId:any="";
    const memberId = req.decoded.member.id
    const childId  = req.body.childId;
    const { addressId } = req.body;
    // const { address_1, address_2, city, state, contactNumber,zipCode} = req.body.formData;
    const memberRole:any = req.body.memberRole;
    const validData = validAddressData(req.body.formData)

    if (memberRole === "child") {
      mainId = childId;
    } else {
      mainId = memberId;
    }

    try {
      const connection = await dbUtils.getDefaultConnection();
      const addressRepo = connection.getRepository(Address_);
      
      const memberAddressUpdate: any = await addressRepo
        .createQueryBuilder("address")
        .update(Address_)
        .set({
          Address_1: validData.address_1,
          Address_2: validData.address_2,
          // MaternalAddress: validData.member_MaternalAddress,
          City: validData.city,
          State: validData.state,
          Contact: validData.contactNumber,
          ZipCode: validData.zipCode,
        })
        .where("address.id = :id", { id: addressId })
        .execute();
            
      return res.status(200).json(memberAddressUpdate)
    } catch (error) {
      console.error(error);
      return res.json("Address not found");      
    }
  }
  
  async addressDelete(req: Request, res: Response, next: NextFunction) {
    
    const { id } = req.body;  

    try {
      const connection = await dbUtils.getDefaultConnection();
      const addressRepo = connection.getRepository(Address_);
      
      const memberAddressDelete: any = await addressRepo
        .createQueryBuilder("address")
        .delete()
        .where("address.id = :id", { id: id })
        .execute()
        return res.status(200).json(memberAddressDelete)
    } catch (error) {
      console.error(error);
      return res.json("Address not found");      
    }
  }
}

export default new AddressController();
