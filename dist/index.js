import {
  AppError,
  EmailService,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_OK,
  HTTP_STATUS_UNAUTHORIZED,
  UserService,
  getErrorStatus,
  handlePrismaError
} from "./chunk-T4HQAV4F.js";
import {
  SectionService
} from "./chunk-PMVX3PTM.js";
import {
  BlocTemplateService,
  ComponentService,
  ContentEntryService,
  MediaService
} from "./chunk-SERHJ7EL.js";
import {
  Paginator,
  PrismaClient_default
} from "./chunk-A6KLEGV2.js";

// src/index.ts
import express from "express";
import dotenv2 from "dotenv";

// src/Middleware/ValidateBoody.ts
var validateBody = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const messages = error.details.map((err) => err.message);
      res.status(HTTP_STATUS_BAD_REQUEST).json({ erreurs: messages });
      console.log(messages);
      return;
    }
    req.body = value;
    next();
  };
};
var ValidateBoody_default = validateBody;

// src/Utils/file.ts
import fs from "fs";
import path from "path";
function deleteFile(file_path) {
  try {
    const cleanPath = file_path.startsWith("/") ? file_path.substring(1) : file_path;
    const absolutePath = path.join(process.cwd(), cleanPath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log(`Fichier supprim\xE9 : ${absolutePath}`);
    }
  } catch (error) {
    console.error(`Erreur lors de la suppression physique : ${error}`);
  }
}

// src/Controllers/MediaController.ts
import path2 from "path";
import sharp from "sharp";

// src/Utils/queryFilter.ts
import "express";
var RequestHelper = class {
  static getFilters(req) {
    const filters = {};
    if (req.query.type && typeof req.query.type === "string") {
      filters.type = req.query.type.split(",");
    }
    if (req.query.page) filters.page = Number(req.query.page);
    if (req.query.limit) filters.limit = Number(req.query.limit);
    if (req.query.search) filters.search = req.query.search;
    if (req.query.status) filters.status = req.query.status;
    if (req.query.archive) filters.archive = req.query.archive === "true" ? true : req.query.archive === "false" ? false : void 0;
    return filters;
  }
  static getContenusFilters(req) {
    const filters = {};
    if (req.query.mode) filters.mode = req.query.mode;
    if (req.query.limit) filters.limit = Number(req.query.limit);
    if (req.query.sortBy) filters.sortBy = req.query.sortBy;
    if (req.query.order) filters.order = req.query.order;
    if (req.query.taxonomyFilters) filters.taxonomyFilters = req.query.taxonomyFilters;
    return filters;
  }
};

// src/Utils/fileMetaData.ts
import { imageSize as sizeOf } from "image-size";
import ffmpegModule from "fluent-ffmpeg";
import fs2 from "fs";
var ffmpeg = ffmpegModule;
var getExtendedMetadata = async (file, type) => {
  const metadata = {
    size: file.size,
    mimetype: file.mimetype,
    extension: file.originalname.split(".").pop() || ""
  };
  if (!file.path) return metadata;
  try {
    if (type === "image") {
      const buffer = fs2.readFileSync(file.path);
      const dims = sizeOf(buffer);
      metadata.width = dims.width;
      metadata.height = dims.height;
    } else if (type === "video") {
      const videoData = await new Promise((resolve) => {
        ffmpeg.ffprobe(file.path, (err, data) => {
          if (err) {
            console.error("Erreur ffprobe:", err);
            return resolve({});
          }
          const stream = data.streams.find((s) => s.codec_type === "video");
          resolve({
            width: stream?.width,
            height: stream?.height,
            duration: data.format.duration
          });
        });
      });
      if (videoData.width) metadata.width = videoData.width;
      if (videoData.height) metadata.height = videoData.height;
      if (videoData.duration) metadata.duration = videoData.duration;
    }
  } catch (e) {
    console.error("Erreur lors de l'extraction des m\xE9tadonn\xE9es:", e);
  }
  return metadata;
};

// src/Controllers/MediaController.ts
import fs3 from "fs";
var MediaController = class {
  mediaService;
  constructor() {
    this.mediaService = new MediaService();
  }
  async getMedia(req, res) {
    const id = Number(req.params.id);
    try {
      const media = await this.mediaService.getMediaById(id);
      if (!media) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "M\xE9dia non trouv\xE9" });
      }
      const mediaUrl = `${process.env.APP_URL}${media.file_path}`;
      media.file_path = mediaUrl;
      return res.status(HTTP_STATUS_OK).json(media);
    } catch (error) {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur lors de la r\xE9cup\xE9ration du m\xE9dia", details: error });
    }
  }
  async getMedias(req, res) {
    try {
      const filters = RequestHelper.getFilters(req);
      const mediaList = await this.mediaService.getAllMedia(filters);
      const baseUrl = `${process.env.APP_URL}`;
      const results = mediaList.results.map((media) => ({
        ...media,
        file_path: `${baseUrl}${media.file_path}`
      }));
      const paginateData = { ...mediaList, results };
      return res.status(HTTP_STATUS_OK).json(paginateData);
    } catch (error) {
      console.log(error);
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la r\xE9cup\xE9ration des m\xE9dias",
        details: error
      });
    }
  }
  async deleteMedia(req, res) {
    const id = Number(req.params?.id);
    let ids = req.body?.ids;
    try {
      if (!isNaN(id)) {
        ids = [id];
      } else if (!(ids && Array.isArray(ids))) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "ID de m\xE9dia invalide" });
      }
      const mediasToDelete = await this.mediaService.getMediaByIds(ids);
      if (!mediasToDelete || mediasToDelete.length === 0) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Aucun m\xE9dia trouv\xE9" });
      }
      mediasToDelete.forEach((media) => {
        deleteFile(media.file_path);
      });
      const result = await this.mediaService.deleteMedias(ids);
      return res.status(HTTP_STATUS_OK).json({
        message: `${result} m\xE9dia(s) supprim\xE9(s) (BDD + Disque).`
      });
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la suppression",
        details: error
      });
    }
  }
  async createMedia(req, res) {
    try {
      if (!req.file) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Aucun fichier t\xE9l\xE9charg\xE9" });
      }
      const mediaPayload = req.body;
      const mimetype = req.file.mimetype;
      const filename = req.file.filename;
      if (mimetype.startsWith("image/")) {
        mediaPayload.file_path = `media/uploads/images/${filename}`;
        mediaPayload.type = "image";
      } else if (mimetype.startsWith("video/")) {
        mediaPayload.file_path = `media/uploads/videos/${filename}`;
        mediaPayload.type = "video";
      } else if (mimetype.includes("pdf") || mimetype.includes("msword") || mimetype.includes("officedocument") || mimetype.startsWith("text/")) {
        mediaPayload.file_path = `media/uploads/documents/${filename}`;
        mediaPayload.type = "document";
      } else if (mimetype.includes("zip") || mimetype.includes("x-rar") || mimetype.includes("tar") || mimetype.includes("compressed")) {
        mediaPayload.file_path = `media/uploads/archives/${filename}`;
        mediaPayload.type = "archive";
      } else {
        mediaPayload.file_path = `media/uploads/others/${filename}`;
        mediaPayload.type = "other";
      }
      const meta = await getExtendedMetadata(req.file, mediaPayload.type);
      mediaPayload.size = meta.size;
      mediaPayload.width = meta.width;
      mediaPayload.height = meta.height;
      mediaPayload.duration = meta.duration;
      mediaPayload.pageCount = meta.pageCount;
      const newMedia = await this.mediaService.createMedia(mediaPayload);
      return res.status(HTTP_STATUS_OK).json(newMedia);
    } catch (error) {
      console.error("CreateMedia Error:", error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la cr\xE9ation du m\xE9dia",
        details: error instanceof Error ? error.message : error
      });
    }
  }
  async editImage(req, res) {
    try {
      const { id } = req.params;
      const { geometry, adjustments } = req.body;
      const media = await this.mediaService.getMediaById(Number(id));
      if (!media) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "M\xE9dia non trouv\xE9" });
      }
      const originalAbsolutePath = path2.join(process.cwd(), media.file_path);
      const fileExt = path2.extname(media.file_path);
      const fileName = path2.basename(media.file_path, fileExt);
      const newFileName = `${fileName}_edited_${Date.now()}${fileExt}`;
      const newRelativePath = path2.join("media/uploads/images/", newFileName).replace(/\\/g, "/");
      const newAbsolutePath = path2.join(process.cwd(), newRelativePath);
      let pipeline = sharp(originalAbsolutePath).rotate();
      if (geometry && geometry.crop) {
        pipeline = pipeline.extract({
          left: Math.max(0, Math.round(geometry.crop.x)),
          top: Math.max(0, Math.round(geometry.crop.y)),
          width: Math.round(geometry.crop.width),
          height: Math.round(geometry.crop.height)
        });
      }
      if (geometry.rotation) {
        pipeline = pipeline.rotate(geometry.rotation);
      }
      if (geometry.flipH) pipeline = pipeline.flop();
      if (geometry.flipV) pipeline = pipeline.flip();
      if (adjustments) {
        if (adjustments.grayscale) pipeline = pipeline.grayscale();
        if (adjustments.blur) pipeline = pipeline.blur(adjustments.blur);
      }
      await pipeline.toFile(newAbsolutePath);
      const stats = await fs3.promises.stat(newAbsolutePath);
      const meta = await getExtendedMetadata(
        {
          path: newAbsolutePath,
          size: stats.size,
          mimetype: `image/${fileExt.replace(".", "")}`,
          originalname: newFileName
        },
        "image"
      );
      const newMedia = await this.mediaService.createMedia({
        alt: media.alt,
        file_path: newRelativePath,
        type: "image",
        size: meta.size,
        width: meta.width || null,
        height: meta.height || null,
        duration: meta.duration || null,
        pageCount: meta.pageCount || null
      });
      return res.status(HTTP_STATUS_OK).json({
        message: "Nouvelle image cr\xE9\xE9e avec succ\xE8s",
        media: newMedia
      });
    } catch (error) {
      console.error("Erreur EditImage:", error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors du traitement de l'image"
      });
    }
  }
  async updateMedia(req, res) {
    try {
      const id = Number(req.params.id);
      const { alt } = req.body;
      if (!alt) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Alt manquant" });
      }
      const updatedMedia = await this.mediaService.updateMedia(id, { alt });
      return res.status(HTTP_STATUS_OK).json(updatedMedia);
    } catch (error) {
      console.error("Erreur UpdateMedia:", error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la mise \xE0 jour du m\xE9dia"
      });
    }
  }
};

// src/Config/multer.config.ts
import multer from "multer";
import path3 from "path";
import fs4 from "fs";

// src/Utils/Constantes/config.constant.ts
var mimeTypes = [
  // Images
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  // Vidéos
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  // Documents
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  // .docx
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  // .xlsx
  "text/plain",
  // Archives (Compressés)
  "application/zip",
  "application/x-zip-compressed",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-7z-compressed"
];

// src/Config/multer.config.ts
var baseUploadDir = path3.join(process.cwd(), "media", "uploads");
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let subDir = "others";
    if (file.mimetype.startsWith("image/")) {
      subDir = "images";
    } else if (file.mimetype.startsWith("video/")) {
      subDir = "videos";
    } else if (file.mimetype.includes("pdf") || file.mimetype.includes("msword") || file.mimetype.includes("officedocument") || file.mimetype.startsWith("text/")) {
      subDir = "documents";
    } else if (file.mimetype.includes("zip") || file.mimetype.includes("x-rar") || file.mimetype.includes("tar") || file.mimetype.includes("compressed")) {
      subDir = "archives";
    }
    const finalDir = path3.join(baseUploadDir, subDir);
    if (!fs4.existsSync(finalDir)) {
      fs4.mkdirSync(finalDir, { recursive: true });
    }
    cb(null, finalDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
    const originalExtension = path3.extname(file.originalname);
    cb(null, uniqueSuffix + originalExtension);
  }
});
var fileFilter = (req, file, cb) => {
  if (mimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new multer.MulterError(
        "LIMIT_UNEXPECTED_FILE",
        `Type ${file.mimetype} non autoris\xE9`
      )
    );
  }
};
function multerErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_FILE_SIZE":
        return res.status(413).json({
          message: "Fichier trop volumineux (max 50 Mo)"
        });
      case "LIMIT_UNEXPECTED_FILE":
        return res.status(415).json({
          message: err.message || "Type de fichier non autoris\xE9"
        });
      default:
        return res.status(400).json({
          message: err.message
        });
    }
  }
  next(err);
}
var upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024
  }
});

// src/Utils/Validations/MediaSchema.ts
import Joi from "joi";
var mediaSchema = Joi.object({
  alt: Joi.string().allow(null, "").max(255).messages({
    "string.max": "Le texte alternatif ne doit pas d\xE9passer 255 caract\xE8res."
  }),
  type: Joi.string().optional()
});
var mediaDeleteSchema = Joi.object({
  ids: Joi.array().items(Joi.number().integer().positive()).min(1).optional().messages({
    "array.base": "Le champ 'ids' doit \xEAtre un tableau de nombres.",
    "array.min": "Le tableau 'ids' doit contenir au moins un \xE9l\xE9ment."
  })
});
var imageEditSchema = Joi.object({
  geometry: Joi.object({
    rotation: Joi.number().integer().min(0).max(359).default(0),
    flipH: Joi.boolean().default(false),
    flipV: Joi.boolean().default(false),
    crop: Joi.object({
      x: Joi.number().integer().min(0).required(),
      y: Joi.number().integer().min(0).required(),
      width: Joi.number().integer().min(1).required(),
      height: Joi.number().integer().min(1).required()
    }).optional()
  }).optional(),
  adjustments: Joi.object({
    brightness: Joi.number().min(0).max(2).default(1),
    contrast: Joi.number().min(0).max(2).default(1),
    saturation: Joi.number().min(0).max(2).default(1),
    blur: Joi.number().min(0).max(100).default(0),
    grayscale: Joi.boolean().default(false)
  }).optional(),
  bgRemoved: Joi.boolean().optional()
}).min(1);
var mediaUpdateSchema = Joi.object({
  alt: Joi.string().allow(null, "").max(255).messages({
    "string.max": "Le texte alternatif ne doit pas d\xE9passer 255 caract\xE8res."
  })
});

// src/Services/AuthService.ts
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
var userService = new UserService();
var AuthService = class _AuthService {
  createAccesToken(userId, full_name, role) {
    const ACCESS_SECRET = process.env.ACCESS_SECRET || "SECRET_ACCESS_KEY";
    const ACCESS_EXPIRY = process.env.ACCESS_EXPIRY || "15m";
    const accessOptions = {
      expiresIn: ACCESS_EXPIRY
    };
    const accessPayload = { sub: userId, full_name, role };
    const accessToken = jwt.sign(accessPayload, ACCESS_SECRET, accessOptions);
    return accessToken;
  }
  async createRefreshToken(userId) {
    const REFRESH_SECRET = process.env.REFRESH_SECRET || "SECRET_REFRESH_KEY";
    const REFRESH_EXPIRY = process.env.REFRESH_EXPIRY || "7d";
    const refreshOptions = {
      expiresIn: REFRESH_EXPIRY
    };
    const refreshPayload = { sub: userId, jti: uuidv4() };
    const refreshToken = jwt.sign(refreshPayload, REFRESH_SECRET, refreshOptions);
    const userMod = await userService.updateUser(userId, { "refreshToken": refreshToken });
    if (userMod == null) {
      console.log("Erreur Refresh token n'a pas \xE9t\xE9 enregistrer");
      return null;
    }
    return refreshToken;
  }
  // Crée un Access Token et un Refresh Token pour un utilisateur donné.
  async createTokens(userId, full_name, role) {
    const accessToken = this.createAccesToken(userId, full_name, role);
    const refreshToken = await this.createRefreshToken(userId);
    if (!accessToken || !refreshToken) {
      console.log("AccesToken ou RefreshToken est ou sont null(s)");
      return null;
    }
    return { accessToken, refreshToken };
  }
  static isAccessTokenPayload(payload) {
    return typeof payload === "object" && payload !== null && typeof payload.sub === "number" && typeof payload.full_name === "string";
  }
  static isRefreshTokenPayload(payload) {
    if (typeof payload !== "object" || payload === null) return false;
    const p = payload;
    return typeof p.sub === "number" && typeof p.jti === "string";
  }
  // Verifier la validité de l'acces Token 
  verifyAccesToken(token) {
    try {
      const ACCESS_SECRET = process.env.ACCESS_SECRET ?? "SECRET_ACCESS_KEY";
      const decodedAccessToken = jwt.verify(token, ACCESS_SECRET);
      if (_AuthService.isAccessTokenPayload(decodedAccessToken)) {
        return decodedAccessToken;
      }
      return null;
    } catch (error) {
      console.log("Le token est invalide ou expir\xE9", error);
      return null;
    }
  }
  // Vérifie la validité du Refresh Token et s'il est présent en BDD.
  async verifyAndCheckRefreshToken(token) {
    try {
      const REFRESH_SECRET = process.env.REFRESH_SECRET ?? "SECRET_REFRESH_KEY";
      const payloadRefresh = jwt.verify(token, REFRESH_SECRET);
      if (!_AuthService.isRefreshTokenPayload(payloadRefresh)) {
        return null;
      }
      const user = await userService.getUserByToken(token);
      if (!user) {
        console.log("Erreur Refresh token n'a pas \xE9t\xE9 trouver en bd");
        return null;
      }
      return { payloadRefresh, user };
    } catch {
      return null;
    }
  }
  // Révoque le Refresh Token lors du logout ou d'une action de sécurité.
  async revokeRefreshToken(refreshToken) {
    try {
      const decoded = jwt.decode(refreshToken);
      if (_AuthService.isRefreshTokenPayload(decoded)) {
        console.log("R\xE9voquer le token pour user:", decoded.sub);
        const userRevoke = await userService.updateUser(decoded.sub, { "refreshToken": null });
        if (!userRevoke) {
          console.log("Erreur lors de la revokation de  Refresh token en bd");
          return false;
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erreur lors de la r\xE9vocation du refresh token:", error);
      return false;
    }
  }
};

// src/Middleware/AuthMiddleware.ts
var authService = new AuthService();
var AuthMiddleware = (req, res, next) => {
  let accessToken = req.cookies.access_token;
  if (!accessToken) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7);
    }
  }
  if (!accessToken) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({
      message: "Access Token manquant."
    });
  }
  const payload = authService.verifyAccesToken(accessToken);
  if (!payload) {
    return res.status(HTTP_STATUS_UNAUTHORIZED).json({
      message: "Access Token expir\xE9."
    });
  }
  req.user = payload;
  next();
};

