import { isValidEmail, isNotEmpty, isValidUUID } from './helpers';
import { HttpResponse } from './types';

describe('shared library', () => {
  describe('validation helpers', () => {
    it('should validate email correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('invalid-email')).toBe(false);
    });

    it('should validate non-empty strings', () => {
      expect(isNotEmpty('test')).toBe(true);
      expect(isNotEmpty('')).toBe(false);
      expect(isNotEmpty(null)).toBe(false);
      expect(isNotEmpty(undefined)).toBe(false);
    });

    it('should validate UUID correctly', () => {
      const validUUID = '123e4567-e89b-12d3-a456-426614174000';
      expect(isValidUUID(validUUID)).toBe(true);
      expect(isValidUUID('invalid-uuid')).toBe(false);
    });
  });

  describe('types', () => {
    it('should have HttpResponse type', () => {
      const response: HttpResponse<string> = {
        success: true,
        data: 'test',
        statusCode: 200,
      };
      expect(response.success).toBe(true);
      expect(response.data).toBe('test');
      expect(response.statusCode).toBe(200);
    });
  });
});
