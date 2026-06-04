import { describe, it, expect } from 'vitest';
import { revealClasses } from './motion';

describe('revealClasses', () => {
  it('marks element as hidden when not in view', () => {
    const classes = revealClasses(false);
    expect(classes).toContain('opacity-0');
  });

  it('marks element as visible when in view', () => {
    const classes = revealClasses(true);
    expect(classes).toContain('opacity-100');
  });

  it('does not apply the visible state when not in view', () => {
    const classes = revealClasses(false);
    expect(classes).not.toContain('opacity-100');
    expect(classes).not.toContain('translate-y-0');
  });

  it('does not apply the hidden state when in view', () => {
    const classes = revealClasses(true);
    expect(classes).not.toContain('opacity-0');
    expect(classes).not.toContain('translate-y-8');
  });

  describe('when animations are disabled', () => {
    it('treats element as visible regardless of inView=false', () => {
      const classes = revealClasses(false, false);
      expect(classes).toContain('opacity-100');
      expect(classes).not.toContain('opacity-0');
    });

    it('treats element as visible regardless of inView=true', () => {
      const classes = revealClasses(true, false);
      expect(classes).toContain('opacity-100');
      expect(classes).not.toContain('translate-y-8');
    });

    it('does not apply translate offset when animations are disabled', () => {
      expect(revealClasses(false, false)).not.toContain('translate-y-8');
    });
  });
});
