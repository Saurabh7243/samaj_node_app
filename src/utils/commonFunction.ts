import moment from "moment";
import {
  BloodGroupEnum,
  GenderEnum,
  MaritalStatusEnum,
  RelationEnum,
} from "./enumData";
import { validUserData } from "./validate";
export interface updateMembersData {
  firstName?: any;
  email?: any;
  relation?: any;
  dob?: any;
  study?: any;
  maritalStatus?: any;
  bloodGroup?: any;
  maternalName?: any;
  gender?: any;
}

export interface updateFileData {
  Status: any;
  Gender: any;
  MaritalStatus: any;
  Relation: any;
}

function generateDate(date: any) {
  //
  let newDate = null;
  const formats = [
    "DD/MM/YYYY",
    "DD-MM-YYYY",
    "DD-MM-YYYY HH:mm:ss",
    "DD-MM-YY",
    "YYYY-MM-DD",
  ];
  for (const format of formats) {
    newDate = moment.utc(date, format, true);
    if (newDate.isValid()) {
      if (format === "DD-MM-YYYY HH:mm:ss") {
        return newDate.format("YYYY-MM-DD HH:mm:ss");
      }      
      return newDate.format()
    }
  }
  return undefined;
}


export function updateMembers(member: updateMembersData) {
  //
  const validatedUserData = validUserData(member);

  let maritalData: any;
  if (member.maritalStatus === "Married") {
    maritalData = MaritalStatusEnum.Married;
  } else {
    maritalData = MaritalStatusEnum.Unmarried;
  }

  //get relationship status
  let relationshipStatus: any;
  if (member.relation === "Wife") {
    relationshipStatus = RelationEnum.Wife;
  } else if (member.relation === "Child") {
    relationshipStatus = RelationEnum.Child;
  } else if (member.relation === "Husband") {
    relationshipStatus = RelationEnum.Husband;
  } else {
    relationshipStatus = RelationEnum.Head;
  }

  //get bloodGroup status
  let bloodGroupStatus: any;
  if (member.bloodGroup === "oPositive") {
    bloodGroupStatus = BloodGroupEnum.oPositive;
  } else if (member.bloodGroup === "bNegative") {
    bloodGroupStatus = BloodGroupEnum.bNegative;
  } else if (member.bloodGroup === "abPositive") {
    bloodGroupStatus = BloodGroupEnum.abPositive;
  } else {
    bloodGroupStatus = BloodGroupEnum.aPositive;
  }

  // get gender status
  let genderStatus = undefined;
  if (member.gender === "Male") {
    genderStatus = GenderEnum.Male;
  } else if (member.gender === "Female") {
    genderStatus = GenderEnum.Female;
  } else {
    genderStatus;
  }

  let dob = null;
  if (member.dob != undefined || member.dob != null || member.dob != "") {
    dob = generateDate(member.dob);
  } 
  // else {
  //   dob;
  // }

  return {
    maritalData,
    relationshipStatus,
    bloodGroupStatus,
    genderStatus,
    dob,
    validatedUserData,
  };
}

export function updateFileUploadData(validData: updateFileData) {
  //;
  let memberStatus;
  if (validData.Status === "unpaid") {
    memberStatus = false;
  } else {
    memberStatus = true;
  }

  let genderStatus: any;
  if (validData.Gender === "Female") {
    genderStatus = GenderEnum.Female;
  } else {
    genderStatus = GenderEnum.Male;
  }

  let maritalStatus: any;
  if (validData.MaritalStatus === "marriade") {
    maritalStatus = MaritalStatusEnum.Married;
  } else {
    maritalStatus = MaritalStatusEnum.Unmarried;
  }

  let relationshipStatus: any;
  if (validData.Relation === "wife") {
    relationshipStatus = RelationEnum.Wife;
  } else if (validData.Relation === "child") {
    relationshipStatus = RelationEnum.Child;
  } else {
    relationshipStatus = RelationEnum.Husband;
  }

  return { memberStatus, genderStatus, maritalStatus, relationshipStatus };
}
