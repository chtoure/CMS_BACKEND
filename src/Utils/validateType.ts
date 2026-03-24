const validateValueByType = (type: string, value: string | number | boolean): boolean => {
    switch (type) {
        case 'COLOR':
            return /^#?([0-9A-F]{3,4}|[0-9A-F]{6}|[0-9A-F]{8})$/i.test(String(value));
        case 'NUMBER':
            return !isNaN(parseFloat(String(value))) && isFinite(Number(value));
        case 'BOOLEAN':
            const val = String(value).toLowerCase();
            return val === 'true' || val === 'false' || val === '0' || val === '1';
        case 'STRING':
            return typeof value === 'string';
        default:
            return false;
    }
}

export {
    validateValueByType
}