// src/Services/PermissionService.ts
var PermissionService = class _PermissionService {
  static mapPermissions(permissions) {
    return permissions.map((p) => ({
      ...p,
      // On extrait l'objet 'role' de chaque entrée de la table pivot
      roles: p.roles?.map((rp) => rp.role) ?? []
    }));
  }
  static mapSinglePermission(permission) {
    return {
      ...permission,
      roles: permission.roles?.map((rp) => rp.role) ?? []
    };
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.archive !== void 0) {
      where.archive = filter.archive;
    }
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } }
      ];
    }
    return where;
  }
  // Creation d'une permission
  async createPermission(data) {
    const perms = await PrismaClient_default.permission.create({
      data,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    return _PermissionService.mapSinglePermission(perms);
  }
  // Creation de plusieurs permissions
  async createPermissions(data) {
    return PrismaClient_default.permission.createMany({
      data
    });
  }
  async getPermissions(filter) {
    const data = await Paginator.paginate(PrismaClient_default.permission, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    return {
      ...data,
      results: _PermissionService.mapPermissions(data.results)
    };
  }
  // Récupère une permission par ID
  async getPermissionById(id) {
    const permission = await PrismaClient_default.permission.findUnique({
      where: { id, archive: false },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    return _PermissionService.mapSinglePermission(permission);
  }
  // Récupère une permission par name
  async getPermissionByName(name) {
    const perms = await PrismaClient_default.permission.findUnique({
      where: { name, archive: false },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    return _PermissionService.mapSinglePermission(perms);
  }
  // Modifier une permission
  async updatePermission(id, userData) {
    const permission = await PrismaClient_default.permission.update({
      where: { id },
      data: userData,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    return _PermissionService.mapSinglePermission(permission);
  }
  // Archiver une permission 
  async deletePermission(id) {
    const perm = await PrismaClient_default.permission.update({
      where: { id, archive: false },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      data: {
        archive: true,
        archivedAt: /* @__PURE__ */ new Date()
      }
    });
    return _PermissionService.mapSinglePermission(perm);
  }
  // Restore une permission
  async RestorePermission(id) {
    const perm = await PrismaClient_default.permission.update({
      where: { id, archive: true },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      data: {
        archive: false,
        archivedAt: null
      }
    });
    return _PermissionService.mapSinglePermission(perm);
  }
  // Function : Prend Un tableau(Name Permissions) et retourne un tableau(Id Permission)
  async getPermissionsIdsByName(names) {
    const permissions = await PrismaClient_default.permission.findMany({
      where: {
        name: {
          in: names
        },
        archive: false
      },
      select: {
        id: true
        // Récupère [{id: 1}, {id: 2}, ...]
      }
    });
    return permissions.map((p) => p.id);
  }
  async getPermissionsByRoleId(roleId) {
    const permissions = await PrismaClient_default.permission.findMany({
      where: {
        roles: {
          some: {
            roleId
          }
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
    return _PermissionService.mapPermissions(permissions);
  }
};

// src/Middleware/PermissionMiddleware.ts
var permissionService = new PermissionService();
var requirePermission = (permissionName) => {
  return async (req, res, next) => {
    const roleId = req.user?.role?.id;
    if (!roleId) {
      return res.status(HTTP_STATUS_FORBIDDEN).json({
        message: "Acc\xE8s refus\xE9 : r\xF4le introuvable."
      });
    }
    const permissionsToCheck = Array.isArray(permissionName) ? permissionName : [permissionName];
    const permissions = await permissionService.getPermissionsByRoleId(roleId);
    const userPermissions = permissions?.map((p) => p.name) || [];
    const hasPermission = permissionsToCheck.some((p) => userPermissions.includes(p));
    if (!hasPermission) {
      return res.status(HTTP_STATUS_FORBIDDEN).json({
        message: `Acc\xE8s refus\xE9 : permission requise.`
      });
    }
    next();
  };
};

// src/Routes/MediaRoute.ts
function mediaRoutes(app2) {
  const mediaController = new MediaController();
  app2.get("/medias", AuthMiddleware, requirePermission("read_media"), mediaController.getMedias.bind(mediaController));
  app2.get("/media/:id", AuthMiddleware, requirePermission("read_media"), mediaController.getMedia.bind(mediaController));
  app2.delete("/media/", AuthMiddleware, requirePermission("delete_media"), ValidateBoody_default(mediaDeleteSchema), mediaController.deleteMedia.bind(mediaController));
  app2.delete("/media/:id", AuthMiddleware, requirePermission("delete_media"), mediaController.deleteMedia.bind(mediaController));
  app2.post("/media", AuthMiddleware, requirePermission("upload_media"), ValidateBoody_default(mediaSchema), upload.single("file"), multerErrorHandler, mediaController.createMedia.bind(mediaController));
  app2.put("/media/image/:id", AuthMiddleware, requirePermission("edit_image"), ValidateBoody_default(imageEditSchema), mediaController.editImage.bind(mediaController));
  app2.put("/media/update/:id", AuthMiddleware, requirePermission("update_media"), ValidateBoody_default(mediaUpdateSchema), mediaController.updateMedia.bind(mediaController));
}

// src/Services/CollectionService.ts
var CollectionService = class {
  async createCollection(data) {
    return PrismaClient_default.collection.create({
      data,
      include: { variables: true }
    });
  }
  // public async getAllCollections() {
  //     return prisma.collection.findMany({
  //         include: { 
  //             variables: true 
  //         },
  //         orderBy: { createdAt: 'desc' }
  //     });
  // }
  // CollectionService.ts
  async getAllCollections(search) {
    if (!search || search.trim() === "") {
      return PrismaClient_default.collection.findMany({
        include: { variables: true },
        orderBy: { createdAt: "desc" }
      });
    }
    const query = search.trim();
    return PrismaClient_default.collection.findMany({
      where: {
        variables: {
          some: {
            OR: [
              { name: { contains: query } },
              // 'mode' supprimé ici
              { value: { contains: query } }
              // 'mode' supprimé ici
            ]
          }
        }
      },
      include: {
        variables: {
          where: {
            OR: [
              { name: { contains: query } },
              { value: { contains: query } }
            ]
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
  async getCollectionById(id) {
    return PrismaClient_default.collection.findUnique({
      where: { id },
      include: { variables: true }
    });
  }
  async deleteCollection(id) {
    return PrismaClient_default.collection.delete({
      where: { id }
    });
  }
};

// src/Controllers/CollectionController.ts
var CollectionController = class {
  collectionService;
  constructor() {
    this.collectionService = new CollectionService();
  }
  // async getAllCollections(req: Request, res: Response) {
  //     try {
  //         const collections = await this.collectionService.getAllCollections();
  //         return res.status(HTTP_STATUS_OK).json(collections);
  //     } catch (error) {
  //         return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ 
  //             error: "Erreur lors de la récupération des collections", 
  //             details: error 
  //         });
  //     }
  // }
  // CollectionController.ts
  async getAllCollections(req, res) {
    try {
      const searchQuery = req.query.search;
      console.log("ma recherche:", searchQuery);
      const collections = await this.collectionService.getAllCollections(searchQuery);
      console.log("ma collection:", collections);
      return res.status(HTTP_STATUS_OK).json(collections);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la r\xE9cup\xE9ration des collections",
        details: error instanceof Error ? error.message : error
      });
    }
  }
  async createCollection(req, res) {
    try {
      const { name, type } = req.body;
      if (!name || !type) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Nom et type requis" });
      }
      const newCollection = await this.collectionService.createCollection({ name, type });
      return res.status(HTTP_STATUS_OK).json(newCollection);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la cr\xE9ation de la collection",
        details: error
      });
    }
  }
  async deleteCollection(req, res) {
    try {
      const id = Number(req.params.id);
      await this.collectionService.deleteCollection(id);
      return res.status(HTTP_STATUS_OK).json({ message: "Collection supprim\xE9e" });
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur suppression", details: error });
    }
  }
};

// src/Services/VariableService.ts
var VariableService = class {
  async createVariable(data) {
    return PrismaClient_default.variable.create({
      data
    });
  }
  async updateVariable(id, data) {
    return PrismaClient_default.variable.update({
      where: { id },
      data
    });
  }
  async deleteVariable(id) {
    return PrismaClient_default.variable.delete({
      where: { id }
    });
  }
  async deleteVariables(ids) {
    const result = await PrismaClient_default.variable.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    return result.count;
  }
  async getVariablesByCollection(collectionId) {
    return PrismaClient_default.variable.findMany({
      where: { collectionId },
      orderBy: { name: "asc" }
    });
  }
  async getVariableById(id) {
    return PrismaClient_default.variable.findUnique({
      where: { id },
      include: { collection: true }
    });
  }
  async getAllVariables() {
    return PrismaClient_default.variable.findMany({
      orderBy: { name: "asc" },
      include: { collection: true }
    });
  }
};

// src/Utils/validateType.ts
var validateValueByType = (type, value) => {
  switch (type) {
    case "COLOR":
      return /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(String(value));
    case "NUMBER":
      return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
    case "BOOLEAN":
      const val = String(value).toLowerCase();
      return val === "true" || val === "false" || val === "0" || val === "1";
    case "STRING":
      return typeof value === "string";
    default:
      return false;
  }
};

// src/Controllers/VariableController.ts
var VariableController = class {
  variableService;
  collectionService;
  constructor() {
    this.variableService = new VariableService();
    this.collectionService = new CollectionService();
  }
  async getAllVariables(req, res) {
    try {
      const variables = await this.variableService.getAllVariables();
      return res.status(HTTP_STATUS_OK).json(variables);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur r\xE9cup\xE9ration variables", details: error });
    }
  }
  async getVariableById(req, res) {
    try {
      const id = Number(req.params.id);
      const variable = await this.variableService.getVariableById(id);
      return res.status(HTTP_STATUS_OK).json(variable);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur r\xE9cup\xE9ration variable", details: error });
    }
  }
  async createVariable(req, res) {
    try {
      const { name, value, collectionId } = req.body;
      if (!name || value === void 0 || !collectionId) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Donn\xE9es manquantes" });
      }
      const collection = await this.collectionService.getCollectionById(collectionId);
      if (!collection) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Collection introuvable" });
      }
      if (!validateValueByType(collection.type, value)) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({
          error: `La valeur fournie n'est pas valide pour le type ${collection.type}`
        });
      }
      const newVariable = await this.variableService.createVariable({ name, value, collectionId });
      return res.status(HTTP_STATUS_OK).json(newVariable);
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur cr\xE9ation variable", details: error });
    }
  }
  async updateVariable(req, res) {
    try {
      const id = Number(req.params.id);
      let { name, value } = req.body;
      const variable = await this.variableService.getVariableById(id);
      if (name == void 0) {
        name = variable?.name;
      }
      if (value == void 0) {
        value = variable?.value;
      }
      console.log("nanan", name, value);
      const collection = await this.collectionService.getCollectionById(variable?.collectionId || 0);
      if (!variable || !collection) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Variable introuvable" });
      }
      if (!validateValueByType(collection.type, value)) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({
          error: `Type invalide. Attendu: ${collection.type}`
        });
      }
      const updated = await this.variableService.updateVariable(id, { name, value });
      return res.status(HTTP_STATUS_OK).json(updated);
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur mise \xE0 jour", details: error });
    }
  }
  async deleteVariables(req, res) {
    try {
      const id = Number(req.params?.id);
      let ids = req.body?.ids;
      if (!isNaN(id)) {
        ids = [id];
      } else if (!Array.isArray(ids)) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "ID(s) invalide(s)" });
      }
      const count = await this.variableService.deleteVariables(ids);
      return res.status(HTTP_STATUS_OK).json({ message: `${count} variable(s) supprim\xE9e(s)` });
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: "Erreur suppression", details: error });
    }
  }
};

// src/Utils/Validations/VariableSchema.ts
import Joi2 from "joi";
var variableCreateSchema = Joi2.object({
  name: Joi2.string().min(1).required(),
  value: Joi2.string().required(),
  collectionId: Joi2.number().integer().required()
});
var variableUpdateSchema = Joi2.object({
  name: Joi2.string().min(1).optional(),
  value: Joi2.string().optional()
}).min(1);
var deleteMultipleSchema = Joi2.object({
  ids: Joi2.array().items(Joi2.number().integer()).min(1).required()
});

// src/Utils/Validations/CollectionSchema.ts
import Joi3 from "joi";
var collectionSchema = Joi3.object({
  name: Joi3.string().min(2).max(50).required(),
  type: Joi3.string().valid("COLOR", "NUMBER", "STRING", "BOOLEAN").required()
});

// src/Routes/VariableRoute.ts
function variableRoutes(app2) {
  const collectionController = new CollectionController();
  const variableController = new VariableController();
  app2.get("/collections", AuthMiddleware, requirePermission("read_collection"), collectionController.getAllCollections.bind(collectionController));
  app2.post("/collections", AuthMiddleware, requirePermission("create_collection"), ValidateBoody_default(collectionSchema), collectionController.createCollection.bind(collectionController));
  app2.delete("/collections/:id", AuthMiddleware, requirePermission("delete_collection"), collectionController.deleteCollection.bind(collectionController));
  app2.post("/variables", AuthMiddleware, requirePermission("create_variable"), ValidateBoody_default(variableCreateSchema), variableController.createVariable.bind(variableController));
  app2.put("/variables/:id", AuthMiddleware, requirePermission("update_variable"), ValidateBoody_default(variableUpdateSchema), variableController.updateVariable.bind(variableController));
  app2.delete("/variables/", AuthMiddleware, requirePermission("delete_variable"), ValidateBoody_default(deleteMultipleSchema), variableController.deleteVariables.bind(variableController));
  app2.delete("/variables/:id", AuthMiddleware, requirePermission("delete_variable"), variableController.deleteVariables.bind(variableController));
  app2.get("/variables", variableController.getAllVariables.bind(variableController));
  app2.get("/variables/:id", variableController.getVariableById.bind(variableController));
}

// src/Utils/Scripts/SetAuthCookies.ts
var ACCESS_COOKIE_MAXAGE = 15 * 60 * 1e3;
var REFRESH_COOKIE_MAXAGE = 7 * 24 * 60 * 60 * 1e3;
function SetAccesCookie(res, accessToken) {
  const isSecure = res.req.secure || res.req.get("x-forwarded-proto") === "https";
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isSecure,
    maxAge: ACCESS_COOKIE_MAXAGE,
    // Si c'est sécurisé, on met 'none' pour le cross-domain
    // Si c'est HTTP, on met 'lax' (sinon le cookie sera rejeté)
    sameSite: isSecure ? "none" : "lax"
  });
}
function SetRefreshCookie(res, refreshToken) {
  const isSecure = res.req.secure || res.req.get("x-forwarded-proto") === "https";
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isSecure,
    maxAge: REFRESH_COOKIE_MAXAGE,
    sameSite: isSecure ? "none" : "lax"
  });
}
function setAuthCookies(res, accessToken, refreshToken) {
  SetAccesCookie(res, accessToken);
  SetRefreshCookie(res, refreshToken);
}

