# @grace-studio/openapi-docs

[![npm version](https://badge.fury.io/js/@grace-studio%2Fopenapi-docs.svg)](https://www.npmjs.com/package/@grace-studio/openapi-docs)

## Installation

```bash
npm i -g @grace-studio/openapi-docs

# or

yarn global add @grace-studio/openapi-docs
```

## Usage

Combines multiple JSON or YAML files to one OpenAPI file used for documentation. Outputs the files to `/docs` including the OpenAPI file and an html-file with a standalone reference to Redoc that can be used directly.

**Merge multiple JSON or YAML files:**

```bash
openapi-docs \
--files <input-files...>
```

**Example:**

```bash
openapi-docs \
-f ./testfiles/test.json ./testfiles/test2.json ./testfiles/test3.yml
```
