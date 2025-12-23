import type { Express } from "express";
import MediaController from "../Controllers/MediaController.ts";
import { AuthMiddleware } from "../Middleware/AuthMiddleware.ts";



export  function mediaRoutes(app:Express) : void {

    const mediaController = new MediaController();

    app.get("/medias", AuthMiddleware, mediaController.getMedias.bind(mediaController));
    // app.get("/media/:id", mediaController.getMedia.bind(mediaController));
    // app.delete("/media/:id", mediaController.deleteMedia.bind(mediaController));

}