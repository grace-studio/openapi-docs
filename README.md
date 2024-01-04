# @grace-studio/openapi-docs

[![npm version](https://badge.fury.io/js/@grace-studio%2Fopenapi-docs.svg)](https://www.npmjs.com/package/@grace-studio/openapi-docs)

## Installation

```bash
npm i -g @grace-studio/openapi-docs

# or

yarn global add @grace-studio/openapi-docs
```

## Usage

**Merge multiple JSON files:**

```bash
openapi-docs \
--files <input-json-files...> \
--out <output-json-file>
```

**Example:**

```bash
openapi-docs \
-f ./testfiles/test.json ./testfiles/test2.json \
-o ./testfiles/out.json
```
