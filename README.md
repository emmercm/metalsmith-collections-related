# metalsmith-collections-related

[![npm Version](https://badgen.net/npm/v/metalsmith-collections-related?icon=npm)](https://www.npmjs.com/package/metalsmith-collections-related)
[![node Version](https://badgen.net/npm/node/metalsmith-collections-related)](https://github.com/emmercm/metalsmith-collections-related/blob/master/package.json)
[![npm Weekly Downloads](https://badgen.net/npm/dw/metalsmith-collections-related)](https://www.npmjs.com/package/metalsmith-collections-related)

[![Known Vulnerabilities](https://snyk.io/test/npm/metalsmith-collections-related/badge.svg)](https://snyk.io/test/npm/metalsmith-collections-related)
[![Test Coverage](https://badgen.net/codecov/c/github/emmercm/metalsmith-collections-related/master?icon=codecov)](https://codecov.io/gh/emmercm/metalsmith-collections-related)
[![Maintainability](https://badgen.net/codeclimate/maintainability/emmercm/metalsmith-collections-related?icon=codeclimate)](https://codeclimate.com/github/emmercm/metalsmith-collections-related/maintainability)

[![GitHub](https://badgen.net/badge/emmercm/metalsmith-collections-related/purple?icon=github)](https://github.com/emmercm/metalsmith-collections-related)
[![License](https://badgen.net/github/license/emmercm/metalsmith-collections-related?color=grey)](https://github.com/emmercm/metalsmith-collections-related/blob/master/LICENSE)

A Metalsmith plugin to find related files within collections.

## Installation

```bash
npm install --save metalsmith-collections-related
```

## JavaScript Usage

Collections need to be processed before related files can be found:

```javascript
const Metalsmith  = require('metalsmith');
const collections = require('metalsmith-collections');
const related     = require('metalsmith-collections-related');

Metalsmith(__dirname)
    .use(collections({
        // options here
    }))
    .use(related({
        // options here
    }))
    .build((err) => {
        if (err) {
            throw err;
        }
    });
```

## File metadata

This plugin adds a metadata field named `related` to each file in the format:

```json5
{
  contents: "...",
  path: "...",
  related: {
    "[collection name]": [
      { contents: "...", path: "..." },
      { contents: "...", path: "..." }
      // up to the `maxRelated` number of files
    ],
    "[another collection name]": [
      { contents: "...", path: "..." },
      { contents: "...", path: "..." }
      // up to the `maxRelated` number of files
    ]
    // up to as many collections as the file is in
  }
}
```

which can be used in templating engines, such as in [Handlebars](https://www.npmjs.com/package/handlebars):

```handlebars
{{#each related}}
    <a href="{{ path }}">{{ path }}</a>
{{/each}}
```

## Options

### `pattern` (optional)

Type: `string` Default: `**/*`

A [minimatch](https://www.npmjs.com/package/minimatch) glob pattern to find input files.

### `maxRelated` (optional)

Type: `number` Default: `3`

The number of related files to add to each file's metadata.

## Changelog

[Changelog](./CHANGELOG.md)
