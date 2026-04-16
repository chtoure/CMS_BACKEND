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
     * Fusionne les styles (props) du modèle avec ceux de l'instance.
     * L'instance a priorité sur le modèle.
     * Utilise le customMerge pour traiter correctement les VariableProperty et les tableaux.
     */
    static merge(modelProps: any, instanceProps: any): any {
        return mergeWith({}, modelProps ?? {}, instanceProps ?? {}, this.customMerge);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // DATA INHERITANCE
    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Personnalisation du merge pour les données (data).
     * Les VariableProperty ({ type: 'static'|'variable'|'media' }) et les tableaux
     * sont remplacés entièrement depuis l'instance, jamais fusionnés en profondeur.
     */
    static customDataMerge(objValue: any, srcValue: any): any {
        // Remplacement atomique des VariableProperty et des tableaux
        if (Array.isArray(srcValue)) return srcValue;
        if (
            srcValue !== null &&
            typeof srcValue === 'object' &&
            'type' in srcValue &&
            (srcValue.type === 'static' || srcValue.type === 'variable' || srcValue.type === 'media')
        ) {
            return srcValue;
        }
        return undefined; // Laisse lodash faire le merge par défaut
    }

    /**
     * Fusionne le data du modèle avec le data de l'instance.
     * L'instance a priorité sur le modèle.
     */
    static mergeData(modelData: any, instanceData: any): any {
        return mergeWith({}, modelData ?? {}, instanceData ?? {}, this.customDataMerge);
    }

    /**
     * Applique l'héritage de manière récursive sur un arbre de blocs.
     * Fusionne à la fois les `styles` (props) et le `data` du modèle vers l'instance.
     */
    static applyInheritance(bloc: any): any {
        if (!bloc) return bloc;

        let effectiveProps = bloc.props || {};

        // Si le bloc a un modèle chargé, on fusionne les styles ET le data
        if (bloc.model?.props) {
            const modelProps = bloc.model.props;

            // Merge des styles (logique existante)
            effectiveProps = this.merge(modelProps, effectiveProps);

            // Merge du data : le data du modèle sert de base, l'instance surcharge
            const mergedData = this.mergeData(
                modelProps.data ?? {},
                effectiveProps.data ?? {}
            );
            effectiveProps = { ...effectiveProps, data: mergedData };
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
     * Calcule les propriétés (styles) effectives totales d'un bloc (Modèle + Instance).
     */
    static computeEffectiveProps(bloc: any): any {
        if (!bloc) return {};
        const baseProps = bloc.model?.props ? this.computeEffectiveProps(bloc.model) : {};
        return this.merge(baseProps, bloc.props);
    }

    /**
     * Calcule le data effectif total d'un bloc (Modèle + Instance).
     */
    static computeEffectiveData(bloc: any): any {
        if (!bloc) return {};
        const baseData = bloc.model?.props?.data
            ? this.computeEffectiveData(bloc.model)
            : {};
        return this.mergeData(baseData, bloc.props?.data ?? {});
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
     * Calcule uniquement les propriétés (styles) qui diffèrent entre le modèle et les propriétés soumises.
     * C'est une opération de "diff" profond utilisée pour ne stocker que les surcharges en base.
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

    /**
     * Calcule uniquement les champs data qui diffèrent entre le modèle et le data soumis.
     * Utilisé pour ne stocker que les surcharges de data en base (même logique que computeOverrides).
     */
    static computeDataOverrides(modelData: any, submittedData: any): any {
        return this.computeOverrides(modelData ?? {}, submittedData ?? {});
    }
}
