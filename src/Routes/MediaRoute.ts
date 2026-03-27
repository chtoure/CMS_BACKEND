import type { Express } from "express";
import MediaController from "../Controllers/MediaController.ts";
import { multerErrorHandler, upload } from "../Config/multer.config.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { imageEditSchema, mediaDeleteSchema, mediaSchema, mediaUpdateSchema } from "../Utils/Validations/MediaSchema.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";
import { requirePermission } from "../Middleware/PermissionMiddleware.ts";


export  function mediaRoutes(app:Express) : void {

    const mediaController = new MediaController();

    app.get("/medias", AuthMiddleware, requirePermission("read_media"), mediaController.getMedias.bind(mediaController));
    app.get("/media/:id", AuthMiddleware, requirePermission("read_media"), mediaController.getMedia.bind(mediaController));
    app.delete("/media/", AuthMiddleware, requirePermission("delete_media"), validateBody(mediaDeleteSchema), mediaController.deleteMedia.bind(mediaController));
    app.delete("/media/:id", AuthMiddleware, requirePermission("delete_media"), mediaController.deleteMedia.bind(mediaController));
    app.post("/media", AuthMiddleware, requirePermission("upload_media"), validateBody(mediaSchema), upload.single("file"), multerErrorHandler, mediaController.createMedia.bind(mediaController));
    app.put("/media/image/:id", AuthMiddleware, requirePermission("edit_image"), validateBody(imageEditSchema), mediaController.editImage.bind(mediaController))
    app.put("/media/update/:id", AuthMiddleware, requirePermission("update_media"), validateBody(mediaUpdateSchema), mediaController.updateMedia.bind(mediaController))

}