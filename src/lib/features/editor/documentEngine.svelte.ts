import {
	sanitizeBlockContent,
	isValidDocumentTitle,
	createBlockObject
} from '../../utils/sanitize';
import { blocksToMarkdown } from '../../utils/markdown';
import type { BlockObject, BlockType, BlockProps } from '../../../types/blocks.type';

interface DocumentSnapshot {
	title: string;
	blocks: BlockObject[];
	activeBlockId: string | null;
}

const STORAGE_KEY = 'blockcraft_doc_v1';

export class DocumentEngine {
	title = $state<string>('Untitled Document');
	blocks = $state.raw<BlockObject[]>([]);
	activeBlockId = $state<string | null>(null);
	searchQuery = $state<string>('');
	typeFilter = $state<string>('all');

	private undoStack = $state.raw<DocumentSnapshot[]>([]);
	private redoStack = $state.raw<DocumentSnapshot[]>([]);

	constructor(initialData: { title?: string; blocks?: BlockObject[] } | null = null) {
		if (initialData) {
			this.title = initialData.title || 'Untitled Document';
			this.blocks =
				Array.isArray(initialData.blocks) && initialData.blocks.length > 0
					? initialData.blocks
					: [createBlockObject({ type: 'paragraph', content: '' })];
			this.activeBlockId = this.blocks[0]?.id ?? null;
		} else {
			let loadedFromStorage = false;
			if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
				try {
					const saved = globalThis.localStorage.getItem(STORAGE_KEY);
					if (saved) {
						const parsed = JSON.parse(saved);
						if (parsed && Array.isArray(parsed.blocks) && parsed.blocks.length > 0) {
							this.title = parsed.title || 'Untitled Document';
							this.blocks = parsed.blocks;
							this.activeBlockId = this.blocks[0]?.id ?? null;
							loadedFromStorage = true;
						}
					}
				} catch {
					// Fallback to default
				}
			}

			if (!loadedFromStorage) {
				this.title = 'Untitled Document';
				const initialBlock = createBlockObject({ type: 'paragraph', content: '' });
				this.blocks = [initialBlock];
				this.activeBlockId = initialBlock.id;
			}
		}
	}

	get filteredBlocks(): BlockObject[] {
		const query = this.searchQuery.trim().toLowerCase();
		const filter = this.typeFilter;

		return this.blocks.filter((b) => {
			if (filter !== 'all' && b.type !== filter) {
				return false;
			}
			if (query && !b.content.toLowerCase().includes(query)) {
				return false;
			}
			return true;
		});
	}

	get stats() {
		const totalBlocks = this.blocks.length;
		let wordCount = 0;
		let charCount = 0;

		for (let i = 0; i < this.blocks.length; i++) {
			const b = this.blocks[i];
			const content = b.content || '';
			charCount += content.length;

			if (b.type !== 'divider' && content.trim()) {
				wordCount += content.trim().split(/\s+/).filter(Boolean).length;
			}
		}

		const readingTimeMinutes = wordCount === 0 ? 0 : Math.ceil(wordCount / 200);

		return {
			totalBlocks,
			wordCount,
			charCount,
			readingTimeMinutes
		};
	}

	get canUndo(): boolean {
		return this.undoStack.length > 0;
	}

	get canRedo(): boolean {
		return this.redoStack.length > 0;
	}

	private recordHistory() {
		const snapshot: DocumentSnapshot = {
			title: this.title,
			blocks: this.blocks.map((b) => ({ ...b, props: { ...b.props } })),
			activeBlockId: this.activeBlockId
		};
		this.undoStack = [...this.undoStack, snapshot];
		this.redoStack = [];
	}

	private syncStorage() {
		if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
			try {
				globalThis.localStorage.setItem(
					STORAGE_KEY,
					JSON.stringify({ title: this.title, blocks: this.blocks })
				);
			} catch {
				// Ignore quota exceeded or storage error
			}
		}
	}

	setTitle(newTitle: string) {
		if (!isValidDocumentTitle(newTitle)) {
			throw new Error('Invalid document title');
		}
		this.recordHistory();
		this.title = newTitle;
		this.syncStorage();
	}

	addBlock({
		type = 'paragraph',
		content = '',
		props = {},
		afterBlockId = null
	}: {
		type?: BlockType | string;
		content?: string;
		props?: BlockProps;
		afterBlockId?: string | null;
	} = {}): BlockObject {
		const newBlock = createBlockObject({ type, content, props });
		this.recordHistory();

		if (afterBlockId) {
			const idx = this.blocks.findIndex((b) => b.id === afterBlockId);
			if (idx !== -1) {
				const nextBlocks = [...this.blocks];
				nextBlocks.splice(idx + 1, 0, newBlock);
				this.blocks = nextBlocks;
			} else {
				this.blocks = [...this.blocks, newBlock];
			}
		} else {
			this.blocks = [...this.blocks, newBlock];
		}

		this.activeBlockId = newBlock.id;
		this.syncStorage();
		return newBlock;
	}

	updateBlockContent(id: string, newContent: string) {
		const idx = this.blocks.findIndex((b) => b.id === id);
		if (idx === -1) return;

		this.recordHistory();
		const sanitized = sanitizeBlockContent(newContent);
		const trailingSpaces =
			typeof newContent === 'string' ? newContent.match(/\s+$/)?.[0] || '' : '';
		const finalContent = sanitized
			? sanitized + trailingSpaces
			: typeof newContent === 'string' && newContent.trim() === ''
				? newContent
				: '';
		const nextBlocks = [...this.blocks];
		nextBlocks[idx] = {
			...nextBlocks[idx],
			content: finalContent,
			updatedAt: Date.now()
		};
		this.blocks = nextBlocks;
		this.syncStorage();
	}

	transformBlockType(id: string, newType: BlockType | string, newProps: BlockProps = {}) {
		const idx = this.blocks.findIndex((b) => b.id === id);
		if (idx === -1) return;

		this.recordHistory();
		const current = this.blocks[idx];
		let nextContent = current.content;
		if (nextContent.startsWith('/')) {
			nextContent = '';
		}

		const nextBlocks = [...this.blocks];
		nextBlocks[idx] = {
			...current,
			type: newType as BlockType,
			content: nextContent,
			props: { ...newProps },
			updatedAt: Date.now()
		};
		this.blocks = nextBlocks;
		this.syncStorage();
	}

	splitBlockAtCursor(id: string, cursorIndex: number) {
		const idx = this.blocks.findIndex((b) => b.id === id);
		if (idx === -1) return;

		this.recordHistory();
		const current = this.blocks[idx];
		const fullText = current.content;
		const left = fullText.slice(0, cursorIndex);
		const right = fullText.slice(cursorIndex);

		const updatedCurrent: BlockObject = {
			...current,
			content: left,
			updatedAt: Date.now()
		};

		const newBlock = createBlockObject({
			type: 'paragraph',
			content: right,
			props: {}
		});

		const nextBlocks = [...this.blocks];
		nextBlocks.splice(idx, 1, updatedCurrent, newBlock);
		this.blocks = nextBlocks;
		this.activeBlockId = newBlock.id;
		this.syncStorage();
	}

	mergeWithPrevious(id: string): boolean {
		const idx = this.blocks.findIndex((b) => b.id === id);
		if (idx <= 0) return false;

		const prev = this.blocks[idx - 1];
		if (prev.type === 'divider') return false;

		this.recordHistory();
		const current = this.blocks[idx];
		const nextBlocks = [...this.blocks];

		nextBlocks[idx - 1] = {
			...prev,
			content: (prev.content || '') + (current.content || ''),
			updatedAt: Date.now()
		};
		nextBlocks.splice(idx, 1);

		this.blocks = nextBlocks;
		this.activeBlockId = prev.id;
		this.syncStorage();
		return true;
	}

	moveBlock(id: string, direction: 'up' | 'down') {
		const idx = this.blocks.findIndex((b) => b.id === id);
		if (idx === -1) return;

		if (direction === 'up' && idx > 0) {
			this.recordHistory();
			const nextBlocks = [...this.blocks];
			const temp = nextBlocks[idx];
			nextBlocks[idx] = nextBlocks[idx - 1];
			nextBlocks[idx - 1] = temp;
			this.blocks = nextBlocks;
			this.syncStorage();
		} else if (direction === 'down' && idx < this.blocks.length - 1) {
			this.recordHistory();
			const nextBlocks = [...this.blocks];
			const temp = nextBlocks[idx];
			nextBlocks[idx] = nextBlocks[idx + 1];
			nextBlocks[idx + 1] = temp;
			this.blocks = nextBlocks;
			this.syncStorage();
		}
	}

	deleteBlock(id: string) {
		const idx = this.blocks.findIndex((b) => b.id === id);
		if (idx === -1) return;

		this.recordHistory();
		const nextBlocks = this.blocks.filter((b) => b.id !== id);

		if (nextBlocks.length === 0) {
			const fallback = createBlockObject({ type: 'paragraph', content: '' });
			this.blocks = [fallback];
			this.activeBlockId = fallback.id;
		} else {
			this.blocks = nextBlocks;
			const targetIdx = Math.min(idx, this.blocks.length - 1);
			this.activeBlockId = this.blocks[targetIdx].id;
		}
		this.syncStorage();
	}

	setSearchQuery(query: string) {
		this.searchQuery = query;
	}

	setTypeFilter(type: string) {
		this.typeFilter = type;
	}

	undo() {
		if (this.undoStack.length === 0) return;
		const nextUndo = [...this.undoStack];
		const snapshot = nextUndo.pop()!;
		this.undoStack = nextUndo;

		this.redoStack = [
			...this.redoStack,
			{
				title: this.title,
				blocks: this.blocks.map((b) => ({ ...b, props: { ...b.props } })),
				activeBlockId: this.activeBlockId
			}
		];

		this.title = snapshot.title;
		this.blocks = snapshot.blocks;
		this.activeBlockId = snapshot.activeBlockId;
		this.syncStorage();
	}

	redo() {
		if (this.redoStack.length === 0) return;
		const nextRedo = [...this.redoStack];
		const snapshot = nextRedo.pop()!;
		this.redoStack = nextRedo;

		this.undoStack = [
			...this.undoStack,
			{
				title: this.title,
				blocks: this.blocks.map((b) => ({ ...b, props: { ...b.props } })),
				activeBlockId: this.activeBlockId
			}
		];

		this.title = snapshot.title;
		this.blocks = snapshot.blocks;
		this.activeBlockId = snapshot.activeBlockId;
		this.syncStorage();
	}

	exportMarkdown(): string {
		return blocksToMarkdown(this.blocks);
	}

	exportJSON(): string {
		return JSON.stringify({ title: this.title, blocks: this.blocks }, null, 2);
	}

	importJSON(jsonString: string) {
		try {
			const parsed = JSON.parse(jsonString);
			if (parsed && typeof parsed.title === 'string' && Array.isArray(parsed.blocks)) {
				this.recordHistory();
				this.title = parsed.title;
				this.blocks = parsed.blocks.map((b: any) => createBlockObject(b));
				this.activeBlockId = this.blocks[0]?.id ?? null;
				this.syncStorage();
			}
		} catch {
			throw new Error('Invalid JSON format for document import');
		}
	}

	bulkLoadBlocks(rawBlocksArray: BlockObject[]) {
		this.blocks = rawBlocksArray;
		if (rawBlocksArray.length > 0) {
			this.activeBlockId = rawBlocksArray[0].id;
		}
	}
}
