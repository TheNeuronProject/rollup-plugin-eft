const parse = require('eft-parser')
const createFilter = require('rollup-pluginutils').createFilter

const efAlias = '__$ef'

const codeTemplate = `
import ${efAlias} from 'ef.js'
export default new ${efAlias}(__AST__)
`

module.exports = (options = {}) => {
	const { include = ['*.eft', '**/*.eft'], exclude } = options
	const filter = createFilter(include, exclude)

	return {
		name: 'eft',
		transform(template, id) {
			if (!filter(id)) return
			return {
				code: codeTemplate.replace('__AST__', JSON.stringify(parse(template))),
				map: { mappings: '' }
			}
		}
	}
}
