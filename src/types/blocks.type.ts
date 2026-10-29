export type BlockType = 'paragraph' | 'heading' | 'callout' | 'code' | 'divider';

export interface BlockProps {
	level?: number;
	variant?: string;
	language?: string;
	[key: string]: unknown;
}

export interface BlockObject {
	id: string;
	type: BlockType;
	content: string;
	props: BlockProps;
	updatedAt: number;
}
