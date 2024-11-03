// external imports
import { expect, test } from 'vitest';

// internal imports
import { sum } from '../../src/utils/helpers.js';


test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})
