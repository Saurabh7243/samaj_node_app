import { Request, Response, NextFunction } from "express";
// import { Events } from "../models/event";
import { Events as EventEntity } from "../models/event";

import dbUtils from "../utils/db.utils";
import { Tenant } from "../models/tenant";
import { IsPaidEnum } from "../utils/enumData";
import { QRCodeOptions, toDataURL } from 'qrcode';
import nodemailer from 'nodemailer';
import { Member } from '../models/members';
import * as dotenv from 'dotenv';
import { readFileSync, writeFileSync } from "fs";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "django.developments@gmail.com",
    pass: "qyvedoqvssnilxax"
  }
});

export async function generateQRCode(memberId: any, eventId: any, eventInfo: any={}, email: any, time: any={}, date: any={}) {
  //
  const connection = await dbUtils.getDefaultConnection();
  const memberRepo = connection.getRepository(Member);
  try {
    const member = await memberRepo
      .createQueryBuilder("member")
      .leftJoinAndSelect("member.addresses", "addresses")
      .where("member.id = :id", { id: memberId })
      .getOne();

    if (!member) {
      throw new Error('Member not found');
    }

    const data = JSON.stringify({
      name: member.Name,
      email: email,
      memberId: member.id,
      eventId: eventId,
      eventName: eventInfo,
      eventTime: time,
      eventDate: date
    });

    const formattedDate = date.slice(0, 10);
    const qrCodeOptions: QRCodeOptions = {
      errorCorrectionLevel: "H",
      maskPattern: 3,
    };

    const qrCodeDataURL = await toDataURL(data, qrCodeOptions);

    const filename = 'qr_code.png';
    const imageData = qrCodeDataURL.replace(/^data:image\/\w+;base64,/, "");
    writeFileSync(filename, imageData, 'base64')

    const mailOptions = {
      from: 'django.developments@gmail.com',
      to: email,
      subject: 'Event confirmation mail',
      html: `
        <div style="font-family: Georgia, 'Times New Roman', Times, serif; width:50%; margin:auto;">
          <h2>We're excited to welcome you to ${eventInfo}! Thank you for registering - your spot is officially confirmed.</h2>
          <p style="font-size: 20px;">Here's a quick overview of what you can expect:</p>
          <ul style="font-size: 18px;">
            <li><span style="font-weight: bold;">Event Date:</span> ${formattedDate}</li>
            <li><span style="font-weight: bold;">Time:</span> ${time}</li>
          </ul>
          <img src="cid:qr_code.png" style="display: block; margin: auto;" alt="QR Code" />
          <p style="font-weight: bold; font-size: 16px;">We can't wait to see you there</p>
        </div>
      `
    };
    const attachments = [{
      filename: 'qr_code.png',
      content: readFileSync(filename),
      contentType: 'image/png',
      cid: 'qr_code.png' // Matches the cid used in HTML
    }];

    transporter.sendMail({ ...mailOptions, attachments }, (error, info) => {
      if (error) {
        console.log('Error occurred. ' + error.message);
      } else {
        console.log('Verification email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.log(error);
  }
}


class EventController {
  async getEventDetail(req: Request, res: Response, next: NextFunction) {
    try {
      let tenantId = req.decoded.member.TenantId?.id
      const connection = await dbUtils.getDefaultConnection();
      const repo = connection.getRepository(EventEntity);
      const event = repo.findOne(tenantId);

      return res.json(event);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      let tenantId = req.decoded.member.TenantId.id
      const connection = await dbUtils.getDefaultConnection();
      const eventRepo = connection.getRepository(EventEntity);
      const findEvents = await eventRepo.createQueryBuilder('events')
        .cache(true)
        .where('events.TenantId= :TenantId', { TenantId: tenantId })
        .getRawMany()

      if (!findEvents) {
        return res.status(404).json({ message: "Events Not Found" });
      }
      return res.json({ findEvents });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async createEvent(req: Request, res: Response, next: NextFunction) {
    //
    try {
      let { Name, Active, CreatedDate, PublishDate, Amount, Description, Location, Date, Time, IsPaid } = req.body
      const connection = await dbUtils.getDefaultConnection();
      const eventRepo = connection.getRepository(EventEntity);
      const tenantRepo = connection.getRepository(Tenant);
      let tenantId = req.decoded.member.TenantId.id
      let Photos = req.file?.path

      let eventType = null;
      if (IsPaid === "Paid") {
        eventType = IsPaidEnum.IsPaid
      } else {
        eventType = IsPaidEnum.IsFree
        Amount = 0
      }
      const existingTenant = await tenantRepo
        .createQueryBuilder("tenant")
        .where("tenant.id = :id", { id: tenantId })
        .getRawOne();

      if (!existingTenant) {
        return res.status(404).json({ message: "Tenant not found" });
      } else {
        const newEvent = eventRepo.create({
          Name,
          Active,
          CreatedDate,
          PublishDate,
          TenantId: tenantId,
          Amount,
          Description,
          Location,
          Date,
          Time,
          Photos: Photos,
          IsPaid: eventType
        });
        await eventRepo.save(newEvent)
      }
      return res.status(200).json({ message: "Event Created successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async deleteEvents(req: Request, res: Response, next: NextFunction) {
    try {
      //
      const eventId: any = req.params.eventId
      const connection = await dbUtils.getDefaultConnection();
      const eventRepo = connection.getRepository(EventEntity);
      const findEvents = await eventRepo.findOneBy({ Id: eventId });

      if (!findEvents) {
        return res.status(404).json({ message: "Events Not Found" });
      }
      const deleteEvents = await eventRepo.createQueryBuilder()
        .delete()
        .from(EventEntity)
        .where('Id= :Id', { Id: eventId })
        .execute();

      return res.status(200).json({ message: "Event deleted successfully", deleteEvents })
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async paymentSuccess(req: Request, res: Response, next: NextFunction) {
    //
    const connection = await dbUtils.getDefaultConnection()
    const memberRepository = connection.getRepository(Member);
    const eventRepo = await connection.getRepository(EventEntity)
    try {
      const memberId = req.body.udf1
      const eventId = req.body.udf2
      const eventInfo = req.body.productinfo
      const email = req.body.email
      const time = req.body.udf3
      const date = req.body.udf4

      if (memberId && eventId) {
        const eventExists: any = await eventRepo.findOneBy({ Id: eventId });
        const member = await memberRepository.findOne({
          where:
            { id: memberId },
          relations: ['events'],
          loadEagerRelations: true,
        });

        if (member) {
          member.events.push(eventExists);
          await memberRepository.save(member)
          generateQRCode(memberId, eventId, eventInfo, email, time, date)
          res.redirect("http://localhost:3000/admin/payment/success")
          return res.status(200).json({ message: "Enrolled", data: member })
          
        } else {
          return res.status(404).json({ message: "Member not found" });
        }
      }
      return res.status(404).json({ message: "Member not found" });
    } catch (error) {
      console.log(error)
      return
    }
  }
  async paymentFailure(req: Request, res: Response, next: NextFunction) {
    try {
      const paymentData = req.body;
      console.log(paymentData)
      return res.redirect("http://localhost:3000/admin/payment/fail")
    } catch (error) {
      console.log(error)
    }
  }

  async enrollFreeEvent(req: Request, res: Response, next: NextFunction) {
    //
    const memberId = req.decoded.member.id
    const eventId = req.body.event.events_Id
    try {
      const connection = await dbUtils.getDefaultConnection();
      const eventRepo = await connection.getRepository(EventEntity)

      const eventExists: any = await eventRepo.findOneBy({ Id: eventId });
      if (!eventExists) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      const memberRepository = connection.getRepository(Member);
      const member = await memberRepository.findOne({
        where:
          { id: memberId },
        relations: ['events'],
        loadEagerRelations: true,
      });

      if (member?.events.some((event: any) => event.Id === eventId)) {
        res.status(409).send({ message: "Already enrolled" });
        return
      }
      if (member) {
        member.events.push(eventExists);
        await memberRepository.save(member)
        generateQRCode(memberId, eventId, "Free Event", member.Email, "Free Event", "Free Event")
        res.status(200).json({ message: "Enrolled", data: member })
      } else {
        res.status(404).json({ message: "Member not found" });
      }

    } catch (error) {
      console.error("Error enrolling member in event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async enrollPaidEvent(req: Request, res: Response, next: NextFunction) {
    //
    const memberId = req.decoded.member.id
    const eventId = req.body.event.events_Id
    const eventsIsPaid = req.body.event.events_IsPaid

    try {
      const connection = await dbUtils.getDefaultConnection();
      const eventRepo = await connection.getRepository(EventEntity)

      const eventExists: any = await eventRepo.findOneBy({ Id: eventId });
      if (!eventExists) {
        res.status(404).json({ message: "Event not found" });
      }

      const memberRepository = connection.getRepository(Member);
      const member = await memberRepository.findOne({
        where:
          { id: memberId },
        relations: ['events'],
        loadEagerRelations: true,
      });

      if (member?.events.some((event: any) => event.Id === eventId)) {
        res.status(409).send({ message: "Already enrolled" });
      } else {
        res.status(200).send({ message: "not enrolled" });
      }

    } catch (error) {
      console.error("Error enrolling member in event:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async alreadyScanned(req: Request, res: Response, next: NextFunction) {
    debugger
    // const memberId = req.decoded.member.id
    // const eventId = req.body.eventId
  
    // try {
    //   const connection = await dbUtils.getDefaultConnection()
    //   const eventRepo = connection.getRepository(EventEntity)
    //   const memberRepo = connection.getRepository(Member)
    //   const eventExists: any = await eventRepo.findOneBy({ Id: eventId })
  
    //   if (!eventExists) {
    //     return res.status(404).json({ message: "Event not found" })
    //   }
  
    //   const memberExists = await memberRepo.findOne({
    //     where: {
    //       id: memberId
    //     },
    //     relations: ["events"],
    //     loadEagerRelations: true
    //   })
  
    //   if (memberExists?.events.some((event: any) => event.Id === eventId)) {
    //     return res.status(409).send({ message: "Already enrolled" })
    //   }
  
    //   if (memberExists) {
    //     memberExists.events.push(eventExists)
    //     await memberRepo.save(memberExists)
    //     return res.status(200).json({ message: "has been enrolled", data: memberExists })
    //   } else {
    //     return res.status(404).json({ message: "Member not found" })
    //   }
    // } catch (error) {
    //   console.log(error)
    //   return res.status(500).json({ message: "Internal server error" })
    // }

    const memberId = req.decoded.member.id;
    const eventId = req.body.eventId;

    try {
        const connection = await dbUtils.getDefaultConnection();
        const eventRepo = connection.getRepository(EventEntity);
        const memberRepo = connection.getRepository(Member);

        const event = await eventRepo.findOneBy({ Id: eventId });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const member = await memberRepo.findOne({
            where: { id: memberId },
            relations: ["events"]
        });

        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        const memberEvent:any = member.events.find(event => event.id === eventId);
        if (!memberEvent) {
            return res.status(409).send({ message: "Member not enrolled in event" });
        }

        if (memberEvent.isEventQrScanned) {
            return res.status(409).send({ message: "Event already scanned" });
        }

        memberEvent.isEventQrScanned = true;
        await memberRepo.save(member);

        return res.status(200).json({ message: "Event scanned successfully", data: member });
    } catch (error) {
        console.error("Error scanning event:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
  }

}

export default new EventController();
