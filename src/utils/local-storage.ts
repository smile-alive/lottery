type StorageType = 'local' | 'session';

const isBrowser = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

function getStorage(type: StorageType = 'local'): Storage | null {
	if (!isBrowser) return null;
	return type === 'local' ? window.localStorage : window.sessionStorage;
}

export function setItem(key: string, value: unknown, options?: { type?: StorageType }): boolean {
	const storage = getStorage(options?.type);
	if (!storage) return false;

	try {
		const payload = JSON.stringify(value);
		storage.setItem(key, payload === undefined ? 'null' : payload);
		return true;
	} catch (error) {
		console.error(`Failed to set "${key}" in ${options?.type ?? 'local'}Storage:`, error);
		return false;
	}
}

export function getItem<T = unknown>(key: string, options?: { type?: StorageType }): T | null {
	const storage = getStorage(options?.type);
	if (!storage) return null;

	try {
		const item = storage.getItem(key);
		if (item === null) return null;
		try {
			return JSON.parse(item) as T;
		} catch {
			// If parsing fails, return raw string
			return item as unknown as T;
		}
	} catch (error) {
		console.error(`Failed to get "${key}" from ${options?.type ?? 'local'}Storage:`, error);
		return null;
	}
}

export function removeItem(key: string, options?: { type?: StorageType }): boolean {
	const storage = getStorage(options?.type);
	if (!storage) return false;

	try {
		storage.removeItem(key);
		return true;
	} catch (error) {
		console.error(`Failed to remove "${key}" from ${options?.type ?? 'local'}Storage:`, error);
		return false;
	}
}

export function clear(options?: { type?: StorageType }): boolean {
	const storage = getStorage(options?.type);
	if (!storage) return false;

	try {
		storage.clear();
		return true;
	} catch (error) {
		console.error(`Failed to clear ${options?.type ?? 'local'}Storage:`, error);
		return false;
	}
}

export function hasItem(key: string, options?: { type?: StorageType }): boolean {
	const storage = getStorage(options?.type);
	if (!storage) return false;

	try {
		const item = storage.getItem(key);
		return item !== null && item !== '';
	} catch (error) {
		console.error(`Failed to check "${key}" in ${options?.type ?? 'local'}Storage:`, error);
		return false;
	}
}
