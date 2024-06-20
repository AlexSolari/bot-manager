import { getCorrectPasswordHash, isPasswordCorrect } from "$lib/index.server";
import { redirect } from "@sveltejs/kit";

export const actions = {
    auth: async function ({ cookies, request }) {
        const body = await request.formData();
        const pass = body.get("password") as string;
        console.log("login attempt with " + pass);

        if (await isPasswordCorrect(pass)) {
            cookies.set('sessionid', await getCorrectPasswordHash(), { path: '/', secure: false, httpOnly: false });
            redirect(303, "funny");
        }

        return { success: false };
    }
};