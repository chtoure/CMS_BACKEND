import mergeWith from 'lodash/mergeWith.js';

export class StyleInheritance {
    /**
     * Personnalisation du merge pour lodash.
     * Les VariableProperty et les tableaux sont remplacés entièrement, pas fusionnés en profondeur.
     */
    static customMerge(objValue: any, srcValue: any): any {
        if (Array.isArray(srcValue)) {
            return srcValue; // Remplace les tableaux
        }
        if (srcValue !== null && typeof srcValue === 'object' && 'type' in srcValue) {
            const t = srcValue.type;
            // Remplacement atomique des VariableProperty et MediaProperty
            if (t === 'static' || t === 'variable' || t === 'media') {
                return srcValue;
            }
        }
        return undefined; // Laisse lodash faire le merge par défaut
    }

    /**
     * Fusionne les propriétés du modèle avec les propriétés de l'instance.
     * L'instance a priorité sur le modèle.
     */
    static merge(modelProps: any, instanceProps: any): any {
        return mergeWith({}, modelProps ?? {}, instanceProps ?? {}, this.customMerge);
    }

    /**
     * Applique l'héritage de manière récursive sur un arbre de blocs.
     */
    static applyInheritance(bloc: any): any {
        if (!bloc) return bloc;

        let effectiveProps = bloc.props || {};

        // Si le bloc a un modèle chargé, on fusionne
        if (bloc.model?.props) {
            effectiveProps = this.merge(bloc.model.props, effectiveProps);
        }

        // On traite les enfants récursivement
        const children = bloc.children?.map((child: any) => this.applyInheritance(child));

        return {
            ...bloc,
            props: effectiveProps,
            children: children
        };
    }

    /**
     * Calcule les propriétés effectives totales d'un bloc (Modèle + Instance).
     */
    static computeEffectiveProps(bloc: any): any {
        if (!bloc) return {};
        const baseProps = bloc.model?.props ? this.computeEffectiveProps(bloc.model) : {};
        return this.merge(baseProps, bloc.props);
    }

    /**
     * Vérifie si un objet est une propriété atomique (VariableProperty ou MediaProperty).
     * Ces objets doivent être remplacés entièrement, jamais fusionnés en profondeur.
     */
    static isAtomicProperty(obj: any): boolean {
        if (obj === null || typeof obj !== 'object') return false;
        if (!('type' in obj)) return false;
        return obj.type === 'static' || obj.type === 'variable' || obj.type === 'media';
    }

    /**
     * Calcule uniquement les propriétés qui diffèrent entre le modèle et les propriétés soumises.
     * C'est une opération de "diff" profond.
     */
    static computeOverrides(modelProps: any, submittedProps: any): any {
        if (!modelProps) return submittedProps;
        const diff: any = {};

        Object.keys(submittedProps).forEach(key => {
            const modelVal = modelProps[key];
            const submittedVal = submittedProps[key];

            // Si c'est un tableau ou une propriété atomique (Variable/Media), on remplace entièrement
            if (this.isAtomicProperty(submittedVal) || Array.isArray(submittedVal)) {
                if (JSON.stringify(modelVal) !== JSON.stringify(submittedVal)) {
                    diff[key] = submittedVal;
                }
            }
            // Si les valeurs sont des objets classiques, on fait une comparaison récursive
            else if (
                typeof submittedVal === 'object' && 
                submittedVal !== null && 
                typeof modelVal === 'object' && 
                modelVal !== null
            ) {
                const nestedDiff = this.computeOverrides(modelVal, submittedVal);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } 
            // Sinon on compare les valeurs directement (égalité simple pour les types primitifs)
            else if (JSON.stringify(modelVal) !== JSON.stringify(submittedVal)) {
                diff[key] = submittedVal;
            }
        });

        return diff;
    }
}
