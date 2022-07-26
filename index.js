import path from 'path'
import parse from 'eft-parser'
import camelCase from 'camelcase'
import {createFilter} from 'rollup-pluginutils'

export default (options = {}) => {
	const { include = ['**/*.ef', '**/*.eft', '**/*.efml'], exclude } = options
	const filter = createFilter(include, exclude)

	return {
		name: 'eft',
		transform(template, id) {
			if (!filter(id)) return

			const fileName = path.parse(id).name

			const imports = []
			let componentName = camelCase(fileName, {pascalCase: true})
			let componentScope = null

			const commentHandler = ({depth, content}) => {
				if (depth > 0) return
				if (content[0] !== '!') return

				content = content.slice(1).trim()

				const splitedContent = content.split(/\s+/)
				const directive = splitedContent.shift()

				switch (directive) {
					case 'import': {
						imports.push(content)
						break
					}
					case 'scope': {
						componentScope = content.match(/{.+}/)
						break
					}
					case 'name': {
						componentName = splitedContent.join('_')
						break
					}
					default: {
						throw new TypeError(`[EFML] Unknown directive "${directive}"`)
					}
				}

			}

			const ast = JSON.stringify(JSON.stringify(parse(template, commentHandler)))

			const code = [
				...imports,
				componentScope && `import { create, scoped } from 'ef-core'` || `import { create } from 'ef-core'`,
				componentScope && `export default class ${componentName} extends scoped(create(JSON.parse(${ast})), ${componentScope}) {}` || `export default class ${componentName} extends create(JSON.parse(${ast})) {}`,
				''
			].join(';\n')

			return {
				code,
				map: { mappings: '' }
			}
		}
	}
}
