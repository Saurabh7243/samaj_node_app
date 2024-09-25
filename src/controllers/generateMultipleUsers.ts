import { Request, Response, NextFunction } from "express";
import { Business } from "../models/business";
import dbUtils from "../utils/db.utils";
import { Member } from "../models/members";
import { MemberRoleEnum, RelationEnum } from "../utils/enumData";

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

async function generateFamilyMembers(start: Date, end: Date, familySize: number) {
  //;
  var names = ["Alice", "Bob", "Charlie", "David", "Eve","Dev","Saurabh","Sagar","Rohit","dharmik","Eva","Rajan","Aaron","Harshad",  'Time', 'Past', 'Future', 'Dev',
  'Fly', 'Flying', 'Soar', 'Soaring', 'Power', 'Falling',
  'Fall', 'Jump', 'Cliff', 'Mountain', 'Rend', 'Red', 'Blue',
  'Green', 'Yellow', 'Gold', 'Demon', 'Demonic', 'Panda', 'Cat',
  'Kitty', 'Kitten', 'Zero', 'Memory', 'Trooper', 'XX', 'Bandit',
  'Fear', 'Light', 'Glow', 'Tread', 'Deep', 'Deeper', 'Deepest',
  'Mine', 'Your', 'Worst', 'Enemy', 'Hostile', 'Force', 'Video',
  'Game', 'Donkey', 'Mule', 'Colt', 'Cult', 'Cultist', 'Magnum',
  'Gun', 'Assault', 'Recon', 'Trap', 'Trapper', 'Redeem', 'Code',
  'Script', 'Writer', 'Near', 'Close', 'Open', 'Cube', 'Circle',
  'Geo', 'Genome', 'Germ', 'Spaz', 'Shot', 'Echo', 'Beta', 'Alpha',
  'Gamma', 'Omega', 'Seal', 'Squid', 'Money', 'Cash', 'Lord', 'King',
  'Duke', 'Rest', 'Fire', 'Flame', 'Morrow', 'Break', 'Breaker', 'Numb',
  'Ice', 'Cold', 'Rotten', 'Sick', 'Sickly', 'Janitor', 'Camel', 'Rooster',
  'Sand', 'Desert', 'Dessert', 'Hurdle', 'Racer', 'Eraser', 'Erase', 'Big',
  'Small', 'Short', 'Tall', 'Sith', 'Bounty', 'Hunter', 'Cracked', 'Broken',
  'Sad', 'Happy', 'Joy', 'Joyful', 'Crimson', 'Destiny', 'Deceit', 'Lies',
  'Lie', 'Honest', 'Destined', 'Bloxxer', 'Hawk', 'Eagle', 'Hawker', 'Walker',
  'Zombie', 'Sarge', 'Capt', 'Captain', 'Punch', 'One', 'Two', 'Uno', 'Slice',
  'Slash', 'Melt', 'Melted', 'Melting', 'Fell', 'Wolf', 'Hound',
  'Legacy', 'Sharp', 'Dead', 'Mew', 'Chuckle', 'Bubba', 'Bubble', 'Sandwich', 'Smasher', 'Extreme', 'Multi', 
  'Universe', 'Ultimate', 'Death', 'Ready', 'Monkey', 'Elevator', 'Wrench', 'Grease', 'Head', 
  'Theme', 'Grand', 'Cool', 'Kid', 'Boy', 'Girl', 'Vortex', 'Paradox'];
  var roleId = ["User"];//Admin
  var relation = ["Wife", "Child"];
  var tenantId = ["1"]; //["1" , "2" , "3","4"]
  var parentId:any=null 
  const connection = await dbUtils.getDefaultConnection();
  const memberRepo = connection.getRepository(Member);
  const findLastIndex:any = await memberRepo.createQueryBuilder('member')
      .orderBy('member.id',"DESC")
      .limit(1)
      .getOne();
  console.log(findLastIndex.id)
  if(findLastIndex) {
    parentId=findLastIndex.id + 1
  }
  // Generate the head of the family
  const headName = names[Math.floor(Math.random() * names.length)];
  const headRelation = "Head";
  const headTenantId = tenantId[Math.floor(Math.random() * tenantId.length)];
  const headRolesId = roleId[Math.floor(Math.random() * roleId.length)];
  const headEmail = `${headName.toLocaleLowerCase()}${Date.now()}@gmail.com`;
  let headDate:any = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  let headId:any = parentId
  
  let headPass:string = '1234'
  headDate = new Date(headDate.getUTCFullYear(), headDate.getUTCMonth(), headDate.getUTCDay()).toISOString().slice(0, 10);
  const head = {
      name: headName,
      email: headEmail,
      relation: headRelation,
      tenantIds: headTenantId,
      userRoles: headRolesId,
      date: headDate,
      id:headId,
      password:headPass
  };

  // Generate other family members
  let familyMembers:any = [head];
  for (let i = 1; i < familySize; i++) {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomRelationShip = relation[Math.floor(Math.random() * relation.length)];//relation[i % 2 === 1 ? 1 : 2];
      const randomTenantId = tenantId[Math.floor(Math.random() * tenantId.length)];
      const randomRolesId = roleId[Math.floor(Math.random() * roleId.length)];
      const randomEmail = `${randomName.toLocaleLowerCase()}${Date.now()}@gmail.com`;
      let childId = null

      if(parentId) {
        childId = parentId;
        // childId++
        childId += i
      }

      let dates = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
      let currDate = new Date(dates.getUTCFullYear(), dates.getUTCMonth(), dates.getUTCDay()).toISOString().slice(0, 10);
      // let parentId = head.id
      const member = {
          id:childId,
          name: randomName,
          email: randomEmail,
          relation: randomRelationShip,
          tenantIds: randomTenantId,
          userRoles: randomRolesId,
          date: currDate,
          parentId:parentId
      };
      familyMembers.push(member);
  }

  return familyMembers;
}

