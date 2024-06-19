import { promises as fs } from 'fs';
import type { Cookies } from '@sveltejs/kit';

export async function getCorrectPassword() : Promise<string> {
    const passFile = import.meta.env.MODE == "development"
        ? "./static/pass.word"
        : "./pass.word";
    const correctPass = await fs.readFile(passFile, "utf8");

    return correctPass;
}

export async function isSignedOn(cookies: Cookies) : Promise<boolean> {
    const sessionId = cookies.get("sessionid");
    const correctPass = await getCorrectPassword();

    return sessionId == correctPass;
}