import type { BlockObject } from '../../types/blocks.type';
import { createBlockObject } from './sanitize';

export const blocksToMarkdown = (blocks: readonly BlockObject[]): string => {
	if (!Array.isArray(blocks) || blocks.length === 0) {
		return '';
	}

	return blocks
		.map((block) => {
			const content = block.content ?? '';
			switch (block.type) {
				case 'heading': {
					const level = Math.min(Math.max(Number(block.props?.level) || 1, 1), 6);
					return `${'#'.repeat(level)} ${content}`;
				}
				case 'paragraph':
					return content;
				case 'callout': {
					const variant = String(block.props?.variant || 'INFO').toUpperCase();
					return `> [${variant}] ${content}`;
				}
				case 'code': {
					const lang = block.props?.language || 'plaintext';
					return `\`\`\`${lang}\n${content}\n\`\`\``;
				}
				case 'divider':
					return '---';
				default:
					return content;
			}
		})
		.join('\n\n');
};

export const markdownToBlocks = (markdownString: string): BlockObject[] => {
	if (typeof markdownString !== 'string' || !markdownString.trim()) {
		return [];
	}

	const sections = markdownString.split(/\n\n+/);
	return sections
		.map((sec) => sec.trim())
		.filter((sec) => sec.length > 0)
		.map((section) => {
			if (section === '---') {
				return createBlockObject({
					type: 'divider',
					content: '',
					props: {}
				});
			}

			const headingMatch = section.match(/^(#{1,6})\s+([\s\S]*)$/);
			if (headingMatch) {
				return createBlockObject({
					type: 'heading',
					content: headingMatch[2],
					props: { level: headingMatch[1].length }
				});
			}

			const calloutMatch = section.match(/^>\s*\[([A-Za-z0-9_-]+)\]\s*([\s\S]*)$/);
			if (calloutMatch) {
				return createBlockObject({
					type: 'callout',
					content: calloutMatch[2],
					props: { variant: calloutMatch[1].toLowerCase() }
				});
			}

			const codeMatch = section.match(/^```([a-zA-Z0-9_-]*)\r?\n([\s\S]*?)\r?\n?```$/);
			if (codeMatch) {
				return createBlockObject({
					type: 'code',
					content: codeMatch[2],
					props: { language: codeMatch[1] || 'plaintext' }
				});
			}

			return createBlockObject({
				type: 'paragraph',
				content: section,
				props: {}
			});
		});
};
