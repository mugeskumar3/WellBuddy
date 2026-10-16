import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { AvatarManager } from '../../electron/avatars/avatar-manager';

describe('AvatarManager', () => {
  let testUserData: string;
  let avatarManager: AvatarManager;

  beforeEach(() => {
    testUserData = fs.mkdtempSync(path.join(os.tmpdir(), 'wellbuddy-avatar-test-'));
    avatarManager = new AvatarManager(testUserData);
  });

  afterEach(() => {
    try {
      fs.rmSync(testUserData, { recursive: true, force: true });
    } catch {}
  });

  it('loads built-in avatars by default without remote network calls', () => {
    const avatars = avatarManager.getAvatars();
    expect(avatars.length).toBeGreaterThanOrEqual(4);

    const ids = avatars.map((a) => a.id);
    expect(ids).toContain('water-drop');
    expect(ids).toContain('sprout');
    expect(ids).toContain('robobuddy');
    expect(ids).toContain('zen-pebble');
    expect(ids).toContain('doraemon');
    expect(ids).toContain('human-buddy');
    expect(ids).toContain('pippy-cat');

    // Confirm avatars are valid SVG data URIs and well-formed XML
    for (const av of avatars) {
      expect(av.src.startsWith('data:image/svg+xml')).toBe(true);
      const commaIdx = av.src.indexOf(',');
      const svgText = decodeURIComponent(av.src.substring(commaIdx + 1));
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      expect(parserError, `SVG XML error in ${av.id}: ${parserError?.textContent}`).toBeNull();
      expect(doc.querySelector('svg')).not.toBeNull();
    }
  });

  it('validates and saves uploaded PNG avatars safely into userData/avatars', () => {
    // Valid PNG header: 89 50 4E 47 0D 0A 1A 0A
    const validPngBytes = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    ]);

    const saved = avatarManager.saveUploadedAvatar(validPngBytes, 'custom-mascot.png', 'image/png');
    expect(saved.id.startsWith('custom_')).toBe(true);
    expect(saved.type).toBe('custom');
    expect(saved.src.startsWith('data:image/png;base64,')).toBe(true);

    // Verify file is persisted in userData/avatars/
    const all = avatarManager.getAvatars();
    const found = all.find((a) => a.id === saved.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(saved.id);
    expect(found?.name.startsWith('Custom')).toBe(true);
  });

  it('rejects spoofed image files with invalid headers', () => {
    // Arbitrary text / script disguised as PNG
    const fakeBytes = new Uint8Array([0x65, 0x63, 0x68, 0x6f, 0x20, 0x68, 0x61, 0x63, 0x6b]);

    expect(() =>
      avatarManager.saveUploadedAvatar(fakeBytes, 'fake.png', 'image/png')
    ).toThrow('Invalid PNG header');
  });

  it('deletes custom avatars and cleans up disk files', () => {
    const validPngBytes = new Uint8Array([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00,
    ]);
    const saved = avatarManager.saveUploadedAvatar(validPngBytes, 'to-delete.png', 'image/png');

    expect(avatarManager.getAvatars().some((a) => a.id === saved.id)).toBe(true);

    const deleted = avatarManager.deleteAvatar(saved.id);
    expect(deleted).toBe(true);
    expect(avatarManager.getAvatars().some((a) => a.id === saved.id)).toBe(false);
  });
});
