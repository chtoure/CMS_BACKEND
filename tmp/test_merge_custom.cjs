const merge = require('lodash/merge');
const mergeWith = require('lodash/mergeWith');

function customMerge(objValue, srcValue) {
  if (Array.isArray(srcValue)) {
    return srcValue; // Replace arrays entirely
  }
  // Check if it's a VariableProperty
  if (srcValue && typeof srcValue === 'object' && 'type' in srcValue && 'value' in srcValue) {
    if (srcValue.type === 'static' || srcValue.type === 'variable') {
      return srcValue; // Replace VariableProperty entirely
    }
  }
}

const model = {
  marginTop: { type: 'static', value: { default: '10px', md: '20px' } }
};

const diff = {
  marginTop: { type: 'static', value: { default: '20px' } }
};

console.log('Deep merge:', JSON.stringify(merge({}, model, diff)));
console.log('Custom merge:', JSON.stringify(mergeWith({}, model, diff, customMerge)));
