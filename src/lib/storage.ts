export function setItem(key: string, value: string, expiryInHours: number) {
	const now = new Date();
	localStorage.setItem(
		key,
		JSON.stringify({ value: value, expiry: now.getTime() + expiryInHours * 60 * 60 * 1000 })
	);
}

export function getItem(key: string): string | null {
	const itemStr = localStorage.getItem(key);
	if (!itemStr) {
		return null;
	}

	let item;
	try {
		item = JSON.parse(itemStr);
	} catch (error) {
		console.error("Error parsing item from localStorage", error);
		return null;
	}

	const now = new Date();
	if (now.getTime() > item.expiry) {
		localStorage.removeItem(key);
		return null;
	}

	return item.value;
}

export function removeItem(key: string) {
	localStorage.removeItem(key);
}
