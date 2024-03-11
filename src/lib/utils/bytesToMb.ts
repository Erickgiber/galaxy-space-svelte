export function bytesToMB(bytes: number): number {
	const megabytes = bytes / (1024 * 1024)
	return Number(megabytes.toFixed(3))
}
