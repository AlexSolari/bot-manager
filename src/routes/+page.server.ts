import { getCorrectPassword } from "$lib/index.server";
import { redirect } from "@sveltejs/kit";

export const actions = {
    auth: async function ({ cookies, request }) {
        const body = await request.formData();
        const pass = body.get("password");
        const correctPass = await getCorrectPassword();
        console.log("login attempt with " + pass);

        if (correctPass == pass) {
            cookies.set('sessionid', correctPass, { path: '/', secure: false, httpOnly: false });
            redirect(303, "funny");
        }

        return { success: false };
    }
};