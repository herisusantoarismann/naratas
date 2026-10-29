/**
 * Naratas Document Exporter Utilities
 * Anti-Slop: Clean, robust, safe DOM file downloading
 */

export function downloadMarkdownFile(title: string, markdownContent: string): string {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		return '';
	}

	const safeSlug = title
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
	const filename = `${safeSlug || 'naratas-dokumen'}.md`;

	const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.href = url;
	link.download = filename;
	link.style.display = 'none';

	document.body.appendChild(link);
	link.click();

	setTimeout(() => {
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}, 100);

	return filename;
}
