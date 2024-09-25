import Joi from "joi";
export function validUserData(data: any) {
    //
    const convertToLowerCase = {
        ...data,
        email: data.email ? data.email.toLowerCase() : undefined,
        firstName: data.firstName ? data.firstName.toLowerCase() : undefined,
        contact : data.contact ? String(data.contact) : undefined,
    }
    const schema = Joi.object({
        email: Joi.string().email().required().trim().max(255).truncate(),
        firstName: Joi.string().max(12).truncate(),
        relation: Joi.string().allow('').allow(null).default(null).max(50).truncate(),
        gender: Joi.string().allow('').default(null).max(12).truncate(),
        maritalStatus: Joi.string().allow('').default(null).max(12).truncate(),
        bloodGroup: Joi.string().allow('').default(null).max(15).truncate(),
        // Status: Joi.string(),
        // ParentId: Joi.string(),
        study:Joi.string().max(12).truncate().allow(null).allow('').default(null).max(100).truncate(),
        maternalName:Joi.string().max(12).truncate().allow('').allow(null).default(null).max(100).truncate(),
        contact:Joi.string().max(12).truncate().allow(null).default(null).max(15).truncate(),
        role: Joi.string().allow('').default(null).max(10).truncate(),
        // TenantId: Joi.number().required(),
        // PaymentDate: Joi.string(),
        // PaymentMode: Joi.string(),
        // MemberShip: Joi.string(),
    })
    const { error, value } = schema.validate(convertToLowerCase, {
        abortEarly: false,
        stripUnknown: true,
    })

    if (error) {
        console.error("Validation Error: ", error.details.map((err) => err.message));
        return null;
    }
    return value;
}

export function validAddressData(data: any) {    
    const processedData = {
        ...data,
        address_2: data.address_2 ? String(data.address_2) : null,
        contactNumber: data.contactNumber ? String(data.contactNumber) : null,
    };

    const addressSchema = Joi.object({
        address_1: Joi.string().required().max(50).truncate(),
        address_2: Joi.string().allow(null).default(null).max(30).truncate(),
        city: Joi.string().required().max(50).truncate(),
        state: Joi.string().required().max(50).truncate(),
        contactNumber: Joi.string().allow(null).default(null).max(15).truncate(),
    });

    const { error, value } = addressSchema.validate(processedData, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        console.error("Validation Error: ", error.details.map((err) => err.message));
        return null;
    }
    return value;
}

export function validBusinessData(data: any) {
    //
    const addressSchema = Joi.object({
        name: Joi.string().required().max(5).truncate(),
    });

    const { error, value } = addressSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
    });

    if (error) {
        console.error("Validation Error: ", error.details.map((err) => err.message));
        return null;
    }
    return value;
}