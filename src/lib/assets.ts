import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const getAudioDir = (): string => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, '..', 'lib', 'assets', 'audio');
};

export const getAudioPath = (filename: string): string =>
    path.join(getAudioDir(), filename);
