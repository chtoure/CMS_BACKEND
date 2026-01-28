import type { Request, Response } from "express";
import { FieldType, type IFieldDefinition } from "../Types/InputField.ts";
import type { ContentEntry } from "../Types/ContentEntry.ts";

export const getContentEntryMock = (req: Request, res: Response) => {
    const blogSchema: ContentEntry[] = [
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
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
            status: 'DRAFT',
            createdAt: new Date(),
            updatedAt: new Date(),
            archive: false,
            archivedAt: null
        }
    ];


    return res.status(200).json(blogSchema);
};