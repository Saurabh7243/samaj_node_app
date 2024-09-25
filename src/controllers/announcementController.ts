import { NextFunction, Request, Response } from "express";
// import fileUpload from "express-fileupload";
import dbUtils from "../utils/db.utils";
import Announcement from "../models/announcement";
class AnnouncementController {

  async createNews(req: Request, res: Response, next: NextFunction) {
    //
    try {
      let tenantId: any = req.decoded.member.TenantId.id;
      let memberId: any = req.decoded.member.id;
      const connection = await dbUtils.getDefaultConnection();
      const announcementRepo = connection.getRepository(Announcement);
      const { title, description } = req.body;

      const imagePath = req.file?.path.trim();

      const dateFn = () => {
        let date = new Date();
        return new Date(
          date.getUTCDay(),
          date.getUTCMonth() + 1,
          date.getUTCFullYear()
        )
          .toISOString()
          .slice(0, 10);
      };

      const news = announcementRepo.create({
        Tittle: title,
        Description: description,
        IsActive: true,
        CreatedDate: dateFn(),
        TenantId: tenantId,
        MemberId: memberId,
        ImageUrl:imagePath
      });

      await announcementRepo.save(news);
      return res.status(200).json({ message: "news saved successfully", data: news });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }

  async showNews(req: Request, res: Response, next: NextFunction) {
    let tenantId: any = req.decoded.member.TenantId.id;
    let memberId: any = req.decoded.member.id;
    const connection = await dbUtils.getDefaultConnection();
    const announcementRepo = connection.getRepository(Announcement);

    try {
      const news = await announcementRepo
        .createQueryBuilder("news")
        .select(["news.id", "news.Tittle", "news.Description","news.ImageUrl"])
        .leftJoinAndSelect("news.MemberId", "MemberId")
        .cache(true)
        .where("news.TenantId =:TenantId", { TenantId: tenantId })
        .getRawMany();

      return res.status(200).json({ news });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }

  async getNews(req: Request, res: Response, next: NextFunction) {
    
    const {newsId} = req.body;
    const connection = await dbUtils.getDefaultConnection();
    const announcementRepo = connection.getRepository(Announcement);

    try {
      const news = await announcementRepo
        .createQueryBuilder("news")
        .select(["news.id", "news.Tittle", "news.Description","news.ImageUrl"])
        .cache(true)        
        .where("news.id =:id", { id: newsId })
        .getRawOne();

      return res.status(200).json({ news });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }
  
  async updateNews(req: Request, res: Response, next: NextFunction) {
    ;
    const { title, description, newsId } = req.body;
    const connection = await dbUtils.getDefaultConnection();
    const announcementRepo = connection.getRepository(Announcement);
  
    try {
      const updateNews =await announcementRepo.update(
        {id:newsId},
        {Tittle:title,Description:description},        
      );
      if (updateNews.affected === 1) {        
        const updatedNews = await announcementRepo.findOne(newsId);
        return res.status(200).json({ news: updatedNews });
      } else {
        return res.status(404).json({ message: "News not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  }
  
    
}

export default new AnnouncementController();
