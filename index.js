const parse = require('eft-parser')
const createFilter = require('rollup-pluginutils').createFilter

const codeTemplate = `
const ef = require('ef.js');
const ast = __AST__;
module.exports = new ef(ast);
`

module.exports = (options = {}) => {
	const { include = ['*.eft', '**/*.eft'], exclude } = options;
	const filter = createFilter(include, exclude);

	return {
		transform(template, id) {
			return filter(id) ? { code: codeTemplate.replace('__AST__', JSON.stringify(parse(template))), map: { mappings: '' } } : null;
		}
	}
}