import { promises as fs } from 'fs';
import { type Cookies } from '@sveltejs/kit';
import { createHash } from 'crypto';

async function hash(data: string): Promise<string> {
    const salt = await fs.readFile('./salt.txt', 'utf8');
    return createHash('sha256').update(`${data}${salt}`).digest('hex');
}

export async function getCorrectPasswordHash(): Promise<string> {
    const correctPassword = await fs.readFile('./pass.word', 'utf8');

    return hash(correctPassword);
}

export async function isSignedOn(cookies: Cookies): Promise<boolean> {
    const sessionId = cookies.get('sessionid') || '';
    const correctPasswordHash = await getCorrectPasswordHash();

    return sessionId == correctPasswordHash;
}

export async function isPasswordCorrect(password: string): Promise<boolean> {
    const correctPasswordHash = await getCorrectPasswordHash();
    const passwordHash = await hash(password);

    return passwordHash == correctPasswordHash;
}
