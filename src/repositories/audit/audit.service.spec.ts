import { sanitize } from './audit.service';

describe('sanitize (auditoría)', () => {
  it('enmascara secretos a cualquier profundidad', () => {
    const out = sanitize({
      email: 'a@b.c',
      password: 'x',
      nested: { accessToken: 't', currentPassword: 'y', ok: 1 },
      embedding: [0.1, 0.2],
    }) as any;
    expect(out).toEqual({
      email: 'a@b.c',
      password: '[REDACTED]',
      nested: {
        accessToken: '[REDACTED]',
        currentPassword: '[REDACTED]',
        ok: 1,
      },
      embedding: '[REDACTED]',
    });
  });

  it('resume arrays grandes y strings largos', () => {
    const out = sanitize({
      realTempSeries: Array.from({ length: 500 }, (_, i) => i),
      notes: 'x'.repeat(2000),
    }) as any;
    expect(out.realTempSeries).toBe('[array(500)]');
    expect(out.notes.length).toBeLessThanOrEqual(501);
  });
});
