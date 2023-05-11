import path from 'path'
import parse from 'eft-parser'
import JSON5 from 'json5'
import camelCase from 'camelcase'
import {createFilter} from 'rollup-pluginutils'

export default (options = {}) => {
	const { include = ['**/*.ef', '**/*.eft', '**/*.efml'], exclude, useJSONParse } = options
	const filter = createFilter(include, exclude)

	return {
		name: 'eft',
		transform(template, id) {
			if (!filter(id)) return

			const fileName = path.parse(id).name

			const importLines = []
			const exportLines = []
			let componentName = camelCase(fileName, {pascalCase: true})
			let componentScope = null
			let componentData = null
			let componentMethods = null

			const commentHandler = ({depth, content}) => {
				if (depth > 0) return
				if (content[0] !== '!') return

				content = content.slice(1).trim()

				const splitedContent = content.split(/\s+/)
				const directive = splitedContent.shift()

				switch (directive) {
					case 'import': {
						importLines.push(content)
						break
					}
					case 'export': {
						exportLines.push(content)
						break
					}
					case 'scope': {
						componentScope = content.match(/{.+}/)
						break
					}
					case 'name': {
						componentName = camelCase(splitedContent.join('_'), {pascalCase: true})
						break
					}
					case 'data': {
						componentData = content.match(/{.+}/)
						break
					}
					case 'methods': {
						componentMethods = content.match(/{.+}/)
						break
					}
					default: {
						throw new TypeError(`[EFML] Unknown directive "${directive}"`)
					}
				}

			}

			let ast = parse(template, commentHandler)

			if (useJSONParse) {
				ast = JSON.stringify(JSON.stringify(ast))
			} else {
				ast = JSON5.stringify(ast)
			}

			const code = [
				...importLines,
				`import { create } from 'ef-core'`,
				`export default class ${componentName} extends create(${useJSONParse && 'JSON.parse(' || ''}${ast}${useJSONParse && ')' || ''}) {${componentData && `
	static initData() {
		return ${componentData}
	}` || ''}${componentMethods && `
	static initMethods() {
		return ${componentMethods}
	}` || ''}${componentScope && `
	static __defaultScope() {
		return ${componentScope}
	}` || ''}
}`,
				...exportLines,
				''
			].join(';\n')

			return {
				code,
				map: { mappings: '' }
			}
		}
	}
}
