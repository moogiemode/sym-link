import { access, mkdir } from 'fs/promises';

export const ensureDirectory: (dirPath: string, allowCreate?: boolean) => Promise<boolean> = async (dirPath: string, allowCreate?: boolean) => {
  try {
    await access(dirPath);
    return true;
  } catch {
    // Directory doesn't exist, create it
    if (allowCreate) {
      return await mkdir(dirPath, { recursive: true })
        .then(() => true)
        .catch(() => false);
    } else {
      return false;
    }
  }
};