// src/Services/RolePermissionService.ts
var RolePermissionService = class {
  static async CreateRolePermission(dataPermission) {
    return PrismaClient_default.rolePermission.create({
      data: dataPermission
    });
  }
  static async CreateRolePermissions(dataPermissions) {
    return PrismaClient_default.rolePermission.createMany({
      data: dataPermissions
      //skipDuplicates: true, // Ignore les associations déjà existantes
    });
  }
  static async createRolePermsByRoleId(roleId, permissionIds) {
    return PrismaClient_default.rolePermission.createMany({
      data: permissionIds.map((permissionId) => ({
        roleId,
        permissionId
      }))
    });
  }
  static async VerifyRolePermission(dataPermissions) {
    return PrismaClient_default.rolePermission.findFirst({
      where: {
        roleId: dataPermissions.roleId,
        permissionId: dataPermissions.permissionId
      }
    });
  }
  static async updateRolePermission(id, dataRolePerms) {
    return PrismaClient_default.rolePermission.update({
      where: { id },
      data: dataRolePerms
    });
  }
  // Supprimer toutes les relations (RolePermission) de role_id
  static async deleteRolePermsByRoleId(role_id) {
    return PrismaClient_default.rolePermission.deleteMany({
      where: { roleId: role_id }
    });
  }
  // Supprimer une relation (RolePermission) spécifique
  static async deleteRolePermission(whereData) {
    return PrismaClient_default.rolePermission.updateMany({
      where: { roleId: whereData.roleId, permissionId: whereData.permissionId, archive: false },
      data: {
        archive: true,
        archivedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  // Restore une relation (RolePermission) spécifique
  static async restoreRolePermission(whereData) {
    return PrismaClient_default.rolePermission.updateMany({
      where: { roleId: whereData.roleId, permissionId: whereData.permissionId, archive: true },
      data: {
        archive: false,
        archivedAt: null
      }
    });
  }
};

// src/Services/RoleService.ts
var RoleService = class _RoleService {
  // Transforme la structure Prisma (table pivot) en structure plate (permissions directes)
  static mapRoles(roles) {
    return roles.map((role) => ({
      ...role,
      // On extrait l'objet 'permission' de chaque entrée de la table pivot
      permissions: role.permissions?.map((rp) => rp.permission) ?? []
    }));
  }
  // Version pour un seul rôle
  static mapSingleRole(role) {
    return {
      ...role,
      permissions: role.permissions?.map((rp) => rp.permission) ?? []
    };
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.archive !== void 0) {
      where.archive = filter.archive;
    }
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } },
        { description: { contains: query } }
      ];
    }
    return where;
  }
  // Creation d'un role
  async createRole(data, permissionIds = []) {
    const role = await PrismaClient_default.role.create({
      data,
      include: {
        permissions: {
          include: { permission: true }
        },
        users: true
      }
    });
    if (permissionIds.length > 0) {
      const rolePermissionData = permissionIds.map((permissionId) => ({
        roleId: role.id,
        permissionId
      }));
      await RolePermissionService.CreateRolePermissions(rolePermissionData);
    }
    return _RoleService.mapSingleRole(role);
  }
  async getRoles(filter) {
    const roles = await Paginator.paginate(PrismaClient_default.role, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      include: {
        users: true,
        permissions: {
          include: {
            permission: true
            // On inclut l'objet Permission réel
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
    const resultRole = _RoleService.mapRoles(roles.results);
    return {
      ...roles,
      results: resultRole
    };
  }
  // Récupère un role par ID
  async getRoleById(id) {
    const role = await PrismaClient_default.role.findUnique({
      where: { id, archive: false },
      include: {
        permissions: {
          include: { permission: true }
        },
        users: true
      }
    });
    return _RoleService.mapSingleRole(role);
  }
  // Récupère un role par name
  async getRoleByName(name) {
    const role = await PrismaClient_default.role.findUnique({
      where: { name },
      include: {
        permissions: {
          include: { permission: true }
        },
        users: true
      }
    });
    return _RoleService.mapSingleRole(role);
  }
  // Update Role
  async updateRole(id, roleData, permissionIds) {
    const roleUpdated = await PrismaClient_default.role.update({
      where: { id },
      data: roleData,
      include: {
        permissions: true,
        users: true
      }
    });
    if (permissionIds) {
      await RolePermissionService.deleteRolePermsByRoleId(roleUpdated.id);
      const rolePermissionData = permissionIds.map((permissionId) => ({
        roleId: id,
        permissionId
      }));
      await RolePermissionService.CreateRolePermissions(rolePermissionData);
    }
    return this.getRoleById(roleUpdated.id);
  }
  // Archiver un  Role
  async deleteRole(id) {
    return PrismaClient_default.role.update({
      where: { id, archive: false },
      data: {
        archive: true,
        archivedAt: /* @__PURE__ */ new Date()
      }
    });
  }
  // Restorer un role archivé
  async restoreRole(id) {
    return PrismaClient_default.role.update({
      where: { id, archive: true },
      data: {
        archive: false,
        archivedAt: null
      }
    });
  }
  // Retirer la permission d'un role (Je souhaite le gerer avec l'archivage)
  async removePermissionFromRole(roleId, permissionId) {
    await RolePermissionService.deleteRolePermission({ roleId, permissionId });
    return this.getRoleById(roleId);
  }
  // Restore la permission  d'un role retirer
  async restorePermissionFromRole(roleId, permissionId) {
    await RolePermissionService.restoreRolePermission({ roleId, permissionId });
    return this.getRoleById(roleId);
  }
  // Ajouter des ou une permission(s) a un role deja existant
  async addPermissionsToRole(roleId, permissionIds) {
    let addPermissions = [];
    permissionIds.forEach(async (permissionId) => {
      const existantRolePerms = await RolePermissionService.VerifyRolePermission({ roleId, permissionId });
      if (!existantRolePerms) {
        addPermissions.push(permissionId);
      }
    });
    if (addPermissions.length > 0) {
      await RolePermissionService.createRolePermsByRoleId(roleId, addPermissions);
    }
    return this.getRoleById(roleId);
  }
  // recuperer les permission d'un role by id
  async getPermissions(roleId) {
    const roleWithPermissions = await PrismaClient_default.role.findUnique({
      where: { id: roleId, archive: false },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });
    return roleWithPermissions?.permissions.map((rp) => rp.permission) || [];
  }
};

// src/Controllers/AuthController.ts
import crypto from "crypto";
var userService2 = new UserService();
var authService2 = new AuthService();
var roleService = new RoleService();
var AuthController = class _AuthController {
  // Méthode privée réutilisable pour éviter la répétition
  static async handleAuthentification(res, user, message, status) {
    const tokens = await authService2.createTokens(user.id, user.full_name, user.role ?? null);
    if (!tokens) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Creation des tokens ont echou\xE9s" });
    }
    const { accessToken, refreshToken } = tokens;
    setAuthCookies(res, accessToken, refreshToken);
    return res.status(status).json({
      message,
      // Tokens aussi dans le JSON pour le fallback Bearer (si cookies bloqués en HTTP)
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        isLoggedIn: user.isLoggedIn
      }
    });
  }
  // Register ( Creation De Compte )
  async register(req, res) {
    const { full_name, email, role } = req.body;
    let roleData = null;
    try {
      const userExist = await userService2.getUserByEmail(email);
      if (userExist) {
        return res.status(HTTP_STATUS_CONFLICT).json({ message: "Cet email est d\xE9j\xE0 utilis\xE9." });
      }
      const confirmToken = crypto.randomBytes(32).toString("hex");
      if (role) {
        roleData = await roleService.getRoleByName(role);
        if (!roleData) {
          roleData = await roleService.createRole({ name: role });
        }
      }
      const newUser = await userService2.createUser({
        full_name,
        email,
        password_hash: "PENDING_PASSWORD_NOT_SET",
        role_id: roleData ? roleData.id : null,
        isLoggedIn: false,
        confirmationToken: confirmToken
      });
      const isSend = await EmailService.sendVerificationEmail(newUser.email, confirmToken);
      if (!isSend) {
        return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: "Erreur interne lors de la cr\xE9ation de l'utilisateur." });
      }
      const message = "Inscription r\xE9ussie. V\xE9rifier votre mail pour activer votre compte.";
      return _AuthController.handleAuthentification(res, newUser, message, HTTP_STATUS_CREATED);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await userService2.getUserByEmailNonArchive(email);
      if (!user) {
        console.log("Email Invalide");
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Identifiants invalides ou utilisateur archiv\xE9 ou en attente de confirmation." });
      }
      const isPasswordValid = await userService2.comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        console.log("Password Invalide");
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Identifiants invalides." });
      }
      const message = "Connexion Reussie.";
      return _AuthController.handleAuthentification(res, user, message, HTTP_STATUS_OK);
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Refresh Token Access
  async refreshToken(req, res) {
    const refreshToken = req.cookies.refresh_token || req.body?.refreshToken;
    try {
      if (!refreshToken) {
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: "Refresh Token manquant." });
      }
      const decodedPayload = await authService2.verifyAndCheckRefreshToken(refreshToken);
      if (!decodedPayload?.payloadRefresh) {
        console.log("Le token est invalide ou r\xE9voqu\xE9. Supprimer les cookies pour forcer la reconnexion.");
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: "Session invalide ou expir\xE9e. Veuillez vous reconnecter." });
      }
      const { payloadRefresh, user } = decodedPayload;
      const newAccessToken = authService2.createAccesToken(payloadRefresh.sub, user.full_name, user.role ?? null);
      SetAccesCookie(res, newAccessToken);
      return res.status(HTTP_STATUS_OK).json({
        message: "Access Token renouvel\xE9.",
        accessToken: newAccessToken
      });
    } catch (error) {
      console.error("Erreur lors de la renouvellement du token access", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Logout : Deconnexion
  async logout(req, res) {
    const refreshToken = req.cookies.refresh_token || req.body?.refreshToken;
    try {
      if (refreshToken) {
        await authService2.revokeRefreshToken(refreshToken).catch((err) => {
          console.error("Erreur lors de la r\xE9vocation BDD:", err);
        });
      }
    } catch (error) {
      console.error("Erreur lors de la d\xE9connexion:", error);
    } finally {
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
    }
    return res.status(HTTP_STATUS_NO_CONTENT).send("Deconnexion r\xE9ussie.");
  }
  // Reinitialisation du mot de passe (Forgot Password) && se connecter plus tard
  async reinitialisationPasswordLogin(req, res) {
    const { email, password } = req.body;
    try {
      const hashedPassword = await userService2.hashPassword(password);
      if (!hashedPassword) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Hachage du mot de passe a \xE9chou\xE9." });
      }
      const userModPassword = await userService2.updateUser(Number(req.params.id), { password_hash: hashedPassword, isLoggedIn: true });
      if (!userModPassword) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "La mise \xE0 jour du mot de passe a \xE9chou\xE9." });
      }
      return this.login(req, res);
    } catch (error) {
      console.error("Erreur lors de la r\xE9initialisation du mot de passe:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Renvoyer l'email de confirmation
  async sendConfirmationEmail(req, res) {
    try {
      const result = await userService2.resendConfirmationEmail(Number(req.params.id));
      if (!result) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "\xC9chec de l'envoi ou compte d\xE9j\xE0 valid\xE9." });
      }
      return res.status(HTTP_STATUS_OK).json({ message: "Email de confirmation envoy\xE9 avec succ\xE8s." });
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email de confirmation:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Confirmer si le message a été bien envoyé
  async confirmEmailReceipt(req, res) {
    const { token, email } = req.query;
    try {
      if (!token || !email) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Param\xE8tres de confirmation invalide." });
      const result = await userService2.confirmEmail(token, email);
      if (!result || !result.password) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Erreur lors de la confirmation de l'email." });
      }
      await EmailService.sendWelcome(result.user.email, result.password);
      return res.send(`
                    <!DOCTYPE html>
                    <html lang="fr">
                        <head>
                            <meta charset="UTF-8"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                        </head>
                        <body style="font-family: sans-serif;">
                            <div style="text-align:center; padding:50px; font-family: sans-serif;">
                                <div style="font-size: 50px;">\u{1F4E7}</div>
                                <h1 style="color: #312782;">V\xE9rification r\xE9ussie !</h1>
                                <p style="font-size: 18px; color: #4b5563;">
                                    Votre compte est maintenant actif.
                                </p>
                                <p style="background: #f3f4f6; padding: 15px; border-radius: 8px; display: inline-block;">
                                    <strong>Veuillez consulter votre bo\xEEte de r\xE9ception :</strong><br>
                                    Nous venons de vous envoyer vos identifiants de connexion.
                                </p>
                                <div style="margin-top: 20px;">
                                    <small>Vous pouvez fermer cette fen\xEAtre.</small>
                                </div>
                            </div>
                        </body>
                    </html>
                `);
    } catch (error) {
      console.error("Erreur lors de la confirmation de l'email:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/UserSchema.ts
import Joi4 from "joi";
var userRegisterSchema = Joi4.object({
  full_name: Joi4.string().min(3).required(),
  email: Joi4.string().email().lowercase().required(),
  password: Joi4.string().min(8),
  role: Joi4.string()
});
var userLoginSchema = Joi4.object({
  email: Joi4.string().email().lowercase().required(),
  password: Joi4.string().min(3).required()
});
var userUpdateSchema = Joi4.object({
  full_name: Joi4.string().min(3),
  email: Joi4.string().email().lowercase(),
  password: Joi4.string().min(8),
  role: Joi4.string()
});
var changePasswordSchema = Joi4.object({
  newPassword: Joi4.string().min(8).required()
});

// src/Controllers/EmailController.ts
var userService3 = new UserService();
var EmailController = class {
  async sendVerificationEmail(req, res) {
    const { toEmail } = req.body;
    try {
      const userByEmail = await userService3.getUserByEmail(toEmail);
      if (!userByEmail) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Utilisateur non trouv\xE9 avec cet email." });
      }
      const userCode = EmailService.generateOTP();
      const codeExpiration = EmailService.getExpirationDate(10);
      const success = await EmailService.sendVerificationCode(toEmail, userCode);
      if (success) {
        const updatedUser = await userService3.updateUser(userByEmail.id, {
          resetCode: userCode,
          codeExpiration
        });
        if (!updatedUser) {
          console.log("Failed to update user with code.");
          return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "\xC9chec de la mise \xE0 jour de l'utilisateur avec le code." });
        }
        res.status(HTTP_STATUS_OK).json({
          user: {
            id: updatedUser.id,
            full_name: updatedUser.full_name,
            email: updatedUser.email,
            role: updatedUser.role?.name ?? null,
            isLoggedIn: updatedUser.isLoggedIn
          },
          message: "Email de v\xE9rification envoy\xE9 avec succ\xE8s."
        });
      } else {
        res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "\xC9chec de l'envoi de l'email de v\xE9rification." });
      }
    } catch (error) {
      console.log("Erreur lors de l'envoi de l'email de v\xE9rification:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async verifyCode(req, res) {
    const { code } = req.body;
    const userId = Number(req.params.id);
    try {
      const user = await userService3.verifyResetCode(userId, code);
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Code invalide ou expir\xE9." });
      }
      await userService3.updateUser(user.id, { resetCode: null, codeExpiration: null });
      res.status(HTTP_STATUS_OK).json({ message: "Code v\xE9rifi\xE9 avec succ\xE8s. Vous pouvez r\xE9initialiser votre mot de passe." });
    } catch (error) {
      console.log("Erreur lors de la v\xE9rification du code:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Routes/AuthRoute.ts
function authRoutes(app2, validateBody3) {
  const authController = new AuthController();
  const emailController = new EmailController();
  app2.post("/register", AuthMiddleware, requirePermission("create_user"), validateBody3(userRegisterSchema), authController.register.bind(authController));
  app2.post("/login", validateBody3(userLoginSchema), authController.login.bind(authController));
  app2.post("/logout", authController.logout.bind(authController));
  app2.post("/refresh-token", authController.refreshToken.bind(authController));
  app2.post("/send-verification-code", emailController.sendVerificationEmail.bind(emailController));
  app2.post("/verify-code/:id", emailController.verifyCode.bind(emailController));
  app2.post("/reset-password/:id", validateBody3(userLoginSchema), authController.reinitialisationPasswordLogin.bind(authController));
  app2.post("/sendConfirmEmail/:id", authController.sendConfirmationEmail.bind(authController));
  app2.get("/confirm-receipt", authController.confirmEmailReceipt.bind(authController));
}

// src/Utils/VerifyExistenceEmail.ts
import axios from "axios";
var MailboxLayerService = class {
  // Ta clé API gratuite récupérée sur le tableau de bord MailboxLayer
  static API_KEY = process.env.API_KEY_VERIFY_EMAIL || "a62e3ee797602742473381531837016c";
  static BASE_URL = process.env.BASE_URL_VERIFY_EMAIL || "http://apilayer.net/api/check";
  /**
   * Vérifie si l'email existe réellement
   */
  static async checkExistence(email) {
    try {
      const response = await axios.get(this.BASE_URL, {
        params: {
          access_key: this.API_KEY,
          email,
          smtp: 1,
          // Très important : active la vérification réelle du compte
          format: 1
        }
      });
      const data = response.data;
      if (data.error) {
        console.error("Erreur API MailboxLayer:", data.error.info);
        return { success: true, message: "Validation ignor\xE9e (Erreur API)" };
      }
      if (!data.format_valid) {
        return { success: false, message: "Le format de l'email est incorrect." };
      }
      if (!data.mx_found) {
        return { success: false, message: "Le domaine de cet email n'existe pas." };
      }
      if (!data.smtp_check) {
        return { success: false, message: "Cet utilisateur n'existe pas sur ce serveur mail." };
      }
      if (data.disposable) {
        return { success: false, message: "Les emails jetables ne sont pas autoris\xE9s." };
      }
      return { success: true, message: "L'email est valide et existe." };
    } catch (error) {
      console.error("Erreur lors de l'appel MailboxLayer:", error);
      return { success: true, message: "Service de v\xE9rification indisponible, passage en mode manuel." };
    }
  }
};

// src/Controllers/UserController.ts
var userService4 = new UserService();
var roleService2 = new RoleService();
var UserController = class {
  async getUsers(req, res) {
    try {
      const filters = RequestHelper.getFilters(req);
      const users = await userService4.getAllUsers(filters);
      res.status(HTTP_STATUS_OK).json(users);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration des utilisateurs:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getUser(req, res) {
    try {
      const user = await userService4.getUserById(Number(req.params.id));
      if (!user) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Utilisateur non trouv\xE9 ou archiv\xE9" });
      res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration de l'utilisateur:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateUser(req, res) {
    const { password, email, role } = req.body;
    let roleData = null;
    try {
      if (password) {
        const password_hash = await userService4.hashPassword(password);
        if (!password_hash) {
          return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Hachage du password echouer" });
        }
        req.body.password_hash = password_hash;
        delete req.body.password;
      }
      if (email) {
        const userExist = await userService4.getUserByEmail(email);
        if (!userExist) {
          const isEmailValid = await MailboxLayerService.checkExistence(email);
          if (!isEmailValid.success) {
            console.log("Email non valide:", isEmailValid.message);
            return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: isEmailValid.message });
          }
        }
      }
      if (role) {
        roleData = await roleService2.getRoleByName(role);
        if (!roleData) {
          roleData = await roleService2.createRole({ name: role });
        }
        req.body.role_id = roleData.id;
        delete req.body.role;
      }
      const user = await userService4.updateUser(Number(req.params.id), req.body);
      res.status(HTTP_STATUS_OK).json({
        message: "Utilisateur mis \xE0 jour avec succ\xE8s",
        user: {
          id: user?.id,
          full_name: user?.full_name,
          email: user?.email,
          role: user?.role?.name ?? null
        }
      });
    } catch (error) {
      console.log("Erreur lors de la mise \xE0 jour de l'utilisateur:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // User archiver
  async archivedUser(req, res) {
    try {
      const user = await userService4.deleteUser(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
      console.log("Erreur lors de la suppression de l'utilisateur:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // restorer un utilisateur archivés
  async restoreUser(req, res) {
    try {
      const user = await userService4.restoreUser(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
      console.log("Erreur lors de la restauration de l'utilisateur:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async changePassword(req, res) {
    const { newPassword } = req.body;
    try {
      const userChangedPassword = await userService4.changeUserPassword(Number(req.params.id), newPassword);
      res.status(HTTP_STATUS_OK).json({
        message: "Mot de passe mis \xE0 jour avec succ\xE8s",
        user: {
          id: userChangedPassword?.id,
          full_name: userChangedPassword?.full_name,
          email: userChangedPassword?.email,
          role: userChangedPassword?.role?.name ?? null,
          isLoggedIn: userChangedPassword?.isLoggedIn
        }
      });
    } catch (error) {
      console.log("Erreur lors de la mise \xE0 jour du mot de passe:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deleteDefinitivelyUser(req, res) {
    try {
      const user = await userService4.deleteDefinitivelyUser(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(user);
    } catch (error) {
      console.log("Erreur lors de la suppression de l'utilisateur:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Routes/UserRoute.ts
function userRoutes(app2, validateBody3) {
  const userController = new UserController();
  app2.get("/users", AuthMiddleware, requirePermission("read_user"), userController.getUsers.bind(userController));
  app2.get("/users/:id", AuthMiddleware, requirePermission("read_user"), userController.getUser.bind(userController));
  app2.put("/users/:id", AuthMiddleware, requirePermission("update_user"), validateBody3(userUpdateSchema), userController.updateUser.bind(userController));
  app2.put("/archiveUsers/:id", AuthMiddleware, requirePermission("update_user"), userController.archivedUser.bind(userController));
  app2.put("/restoreUers/:id", AuthMiddleware, requirePermission("update_user"), userController.restoreUser.bind(userController));
  app2.put("/change-password/:id", validateBody3(changePasswordSchema), userController.changePassword.bind(userController));
  app2.delete("/deleteUsers/:id", AuthMiddleware, requirePermission("delete_user"), userController.deleteDefinitivelyUser.bind(userController));
}

// src/Controllers/RoleController.ts
var roleService3 = new RoleService();
var RoleController = class {
  // Methode : creation d'un role
  async createRole(req, res) {
    const { name, description, permissionIds } = req.body;
    try {
      let role;
      if (!permissionIds || permissionIds.length == 0) {
        role = await roleService3.createRole({ name, description });
        return res.status(HTTP_STATUS_CREATED).json(role);
      }
      role = await roleService3.createRole({ name, description }, permissionIds);
      return res.status(HTTP_STATUS_CREATED).json(role);
    } catch (error) {
      console.error("Erreur lors de la creation d'un role", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Recuperer tous les roles
  async getRoles(req, res) {
    try {
      const filter = RequestHelper.getFilters(req);
      const roles = await roleService3.getRoles(filter);
      return res.status(HTTP_STATUS_OK).json(roles);
    } catch (error) {
      console.error("Erreur lors de la recuperation des roles", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Recuperer un role par son id
  async getRoleById(req, res) {
    try {
      const role = await roleService3.getRoleById(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(role);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration d'un role:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Modifier un role
  async updateRole(req, res) {
    const { name, description, permissionIds } = req.body;
    try {
      let roleUpdated;
      if (!permissionIds || permissionIds.length == 0) {
        roleUpdated = await roleService3.updateRole(Number(req.params.id), { name, description });
        return res.status(HTTP_STATUS_OK).json(roleUpdated);
      }
      roleUpdated = await roleService3.updateRole(Number(req.params.id), { name, description }, permissionIds);
      return res.status(HTTP_STATUS_OK).json(roleUpdated);
    } catch (error) {
      console.error("Erreur lors de la modification d'un role", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Archiver un role
  async deleteRole(req, res) {
    try {
      const deletedRole = await roleService3.deleteRole(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(deletedRole);
    } catch (error) {
      console.log("Erreur lors de la suppression d'un role:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Restorer un role
  async restoreRole(req, res) {
    try {
      const deletedRole = await roleService3.restoreRole(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(deletedRole);
    } catch (error) {
      console.log("Erreur lors de la restauration d'un role:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  //Methode: Ajouter des ou une permission(s) a un role deja existant
  async addPermissionsToRole(req, res) {
    const { permissionIds } = req.body;
    try {
      if (!permissionIds || permissionIds.length == 0) {
        return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Aucune permission fournie pour l'ajout au role" });
      }
      const roleExistant = await roleService3.getRoleById(Number(req.params.id));
      if (!roleExistant) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Role non existant ou archiver" });
      }
      const roleUpdated = await roleService3.addPermissionsToRole(roleExistant.id, req.body.permissionIds);
      return res.status(HTTP_STATUS_OK).json(roleUpdated);
    } catch (error) {
      console.error("Erreur lors de l'ajout de permissions a un role", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode: Retirer une permission d'un role
  async removePermissionFromRole(req, res) {
    const { permissionId } = req.body;
    try {
      const roleExistant = await roleService3.getRoleById(Number(req.params.id));
      if (!roleExistant) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Role non existant ou archiver" });
      }
      const roleUpdated = await roleService3.removePermissionFromRole(roleExistant.id, permissionId);
      return res.status(HTTP_STATUS_OK).json(roleUpdated);
    } catch (error) {
      console.error("Erreur lors du retrait de la permission du role", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  //  Methode: Restorer une permission d'un role
  async restorePermissionFromRole(req, res) {
    const { permissionId } = req.body;
    try {
      const roleExistant = await roleService3.getRoleById(Number(req.params.id));
      if (!roleExistant) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Role non existant ou archiver" });
      }
      const roleUpdated = await roleService3.restorePermissionFromRole(roleExistant.id, permissionId);
      return res.status(HTTP_STATUS_OK).json(roleUpdated);
    } catch (error) {
      console.error("Erreur lors du restore de la permission du role", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // recuperer les permission d'un role by id
  async getPermissionByRoleId(req, res) {
    try {
      const permissions = await roleService3.getPermissions(Number(req.params.id));
      if (!permissions) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Cet Role n'a pas de permissions" });
      }
      return res.status(HTTP_STATUS_OK).json(permissions);
    } catch (error) {
      console.error("Erreur lors de la recuperation des permission du role", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/RoleSchema.ts
import Joi5 from "joi";
var roleSchema = Joi5.object({
  name: Joi5.string().min(3).required(),
  description: Joi5.string().min(3).allow("").optional(),
  // Un tableau qui contient des chaînes de caractères
  permissionIds: Joi5.array().items(Joi5.number())
});
var roleUpdateSchema = Joi5.object({
  name: Joi5.string().min(3).optional(),
  description: Joi5.string().min(3).allow("").optional(),
  // Un tableau qui contient des numbers
  permissionIds: Joi5.array().items(Joi5.number()).optional()
});

// src/Routes/RoleRoute.ts
function roleRoutes(app2, validateBody3) {
  const roleController = new RoleController();
  app2.get("/roles", AuthMiddleware, requirePermission("read_role"), roleController.getRoles.bind(roleController));
  app2.get("/roles/:id", AuthMiddleware, requirePermission("read_role"), roleController.getRoleById.bind(roleController));
  app2.get("/permissionsRole/:id", AuthMiddleware, requirePermission("read_role"), roleController.getPermissionByRoleId.bind(roleController));
  app2.post("/roles", AuthMiddleware, requirePermission("create_role"), validateBody3(roleSchema), roleController.createRole.bind(roleController));
  app2.put("/roles/:id", AuthMiddleware, requirePermission("update_role"), validateBody3(roleUpdateSchema), roleController.updateRole.bind(roleController));
  app2.put("/archiveRoles/:id", AuthMiddleware, requirePermission("delete_role"), roleController.deleteRole.bind(roleController));
  app2.put("/restoreRoles/:id", AuthMiddleware, requirePermission("update_role"), roleController.restoreRole.bind(roleController));
  app2.post("/roles/:id/permissions", AuthMiddleware, requirePermission("update_role"), validateBody3(roleUpdateSchema), roleController.addPermissionsToRole.bind(roleController));
  app2.put("/archiveRoles/:id/permissions", AuthMiddleware, requirePermission("update_role"), roleController.removePermissionFromRole.bind(roleController));
  app2.put("/restoreRoles/:id/permissions", AuthMiddleware, requirePermission("update_role"), roleController.restorePermissionFromRole.bind(roleController));
}

// src/Controllers/PermissionController.ts
var permissionService2 = new PermissionService();
var PermissionController = class {
  // Methode: Creation de permission
  async createPermission(req, res) {
    try {
      const perms = await permissionService2.createPermission(req.body);
      res.status(HTTP_STATUS_CREATED).json(perms);
    } catch (error) {
      console.error("Erreur lors de la creation d'une permission", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Recuperer tous les permissions
  async getPermissions(req, res) {
    try {
      const filter = RequestHelper.getFilters(req);
      const permissions = await permissionService2.getPermissions(filter);
      res.status(HTTP_STATUS_OK).json(permissions);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration des permissions:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Recuperer une permission par son id
  async getPermsById(req, res) {
    try {
      const permission = await permissionService2.getPermissionById(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(permission);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration d'une permission:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Modifier une permission
  async upadatePerms(req, res) {
    try {
      const pemsUpdated = await permissionService2.updatePermission(Number(req.params.id), req.body);
      res.status(HTTP_STATUS_OK).json(pemsUpdated);
    } catch (error) {
      console.log("Erreur lors de la mise \xE0 jour de la permission:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : Archiver une permission
  async deletePerms(req, res) {
    try {
      const perm = await permissionService2.deletePermission(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(perm);
    } catch (error) {
      console.log("Erreur lors de la suppression de la permission:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Methode : restorer une permission
  async restorePerms(req, res) {
    try {
      const perm = await permissionService2.RestorePermission(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(perm);
    } catch (error) {
      console.log("Erreur lors de la restauration de la permission:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getPermissionsByRoleId(req, res) {
    try {
      console.log(req.params.id);
      const permissions = await permissionService2.getPermissionsByRoleId(Number(req.params.id));
      console.log("permissions", permissions);
      res.status(HTTP_STATUS_OK).json(permissions);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration des permissions:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/PermissionSchema.ts
import Joi6 from "joi";
var permissionSchema = Joi6.object({
  name: Joi6.string().min(3).lowercase().required(),
  description: Joi6.string().min(3).optional()
});

// src/Routes/PermissionRoute.ts
function permissionRoutes(app2, validateBody3) {
  const permissionController = new PermissionController();
  app2.get("/permissions", AuthMiddleware, requirePermission("read_permission"), permissionController.getPermissions.bind(permissionController));
  app2.get("/permissions/:id", AuthMiddleware, requirePermission("read_permission"), permissionController.getPermsById.bind(permissionController));
  app2.get("/permissionsByRoleId/:id", permissionController.getPermissionsByRoleId.bind(permissionController));
  app2.post("/permissions", AuthMiddleware, requirePermission("create_permission"), validateBody3(permissionSchema), permissionController.createPermission.bind(permissionController));
  app2.put("/permissions/:id", AuthMiddleware, requirePermission("update_permission"), validateBody3(permissionSchema), permissionController.upadatePerms.bind(permissionController));
  app2.put("/archivePermissions/:id", AuthMiddleware, requirePermission("delete_permission"), permissionController.deletePerms.bind(permissionController));
  app2.put("/restorePermissions/:id", AuthMiddleware, requirePermission("update_permission"), permissionController.restorePerms.bind(permissionController));
}

// src/Services/ParameterService.ts
var ParameterService = class {
  async getParameters() {
    return PrismaClient_default.parameter.findFirst({
      include: {
        media: true
      }
    });
  }
  async updateParameters(data) {
    return PrismaClient_default.parameter.upsert({
      where: { id: 1 },
      update: data,
      create: {
        ...data
      }
    });
  }
};

// src/Controllers/ParameterController.ts
var ParameterController = class {
  parameterService;
  mediaService;
  constructor() {
    this.parameterService = new ParameterService();
    this.mediaService = new MediaService();
  }
  async getParams(req, res) {
    try {
      const params = await this.parameterService.getParameters();
      if (!params) {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Param\xE8tres non configur\xE9s" });
      }
      if (params.media) {
        params.media.file_path = `${process.env.APP_URL}${params.media.file_path}`;
      }
      return res.status(HTTP_STATUS_OK).json(params);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la r\xE9cup\xE9ration des param\xE8tres",
        details: error
      });
    }
  }
  async updateParams(req, res) {
    try {
      const payload = req.body;
      const mediaId = payload.mediaId;
      const media = await this.mediaService.getMediaById(mediaId);
      if (!media || media.type !== "image" && media.type !== "video") {
        return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Media non trouv\xE9 ou type non valide" });
      }
      const updatedParams = await this.parameterService.updateParameters(payload);
      return res.status(HTTP_STATUS_OK).json({
        message: "Param\xE8tres mis \xE0 jour avec succ\xE8s",
        data: updatedParams
      });
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la mise \xE0 jour des param\xE8tres",
        details: error
      });
    }
  }
};

// src/Utils/Validations/ParameterSchema.ts
import Joi7 from "joi";
var supportedFonts = [
  "Inter",
  "Roboto",
  "Poppins",
  "Montserrat",
  "Open Sans",
  "Playfair Display",
  "Lora",
  "Merriweather",
  "JetBrains Mono",
  "Fira Code",
  "Bebas Neue"
];
var parameterSchema = Joi7.object({
  entity_name: Joi7.string().required().max(100).messages({
    "string.base": "Le nom de l'entit\xE9 doit \xEAtre une cha\xEEne de caract\xE8res.",
    "string.empty": "Le nom de l'entit\xE9 ne peut pas \xEAtre vide.",
    "string.max": "Le nom de l'entit\xE9 ne doit pas d\xE9passer 100 caract\xE8res.",
    "any.required": "Le nom de l'entit\xE9 est requis."
  }),
  title: Joi7.string().required().max(255).messages({
    "string.base": "Le titre doit \xEAtre une cha\xEEne de caract\xE8res.",
    "string.empty": "Le titre ne peut pas \xEAtre vide.",
    "string.max": "Le titre ne doit pas d\xE9passer 255 caract\xE8res.",
    "any.required": "Le titre du site est requis."
  }),
  mediaId: Joi7.number().required(),
  description: Joi7.string().allow(null, "").max(500).messages({
    "string.max": "La description ne doit pas d\xE9passer 500 caract\xE8res."
  }),
  family_name: Joi7.string().valid(...supportedFonts).optional().messages({
    "any.only": "La police s\xE9lectionn\xE9e n'est pas support\xE9e."
  })
});

// src/Routes/ParameterRoute.ts
function parameterRoutes(app2) {
  const parameterController = new ParameterController();
  app2.get("/parameters", parameterController.getParams.bind(parameterController));
  app2.put("/parameters", AuthMiddleware, requirePermission("update_parameter"), ValidateBoody_default(parameterSchema), parameterController.updateParams.bind(parameterController));
}

// src/Types/InputField.ts
var TypesMedia = /* @__PURE__ */ ((TypesMedia2) => {
  TypesMedia2["IMAGE"] = "image";
  TypesMedia2["VIDEO"] = "video";
  TypesMedia2["DOCUMENT"] = "document";
  TypesMedia2["ARCHIVE"] = "archive";
  return TypesMedia2;
})(TypesMedia || {});

// src/mock/fieldSchema.ts
var getContentTypeMock = (req, res) => {
  const blogSchema = [
    {
      name: "title",
      label: "Titre de l'article",
      type: "text" /* TEXT */,
      required: true,
      placeholder: "Ex: Les tendances tech 2026",
      minLength: 5
    },
    {
      name: "content",
      label: "Corps de l'article",
      type: "richtext" /* RICH_TEXT */,
      required: true,
      toolbar: "full"
    },
    {
      name: "price_pro",
      label: "Prix (Acc\xE8s Premium)",
      type: "number" /* NUMBER */,
      required: false,
      min: 0,
      step: 0.01
    },
    {
      name: "thumbnail",
      label: "Image de couverture",
      type: "media" /* MEDIA */,
      required: true,
      allowedTypes: ["image", "video"],
      multiple: true
    },
    {
      name: "category",
      label: "Cat\xE9gorie",
      type: "taxonomy" /* TAXONOMY */,
      required: true,
      taxonomy_slug: "blog-categories",
      multiple: false,
      renderType: "combobox"
    },
    {
      name: "is_published",
      label: "Visible imm\xE9diatement ?",
      type: "boolean" /* BOOLEAN */,
      required: true,
      defaultValue: true
    },
    {
      name: "author",
      label: "Auteur",
      type: "relation" /* RELATION */,
      required: true,
      contentTypeId: 1,
      multiple: true
    },
    {
      name: "comments",
      label: "Commentaires",
      type: "select" /* SELECT */,
      required: false,
      multiple: false,
      options: [
        "commentaire_1",
        "commentaire_2",
        "commentaire_3"
      ]
    }
  ];
  const contentEntryMock = {
    id: 1,
    name: "Article de Blog",
    slug: "blog",
    description: "Description de l'article de blog",
    fields_schema: blogSchema,
    createdAt: /* @__PURE__ */ new Date(),
    updatedAt: /* @__PURE__ */ new Date(),
    archive: false,
    archivedAt: null
  };
  return res.status(200).json(contentEntryMock);
};

// src/Utils/Validations/ContentEntrySchema.ts
import Joi8 from "joi";
var buildJoiSchema = (fields) => {
  const schemaDefinition = {};
  fields.forEach((field) => {
    let validator;
    switch (field.type) {
      case "text" /* TEXT */: {
        const f = field;
        let s = Joi8.string().trim();
        if (f.minLength) s = s.min(f.minLength);
        if (f.maxLength) s = s.max(f.maxLength);
        if (f.pattern) s = s.pattern(new RegExp(f.pattern));
        validator = s;
        break;
      }
      case "number" /* NUMBER */: {
        const f = field;
        let n = Joi8.number();
        if (f.min !== void 0) n = n.min(f.min).messages({
          "number.min": `${field.label} ne peut pas \xEAtre inf\xE9rieur \xE0 ${f.min}`
        });
        if (f.max !== void 0) n = n.max(f.max).messages({
          "number.max": `${field.label} ne peut pas d\xE9passer ${f.max}`
        });
        validator = n;
        break;
      }
      case "select" /* SELECT */: {
        const f = field;
        const allowedValues = f.options;
        const base = Joi8.valid(...allowedValues).messages({
          "any.only": `${field.label} doit \xEAtre l'une des valeurs suivantes : ${allowedValues.join(", ")}`
        });
        validator = f.multiple ? Joi8.array().items(base).unique().messages({
          "array.includesOneOf": `${field.label} doit contenir uniquement des valeurs valides`
        }) : base;
        break;
      }
      case "taxonomy" /* TAXONOMY */: {
        const f = field;
        const taxId = Joi8.number().integer().positive().messages({
          "number.base": `${field.label} doit \xEAtre un nombre`,
          "number.integer": `${field.label} doit \xEAtre un nombre entier`,
          "number.positive": `${field.label} doit \xEAtre un nombre positif`
        });
        validator = f.multiple ? Joi8.array().items(taxId).unique().messages({
          "array.includesOneOf": `${field.label} doit contenir uniquement des nombres valides`,
          "array.unique": `${field.label} ne doit pas contenir de doublons`
        }) : taxId;
        break;
      }
      case "relation" /* RELATION */: {
        const f = field;
        const refId = Joi8.alternatives().try(Joi8.number(), Joi8.string()).messages({
          "alternatives.types": `${field.label} doit \xEAtre un nombre ou une cha\xEEne de caract\xE8res`
        });
        validator = f.multiple ? Joi8.array().items(refId).unique().messages({
          "array.includesOneOf": `${field.label} doit contenir uniquement des nombres ou des cha\xEEnes de caract\xE8res valides`,
          "array.unique": `${field.label} ne doit pas contenir de doublons`
        }) : refId;
        break;
      }
      case "media" /* MEDIA */: {
        const mediaVal = Joi8.alternatives().try(Joi8.number(), Joi8.string()).messages({
          "alternatives.types": `${field.label} doit \xEAtre un nombre ou une cha\xEEne de caract\xE8res`
        });
        validator = field.multiple ? Joi8.array().items(mediaVal).unique().messages({
          "array.includesOneOf": `${field.label} doit contenir uniquement des nombres ou des cha\xEEnes de caract\xE8res valides`,
          "array.unique": `${field.label} ne doit pas contenir de doublons`
        }) : mediaVal;
        break;
      }
      case "boolean" /* BOOLEAN */:
        validator = Joi8.boolean().messages({
          "boolean.base": `${field.label} doit \xEAtre un bool\xE9en`
        });
        break;
      case "richtext" /* RICH_TEXT */:
        validator = Joi8.string().allow("", null).messages({
          "string.base": `${field.label} doit \xEAtre une cha\xEEne de caract\xE8res`
        });
        break;
      default:
        validator = Joi8.any();
    }
    if (field.required) {
      validator = validator.required().messages({
        "any.required": `${field.label} est obligatoire`,
        "string.empty": `${field.label} ne peut pas \xEAtre vide`
      });
    } else {
      validator = validator.optional().allow(null, "");
    }
    schemaDefinition[field.name] = validator;
  });
  return Joi8.object(schemaDefinition);
};
var switchStatusSchema = Joi8.object({
  status: Joi8.string().valid("PUBLISHED", "DRAFT", "ARCHIVED").required()
});
var toggleArchiveSchema = Joi8.object({
  archive: Joi8.boolean().required()
});

// src/Middleware/ValidateDynamicContent.ts
import Joi9 from "joi";
var validateDynamicContent = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { data_json, status } = req.body;
    if (!slug) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre slug est manquant." });
    }
    const contentType = await PrismaClient_default.contentType.findUnique({
      where: { slug }
    });
    if (!contentType) {
      return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Type de contenu inconnu." });
    }
    const dynamicSchema = buildJoiSchema(contentType.fields_schema);
    const { error: jsonError, value: validatedJson } = dynamicSchema.validate(data_json, {
      abortEarly: false,
      stripUnknown: true
      // Nettoie les champs non définis dans le schéma
    });
    if (jsonError) {
      console.log(jsonError.details);
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        message: jsonError.details.map((err) => err.message)
      });
    }
    const entryMetaSchema = Joi9.object({
      status: Joi9.string().valid("DRAFT", "PUBLISHED", "ARCHIVED").default("DRAFT")
    });
    const { error: metaError, value: validatedMeta } = entryMetaSchema.validate({ status });
    if (metaError) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({
        message: "Statut invalide",
        errors: metaError.details
      });
    }
    req.body.data_json = validatedJson;
    req.body.status = validatedMeta.status;
    req.body.contentTypeId = contentType.id;
    next();
  } catch (err) {
    console.error("Erreur Middleware Validation:", err);
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ message: "Erreur lors de la validation dynamique." });
  }
};

// src/mock/contentEntry.ts
var getContentEntryMock = (req, res) => {
  const blogSchema = [
    {
      id: 1,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 2,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 3,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 4,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 5,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 6,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 7,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 8,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 9,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 10,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 11,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 12,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 13,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 14,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 15,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 16,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    },
    {
      id: 17,
      contentTypeId: 1,
      userId: 1,
      data_json: {
        title: "Titre de l'article",
        content: "Corps de l'article",
        price_pro: 0,
        thumbnail: [],
        category: 1,
        is_published: true,
        author: [1],
        comments: "commentaire_1"
      },
      status: "DRAFT",
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date(),
      archive: false,
      archivedAt: null
    }
  ];
  return res.status(200).json(blogSchema);
};

// src/Routes/MockRoute.ts
function mockRoutes(app2) {
  app2.get("/mock/content-type", (req, res) => {
    return getContentTypeMock(req, res);
  });
  app2.get("/mock/content-entry", (req, res) => {
    return getContentEntryMock(req, res);
  });
  app2.post("/mock/content-type", validateDynamicContent, (req, res) => {
    console.log(
      req.body
    );
    ;
  });
}

// src/Services/ContentTypeService.ts
var contentEntryService = new ContentEntryService();
var ContentTypeService = class _ContentTypeService {
  static castingContentType(data) {
    return {
      ...data,
      fields_schema: data.fields_schema,
      archive: Boolean(data.archive),
      entries: data.entries
    };
  }
  static castingContentTypes(items) {
    return items.map((item) => ({
      ...item,
      fields_schema: item.fields_schema,
      archive: Boolean(item.archive)
    }));
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.archive) {
      where.archive = filter.archive;
    } else {
      where.archive = false;
    }
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } },
        { slug: { contains: query } },
        { description: { contains: query } }
      ];
    }
    return where;
  }
  // Create
  async createContentType(data, taxonomyIds) {
    const { userId, fields_schema, ...cleanData } = data;
    const itemContentType = await PrismaClient_default.contentType.create({
      data: {
        ...cleanData,
        fields_schema,
        user: {
          connect: { id: userId }
        },
        ...taxonomyIds && taxonomyIds.length > 0 && {
          taxonomies: {
            connect: taxonomyIds.map((id) => ({ id }))
          }
        }
      }
    });
    return _ContentTypeService.castingContentType(itemContentType);
  }
  // get contentTypes
  async getContentTypes(filter) {
    const data = await Paginator.paginate(PrismaClient_default.contentType, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      orderBy: { createdAt: "desc" }
    });
    return {
      ...data,
      results: _ContentTypeService.castingContentTypes(data.results)
    };
  }
  //get by ID
  async getContentTypeById(id) {
    const item = await PrismaClient_default.contentType.findUnique({
      where: { id, archive: false },
      include: { entries: true }
    });
    if (!item) return null;
    return _ContentTypeService.castingContentType(item);
  }
  // get by slug
  async getContentTypeBySlug(slug) {
    const content = await PrismaClient_default.contentType.findUnique({
      where: { slug, archive: false }
    });
    return _ContentTypeService.castingContentType(content);
  }
  // get contentTypes excepted the one with id
  async getContentTypesExcepted(id) {
    const contentTypes = await PrismaClient_default.contentType.findMany({
      where: { archive: false, NOT: { id } }
    });
    return _ContentTypeService.castingContentTypes(contentTypes);
  }
  // update
  async updateContentType(id, data, taxonomyIds) {
    const contentUpdated = await PrismaClient_default.contentType.update({
      where: { id },
      // On cast pour éviter les erreurs de compatibilité JSON
      data: {
        ...data,
        fields_schema: data.fields_schema,
        ...taxonomyIds && taxonomyIds.length > 0 && {
          taxonomies: {
            set: taxonomyIds.map((id2) => ({ id: id2 }))
          }
        }
      }
    });
    return _ContentTypeService.castingContentType(contentUpdated);
  }
  // Archivage
  async archivedContentType(id) {
    const item = await PrismaClient_default.contentType.update({
      where: { id, archive: false },
      data: {
        archive: true,
        archivedAt: /* @__PURE__ */ new Date()
      }
    });
    return _ContentTypeService.castingContentType(item);
  }
  // Restorer
  async restoredContentType(id) {
    const contentRestore = await PrismaClient_default.contentType.update({
      where: { id, archive: true },
      data: {
        archive: false,
        archivedAt: null
      }
    });
    return _ContentTypeService.castingContentType(contentRestore);
  }
  // delete
  async deleteContentType(id) {
    const typeASupprimer = await PrismaClient_default.contentType.findUnique({
      where: { id, archive: true },
      include: {
        _count: {
          select: {
            childrenContentTypes: true,
            entries: true
          }
        }
      }
    });
    console.log(typeASupprimer);
    if (!typeASupprimer) throw new AppError("Type non trouv\xE9 ou non archiv\xE9.");
    if (typeASupprimer._count.childrenContentTypes > 0) throw new AppError("Suppression impossible : ce type est le 'Parent' relationnel d'autres types.");
    if (typeASupprimer._count.entries > 0) throw new AppError("Suppression impossible : ce type a des entr\xE9es.");
    const contentDelete = await PrismaClient_default.contentType.delete({ where: { id } });
    return _ContentTypeService.castingContentType(contentDelete);
  }
  async syncTaxonomyContentType(fieldsSchema) {
    const taxonomyIds = fieldsSchema.filter((f) => f.type === "taxonomy" /* TAXONOMY */).flatMap((f) => f.taxonomyIds || []).map((id) => Number(id)).filter((id) => !isNaN(id) && id !== 0);
    return [...new Set(taxonomyIds)];
  }
  // synchronisation des relations entre les content types
  async syncRelationsContentTypeCreate(proprietaireId, fieldsSchema) {
    const cibleIds = [...new Set(
      fieldsSchema.filter((f) => f.type === "relation" /* RELATION */).map((f) => Number(f.contentTypeId))
    )];
    if (cibleIds.length > 0) {
      await PrismaClient_default.contentTypeRelation.createMany({
        data: cibleIds.map((id) => ({
          proprietaireId,
          cibleId: id
        }))
      });
    }
  }
  async syncRelationsContentTypeUpdate(proprietaireId, fieldsSchema) {
    const cibleIds = [...new Set(
      fieldsSchema.filter((f) => f.type === "relation" /* RELATION */).map((f) => Number(f.contentTypeId))
    )];
    await PrismaClient_default.contentTypeRelation.deleteMany({
      where: { proprietaireId }
    });
    if (cibleIds.length > 0) {
      await PrismaClient_default.contentTypeRelation.createMany({
        data: cibleIds.map((id) => ({
          proprietaireId,
          cibleId: id
        }))
      });
    }
  }
  async logiqueModContentType(nouveauFieldsSchema, ancienFieldsSchema, contentTypeId) {
    const changements = ancienFieldsSchema.map((ancienField, index) => {
      const nouveauField = nouveauFieldsSchema[index];
      if (!nouveauField || ancienField.name !== nouveauField.name) {
        return { name: ancienField.name, action: "DELETE" };
      }
      const typesSpecifiques = ["relation" /* RELATION */, "media" /* MEDIA */, "taxonomy" /* TAXONOMY */];
      if (typesSpecifiques.includes(nouveauField.type) && ancienField.type !== nouveauField.type) {
        return { name: ancienField.name, action: "NULL" };
      }
      if (nouveauField.type === "select" /* SELECT */) {
        if (ancienField.type !== "select" /* SELECT */) {
          return { name: ancienField.name, action: "NULL" };
        }
        const optionsRestantes = ancienField.options.every((opt) => nouveauField.options.includes(opt));
        if (!optionsRestantes) {
          return { name: ancienField.name, action: "NULL" };
        }
      }
      return { name: ancienField.name, action: "NONE" };
    });
    await _ContentTypeService.bouclerEntry(contentTypeId, changements);
  }
  static async bouclerEntry(id, changements) {
    const { results: entries } = await contentEntryService.getEntries(id);
    if (entries.length === 0) return;
    for (const entry of entries) {
      const data_json = entry.data_json;
      let hasChanged = false;
      changements.forEach((changement) => {
        if (changement.action === "DELETE" && changement.name in data_json) {
          delete data_json[changement.name];
          hasChanged = true;
        } else if (changement.action === "NULL" && changement.name in data_json) {
          data_json[changement.name] = null;
          hasChanged = true;
        }
      });
      if (hasChanged) {
        await contentEntryService.updateContentEntry(entry.id, { data_json });
      }
    }
  }
};

// src/Controllers/ContentTypeController.ts
var contentTypeService = new ContentTypeService();
var contentEntryService2 = new ContentEntryService();
var ContentTypeController = class {
  async create(req, res) {
    try {
      const data = req.body;
      const taxonomyIds = await contentTypeService.syncTaxonomyContentType(data.fields_schema);
      const result = await contentTypeService.createContentType({
        ...data,
        userId: req.user?.sub
      }, taxonomyIds);
      await contentTypeService.syncRelationsContentTypeCreate(result.id, result.fields_schema);
      return res.status(HTTP_STATUS_CREATED).json(result);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getAllContentTypes(req, res) {
    try {
      const filter = RequestHelper.getFilters(req);
      const contentTypes = await contentTypeService.getContentTypes(filter);
      return res.status(HTTP_STATUS_OK).json(contentTypes);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration des contentTypes:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getContentTypeById(req, res) {
    try {
      const contentType = await contentTypeService.getContentTypeById(Number(req.params.id));
      if (!contentType) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "ContententType non trouv\xE9 ou archiv\xE9" });
      return res.status(HTTP_STATUS_OK).json(contentType);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration de ContententType:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getContentTypeBySlug(req, res) {
    const { slug } = req.params;
    try {
      if (!slug) {
        res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre slug est manquant." });
        return null;
      }
      const contentTypeSlug = await contentTypeService.getContentTypeBySlug(slug);
      if (!contentTypeSlug) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "ContententType non trouv\xE9 ou archiv\xE9" });
      res.status(HTTP_STATUS_OK).json(contentTypeSlug);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration de ContententType:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getContentTypesExcepted(req, res) {
    try {
      const contentTypes = await contentTypeService.getContentTypesExcepted(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(contentTypes);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration de ContententType:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateContentType(req, res) {
    const { fields_schema } = req.body;
    try {
      const ancienContent = await contentTypeService.getContentTypeById(Number(req.params.id));
      if (!ancienContent) return res.status(HTTP_STATUS_NOT_FOUND).json({ "message": "content non trouver" });
      const taxonomyIds = await contentTypeService.syncTaxonomyContentType(fields_schema);
      const resultContent = await contentTypeService.updateContentType(Number(req.params.id), req.body, taxonomyIds);
      await contentTypeService.syncRelationsContentTypeUpdate(resultContent.id, resultContent.fields_schema);
      const { results: entries } = await contentEntryService2.getEntries(resultContent.id);
      if (entries.length > 0) {
        await contentTypeService.logiqueModContentType(fields_schema, ancienContent.fields_schema, resultContent.id);
      }
      return res.status(HTTP_STATUS_OK).json(resultContent);
    } catch (error) {
      console.log("Erreur lors de la mise \xE0 jour de l'utilisateur:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // archiver contentType
  async archivedContentType(req, res) {
    try {
      const contentType = await contentTypeService.archivedContentType(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(contentType);
    } catch (error) {
      console.log("Erreur lors de l'archivage d'un contenType:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // restorer un contentType archivés
  async restoreContentType(req, res) {
    try {
      const content = await contentTypeService.restoredContentType(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(content);
    } catch (error) {
      console.log("Erreur lors de la restauration d'un contentType:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // delete contentType archiver
  async deleteContentTypeArchived(req, res) {
    try {
      const contentDelete = await contentTypeService.deleteContentType(Number(req.params.id));
      if (!contentDelete) res.status(HTTP_STATUS_NOT_FOUND).json({ error: "ContententType non trouv\xE9 ou non archiv\xE9" });
      res.status(HTTP_STATUS_OK).json(contentDelete);
    } catch (error) {
      console.log("Erreur lors de la suppression d'un contentType:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/ContentTypeSchema.ts
import Joi10 from "joi";
var selectOptionSchema = Joi10.alternatives().try(Joi10.string(), Joi10.number());
var fieldDefinitionSchema = Joi10.object({
  // Propriétés communes (IBaseField)
  name: Joi10.string().required().lowercase().trim(),
  label: Joi10.string().required().allow(""),
  required: Joi10.boolean().required(),
  placeholder: Joi10.string().allow("").optional(),
  description: Joi10.string().allow("").optional(),
  // Discriminant
  type: Joi10.string().valid(
    "text",
    "richtext",
    "number",
    "media",
    "taxonomy",
    "boolean",
    "select",
    "relation"
  ).required(),
  // Validation spécifique selon le type (Configs)
  minLength: Joi10.number().optional(),
  maxLength: Joi10.number().optional(),
  pattern: Joi10.string().optional(),
  min: Joi10.number().optional(),
  max: Joi10.number().optional(),
  step: Joi10.number().optional(),
  maxSize: Joi10.number().optional(),
  allowedTypes: Joi10.array().items(Joi10.string().valid(...Object.values(TypesMedia)).allow(null)).optional(),
  multiple: Joi10.boolean().optional(),
  taxonomyIds: Joi10.array().items(Joi10.number()).when("type", { is: "taxonomy", then: Joi10.required() }),
  renderType: Joi10.string().valid("combobox", "badges", "checkbox").optional(),
  options: Joi10.array().items(selectOptionSchema).when("type", { is: "select", then: Joi10.required() }).messages({ "array.base": "Les options doivent \xEAtre un tableau" }),
  defaultValue: Joi10.any().optional(),
  toolbar: Joi10.string().valid("minimal", "full").optional(),
  contentTypeId: Joi10.number().when("type", { is: "relation", then: Joi10.required() }).invalid(0).messages({ "number.invalid": "Le contentTypeId ne peut pas \xEAtre 0" })
});
var contentTypeSchema = Joi10.object({
  name: Joi10.string().min(3).required(),
  slug: Joi10.string().min(3).required(),
  description: Joi10.string().min(3).allow(null, "").optional(),
  archive: Joi10.boolean().default(false).optional(),
  // On valide que c'est un tableau de définitions
  fields_schema: Joi10.array().items(fieldDefinitionSchema).unique("name").required().messages({
    "array.unique": "Le nom technique du champ (name) doit \xEAtre unique."
  })
});
var contentTypeUpdateSchema = Joi10.object({
  name: Joi10.string().min(3).optional(),
  slug: Joi10.string().min(3).optional(),
  description: Joi10.string().min(3).allow(null, "").optional(),
  archive: Joi10.boolean().default(false).optional(),
  fields_schema: Joi10.array().items(fieldDefinitionSchema).unique("name").optional().messages({
    "array.unique": "Le nom technique du champ (name) doit \xEAtre unique."
  })
});

// src/Routes/ContentTypeRoute.ts
function contentTypeRoutes(app2, validateBody3) {
  const contentTypeController = new ContentTypeController();
  app2.post("/contents", AuthMiddleware, requirePermission("create_content_type"), validateBody3(contentTypeSchema), contentTypeController.create.bind(contentTypeController));
  app2.get("/contents", AuthMiddleware, requirePermission("read_content_type"), contentTypeController.getAllContentTypes.bind(contentTypeController));
  app2.get("/contents/:id", AuthMiddleware, requirePermission("read_content_type"), contentTypeController.getContentTypeById.bind(contentTypeController));
  app2.get("/contentsSlug/:slug", contentTypeController.getContentTypeBySlug.bind(contentTypeController));
  app2.get("/contentsExcepted/:id", AuthMiddleware, requirePermission("read_content_type"), contentTypeController.getContentTypesExcepted.bind(contentTypeController));
  app2.put("/contents/:id", AuthMiddleware, requirePermission("update_content_type"), validateBody3(contentTypeUpdateSchema), contentTypeController.updateContentType.bind(contentTypeController));
  app2.put("/archiveContents/:id", AuthMiddleware, requirePermission("update_content_type"), contentTypeController.archivedContentType.bind(contentTypeController));
  app2.put("/restoreContents/:id", AuthMiddleware, requirePermission("update_content_type"), contentTypeController.restoreContentType.bind(contentTypeController));
  app2.delete("/contents/:id", AuthMiddleware, requirePermission("delete_content_type"), contentTypeController.deleteContentTypeArchived.bind(contentTypeController));
}

// src/Controllers/ContentEntryController.ts
var contentEntryService3 = new ContentEntryService();
var contentTypeService2 = new ContentTypeService();
var ContentEntryController = class _ContentEntryController {
  static async getValidatedContentType(slug, res) {
    if (!slug) {
      res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre slug est manquant." });
      return null;
    }
    const contentType = await contentTypeService2.getContentTypeBySlug(slug);
    if (!contentType) {
      res.status(HTTP_STATUS_NOT_FOUND).json({ message: `Le type de contenu '${slug}' est inconnu.` });
      return null;
    }
    return contentType;
  }
  async getAllEntriesBySlug(req, res) {
    try {
      const ct = await _ContentEntryController.getValidatedContentType(req.params.slug, res);
      if (!ct) return;
      const filters = RequestHelper.getFilters(req);
      const data = await contentEntryService3.getEntries(ct.id, filters);
      return res.status(HTTP_STATUS_OK).json({
        contentType: ct.name,
        schema: ct.fields_schema,
        ...data
      });
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  async getEntryById(req, res) {
    try {
      const entry = await contentEntryService3.getContentEntryById(Number(req.params.id));
      if (!entry) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "Entr\xE9e introuvable." });
      return res.status(HTTP_STATUS_OK).json(entry);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  async createEntry(req, res) {
    try {
      const ct = await _ContentEntryController.getValidatedContentType(req.params.slug, res);
      if (!ct) return;
      const newEntry = await contentEntryService3.createContentEntry({
        ...req.body,
        userId: req.user?.sub,
        contentTypeId: ct.id
      });
      return res.status(HTTP_STATUS_CREATED).json(newEntry);
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  async updateEntry(req, res) {
    try {
      const result = await contentEntryService3.updateContentEntry(Number(req.params.id), req.body);
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  async updateStatus(req, res) {
    try {
      const { status } = req.body;
      const result = await contentEntryService3.updateStatus(Number(req.params.id), status);
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  async toggleArchive(req, res) {
    try {
      const { id } = req.params;
      const result = await contentEntryService3.toggleArchive(Number(id));
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
  async deleteEntry(req, res) {
    try {
      const deleted = await contentEntryService3.deleteContentEntry(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(deleted);
    } catch (error) {
      return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: error.message });
    }
  }
  async getArchivedEntries(req, res) {
    try {
      const baseFilters = RequestHelper.getFilters(req);
      const filters = {
        ...baseFilters,
        status: "ARCHIVED"
      };
      const data = await contentEntryService3.getEntries(void 0, filters);
      return res.status(HTTP_STATUS_OK).json(data);
    } catch (error) {
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
        error: "Erreur lors de la r\xE9cup\xE9ration des archives",
        details: error.message
      });
    }
  }
  async getEntriesByContentTypeIdControl(req, res) {
    try {
      console.log("blockCMSData");
      const filters = RequestHelper.getContenusFilters(req);
      const dataContenus = await contentEntryService3.getEntriesByContentTypeIdControl(Number(req.params.id), filters);
      console.log(dataContenus);
      return res.status(HTTP_STATUS_OK).json(dataContenus);
    } catch (error) {
      console.log(error);
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }
};

// src/Routes/ContentEntryRoute.ts
function contentEntryRoutes(app2) {
  const entryController = new ContentEntryController();
  app2.get("/content-entries/slug/:slug", AuthMiddleware, requirePermission("read_content_entry"), entryController.getAllEntriesBySlug.bind(entryController));
  app2.get("/content-entries/:id", AuthMiddleware, requirePermission("read_content_entry"), entryController.getEntryById.bind(entryController));
  app2.get("/content-entries-archived", AuthMiddleware, requirePermission("read_content_entry"), entryController.getArchivedEntries.bind(entryController));
  app2.post("/content-entries/:slug", AuthMiddleware, requirePermission("create_content_entry"), validateDynamicContent, entryController.createEntry.bind(entryController));
  app2.put("/content-entries/:id/:slug", AuthMiddleware, requirePermission("update_content_entry"), validateDynamicContent, entryController.updateEntry.bind(entryController));
  app2.patch("/content-entries/:id/status", AuthMiddleware, ValidateBoody_default(switchStatusSchema), entryController.updateStatus.bind(entryController));
  app2.put("/content-entries-archive/:id/", AuthMiddleware, requirePermission("delete_content_entry"), entryController.toggleArchive.bind(entryController));
  app2.delete("/content-entries/:id", entryController.deleteEntry.bind(entryController));
  app2.get("/content-entries/id/:id", entryController.getEntriesByContentTypeIdControl.bind(entryController));
}

// src/Services/TaxonomyTermService.ts
var TaxonomyTermService = class _TaxonomyTermService {
  static castingTerm(data) {
    return {
      ...data
    };
  }
  static castingTerms(items) {
    return items.map((item) => _TaxonomyTermService.castingTerm(item));
  }
  // Create many terms
  async createTerms(data) {
    return await PrismaClient_default.taxonomyTerm.createMany({
      data
    });
  }
  // Create
  async createTerm(data) {
    const item = await PrismaClient_default.taxonomyTerm.create({
      data
    });
    return _TaxonomyTermService.castingTerm(item);
  }
  // Get all terms by Taxonomy ID
  async getTermsByTaxonomy(taxonomyId) {
    const items = await PrismaClient_default.taxonomyTerm.findMany({
      where: { taxonomyId }
    });
    return _TaxonomyTermService.castingTerms(items);
  }
  // Get by ID
  async getTermById(id) {
    const item = await PrismaClient_default.taxonomyTerm.findUnique({
      where: { id }
    });
    if (!item) return null;
    return _TaxonomyTermService.castingTerm(item);
  }
  // Get by slug
  async getTermBySlug(slug) {
    const item = await PrismaClient_default.taxonomyTerm.findUnique({
      where: { slug }
    });
    if (!item) return null;
    return _TaxonomyTermService.castingTerm(item);
  }
  // Update
  async updateTerm(id, data) {
    const item = await PrismaClient_default.taxonomyTerm.update({
      where: { id },
      data
    });
    return _TaxonomyTermService.castingTerm(item);
  }
  // Dans TaxonomyTermService.ts
  async updateTerms(taxonomyId, termsData) {
    return await PrismaClient_default.taxonomy.update({
      where: { id: taxonomyId },
      data: {
        terms: {
          // 1. On supprime les anciens termes liés
          deleteMany: {},
          // 2. On crée les nouveaux
          create: termsData
        }
      }
    });
  }
  // Delete
  async deleteTerm(id) {
    const item = await PrismaClient_default.taxonomyTerm.delete({
      where: { id }
    });
    return _TaxonomyTermService.castingTerm(item);
  }
  async deleteTerms(taxonomyId) {
    return PrismaClient_default.taxonomyTerm.deleteMany({
      where: { taxonomyId }
    });
  }
  async getTaxonomyTermsByTaxonomyIds(taxonomyIds) {
    const item = await PrismaClient_default.taxonomyTerm.findMany({
      where: {
        taxonomyId: { in: taxonomyIds },
        taxonomy: { archive: false }
      }
    });
    return item;
  }
};

// src/Services/TaxonomyService.ts
var TaxonomyService = class _TaxonomyService {
  static castingTaxonomy(data) {
    return {
      ...data,
      archive: Boolean(data.archive)
    };
  }
  static castingTaxonomies(items) {
    return items.map((item) => _TaxonomyService.castingTaxonomy(item));
  }
  // Create
  async createTaxonomy(data) {
    const item = await PrismaClient_default.taxonomy.create({
      data
    });
    return _TaxonomyService.castingTaxonomy(item);
  }
  buildWhereClause(filter) {
    const where = {};
    if (filter?.archive !== void 0) {
      where.archive = filter.archive;
    } else {
      where.archive = false;
    }
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } },
        { slug: { contains: query } },
        { description: { contains: query } }
      ];
    }
    return where;
  }
  // get permissions
  async getTaxonomies(filter) {
    const data = await Paginator.paginate(PrismaClient_default.taxonomy, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      include: { terms: true },
      orderBy: { createdAt: "desc" }
    });
    return {
      ...data,
      results: _TaxonomyService.castingTaxonomies(data.results)
    };
  }
  // Get by ID
  async getTaxonomyById(id) {
    const item = await PrismaClient_default.taxonomy.findUnique({
      where: { id, archive: false },
      include: {
        terms: true
      }
    });
    if (!item) return null;
    return _TaxonomyService.castingTaxonomy(item);
  }
  // Get by slug
  async getTaxonomyBySlug(slug) {
    const item = await PrismaClient_default.taxonomy.findUnique({
      where: { slug, archive: false },
      include: {
        terms: true
      }
    });
    if (!item) return null;
    return _TaxonomyService.castingTaxonomy(item);
  }
  // Update
  async updateTaxonomy(id, data) {
    const item = await PrismaClient_default.taxonomy.update({
      where: { id },
      data
    });
    return _TaxonomyService.castingTaxonomy(item);
  }
  // Archive
  async archivedTaxonomy(id) {
    const item = await PrismaClient_default.taxonomy.update({
      where: { id, archive: false },
      data: {
        archive: true,
        archivedAt: /* @__PURE__ */ new Date()
      }
    });
    return _TaxonomyService.castingTaxonomy(item);
  }
  // Restore
  async restoredTaxonomy(id) {
    const item = await PrismaClient_default.taxonomy.update({
      where: { id, archive: true },
      data: {
        archive: false,
        archivedAt: null
      }
    });
    return _TaxonomyService.castingTaxonomy(item);
  }
  // Delete
  async deleteTaxonomy(id) {
    const itemASupprimer = await PrismaClient_default.taxonomy.findUnique({
      where: { id, archive: true },
      include: {
        _count: {
          select: {
            terms: true,
            contentTypes: true
          }
        }
      }
    });
    if (!itemASupprimer) throw new AppError("Taxonomy non trouv\xE9 ou non archiv\xE9.");
    if (itemASupprimer._count.terms > 0) throw new AppError("Suppression impossible : ce categorie a des termes.");
    if (itemASupprimer._count.contentTypes > 0) throw new AppError("Suppression impossible : ce categorie est utilis\xE9 par des types de contenu.");
    const item = await PrismaClient_default.taxonomy.delete({
      where: { id, archive: true }
    });
    return _TaxonomyService.castingTaxonomy(item);
  }
};

// src/Controllers/TaxonomyController.ts
var taxonomyService = new TaxonomyService();
var taxonomyTermService = new TaxonomyTermService();
var TaxonomyController = class {
  async create(req, res) {
    const { name, slug, description, terms } = req.body;
    try {
      if (!req.user?.sub) return res.status(HTTP_STATUS_UNAUTHORIZED).json({ message: "Utilisateur non authentifi\xE9" });
      const data = { name, slug, description, userId: req.user?.sub };
      const result = await taxonomyService.createTaxonomy(data);
      if (terms.length > 0) {
        const termsData = terms.map((term) => ({
          name: term,
          slug: term.toLowerCase().replace(/\s+/g, "-"),
          taxonomyId: result.id
        }));
        await taxonomyTermService.createTerms(termsData);
      }
      return res.status(HTTP_STATUS_CREATED).json(result);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getAllTaxonomies(req, res) {
    try {
      const filter = RequestHelper.getFilters(req);
      const taxonomies = await taxonomyService.getTaxonomies(filter);
      return res.status(HTTP_STATUS_OK).json(taxonomies);
    } catch (error) {
      console.log("Erreur lors de la r\xE9cup\xE9ration des taxonomies:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getTaxonomyById(req, res) {
    try {
      const item = await taxonomyService.getTaxonomyById(Number(req.params.id));
      if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Taxonomie non trouv\xE9e ou archiv\xE9e" });
      return res.status(HTTP_STATUS_OK).json(item);
    } catch (error) {
      console.error("Erreur lors de la recuperation de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getTaxonomyBySlug(req, res) {
    try {
      const { slug } = req.params;
      if (!slug) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre slug est manquant." });
      const item = await taxonomyService.getTaxonomyBySlug(slug);
      if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Taxonomie non trouv\xE9e ou archiv\xE9e" });
      return res.status(HTTP_STATUS_OK).json(item);
    } catch (error) {
      console.error("Erreur lors de la recuperation de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateTaxonomy(req, res) {
    const { name, slug, description, terms } = req.body;
    try {
      const result = await taxonomyService.updateTaxonomy(Number(req.params.id), { name, slug, description });
      if (terms.length > 0) {
        const termsData = terms.map((term) => ({
          name: term,
          slug: term.toLowerCase().replace(/\s+/g, "-")
        }));
        console.log(termsData);
        await taxonomyTermService.updateTerms(result.id, termsData);
        return res.status(HTTP_STATUS_OK).json(result);
      }
      await taxonomyTermService.deleteTerms(result.id);
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de la mise \xE0 jour de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async archivedTaxonomy(req, res) {
    try {
      const result = await taxonomyService.archivedTaxonomy(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de l'archivage de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async restoreTaxonomy(req, res) {
    try {
      const result = await taxonomyService.restoredTaxonomy(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de la restauration de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deleteTaxonomyArchived(req, res) {
    try {
      const result = await taxonomyService.deleteTaxonomy(Number(req.params.id));
      if (!result) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Taxonomie non trouv\xE9e ou non archiv\xE9e" });
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de la suppression de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/TaxonomySchema.ts
import Joi11 from "joi";
var taxonomySchema = Joi11.object({
  name: Joi11.string().min(3).required(),
  slug: Joi11.string().min(3).required(),
  description: Joi11.string().min(3).allow(null, "").optional(),
  terms: Joi11.array().items(Joi11.string()).optional()
});
var taxonomyUpdateSchema = Joi11.object({
  name: Joi11.string().min(3).optional(),
  slug: Joi11.string().min(3).optional(),
  description: Joi11.string().min(3).allow(null, "").optional(),
  terms: Joi11.array().items(Joi11.string()).optional()
});
var taxonomyTermSchema = Joi11.object({
  name: Joi11.string().min(1).required(),
  slug: Joi11.string().min(1).required(),
  taxonomyId: Joi11.number().required()
});
var taxonomyTermUpdateSchema = Joi11.object({
  name: Joi11.string().min(1).optional(),
  slug: Joi11.string().min(1).optional()
});

// src/Routes/TaxonomyRoute.ts
function taxonomyRoutes(app2, validateBody3) {
  const taxonomyController = new TaxonomyController();
  app2.post("/taxonomies", AuthMiddleware, validateBody3(taxonomySchema), taxonomyController.create.bind(taxonomyController));
  app2.get("/taxonomies", AuthMiddleware, taxonomyController.getAllTaxonomies.bind(taxonomyController));
  app2.get("/taxonomies/:id", taxonomyController.getTaxonomyById.bind(taxonomyController));
  app2.get("/taxonomiesSlug/:slug", taxonomyController.getTaxonomyBySlug.bind(taxonomyController));
  app2.put("/taxonomies/:id", AuthMiddleware, validateBody3(taxonomyUpdateSchema), taxonomyController.updateTaxonomy.bind(taxonomyController));
  app2.put("/archiveTaxonomies/:id", AuthMiddleware, taxonomyController.archivedTaxonomy.bind(taxonomyController));
  app2.put("/restoreTaxonomies/:id", AuthMiddleware, taxonomyController.restoreTaxonomy.bind(taxonomyController));
  app2.delete("/taxonomies/:id", AuthMiddleware, taxonomyController.deleteTaxonomyArchived.bind(taxonomyController));
}

// src/Controllers/TaxonomyTermController.ts
var taxonomyTermService2 = new TaxonomyTermService();
var TaxonomyTermController = class {
  async create(req, res) {
    try {
      const data = req.body;
      const result = await taxonomyTermService2.createTerm(data);
      return res.status(HTTP_STATUS_CREATED).json(result);
    } catch (error) {
      console.error("Erreur lors de la creation d'un terme", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getTermsByTaxonomy(req, res) {
    try {
      const items = await taxonomyTermService2.getTermsByTaxonomy(Number(req.params.taxonomyId));
      return res.status(HTTP_STATUS_OK).json(items);
    } catch (error) {
      console.error("Erreur lors de la recuperation des termes", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getTermById(req, res) {
    try {
      const item = await taxonomyTermService2.getTermById(Number(req.params.id));
      if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Terme non trouv\xE9" });
      return res.status(HTTP_STATUS_OK).json(item);
    } catch (error) {
      console.error("Erreur lors de la recuperation du terme", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getTermBySlug(req, res) {
    try {
      const { slug } = req.params;
      if (!slug) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre slug est manquant." });
      const item = await taxonomyTermService2.getTermBySlug(slug);
      if (!item) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Terme non trouv\xE9" });
      return res.status(HTTP_STATUS_OK).json(item);
    } catch (error) {
      console.error("Erreur lors de la recuperation du terme", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateTerm(req, res) {
    try {
      const result = await taxonomyTermService2.updateTerm(Number(req.params.id), req.body);
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de la mise \xE0 jour du terme", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deleteTerm(req, res) {
    try {
      const result = await taxonomyTermService2.deleteTerm(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de la suppression du terme", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getTaxonomyTermsByTaxonomyIds(req, res) {
    try {
      const { taxonomyIds } = req.params;
      if (!taxonomyIds) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre taxonomyIds est manquant." });
      const idsArray = taxonomyIds.split(",").map(Number).filter((n) => !isNaN(n));
      const result = await taxonomyTermService2.getTaxonomyTermsByTaxonomyIds(idsArray);
      if (!result) return res.status(HTTP_STATUS_NOT_FOUND).json({ error: "Taxonomie non trouv\xE9e ou archiv\xE9e" });
      return res.status(HTTP_STATUS_OK).json(result);
    } catch (error) {
      console.error("Erreur lors de la recuperation de la taxonomie", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Routes/TaxonomyTermRoute.ts
function taxonomyTermRoutes(app2, validateBody3) {
  const taxonomyTermController = new TaxonomyTermController();
  app2.post("/terms", AuthMiddleware, validateBody3(taxonomyTermSchema), taxonomyTermController.create.bind(taxonomyTermController));
  app2.get("/terms/taxonomy/:taxonomyId", AuthMiddleware, taxonomyTermController.getTermsByTaxonomy.bind(taxonomyTermController));
  app2.get("/terms/:id", taxonomyTermController.getTermById.bind(taxonomyTermController));
  app2.get("/termsSlug/:slug", taxonomyTermController.getTermBySlug.bind(taxonomyTermController));
  app2.put("/terms/:id", AuthMiddleware, validateBody3(taxonomyTermUpdateSchema), taxonomyTermController.updateTerm.bind(taxonomyTermController));
  app2.delete("/terms/:id", AuthMiddleware, taxonomyTermController.deleteTerm.bind(taxonomyTermController));
  app2.get("/taxonomiesTerms/:taxonomyIds", taxonomyTermController.getTaxonomyTermsByTaxonomyIds.bind(taxonomyTermController));
}

// src/Controllers/ComponentController.ts
var ComponentController = class {
  componentService;
  constructor() {
    this.componentService = new ComponentService();
  }
  async createComponent(req, res) {
    try {
      const components = await this.componentService.createComponents(req.body);
      res.status(HTTP_STATUS_CREATED).json(components);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getComponents(req, res) {
    try {
      const components = await this.componentService.getComponents(req.query);
      res.status(HTTP_STATUS_OK).json(components);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getComponentById(req, res) {
    try {
      const component = await this.componentService.getComponentById(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(component);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getComponentByTag(req, res) {
    const { tag } = req.params;
    try {
      if (!tag) return res.status(HTTP_STATUS_BAD_REQUEST).json({ message: "Le param\xE8tre tag est manquant." });
      const component = await this.componentService.getComponentByTag(tag);
      res.status(HTTP_STATUS_OK).json(component);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateComponent(req, res) {
    try {
      const component = await this.componentService.updateComponent(Number(req.params.id), req.body);
      res.status(HTTP_STATUS_OK).json(component);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deleteComponent(req, res) {
    try {
      const component = await this.componentService.deleteComponent(Number(req.params.id));
      res.status(HTTP_STATUS_OK).json(component);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/ComponentSchema.ts
import Joi12 from "joi";
var StaticFieldSchema = Joi12.object({
  source: Joi12.string().valid("static" /* STATIC */).required(),
  value: Joi12.alternatives().try(Joi12.string(), Joi12.number()).required()
});
var ImageFieldSchema = Joi12.object({
  source: Joi12.string().valid("image" /* IMAGE */).required(),
  src: Joi12.string().required(),
  id: Joi12.number().optional()
});
var ContenusFieldSchema = Joi12.object({
  source: Joi12.string().valid("contenus" /* CONTENUS */).required(),
  contentTypeId: Joi12.number().required(),
  config: Joi12.alternatives().try(
    // IContenusSingle
    Joi12.object({
      mode: Joi12.string().valid("single").required(),
      entryId: Joi12.number().required(),
      mappingField: Joi12.string().optional()
    }),
    // IContenusQuery
    Joi12.object({
      mode: Joi12.string().valid("query").required(),
      limit: Joi12.number().optional(),
      sortBy: Joi12.string().optional(),
      order: Joi12.string().valid("asc", "desc").optional(),
      taxonomyFilters: Joi12.array().items(Joi12.object({
        taxonomyId: Joi12.number().required(),
        termIds: Joi12.array().items(Joi12.number()).required(),
        operator: Joi12.string().valid("AND", "OR").required()
      })).optional()
    })
  ).required()
});
var ParentFieldSchema = Joi12.object({
  source: Joi12.string().valid("parent" /* PARENT */).required(),
  parentParamName: Joi12.string().required(),
  parentKey: Joi12.string().optional(),
  targetType: Joi12.string().valid("static" /* STATIC */, "image" /* IMAGE */).optional()
});
var PropsSchemaField = Joi12.alternatives().try(
  StaticFieldSchema,
  ImageFieldSchema,
  ContenusFieldSchema,
  ParentFieldSchema
);
var ComponentParamsSchema = Joi12.object({
  name: Joi12.string().required(),
  label: Joi12.string().required(),
  type: PropsSchemaField.required(),
  required: Joi12.boolean().required()
});
var componentPropsSchema = Joi12.object({
  styles: Joi12.object().unknown(true),
  // On garde l'ouverture pour les différents styles types
  params: Joi12.array().items(ComponentParamsSchema).optional(),
  data: Joi12.object().unknown(true).optional(),
  children: Joi12.array().items(Joi12.link("...")).optional()
  // Récursivité si nécessaire
});
var registerComponentSchema = Joi12.object({
  name: Joi12.string().required(),
  tag: Joi12.string().required(),
  icon: Joi12.string().required(),
  family: Joi12.string().valid("static", "interactive", "container", "input").required(),
  supportedActions: Joi12.array().items(Joi12.string().valid("NAVIGATE_TO", "SHOW_ALERT", "OPEN_MODAL")).required(),
  defaultProps: componentPropsSchema.required()
});
var ComponentListSchema = Joi12.array().items(registerComponentSchema);

// src/Routes/ComponentRoute.ts
function componentRoutes(app2, validateBody3) {
  const componentController = new ComponentController();
  app2.post("/components", AuthMiddleware, requirePermission(["create_page_revision", "update_page_revision"]), validateBody3(ComponentListSchema), componentController.createComponent.bind(componentController));
  app2.get("/components", AuthMiddleware, componentController.getComponents.bind(componentController));
  app2.get("/components/:id", componentController.getComponentById.bind(componentController));
  app2.get("/componentsSlug/:slug", componentController.getComponentByTag.bind(componentController));
}

// src/Controllers/SectionController.ts
var SectionController = class {
  sectionService;
  constructor() {
    this.sectionService = new SectionService();
  }
  async createSection(req, res) {
    try {
      console.log("section", req.body);
      const section = await this.sectionService.createSection(req.body);
      return res.status(HTTP_STATUS_CREATED).json(section);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getSections(req, res) {
    try {
      const sections = await this.sectionService.getSections(req.query);
      return res.status(HTTP_STATUS_OK).json(sections);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getSectionByRevisionId(req, res) {
    try {
      const section = await this.sectionService.getSectionByRevisionId(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(section);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Rendu d'une page complete
  // public async getFullPage(req: Request, res: Response){
  //     try {
  //         const section = await this.sectionService.renderPage(Number(req.params.id));
  //         return res.status(HTTP_STATUS_OK).json(section);
  //     } catch (error) {
  //         console.log(error);
  //         const errorMessage = handlePrismaError(error);
  //         return res.status(getErrorStatus(error)).json({ message: errorMessage });
  //     }
  // }
  async getSectionById(req, res) {
    try {
      const section = await this.sectionService.getSectionById(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(section);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateSection(req, res) {
    try {
      const section = await this.sectionService.updateSection(Number(req.params.id), req.body);
      return res.status(HTTP_STATUS_OK).json(section);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deleteSection(req, res) {
    try {
      const section = await this.sectionService.deleteSection(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(section);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/SectionSchama.ts
import Joi13 from "joi";
var registerSectionSchema = Joi13.object({
  pageRevisionId: Joi13.number().required(),
  order: Joi13.number().required(),
  block_json: componentPropsSchema.optional()
});
var updateSectionSchema = Joi13.object({
  pageRevisionId: Joi13.number().optional(),
  order: Joi13.number().optional(),
  block_json: componentPropsSchema.optional()
});

// src/Routes/SectionRoute.ts
function sectionRoutes(app2, validateBody3) {
  const sectionController = new SectionController();
  app2.post("/section", AuthMiddleware, requirePermission("create_page_revision"), validateBody3(registerSectionSchema), sectionController.createSection.bind(sectionController));
  app2.put("/section/:id", AuthMiddleware, requirePermission("update_page_revision"), sectionController.updateSection.bind(sectionController));
  app2.get("/section/:id", sectionController.getSectionById.bind(sectionController));
  app2.get("/section/revision/:id", sectionController.getSectionByRevisionId.bind(sectionController));
  app2.delete("/section/:id", AuthMiddleware, requirePermission("delete_page_revision"), sectionController.deleteSection.bind(sectionController));
}

// src/Controllers/BlocTemplateController.ts
var BlocTemplateController = class {
  blocTemplateService;
  constructor() {
    this.blocTemplateService = new BlocTemplateService();
  }
  async createBlocTemplate(req, res) {
    try {
      const data = req.body;
      const blocTemplate = await this.blocTemplateService.createBlocTemplate(data);
      return res.status(HTTP_STATUS_CREATED).json(blocTemplate);
    } catch (error) {
      console.log(error);
      console.log(error.message);
      return res.status(getErrorStatus(error)).json({ message: error.message });
    }
  }
  async getBlocTemplates(req, res) {
    try {
      const blocTemplates = await this.blocTemplateService.getBlocTemplates(req.query);
      return res.status(HTTP_STATUS_OK).json(blocTemplates);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getBlocTemplateById(req, res) {
    try {
      const blocTemplate = await this.blocTemplateService.getBlocTemplateById(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(blocTemplate);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  // Rendu d'un arbre de section
  async getTreeSection(req, res) {
    try {
      const blocTemplates = await this.blocTemplateService.getTreeSection(Number(req.params.sectionId));
      return res.status(HTTP_STATUS_OK).json(blocTemplates);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getBlocTemplatesCustom(req, res) {
    try {
      const blocTemplates = await this.blocTemplateService.getBlocTemplatesCustom();
      return res.status(HTTP_STATUS_OK).json(blocTemplates);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updateBlocTemplate(req, res) {
    try {
      console.log(req.body);
      const blocTemplate = await this.blocTemplateService.updateBlocTemplate(Number(req.params.id), req.body);
      return res.status(HTTP_STATUS_OK).json(blocTemplate);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deleteBlocTemplate(req, res) {
    try {
      const blocTemplate = await this.blocTemplateService.deleteBlocTemplate(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(blocTemplate);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/BlocTemplateSchema.ts
import Joi14 from "joi";
var registerBlocTemplateSchema = Joi14.object({
  componentId: Joi14.number().required(),
  sectionId: Joi14.number().required(),
  order: Joi14.number().required(),
  parentId: Joi14.number().optional(),
  default_json: componentPropsSchema.optional()
});
var updateBlocTemplateSchema = Joi14.object({
  name: Joi14.string().optional(),
  componentId: Joi14.number().optional(),
  sectionId: Joi14.number().optional(),
  order: Joi14.number().optional(),
  parentId: Joi14.number().optional(),
  default_json: componentPropsSchema.optional()
});

// src/Routes/BlocTemplateRoute.ts
function blocTemplateRoutes(app2, validateBody3) {
  const blocTemplateController = new BlocTemplateController();
  app2.post("/bloc-template", AuthMiddleware, requirePermission("create_page_revision"), blocTemplateController.createBlocTemplate.bind(blocTemplateController));
  app2.put("/bloc-template/:id", AuthMiddleware, requirePermission("update_page_revision"), blocTemplateController.updateBlocTemplate.bind(blocTemplateController));
  app2.get("/bloc-templates", blocTemplateController.getBlocTemplates.bind(blocTemplateController));
  app2.delete("/bloc-template/:id", AuthMiddleware, requirePermission("delete_page_revision"), blocTemplateController.deleteBlocTemplate.bind(blocTemplateController));
  app2.get("/bloc-template/:id", blocTemplateController.getBlocTemplateById.bind(blocTemplateController));
  app2.get("/bloc-template-tree/:sectionId", blocTemplateController.getTreeSection.bind(blocTemplateController));
  app2.get("/bloc-templates-components-custom", blocTemplateController.getBlocTemplatesCustom.bind(blocTemplateController));
}

// src/Services/PageRevisionService.ts
var PageRevisionService = class {
  buildWhereClause(filter) {
    const where = {};
    if (filter?.status) {
      where.status = filter.status;
    } else {
      where.status = { not: "ARCHIVED" };
    }
    return where;
  }
  async createPageRevision(data) {
    return PrismaClient_default.pageRevision.create({
      data
    });
  }
  async getPageRevisions(filter) {
    const data = await Paginator.paginate(PrismaClient_default.pageRevision, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      orderBy: { createdAt: "desc" },
      include: { sections: true }
    });
    return {
      ...data,
      results: data.results
    };
  }
  async getPageRevisionById(id) {
    const item = await PrismaClient_default.pageRevision.findUnique({
      where: { id },
      include: { sections: true }
    });
    if (!item) return null;
    return item;
  }
  async getPageRevisionsByPageId(id, filter) {
    const data = await Paginator.paginate(PrismaClient_default.pageRevision, {
      page: filter?.page,
      limit: filter?.limit,
      where: {
        ...this.buildWhereClause(filter),
        pageId: id
      },
      orderBy: { createdAt: "desc" },
      include: {
        sections: true,
        user: true
      }
    });
    return {
      ...data,
      results: data.results
    };
  }
  async updatePageRevision(id, data) {
    const pageRevisionUpdated = await PrismaClient_default.pageRevision.update({
      where: { id },
      data
    });
    return pageRevisionUpdated;
  }
  async deletePageRevision(id) {
    const pageRevisionDeleted = await PrismaClient_default.pageRevision.delete({
      where: { id }
    });
    return pageRevisionDeleted;
  }
  async syncPageRevisionTree(pageRevisionId, data) {
    const { default: SectionService2 } = await import("./SectionService-W2VJEJ5M.js");
    const { default: BlocTemplateService2 } = await import("./BlocTemplateService-YICF7VVI.js");
    const sectionService = new SectionService2();
    const blocTemplateService2 = new BlocTemplateService2();
    const validSectionIds = [];
    const validBlocIds = [];
    function collectBlocIds(blocks) {
      for (const b of blocks) {
        if (typeof b.blocTemplateId === "number") {
          validBlocIds.push(b.blocTemplateId);
        }
        if (b.children && Array.isArray(b.children)) {
          collectBlocIds(b.children);
        }
      }
    }
    for (const s of data.sections) {
      if (typeof s.sectionId === "number") validSectionIds.push(s.sectionId);
      if (s.children && Array.isArray(s.children)) {
        collectBlocIds(s.children);
      }
    }
    const existingSections = await PrismaClient_default.section.findMany({
      where: { pageRevisionId }
    });
    const existingSectionIds = existingSections.map((s) => s.id);
    if (existingSectionIds.length > 0) {
      await PrismaClient_default.blocTemplate.deleteMany({
        where: {
          sectionId: { in: existingSectionIds },
          id: { notIn: validBlocIds }
        }
      });
    }
    await PrismaClient_default.section.deleteMany({
      where: {
        pageRevisionId,
        id: { notIn: validSectionIds }
      }
    });
    async function syncBlocks(blocks, parentId, sectionId, is_custom) {
      for (let i = 0; i < blocks.length; i++) {
        const node = blocks[i];
        let currentBlocId = node.blocTemplateId;
        const payload = {
          componentId: node.componentDefinitionId || node.componentId,
          // Fallback
          order: node.order ?? i,
          parentId,
          sectionId: is_custom ? void 0 : sectionId,
          is_custom,
          props: {
            styles: node.styles || {},
            data: node.data || {},
            params: node.params || []
          },
          modelId: node.modelId ?? null
        };
        if (typeof currentBlocId !== "number") {
          const newBloc = await blocTemplateService2.createBlocTemplate(payload);
          currentBlocId = newBloc.id;
          node.blocTemplateId = currentBlocId;
          await blocTemplateService2.updateBlocTemplate(currentBlocId, payload);
        } else {
          try {
            await blocTemplateService2.updateBlocTemplate(currentBlocId, payload);
          } catch (error) {
            if (error.code === "P2025") {
              const recreatedBloc = await blocTemplateService2.createBlocTemplate(payload);
              node.blocTemplateId = recreatedBloc.id;
              await blocTemplateService2.updateBlocTemplate(node.blocTemplateId, payload);
            } else {
              throw error;
            }
          }
        }
        if (node.children && Array.isArray(node.children)) {
          await syncBlocks(node.children, currentBlocId, sectionId, is_custom);
        }
      }
    }
    for (let i = 0; i < data.sections.length; i++) {
      const sectionNode = data.sections[i];
      let currentSectionId = sectionNode.sectionId;
      const sectionPayload = {
        pageRevisionId,
        order: sectionNode.order ?? i,
        block_json: { styles: sectionNode.styles || {} }
      };
      if (typeof currentSectionId !== "number") {
        const newSection = await sectionService.createSection(sectionPayload);
        currentSectionId = newSection.id;
        sectionNode.sectionId = currentSectionId;
        await sectionService.updateSection(currentSectionId, sectionPayload);
      } else {
        try {
          await sectionService.updateSection(currentSectionId, sectionPayload);
        } catch (error) {
          if (error.code === "P2025") {
            const newSection = await sectionService.createSection(sectionPayload);
            currentSectionId = newSection.id;
            sectionNode.sectionId = currentSectionId;
            await sectionService.updateSection(currentSectionId, sectionPayload);
          } else {
            throw error;
          }
        }
      }
      if (sectionNode.children && Array.isArray(sectionNode.children)) {
        await syncBlocks(sectionNode.children, null, currentSectionId, false);
      }
    }
    const updatedSections = await PrismaClient_default.section.findMany({
      where: { pageRevisionId },
      orderBy: { order: "asc" }
    });
    const syncedTree = [];
    for (const s of updatedSections) {
      const rootNodesJSON = await blocTemplateService2.getTreeSection(s.id);
      syncedTree.push({
        id: sectionNodeIdOverride(s.id),
        // UUID generator can't be used securely here, frontend reconstructs the UUIDs on fetchAll
        sectionId: s.id,
        order: s.order,
        family: "section",
        styles: s.block_json?.styles || {},
        children: rootNodesJSON
        // For the moment, we return it. Frontend `buildTreeFromTemplates` will process this
      });
    }
    return syncedTree;
  }
};
function sectionNodeIdOverride(sectionId) {
  return "temp-" + sectionId;
}

// src/Controllers/PageRevisionController.ts
var PageRevisionController = class {
  pageRevisionService;
  constructor() {
    this.pageRevisionService = new PageRevisionService();
  }
  async createPageRevision(req, res) {
    try {
      const data = req.body;
      const pageRevision = await this.pageRevisionService.createPageRevision({
        ...data,
        pageId: Number(data.pageId),
        userId: req.user?.sub
      });
      return res.status(HTTP_STATUS_CREATED).json(pageRevision);
    } catch (error) {
      console.log("Erreur lors de la creation de la pageRevision:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getPageRevisions(req, res) {
    try {
      const pageRevisions = await this.pageRevisionService.getPageRevisions(req.query);
      return res.status(HTTP_STATUS_OK).json(pageRevisions);
    } catch (error) {
      console.log("Erreur lors de la recuperation des pageRevisions:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getPageRevisionById(req, res) {
    try {
      const pageRevision = await this.pageRevisionService.getPageRevisionById(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(pageRevision);
    } catch (error) {
      console.log("Erreur lors de la recuperation de la pageRevision:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getPageRevisionsByPageId(req, res) {
    try {
      const pageRevision = await this.pageRevisionService.getPageRevisionsByPageId(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(pageRevision);
    } catch (error) {
      console.log("Erreur lors de la recuperation des pageRevisions:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updatePageRevision(req, res) {
    try {
      const pageRevision = await this.pageRevisionService.updatePageRevision(Number(req.params.id), req.body);
      return res.status(HTTP_STATUS_OK).json(pageRevision);
    } catch (error) {
      console.log("Erreur lors de la mise a jour de la pageRevision:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deletePageRevision(req, res) {
    try {
      const pageRevision = await this.pageRevisionService.deletePageRevision(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(pageRevision);
    } catch (error) {
      console.error("Erreur lors de la suppression de la pageRevision:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async syncPageRevisionTree(req, res) {
    try {
      const pageRevisionId = Number(req.params.id);
      const data = req.body;
      const syncedSections = await this.pageRevisionService.syncPageRevisionTree(pageRevisionId, data);
      return res.status(HTTP_STATUS_OK).json(syncedSections);
    } catch (error) {
      console.error("Erreur lors de la synchronisation en masse:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Utils/Validations/PageRevision.ts
import Joi15 from "joi";
var updatePageRevisionSchema = Joi15.object({
  pageId: Joi15.number().optional(),
  status: Joi15.string().optional(),
  version: Joi15.number().optional()
});

// src/Routes/PageRevisionRoute.ts
function pageRevisionRoutes(app2, validateBody3) {
  const pageRevisionController = new PageRevisionController();
  app2.get("/page-revision", AuthMiddleware, requirePermission("read_page_revision"), pageRevisionController.getPageRevisions.bind(pageRevisionController));
  app2.post("/page-revision", AuthMiddleware, requirePermission("create_page_revision"), pageRevisionController.createPageRevision.bind(pageRevisionController));
  app2.get("/page-revision/:id", AuthMiddleware, requirePermission("read_page_revision"), pageRevisionController.getPageRevisionById.bind(pageRevisionController));
  app2.get("/page-revisions/page/:id", AuthMiddleware, requirePermission("read_page_revision"), pageRevisionController.getPageRevisionsByPageId.bind(pageRevisionController));
  app2.put("/page-revision/:id", AuthMiddleware, requirePermission("update_page_revision"), validateBody3(updatePageRevisionSchema), pageRevisionController.updatePageRevision.bind(pageRevisionController));
  app2.post("/page-revision/:id/sync", AuthMiddleware, requirePermission("update_page_revision"), pageRevisionController.syncPageRevisionTree.bind(pageRevisionController));
  app2.delete("/page-revision/:id", AuthMiddleware, requirePermission("delete_page_revision"), pageRevisionController.deletePageRevision.bind(pageRevisionController));
}

// src/Utils/Validations/PageSchema.ts
import Joi16 from "joi";
var registerPageSchema = Joi16.object({
  name: Joi16.string().required(),
  slug: Joi16.string().required()
});
var updatePageSchema = Joi16.object({
  name: Joi16.string().optional(),
  slug: Joi16.string().optional()
});

// src/Services/PageService.ts
var blocTemplateService = new BlocTemplateService();
var PageService = class {
  buildWhereClause(filter) {
    const where = {};
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { name: { contains: query } },
        { slug: { contains: query } },
        {
          user: {
            full_name: {
              contains: query
            }
          }
        }
      ];
    }
    return where;
  }
  async createPage(data) {
    return PrismaClient_default.page.create({
      data: {
        ...data,
        pageRevisions: {
          create: {
            userId: data.userId
          }
        },
        navItem: {
          create: {
            label: data.name,
            value: `${data.slug}`
          }
        }
      },
      include: { pageRevisions: true, navItem: true }
    });
  }
  async getPages(filter) {
    const data = await Paginator.paginate(PrismaClient_default.page, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      orderBy: { createdAt: "desc" },
      include: {
        pageRevisions: true,
        user: true
      }
    });
    return {
      ...data,
      results: data.results
    };
  }
  async getPageById(id) {
    const item = await PrismaClient_default.page.findUnique({
      where: { id },
      include: {
        pageRevisions: true,
        user: true
      }
    });
    if (!item) return null;
    return item;
  }
  async updatePage(id, data) {
    const pageUpdated = await PrismaClient_default.page.update({
      where: { id },
      data
    });
    return pageUpdated;
  }
  async deletePage(id) {
    const pageDeleted = await PrismaClient_default.page.delete({
      where: { id }
    });
    return pageDeleted;
  }
  async renderPage(slug) {
    const page = await PrismaClient_default.page.findUnique({
      where: { slug },
      include: {
        pageRevisions: {
          where: { status: "PUBLISHED" },
          include: {
            sections: {
              include: {
                blocTemplates: {
                  include: { component: true, model: true }
                  // Important pour le tag
                }
              }
            }
          }
        }
      }
    });
    if (!page || !page.pageRevisions[0]) return null;
    const revision = page.pageRevisions[0];
    const layout = await Promise.all(
      revision.sections.map(async (section) => {
        const sectionProps = typeof section.block_json === "string" ? JSON.parse(section.block_json) : section.block_json;
        return {
          id: section.id,
          order: section.order,
          styles: sectionProps,
          data: {},
          children: await blocTemplateService.buildRecursiveTree(
            section.blocTemplates,
            null
          )
        };
      })
    );
    return {
      slug: page.slug,
      layout
      // C'est ce JSON que le Frontend recevra
    };
  }
};

// src/Controllers/PageController.ts
var PageController = class {
  pageService;
  constructor() {
    this.pageService = new PageService();
  }
  async createPage(req, res) {
    console.log("Creation de page", req.body);
    try {
      const data = req.body;
      const page = await this.pageService.createPage({
        ...data,
        userId: req.user?.sub
      });
      return res.status(HTTP_STATUS_CREATED).json(page);
    } catch (error) {
      console.error("Erreur lors de la creation de la revision:", error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getPages(req, res) {
    try {
      const filters = RequestHelper.getFilters(req);
      const pages = await this.pageService.getPages(filters);
      return res.status(HTTP_STATUS_OK).json(pages);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async getPageById(req, res) {
    try {
      const page = await this.pageService.getPageById(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(page);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async updatePage(req, res) {
    try {
      const page = await this.pageService.updatePage(Number(req.params.id), req.body);
      return res.status(HTTP_STATUS_OK).json(page);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async deletePage(req, res) {
    try {
      const page = await this.pageService.deletePage(Number(req.params.id));
      return res.status(HTTP_STATUS_OK).json(page);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
  async renderFullPage(req, res) {
    const { slug } = req.params;
    try {
      if (!slug) {
        const pageRender2 = await this.pageService.renderPage("/");
        return res.status(HTTP_STATUS_OK).json(pageRender2);
      }
      const pageRender = await this.pageService.renderPage("/" + slug);
      return res.status(HTTP_STATUS_OK).json(pageRender);
    } catch (error) {
      console.log(error);
      const errorMessage = handlePrismaError(error);
      return res.status(getErrorStatus(error)).json({ message: errorMessage });
    }
  }
};

// src/Routes/PageRoute.ts
function pageRoutes(app2, validateBody3) {
  const pageController = new PageController();
  app2.get("/pages", AuthMiddleware, requirePermission("read_page"), pageController.getPages.bind(pageController));
  app2.post("/page", AuthMiddleware, requirePermission("create_page"), validateBody3(registerPageSchema), pageController.createPage.bind(pageController));
  app2.get("/page/:id", AuthMiddleware, requirePermission("read_page"), pageController.getPageById.bind(pageController));
  app2.put("/page/:id", AuthMiddleware, requirePermission("update_page"), validateBody3(updatePageSchema), pageController.updatePage.bind(pageController));
  app2.delete("/page/:id", AuthMiddleware, requirePermission("delete_page"), pageController.deletePage.bind(pageController));
  app2.get("/renderPage/:slug", pageController.renderFullPage.bind(pageController));
  app2.get("/renderPage", pageController.renderFullPage.bind(pageController));
}

// src/Routes/NavItemRoute.ts
import { Router } from "express";

// src/Services/NavItemService.ts
var NavItemService = class {
  async createNavItem(data) {
    return PrismaClient_default.navItem.create({
      data
    });
  }
  async getNavItems() {
    return PrismaClient_default.navItem.findMany({
      where: {
        parentId: null,
        // Top level items
        page: {
          pageRevisions: {
            some: {
              status: "PUBLISHED"
            }
          }
        }
      },
      include: {
        children: {
          include: {
            children: true
            // Adjust depth as necessary
          }
        },
        page: true
      },
      orderBy: {
        id: "asc"
      }
    });
  }
  async getNavItemById(id) {
    return PrismaClient_default.navItem.findUnique({
      where: { id },
      include: {
        children: true,
        page: true
      }
    });
  }
  async updateNavItem(id, data) {
    return PrismaClient_default.navItem.update({
      where: { id },
      data
    });
  }
  async deleteNavItem(id) {
    return PrismaClient_default.navItem.delete({
      where: { id }
    });
  }
};

// src/Controllers/NavItemController.ts
var navItemService = new NavItemService();
var createNavItem = async (req, res) => {
  try {
    const item = req.body;
    const result = await navItemService.createNavItem(item);
    res.status(HTTP_STATUS_CREATED).json(result);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
var getNavItems = async (req, res) => {
  try {
    const result = await navItemService.getNavItems();
    res.status(HTTP_STATUS_OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
var getNavItemById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Invalid ID" });
    const result = await navItemService.getNavItemById(id);
    if (!result) return res.status(HTTP_STATUS_NOT_FOUND).json({ message: "NavItem not found" });
    res.status(HTTP_STATUS_OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
var updateNavItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Invalid ID" });
    const data = req.body;
    const result = await navItemService.updateNavItem(id, data);
    res.status(HTTP_STATUS_OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};
var deleteNavItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(HTTP_STATUS_BAD_REQUEST).json({ error: "Invalid ID" });
    const result = await navItemService.deleteNavItem(id);
    res.status(HTTP_STATUS_OK).json(result);
  } catch (error) {
    res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
};

// src/Routes/NavItemRoute.ts
var navItemRoutes = (app2) => {
  const router = Router();
  router.post("/", createNavItem);
  router.get("/", getNavItems);
  router.get("/:id", getNavItemById);
  router.put("/:id", updateNavItem);
  router.delete("/:id", deleteNavItem);
  app2.use("/api/nav-item", router);
};

// src/Routes/Routes.ts
var Routes_default = (app2) => {
  authRoutes(app2, ValidateBoody_default);
  userRoutes(app2, ValidateBoody_default);
  roleRoutes(app2, ValidateBoody_default);
  permissionRoutes(app2, ValidateBoody_default);
  mediaRoutes(app2);
  variableRoutes(app2);
  parameterRoutes(app2);
  mockRoutes(app2);
  contentTypeRoutes(app2, ValidateBoody_default);
  contentEntryRoutes(app2);
  taxonomyRoutes(app2, ValidateBoody_default);
  taxonomyTermRoutes(app2, ValidateBoody_default);
  componentRoutes(app2, ValidateBoody_default);
  sectionRoutes(app2, ValidateBoody_default);
  blocTemplateRoutes(app2, ValidateBoody_default);
  pageRevisionRoutes(app2, ValidateBoody_default);
  pageRoutes(app2, ValidateBoody_default);
  navItemRoutes(app2);
};

// src/index.ts
import cors from "cors";
import cookieParser from "cookie-parser";

// src/Utils/Constantes/CorsOptions.ts
import dotenv from "dotenv";
dotenv.config();
var front_url = process.env.FRONT_APP_URL;
var corsOptions = {
  origin: front_url,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204
};

// src/index.ts
import path4 from "path";
dotenv2.config();
var port = parseInt(process.env.PORT || "3000", 10);
var app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.set("trust proxy", 1);
app.use(cookieParser());
app.use("/media", express.static(path4.join(process.cwd(), "media")));
Routes_default(app);
app.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port ${port}`);
  console.log("Couper le serveur avec Ctrl+C");
});
