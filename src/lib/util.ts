import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MarkId } from "~config/config";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}


export const getExtId = (id) => {
	const ids = id?.split(MarkId);
	return ids[ids.length - 1] ?? id;
};

export const getWebPageStatus = (id, url): Promise<[any, any]> => {
	return new Promise((resolve) => {
		fetch(url, {
			method: "HEAD",
			mode: "no-cors",
		})
			.then((response) => {
				const isDeadBookmark =
					response.status == 404 ||
					response.status == 410;
				resolve(['', { id, isDeadBookmark }]);
			})
			.catch((error) => {
				resolve([error, {}]);
			});
	});
};

