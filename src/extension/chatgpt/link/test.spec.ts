import { describe, expect, it } from 'vitest';

import { isGTPsPage } from '.';

describe('isGTPsPage', () => {
  it('should return true for valid GTPs page URLs', () => {
    expect(isGTPsPage('https://chatgpt.com/g/validPage123')).toBe(true);
    expect(isGTPsPage('https://chatgpt.com/g/another-valid-page')).toBe(true);
    expect(isGTPsPage('https://chatgpt.com/g/g-RBEIWHHXK-vitest-copilot/c/512c887f-cf6e-48b6-9d0b-a38c04bc4c57')).toBe(
      true
    );
  });

  it('should return false for invalid GTPs page URLs', () => {
    expect(isGTPsPage('http://chatgpt.com/g/validPage123')).toBe(false); // 非HTTPS
    expect(isGTPsPage('https://chatgpt.com/invalid/validPage123')).toBe(false); // 无效路径
    expect(isGTPsPage('https://chatgpt.com/g/')).toBe(false); // 空的页面ID
    expect(isGTPsPage('https://chatgpt.com/')).toBe(false); // 缺少路径
    expect(isGTPsPage('https://example.com/g/validPage123')).toBe(false); // 非chatgpt.com域
  });
});
