export interface SlashCommand {
	id: string;
	label: string;
	type: 'heading' | 'paragraph' | 'callout' | 'code' | 'divider';
	props: Record<string, unknown>;
	keywords: string[];
}

export const SLASH_COMMANDS: SlashCommand[] = [
	{
		id: 'h1',
		label: 'Heading 1',
		type: 'heading',
		props: { level: 1 },
		keywords: ['h1', 'title', 'heading 1']
	},
	{
		id: 'h2',
		label: 'Heading 2',
		type: 'heading',
		props: { level: 2 },
		keywords: ['h2', 'subtitle', 'heading 2']
	},
	{
		id: 'paragraph',
		label: 'Text Paragraph',
		type: 'paragraph',
		props: {},
		keywords: ['text', 'p', 'paragraph']
	},
	{
		id: 'callout',
		label: 'Callout Box',
		type: 'callout',
		props: { variant: 'info' },
		keywords: ['alert', 'note', 'callout']
	},
	{
		id: 'code',
		label: 'Code Block',
		type: 'code',
		props: { language: 'javascript' },
		keywords: ['code', 'snippet', 'pre']
	},
	{
		id: 'divider',
		label: 'Divider Line',
		type: 'divider',
		props: {},
		keywords: ['hr', 'line', 'divider']
	}
];

export const filterSlashCommands = (query: string): SlashCommand[] => {
	if (typeof query !== 'string') {
		return [...SLASH_COMMANDS];
	}

	const cleanQuery = query.startsWith('/')
		? query.slice(1).trim().toLowerCase()
		: query.trim().toLowerCase();

	if (!cleanQuery) {
		return [...SLASH_COMMANDS];
	}

	return SLASH_COMMANDS.filter((cmd) => {
		const matchId = cmd.id.toLowerCase().includes(cleanQuery);
		const matchLabel = cmd.label.toLowerCase().includes(cleanQuery);
		const matchType = cmd.type.toLowerCase().includes(cleanQuery);
		const matchKeyword = cmd.keywords.some((k) => k.toLowerCase().includes(cleanQuery));

		return matchId || matchLabel || matchType || matchKeyword;
	});
};
