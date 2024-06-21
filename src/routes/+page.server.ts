import { getCorrectPasswordHash, isPasswordCorrect } from "$lib/index.server";
import { redirect } from "@sveltejs/kit";

export const actions = {
    auth: async function ({ cookies, request }) {
        const body = await request.formData();
        const password = body.get("password") as string;
        console.log("login attempt with " + password);

        if (await isPasswordCorrect(password)) {
            cookies.set('sessionid', await getCorrectPasswordHash(), { path: '/', secure: false, httpOnly: false });
            redirect(303, "funny");
        }

        return { success: false };
    }
};