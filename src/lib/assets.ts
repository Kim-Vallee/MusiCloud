import path from 'node:path';
import { AUDIO_DIR } from "$env/static/private";

export const getAudioDir = (): string => {
    const audioDir = AUDIO_DIR;

    if (!audioDir) {
        throw new Error('AUDIO_DIR env variable not defined');
    }

    return path.resolve(audioDir);
};

export const getAudioPath = (filename: string): string =>
    path.join(getAudioDir(), filename);
