import fs from 'fs';
import path from 'path';
import { BUILT_IN_AVATARS } from '../../shared/built-in-avatars';
import { AvatarInfo } from '../../shared/types';
import { avatarUploadSchema } from '../../shared/validation';

export class AvatarManager {
  private avatarDir: string;

  constructor(userDataPath: string) {
    this.avatarDir = path.join(userDataPath, 'avatars');
    if (!fs.existsSync(this.avatarDir)) {
      fs.mkdirSync(this.avatarDir, { recursive: true });
    }
  }

  /**
   * Returns list of all available avatars (built-in + custom).
   */
  getAvatars(): AvatarInfo[] {
    const list: AvatarInfo[] = [...BUILT_IN_AVATARS];

    try {
      if (fs.existsSync(this.avatarDir)) {
        const files = fs.readdirSync(this.avatarDir);
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();
          if (['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
            const filePath = path.join(this.avatarDir, file);
            const id = path.basename(file, ext);
            const base64Data = fs.readFileSync(filePath).toString('base64');
            const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

            list.push({
              id,
              name: `Custom (${file})`,
              type: 'custom',
              description: 'User uploaded avatar',
              src: `data:${mime};base64,${base64Data}`,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to read custom avatars from disk:', err);
    }

    return list;
  }

  /**
   * Validates and saves an uploaded avatar image into userData/avatars/.
   */
  saveUploadedAvatar(fileBuffer: Uint8Array, fileName: string, mimeType: string): AvatarInfo {
    // 1. Validate payload with Zod
    avatarUploadSchema.parse({
      fileName,
      mimeType,
      sizeBytes: fileBuffer.byteLength,
    });

    // 2. Validate magic bytes to ensure file is actually an image (not arbitrary code)
    this.validateImageMagicBytes(fileBuffer, mimeType);

    // 3. Determine clean extension
    let ext = '.png';
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') ext = '.jpg';
    if (mimeType === 'image/webp') ext = '.webp';

    const safeId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const targetFile = path.join(this.avatarDir, `${safeId}${ext}`);

    // 4. Write safely
    fs.writeFileSync(targetFile, Buffer.from(fileBuffer));

    const base64Data = Buffer.from(fileBuffer).toString('base64');
    return {
      id: safeId,
      name: `Custom (${path.basename(fileName)})`,
      type: 'custom',
      description: 'User uploaded avatar',
      src: `data:${mimeType};base64,${base64Data}`,
    };
  }

  /**
   * Deletes a custom avatar by ID.
   */
  deleteAvatar(avatarId: string): boolean {
    try {
      if (!avatarId.startsWith('custom_')) return false;

      const files = fs.readdirSync(this.avatarDir);
      for (const file of files) {
        if (file.startsWith(avatarId)) {
          fs.unlinkSync(path.join(this.avatarDir, file));
          return true;
        }
      }
    } catch (err) {
      console.error(`Failed to delete avatar ${avatarId}:`, err);
    }
    return false;
  }

  private validateImageMagicBytes(buffer: Uint8Array, mimeType: string): void {
    if (buffer.length < 8) {
      throw new Error('File is too small to be a valid image');
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (mimeType === 'image/png') {
      if (
        buffer[0] !== 0x89 ||
        buffer[1] !== 0x50 ||
        buffer[2] !== 0x4e ||
        buffer[3] !== 0x47
      ) {
        throw new Error('Invalid PNG header');
      }
    }

    // JPEG: FF D8 FF
    if (mimeType === 'image/jpeg' || mimeType === 'image/jpg') {
      if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
        throw new Error('Invalid JPEG header');
      }
    }

    // WebP: RIFF ... WEBP
    if (mimeType === 'image/webp') {
      const headerStr = String.fromCharCode(...buffer.slice(0, 4)) + String.fromCharCode(...buffer.slice(8, 12));
      if (!headerStr.startsWith('RIFF') || !headerStr.endsWith('WEBP')) {
        throw new Error('Invalid WebP header');
      }
    }
  }
}
