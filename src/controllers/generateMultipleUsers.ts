// import { Request, Response, NextFunction } from "express";
// import { Business } from "../models/business";
// import dbUtils from "../utils/db.utils";
// import { Member } from "../models/members";
// import { MemberRoleEnum, RelationEnum } from "../utils/enumData";
// import { hinduNames } from "./randomNames";

// function members(start:Date, end:Date) {
//     //
//     var names = ["Alice", "Bob", "Charlie", "David", "Eve"];
//     var roleId = ["Admin", "User"];
//     var relation  = ["Wife" , "Child" , "Husband","Head"]
//     var tenantId  = ["1"]//["1" , "2" , "3","4"]

//     const randomName = names[Math.floor(Math.random() * names.length)];
//     const randomRelationShip = relation[Math.floor(Math.random() * relation.length)];
//     const randomTenantId = tenantId[Math.floor(Math.random() * tenantId.length)];
//     const randomRolesId = roleId[Math.floor(Math.random() * roleId.length)];
//     const randomEmail = `${randomName.toLocaleLowerCase()}${Date.now()}@gmail.com`;

//     //random date
//     let dates =  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//     let currDate =  new Date(dates.getUTCFullYear(),dates.getUTCMonth(), dates.getUTCDay()).toISOString().slice(0,10)
//     var user = {
//         name: randomName,
//         email:randomEmail,
//         relation:randomRelationShip,
//         tenantIds:randomTenantId,
//         userRoles:randomRolesId,
//         date:currDate,
//       };
//       return user;
// }

import { Request, Response, NextFunction } from "express";
import { Business } from "../models/business";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { MemberRoleEnum, RelationEnum } from "../utils/enumData";
import { hinduNames } from "./randomNames";

// Generates a family of random size between minFamilySize and maxFamilySize
async function generateFamilyMembers(start: Date, end: Date, minFamilySize: number, maxFamilySize: number) {
  var roleId = ["User"];
  var relation = ["Wife", "Child"];
  var tenantId = ["1"]; 
  var parentId: any = null;

  const connection = await dbUtils.getDefaultConnection();
  const memberRepo = connection.getRepository(Member);
  const findLastIndex: any = await memberRepo.createQueryBuilder('member')
    .orderBy('member.id', "DESC")
    .limit(1)
    .getOne();

  if (findLastIndex) {
    parentId = findLastIndex.id + 1;
  }

  // Determine random family size between 5 and 10 members
  const familySize = Math.floor(Math.random() * (maxFamilySize - minFamilySize + 1)) + minFamilySize;

  // Generate the head of the family
  const headName = hinduNames[Math.floor(Math.random() * hinduNames.length)];
  const headRelation = "Head";
  const headTenantId = tenantId[Math.floor(Math.random() * tenantId.length)];
  const headRolesId = roleId[Math.floor(Math.random() * roleId.length)];
  const headEmail = `${headName.toLocaleLowerCase()}${Date.now()}@gmail.com`;
  let headDate: any = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  let headId: any = parentId;
  let headPass: string = '1234';

  headDate = new Date(headDate.getUTCFullYear(), headDate.getUTCMonth(), headDate.getUTCDate()).toISOString().slice(0, 10);

  const head = {
    id: headId,
    name: headName,
    email: headEmail,
    relation: headRelation,
    tenantIds: headTenantId,
    userRoles: headRolesId,
    date: headDate,
    password: headPass,
  };

  // Generate other family members
  let familyMembers: any = [head];
  for (let i = 1; i < familySize; i++) {
    const randomName = hinduNames[Math.floor(Math.random() * hinduNames.length)];
    const randomRelationShip = relation[Math.floor(Math.random() * relation.length)];
    const randomTenantId = tenantId[Math.floor(Math.random() * tenantId.length)];
    const randomRolesId = roleId[Math.floor(Math.random() * roleId.length)];
    const randomEmail = `${randomName.toLocaleLowerCase()}${Date.now() + i}@gmail.com`; // Adjusted to avoid duplicates
    let childId = null;

    if (parentId) {
      childId = parentId + i;
    }

    let dates = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    let currDate = new Date(dates.getUTCFullYear(), dates.getUTCMonth(), dates.getUTCDate()).toISOString().slice(0, 10);

    const member = {
      id: childId,
      name: randomName,
      email: randomEmail,
      relation: randomRelationShip,
      tenantIds: randomTenantId,
      userRoles: randomRolesId,
      date: currDate,
      parentId: parentId,
    };
    familyMembers.push(member);
  }

  return familyMembers;
}

class generateMultipleUsers {
  async createUsers(req: Request, res: Response, next: NextFunction) {
    let existData: any = [];
    const connection = await dbUtils.getDefaultConnection();
    const memberRepo = connection.getRepository(Member);

    try {
      const createNumbersOfUser = 3000;
      for (let i = 0; i < 1; i++) {
        let users = await generateFamilyMembers(new Date('7-2-2000'), new Date('7-2-2020'), 5, 10); // Family size between 5 and 10

        for (let j = 0; j < users.length; j++) {
          const currUser = users[j];

          let relationshipStatus: any;
          var pass: any = null;
          if (currUser.relation === "Head") {
            relationshipStatus = RelationEnum.Head;
            pass = "1234";
          } else if (currUser.relation === "Child") {
            relationshipStatus = RelationEnum.Child;
          } else {
            relationshipStatus = RelationEnum.Wife;
          }

          let tenantId: any = currUser.tenantIds;
          const memberExist = await memberRepo.findOne({ where: { Email: currUser.email } });
          if (memberExist) {
            existData.push(memberExist);
          } else {
            const admin = await memberRepo.create({
              id: currUser.id,
              Name: currUser.name,
              Email: currUser.email,
              DOB: currUser.date,
              Relation: relationshipStatus,
              Password: pass,
              ParentId: currUser.parentId,
              Status: true,
              TenantId: tenantId,
              RoleId: MemberRoleEnum.User,
            });
            await memberRepo.save(admin);
          }
        }
      }
      return res.json({ msg: "Data inserted successfully", sameData: existData });
    } catch (error) {
      console.log(error);
      return res.json({ error: error });
    }
  }
}

export default new generateMultipleUsers();