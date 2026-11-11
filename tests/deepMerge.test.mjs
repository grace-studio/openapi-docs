import assert from 'node:assert/strict';
import { test } from 'node:test';
import { deepMerge } from '../lib/utils/deepMerge.js';

const mergeAll = (values) => values.reduce(deepMerge, {});

test('merges OpenAPI fragments the way the deepmerge package did', () => {
  const merged = mergeAll([
    { info: { title: 'API', version: '1' }, tags: [{ name: 'a' }], paths: {} },
    { info: { version: '2', description: 'd' }, tags: [{ name: 'b' }] },
    { paths: { '/x': { get: {} } }, info: 'replaced-by-primitive' },
  ]);

  assert.deepEqual(merged, {
    info: 'replaced-by-primitive',
    tags: [{ name: 'a' }, { name: 'b' }],
    paths: { '/x': { get: {} } },
  });
  assert.deepEqual(Object.keys(merged), ['info', 'tags', 'paths']);
});

test('keeps a __proto__ key as data instead of changing the prototype', () => {
  const merged = mergeAll([
    {},
    JSON.parse('{"__proto__": {"polluted": true}}'),
  ]);

  assert.equal(Object.getPrototypeOf(merged), Object.prototype);
  assert.equal(merged.polluted, undefined);
  assert.equal({}.polluted, undefined);
});
