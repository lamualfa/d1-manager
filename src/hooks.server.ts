import { extend } from "$lib/log";
import { DBMS } from "$lib/server/db/dbms";
import type { Handle, HandleServerError } from "@sveltejs/kit";
import { locale, waitLocale } from "svelte-i18n";

export const handle: Handle = async ({ event, resolve }) => {
	const lang = event.request.headers.get("accept-language")?.split(",")[0] || "en";
	locale.set(lang);
	await waitLocale(lang);

	event.locals.db = DBMS(event.platform?.env || {});

	const result = await resolve(event);
	return result;
};

const elog = extend("server-error");

export const handleError: HandleServerError = async ({ error }) => {
	elog(error);

	return {
		code: 500,
		message: "Internal Server Error",
	};
};
