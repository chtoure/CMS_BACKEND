import type { Request, Response } from "express";
import { FieldType, type IFieldDefinition } from "../Types/InputField.ts";

export const getContentTypeMock = (req: Request, res: Response) => {
    const blogSchema: IFieldDefinition[] = [
        {
            name: "title",
            label: "Titre de l'article",
            type: FieldType.TEXT,
            required: true,
            placeholder: "Ex: Les tendances tech 2026",
            minLength: 5
        },
        {
            name: "content",
            label: "Corps de l'article",
            type: FieldType.RICH_TEXT,
            required: true,
            toolbar: "full"
        },
        {
            name: "price_pro",
            label: "Prix (Accès Premium)",
            type: FieldType.NUMBER,
            required: false,
            min: 0,
            step: 0.01
        },
        {
            name: "thumbnail",
            label: "Image de couverture",
            type: FieldType.MEDIA,
            required: true,
            allowedTypes: ["image"],
            multiple: false
        },
        {
            name: "category",
            label: "Catégorie",
            type: FieldType.TAXONOMY,
            required: true,
            taxonomy_slug: "blog-categories",
            multiple: false,
            renderType: "combobox"
        },
        {
            name: "is_published",
            label: "Visible immédiatement ?",
            type: FieldType.BOOLEAN,
            required: true,
            defaultValue: true
        }
        ];

    return res.status(200).json({
        id: 1,
        name: "Article de Blog",
        slug: "blog",
        fields_schema: blogSchema
    });
};