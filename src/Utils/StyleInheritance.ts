import merge from 'lodash/merge.js';

export class StyleInheritance {
    /**
     * Fusionne les propriétés du modèle avec les propriétés de l'instance.
     * L'instance a priorité sur le modèle.
     */
    static merge(modelProps: any, instanceProps: any): any {
        return merge({}, modelProps ?? {}, instanceProps ?? {});
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
     * Calcule uniquement les propriétés qui diffèrent entre le modèle et les propriétés soumises.
     * C'est une opération de "diff" profond.
     */
    static computeOverrides(modelProps: any, submittedProps: any): any {
        if (!modelProps) return submittedProps;
        const diff: any = {};

        Object.keys(submittedProps).forEach(key => {
            const modelVal = modelProps[key];
            const submittedVal = submittedProps[key];

            // Si les valeurs sont des objets (mais pas des tableaux), on fait une comparaison récursive
            if (
                typeof submittedVal === 'object' && 
                submittedVal !== null && 
                !Array.isArray(submittedVal) &&
                typeof modelVal === 'object' && 
                modelVal !== null
            ) {
                const nestedDiff = this.computeOverrides(modelVal, submittedVal);
                if (Object.keys(nestedDiff).length > 0) {
                    diff[key] = nestedDiff;
                }
            } 
            // Sinon on compare les valeurs directement (égalité simple pour les types primitifs ou tableaux)
            else if (JSON.stringify(modelVal) !== JSON.stringify(submittedVal)) {
                diff[key] = submittedVal;
            }
        });

        return diff;
    }
}
