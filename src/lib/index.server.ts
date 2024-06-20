import { promises as fs } from 'fs';
import { error, type Cookies } from '@sveltejs/kit';
import { createHash } from 'crypto';

function hash(data: string): string {
    return createHash('sha256').update(data).digest("hex");
}

export async function getCorrectPasswordHash(): Promise<string> {
    const correctPass = await fs.readFile("./pass.word", "utf8");

    return hash(correctPass);
}

export async function isSignedOn(cookies: Cookies): Promise<boolean> {
    const sessionId = cookies.get("sessionid") || "";
    const correctPassHash = await getCorrectPasswordHash();

    return sessionId == correctPassHash;
}

export async function isPasswordCorrect(password: string): Promise<boolean> {
    const correctPassHash = await getCorrectPasswordHash();

    return hash(password) == correctPassHash;
}

export function forbidden(reason: string = "") : never {
    console.trace(`Returning HTTP 405: ${reason}`);
    error(403, { message: `Forbidden: ${reason}` });
}