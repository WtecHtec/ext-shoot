import { describe, expect, it } from 'vitest';

import { splitCamelCase } from './util';

describe('splitCamelCase', () => {
  describe('Correct Usage', () => {
    it('should split camelCase words correctly', () => {
      expect(splitCamelCase('camelCase')).toEqual(['camel', 'Case']);
    });

    it('should split multiple camelCase words correctly', () => {
      expect(splitCamelCase('thisIsCamelCase')).toEqual(['this', 'Is', 'Camel', 'Case']);
    });

    it('should handle camelCase with numbers correctly', () => {
      expect(splitCamelCase('test123Case')).toEqual(['test123', 'Case']);
    });

    it('should return the same string in array if no camelCase is found', () => {
      expect(splitCamelCase('nocamelcase')).toEqual(['nocamelcase']);
    });

    it('should handle single character input correctly', () => {
      expect(splitCamelCase('a')).toEqual(['a']);
    });

    it('should handle empty string correctly', () => {
      expect(splitCamelCase('')).toEqual(['']);
    });

    it('should split camelCase words correctly', () => {
      expect(splitCamelCase('mineGPTs')).toEqual(['mine', 'GPTs']);
    });

    it('should split camelCase words correctly', () => {
      expect(splitCamelCase('GPTsStore')).toEqual(['GPTs', 'Store']);
    });

    it('should split camelCase words correctly', () => {
      expect(splitCamelCase('createNewGPTs')).toEqual(['create', 'New', 'GPTs']);
    });

    it('should split camelCase words correctly', () => {
      expect(splitCamelCase('chatWithModelGPT4o')).toEqual(['chat', 'With', 'Model', 'GPT4o']);
    });
  });

  describe('Incorrect Usage', () => {
    it('should handle strings with only uppercase letters', () => {
      expect(splitCamelCase('UPPERCASE')).toEqual(['UPPERCASE']);
    });

    it('should handle strings with only numbers', () => {
      expect(splitCamelCase('123456')).toEqual(['123456']);
    });

    it('should handle mixed special characters and camelCase', () => {
      expect(splitCamelCase('mixedCamelCase')).toEqual(['mixed', 'Camel', 'Case']);
    });
  });
});
