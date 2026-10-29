import type { BlockObject, BlockType, BlockProps } from '../../types/blocks.type';

export const sanitizeBlockContent = (input: unknown): string => {
	if (typeof input !== 'string') {
		return '';
	}

	return input
		.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
		.replace(/<(iframe|object|embed|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
		.replace(/\s+on[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
		.replace(/\s+srcdoc\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
		.replace(/<[^>]*>/g, '')
		.trim();
};

export const isValidDocumentTitle = (input: unknown): boolean => {
	if (typeof input !== 'string') {
		return false;
	}

	const trimmed = input.trim();
	return trimmed.length >= 3 && trimmed.length <= 120;
};

let blockCounter = 0;
export const createBlockObject = ({
	id,
	type = 'paragraph',
	content = '',
	props = {}
}: {
	id?: string;
	type?: BlockType | string;
	content?: string;
	props?: BlockProps;
} = {}): BlockObject => {
	const generatedId =
		id || `blk-${Date.now()}-${++blockCounter}-${Math.random().toString(36).slice(2, 7)}`;
	return {
		id: generatedId,
		type: (type || 'paragraph') as BlockType,
		content: sanitizeBlockContent(content),
		props: { ...props },
		updatedAt: Date.now()
	};
};
