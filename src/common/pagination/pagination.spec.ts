import { pagination } from './pagination';

describe('pagination', () => {
  it('should work', () => {
    const paginationResult = pagination<string>(1, 10, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'], 10);
    expect(paginationResult).toHaveProperty('paginationData');
  });
});
