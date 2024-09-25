
import { Request, Response, NextFunction } from "express";
import { readFile, utils } from "xlsx";
import path from "path";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { BloodGroupEnum, GenderEnum, MaritalStatusEnum, MemberRoleEnum, PaymentMode, RelationEnum,} from "../utils/enumData";
import { unlink } from "fs";
import Joi from "joi";
import moment from 'moment'
import { MemberShipHistory } from "../models/memberShipHistory";
import { updateFileUploadData } from "../utils/commonFunction";

async function findMember(email:string) {   
  const connection = await dbUtils.getDefaultConnection();
  const memberRepo = connection.getRepository(Member);

  const member = await memberRepo
  .createQueryBuilder("member")
  .leftJoinAndSelect("member.addresses","addresses")
  .cache(true)
  .where("member.Email= :Email", { Email: email })  
  .getOne();

 return member
}
async function createParent(validData:any={},tenantId:any={}) {    
  const Password = "1234"
  const connection = await dbUtils.getDefaultConnection();
  const memberRepo = connection.getRepository(Member);
  const memberExists:any = await findMember(validData.Email)
  const updateFileData = updateFileUploadData(validData)
  try {
    if(memberExists) {
      memberExists.Name= validData.Name
      memberExists.Gender= updateFileData.genderStatus
      memberExists.DOB= new Date()
      memberExists.Relation= updateFileData.relationshipStatus
      memberExists.MaritalStatus= updateFileData.maritalStatus,
      memberExists.BloodGroup= BloodGroupEnum.aPositive
      memberExists.Status= updateFileData.memberStatus
      memberExists.RoleId= MemberRoleEnum.User
      memberExists.TenantId= tenantId      
      // memberExists.addresses=[{
      //       // Address_1= validData.Address,
      //       // City= validData.City,
      //       // State=validData.State,
      //   }],
        // businesses= [{
        //   Name= validData.Business
        // }]      
      await memberRepo.save(memberExists)
      memberShipHistory(validData)
    } else {
      const result = memberRepo.create({
        Email: validData.Email,
        Name: validData.Name,
        Gender: updateFileData.genderStatus,
        DOB: new Date(),
        Relation: updateFileData.relationshipStatus,
        MaritalStatus: updateFileData.maritalStatus,
        BloodGroup: BloodGroupEnum.aPositive,
        Status: updateFileData.memberStatus,
        Password:Password,
        RoleId: MemberRoleEnum.User,
        TenantId: tenantId,
        addresses:[{
            Address_1: validData.Address,
            City: validData.City,
            State:validData.State,
        }],
        businesses: [{
          Name: validData.Business
        }]
      });      
      await memberRepo.save(result)
      setTimeout(()=> {
        memberShipHistory(validData)
      },3000)
    }
  } catch (error) {
    console.error(error)
    return error
  }
}
async function createMember(validData: any={},parent:any={},tenantId:any={},dob:any={},status:any={}) {
  const connection = await dbUtils.getDefaultConnection();
  const memberRepo = connection.getRepository(Member);
  const parentMember = await findMember(parent.Email)
  const parentId:any = parentMember?.id
  const memberExists = await findMember(validData.Email)
  const updateFileData = updateFileUploadData(validData)

  if(memberExists) {
    memberExists.Name= validData.Name;
    memberExists.Gender= updateFileData.genderStatus;
    memberExists.DOB= dob;
    memberExists.Relation= updateFileData.relationshipStatus
    memberExists.MaritalStatus= updateFileData.maritalStatus,
    memberExists.BloodGroup= BloodGroupEnum.aPositive;
    memberExists.Status= status
    memberExists.ParentId= parentId
    memberExists.RoleId= MemberRoleEnum.User
    memberExists.TenantId= tenantId
    // memberExists.addresses=[{
    //   id: 1,
    //   member:memberExists,
    //   Contact:validData.Contact,
    //   Address_1: validData.Address,
    //   Address_2:"",
    //   MaternalAddress:"",
    //   City: validData.City,
    //   ZipCode:"",
    //   AddressType:AddressTypeEnum.Business,
    //   State: validData.State,
    // }]
    await memberRepo.save(memberExists);
  } else {
    const result = memberRepo.create({
      Email: validData.Email,
      Name: validData.Name,
      Gender: updateFileData.genderStatus,
      DOB: dob,
      Relation: updateFileData.relationshipStatus,
      MaritalStatus: updateFileData.maritalStatus,
      BloodGroup: BloodGroupEnum.aPositive,
      Status: status,
      ParentId: parentId,
      RoleId: MemberRoleEnum.User,
      TenantId: tenantId,
      addresses:[{
          Address_1: validData.Address,
          City: validData.City,
          State:validData.State,
      }],
      businesses: [{
        Name: validData.Business
      }]
    });
    await memberRepo.save(result);
  }
}
async function validateData(childData: any,tenantId:any) {
  //
  const convertToLowerCase = {
    ...childData,
    Email: childData.Email ? childData.Email.toLowerCase() :undefined,
    Relation:childData.Relation ? childData.Relation.toLowerCase() : undefined,
    Status:childData.Status ? childData.Status.toLowerCase() : undefined,
    Gender:childData.Gender ? childData.Gender.toLowerCase() : undefined,
    Name:childData.Name ? childData.Name.toLowerCase() : undefined,
    MaritalStatus:childData.MaritalStatus ? childData.MaritalStatus.toLowerCase() : undefined,
    TenantId:tenantId,
    DOB : childData.DOB ? String(childData.DOB) : undefined,
  }
  const schema = Joi.object({
    Email: Joi.string().email().required(),
    Name: Joi.string().required(),
    DOB: Joi.string().allow('').default(''),
    Relation: Joi.string().required(),
    Gender: Joi.string().required(),
    MaritalStatus: Joi.string(),
    BloodGroup: Joi.string(),
    Status: Joi.string(),
    ParentId: Joi.string(),
    RoleId: Joi.string(),
    TenantId: Joi.number().required(),
    Address_1: Joi.string(),
    City: Joi.string().required(),
    State: Joi.string().required(),
    Business: Joi.string().required(),
    PaymentDate:Joi.string(),
    PaymentMode: Joi.string(),
    MemberShip: Joi.string(),
  });
  const { error, value } = schema.validate(convertToLowerCase, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    console.error("Validation Error: ", error.details.map((err) => err.message));
    return null;
  }
  return value;
}
function generateDate(date:any) {
  let newDate = null;
 //
  if (typeof date === 'number') {     
     const excelEpoch = new Date(1900, 0, 1);
     newDate = new Date(excelEpoch.getTime() + (date - 1) * 86400000);
  } else {
     // Attempt to parse the date with Moment.js, allowing it to fall back to its default parsing logic
     newDate = moment(date, moment.ISO_8601, true);
     if (!newDate.isValid()) {
       // If the date is not valid, try parsing it with Moment.js's createFromInputFallback
       newDate = moment.invalid();
     }
  }
 
  // If no valid date is found, log and return null
  if (moment.isMoment(newDate) && newDate.isValid()) {
     console.log('Invalid date format:', date);
     return null;
  }
 
  return moment.isMoment(newDate) ? newDate.toDate() : newDate;
 }
