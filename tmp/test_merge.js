const merge = require('lodash/merge');

const model = {
  marginTop: { type: 'static', value: { default: '10px' } }
};

const diff1 = {
  marginTop: { type: 'variable', value: 'var1' }
};

const diff2 = {
  marginTop: { value: { default: '20px' } } // override just value
};

console.log('Test 1 (static object -> variable primitive):', JSON.stringify(merge({}, model, diff1)));
console.log('Test 2 (static object -> static object value override):', JSON.stringify(merge({}, model, diff2)));

const model2 = {
  marginTop: { type: 'variable', value: 'var1' }
};

const diff3 = {
  marginTop: { type: 'static', value: { default: '20px' } }
};

console.log('Test 3 (variable primitive -> static object):', JSON.stringify(merge({}, model2, diff3)));
