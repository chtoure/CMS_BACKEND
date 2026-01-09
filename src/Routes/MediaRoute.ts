import type { Express } from "express";
import MediaController from "../Controllers/MediaController.ts";
import { multerErrorHandler, upload } from "../Config/multer.config.ts";
import validateBody from "../Middleware/ValidateBoody.ts";
import { imageEditSchema, mediaDeleteSchema, mediaSchema } from "../Utils/Validations/MediaSchema.ts";


export  function mediaRoutes(app:Express) : void {

    const mediaController = new MediaController();

    app.get("/medias", mediaController.getMedias.bind(mediaController));
    app.get("/media/:id", mediaController.getMedia.bind(mediaController));
    app.delete("/media/", validateBody(mediaDeleteSchema), mediaController.deleteMedia.bind(mediaController));
    app.delete("/media/:id", mediaController.deleteMedia.bind(mediaController));
    app.post("/media",validateBody(mediaSchema),  upload.single("file"), multerErrorHandler, mediaController.createMedia.bind(mediaController));
    app.put("/media/:id", validateBody(imageEditSchema),  mediaController.editImage.bind(mediaController))

}