# rollup-plugin-eft
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/ClassicOldSong/rollup-plugin-eft/master/LICENSE) [![npm](https://img.shields.io/npm/dt/rollup-plugin-eft.svg?style=flat-square)](https://www.npmjs.com/package/rollup-plugin-eft)

[ef.js](https://github.com/ClassicOldSong/ef.js) template loader for rollup


``` javascript
import Component from 'some_module.eft'
const component = new Component(options)
```

## Install
``` bash
npm install rollup-plugin-eft --save-dev
# or
yarn add rollup-plugin-eft --dev
```

## Usage
``` javascript
import { rollup } from "rollup"
import eft from "rollup-plugin-eft"

rollup({
	entry: "main.js",
	plugins: [
		eft()
	]
})
```

## License
[MIT](http://cos.mit-license.org/)
