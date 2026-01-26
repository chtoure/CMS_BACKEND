import ContentEntryService from "../Services/ContentEntryService.ts";
import ContentTypeService from "../Services/ContentTypeService.ts";
import type { ContentEntry } from "../Types/ContentEntry.ts";
import { FieldType } from "../Types/InputField.ts";

interface FieldRelation {
    contentTypeId: number;
    name: string;
}

const canDeleteContentEntry = async (id:number): Promise<boolean> => {

    const contentEntryService = new ContentEntryService();
    const contentTypeService = new ContentTypeService();

    const contentEntry = await contentEntryService.getContentEntryById(id);

    const contentType= await contentTypeService.getContentTypeById(contentEntry?.contentTypeId!);

    const contentTypes = await contentTypeService.getAllContentsNoPaginate();

    let isReferenced = false;
    let fields:FieldRelation[] = [];

    contentTypes.forEach(ctype => {
        ctype.fields_schema.forEach(field => {
            if (field.type === FieldType.RELATION) {
                if(field.contentTypeId == contentType?.id){
                    isReferenced = true;
                    fields.push({
                        contentTypeId: ctype.id,
                        name: field.name
                    });
                }
            }
        });
    });
    
    if (!isReferenced) {
        return true;
    }

    let hasContentEntry = false;

    for (const field of fields) {
        const contentEntrys: ContentEntry[] = await contentEntryService.getContentEntriesByContentTypeID(field.contentTypeId);

        for (const contentEntry of contentEntrys) {
            if (contentEntry.data_json) {
                const data = contentEntry.data_json as Record<string, any>;
                const value = data[field.name];

                const isMatch = Array.isArray(value) 
                    ? value.includes(id) 
                    : value === id;

                if (isMatch) {
                    hasContentEntry = true;
                    return false; 
                }
            }
        }
    }

    if (hasContentEntry) {
        return false;
    }

    return true;
}


export {
    canDeleteContentEntry
}