async function memberShipHistory(data:any) {  
  try {
    const connection = await dbUtils.getDefaultConnection();
    const membershipRepo = connection.getRepository(MemberShipHistory);
    const isMemberExists:any = await findMember(data.Email)
    if(!isMemberExists) {
      console.log("member no found");
    } else {
      let paymentMode = PaymentMode.Cash
      if(data.PaymentMode) {
        paymentMode = PaymentMode.Online
      }
      const history = membershipRepo.create({
        meberId:isMemberExists.id,
        amount:1000,
        paymentDate:data.PaymentDate,
        paymentType:paymentMode
      })
      await membershipRepo.save(history)
    }
  
  } catch (error) {
    console.error(error);
  }
}
class ExcelFileReaderController {
  async readExcel(req: Request, res: Response, next: NextFunction) { 
    try {
      const tenantId = req.decoded.member.TenantId.id;
      const fileName: any = req.file?.filename;      
      const currentDirectory = process.cwd();
      const uploadDirectory = path.join(currentDirectory, "public", "files");
      const workbook = readFile(path.resolve(uploadDirectory, fileName));
      const workbook_sheet = workbook.SheetNames;
      const workbook_response = utils.sheet_to_json(workbook.Sheets[workbook_sheet[0]]);      
      const tree = [];
      let currentParent = null;
      for (const rowData of workbook_response) {
        const row: any = rowData;
        const self = row.Relation;
        if (self === "self") {
          currentParent = { parent: row, children: [] };
          tree.push(currentParent);
        } else {
          if (currentParent) {
            (currentParent as { parent: string; children: any[] }).children.push(row);
          }
        }
      }
      let wrongData:any = [];
      let wrongChild:any =[];
      let parentWithWrongChildren:any;
      for (const node of tree) {
        //
        let mainArray = [];
        mainArray.push(node.parent);
        mainArray.push(node.children);
        let validParentData = await validateData(node.parent,tenantId);
        //check for payment paid or  unpaid payment
        let parentStatus = true;
        if(validParentData.Status === 'unpaid') {
            parentStatus = false
        }
        if(validParentData) {
          await createParent(validParentData,tenantId)
          parentWithWrongChildren = {parent: validParentData,children: []};
          for (let data = 1; data < mainArray.length; data++) {
            let main = mainArray[data];

            for (let data of main) {
              const childData:any = data;
              let dob: any = generateDate(childData.DOB);
              let validChildData = await validateData(childData,tenantId);
              if(validChildData) {
                await createMember(validChildData,validParentData,tenantId,dob,parentStatus)
              } else {
                parentWithWrongChildren.children.push(childData);                
              }
            }
            if(parentWithWrongChildren.children.length > 0) {
              wrongChild.push(parentWithWrongChildren);
            }
          }
        } else {
          wrongData.push(node.parent)
        }        
      }
      unlink(path.join(currentDirectory, "public", "files", fileName),
        (err) => {
          if (err) {
            console.error("Error deleting file:", err);
          } else {
            console.log();
          }
        }
      )      
      res.status(200).send({ message: "Data uploaded successfully", wrongParentData: wrongData,wrongChildData:wrongChild });
    } catch (error) {
      console.error("Error reading file:", error);
      res.status(500).send({
        error: "Internal Server Error",
      });
    }
  }

}
export default new ExcelFileReaderController();
