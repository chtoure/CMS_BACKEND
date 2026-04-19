import { StyleInheritance } from "./src/Utils/StyleInheritance.ts";

const modelProps = {
    styles: {
        width: { type: 'static', staticValue: '100px' },
        height: { type: 'static', staticValue: '100px' },
    },
    data: {
        title: "Hello"
    }
};

const instanceProps = {
    styles: {
        width: { type: 'variable', staticValue: '50px' }
    },
    data: {
        title: "Override"
    }
};

const merged = StyleInheritance.merge(modelProps, instanceProps);
console.log(JSON.stringify(merged, null, 2));