class generateMultipleUsers {
  async createUsers(req: Request, res: Response, next: NextFunction) {
    //;
    let existData:any = []
    const connection = await dbUtils.getDefaultConnection();
    const memberRepo = connection.getRepository(Member);
    try {
      
      for (let i = 0; i<100; i++) {
        let users =await generateFamilyMembers(new Date('7-2-2000'), new Date('7-2-2020'), 10000);

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
          const memberExist = await memberRepo.findOne({where:{Email:currUser.email}})
          if(memberExist) {
            existData.push(memberExist)
          } else {
          // let parentId:any = parentId;
          const admin = memberRepo.create({
            id:currUser.id,
            Name: currUser.name,
            Email: currUser.email,
            DOB: currUser.date,
            Relation: relationshipStatus,
            Password: pass,
            ParentId:currUser.parentId,
            Status: true,
            TenantId: tenantId,
            RoleId: MemberRoleEnum.User,
          });         
          await memberRepo.save(admin);
          }

        }
        // return res.json({msg:"Data inserted successfully", sameData: existData});
      }
    } catch (error) {
      console.log(error);
      res.json({ error: error });
    }
  }

  // async forLoop(req: Request, res: Response, next: NextFunction) {
  //   //;
  //   let arr = [10,51,21,56,1,12,54]
  //   let couter = null
  //   for(let i =0; arr.length; i++) {
  //   }
  // }
}

export default new generateMultipleUsers();



    // function randomDate(start:Date, end:Date) {
    //     let dates =  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    //     let currDate =  new Date(dates.getUTCFullYear(),dates.getUTCMonth(), dates.getUTCDay()).toISOString().slice(0,10)
    //     // let finalDate = currDate.toISOString().slice(0,10)
    //     return currDate;
    // }
    
    // for(let i=0; i<10;i++) {
    //     let dates = randomDate(new Date('7-2-2000'), new Date('7-2-2020'));
    //     datax.push(dates) 
    // }