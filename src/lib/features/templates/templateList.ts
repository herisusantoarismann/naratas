import type { BlockObject } from '../../../types/blocks.type';
import { createBlockObject } from '../../utils/sanitize';

export interface TemplateItem {
	id: string;
	title: string;
	category: 'Engineering' | 'Product' | 'Docs' | 'Workflow';
	description: string;
	badge: string;
	testId?: string;
	blocks: BlockObject[];
}

export function hasExistingEditorContent(): boolean {
	if (typeof window === 'undefined' || !window.localStorage) return false;
	try {
		const raw = window.localStorage.getItem('blockcraft_doc_v1');
		if (!raw) return false;
		const data = JSON.parse(raw);
		if (!data) return false;
		const hasTitle = Boolean(
			data.title && data.title !== 'Untitled Document' && data.title.trim().length > 0
		);
		const hasContent =
			Array.isArray(data.blocks) &&
			data.blocks.some((b: { content?: string }) => b.content && b.content.trim().length > 0);
		const hasMultiple = Array.isArray(data.blocks) && data.blocks.length > 1;
		return hasTitle || hasContent || hasMultiple;
	} catch {
		return false;
	}
}

export const TEMPLATES: TemplateItem[] = [
	// 1. Engineering RFC (Preserved for Playwright E2E compatibility)
	{
		id: 'rfc',
		title: 'Engineering RFC Template',
		category: 'Engineering',
		badge: 'Architecture',
		description:
			'Standard Request for Comments template with title, context callout, and problem statement.',
		testId: 'btn-use-template-rfc',
		blocks: [
			createBlockObject({
				id: 'rfc-h1',
				type: 'heading',
				content: 'RFC: Modern Block Architecture',
				props: { level: 1 }
			}),
			createBlockObject({
				id: 'rfc-callout',
				type: 'callout',
				content: 'This document describes the reactive engine architecture.',
				props: { variant: 'info' }
			}),
			createBlockObject({
				id: 'rfc-p',
				type: 'paragraph',
				content: 'This RFC proposes transitioning to Svelte 5 Runes for ultra-fast document state.',
				props: {}
			})
		]
	},

	// 2. Sprint Retrospective
	{
		id: 'sprint-retro',
		title: 'Sprint 42 Retrospective',
		category: 'Product',
		badge: 'Agile',
		description:
			'Structured retrospective doc with milestone heading, success highlight, and velocity review.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Sprint 42 Retrospective',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'What went well, what could be improved, and action items.',
				props: { variant: 'success' }
			}),
			createBlockObject({
				type: 'paragraph',
				content: 'Team velocity increased by 25% following the automated testing pipeline launch.',
				props: {}
			})
		]
	},

	// 3. Open Source README.md
	{
		id: 'readme-oss',
		title: 'Open Source Project README',
		category: 'Docs',
		badge: 'Open Source',
		description:
			'Standard repository README with project pitch, quick installation code, and tech stack badge.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Project Name — Blazing Fast Documentation',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Production-ready local-first block editor built with Svelte 5 and TypeScript.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Quick Start', props: { level: 2 } }),
			createBlockObject({
				type: 'code',
				content: 'git clone https://github.com/org/repo.git\nnpm install\nnpm run dev',
				props: { language: 'bash' }
			}),
			createBlockObject({
				type: 'paragraph',
				content: 'Open http://localhost:5173 to start exploring the workspace canvas.',
				props: {}
			})
		]
	},

	// 4. API Reference & Endpoints
	{
		id: 'api-reference',
		title: 'REST API Endpoint Specification',
		category: 'Engineering',
		badge: 'API Specs',
		description:
			'Clean endpoint documentation with authentication parameters, request payloads, and response schema.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'POST /api/v1/documents',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Requires Bearer Token authentication header.',
				props: { variant: 'warning' }
			}),
			createBlockObject({ type: 'heading', content: 'Request Payload', props: { level: 2 } }),
			createBlockObject({
				type: 'code',
				content:
					'{\n  "title": "Document Title",\n  "blocks": [\n    { "type": "paragraph", "content": "Hello world" }\n  ]\n}',
				props: { language: 'json' }
			}),
			createBlockObject({
				type: 'paragraph',
				content: 'Returns 201 Created with JSON representation of the generated entity.',
				props: {}
			})
		]
	},

	// 5. Architecture Decision Record (ADR)
	{
		id: 'adr-template',
		title: 'Architecture Decision Record (ADR)',
		category: 'Engineering',
		badge: 'Systems',
		description:
			'Document architectural choices, context, trade-offs, and consequences for engineering teams.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'ADR-004: Adopting Svelte 5 Runes for State Engine',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Status: Accepted | Decision Maker: Core Team',
				props: { variant: 'info' }
			}),
			createBlockObject({
				type: 'heading',
				content: 'Context & Problem Statement',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'paragraph',
				content:
					'We need fine-grained universal reactivity without store boilerplate or unnecessary virtual DOM re-renders.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Consequences', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Simplified reactive state machines using $state and $derived with zero legacy Svelte 4 overhead.',
				props: {}
			})
		]
	},

	// 6. Incident Postmortem (RCA)
	{
		id: 'incident-postmortem',
		title: 'Incident Postmortem & RCA',
		category: 'Engineering',
		badge: 'SRE / Ops',
		description:
			'Blameless root cause analysis template with timeline, impact assessment, and preventive action items.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Postmortem: INC-20261029 Memory Saturation',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Total Downtime: 14 mins | Impact: 1.2% API Requests',
				props: { variant: 'warning' }
			}),
			createBlockObject({ type: 'heading', content: 'Root Cause', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'A memory leak occurred due to unbounded listener attachment during WebSocket reconnections.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Action Items', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'1. Introduce explicit teardown hooks in connection managers.\n2. Add heap dump alerts at 85% utilization threshold.',
				props: {}
			})
		]
	},

	// 7. Product Requirements Document (PRD)
	{
		id: 'product-prd',
		title: 'Product Requirements Document (PRD)',
		category: 'Product',
		badge: 'Product',
		description:
			'End-to-end PRD outlining user personas, problem validation, feature scope, and success metrics.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'PRD: Real-time Multi-user Cursor Presence',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Target Release: Q4 2026 | Objective: Increase collaborative retention by 30%.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'User Problem', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Teams currently overwrite each other when editing shared documentation simultaneously.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Key Requirements', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Display color-coded participant cursors with sub-50ms latency across active viewports.',
				props: {}
			})
		]
	},

	// 8. Bug Report & Reproduction Guide
	{
		id: 'bug-report',
		title: 'Bug Report & Reproduction Guide',
		category: 'Engineering',
		badge: 'QA / Testing',
		description:
			'Standardized issue template with expected behavior, minimal reproduction steps, and environment info.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Bug: Caret Reset When Merging Blocks with Backspace',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Severity: Medium | Environment: Chrome 134 on Windows 11',
				props: { variant: 'warning' }
			}),
			createBlockObject({ type: 'heading', content: 'Steps to Reproduce', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'1. Create two paragraphs.\n2. Place caret at index 0 of second paragraph.\n3. Press Backspace.\n4. Observe caret jumping to the start of previous block.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Expected Behavior', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: 'Caret should be placed precisely at the merge boundary offset.',
				props: {}
			})
		]
	},

	// 9. Git Release Notes & Changelog
	{
		id: 'release-notes',
		title: 'Release Notes & Changelog',
		category: 'Docs',
		badge: 'Changelog',
		description:
			'Structured release announcements following Keep a Changelog guidelines with highlighted features.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Release v1.2.0 — Supabase Cloud & Export',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Highlights: Ctrl+S Markdown export and instant cloud document sharing.',
				props: { variant: 'success' }
			}),
			createBlockObject({ type: 'heading', content: 'Added', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'- Ctrl + S shortcut to download current document directly as .md\n- Supabase shared document persistence with public reader route /d/:id',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Changed', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: '- Modularized EditorToolbar into dedicated single-responsibility component.',
				props: {}
			})
		]
	},

	// 10. Developer Quickstart Tutorial
	{
		id: 'developer-tutorial',
		title: 'Developer Quickstart Tutorial',
		category: 'Docs',
		badge: 'Tutorial',
		description:
			'Step-by-step developer guide with installation, initial setup commands, and verification steps.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Building Custom Block Extensions in 5 Minutes',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Prerequisites: Node.js 20+ and TypeScript familiarity.',
				props: { variant: 'info' }
			}),
			createBlockObject({
				type: 'heading',
				content: 'Step 1: Define Block Interface',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'code',
				content:
					'export interface ChartBlockProps {\n  chartType: "bar" | "line";\n  data: number[];\n}',
				props: { language: 'typescript' }
			}),
			createBlockObject({
				type: 'paragraph',
				content: 'Next, register the block renderer in the block catalog component.',
				props: {}
			})
		]
	},

	// 11. Database Schema Migration Plan
	{
		id: 'db-migration',
		title: 'Database Schema Migration Plan',
		category: 'Engineering',
		badge: 'Database',
		description:
			'Zero-downtime migration runbook with forward SQL, rollback procedures, and validation queries.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Migration: Add Full-Text Search Vector to Documents',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Estimated Execution Time: < 30 seconds | Maintenance Window: Non-breaking',
				props: { variant: 'info' }
			}),
			createBlockObject({
				type: 'heading',
				content: 'Forward Migration Script',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'code',
				content:
					"alter table shared_documents\nadd column fts_vector tsvector\ngenerated always as (to_tsvector('english', title)) stored;\n\ncreate index idx_docs_fts on shared_documents using gin(fts_vector);",
				props: { language: 'sql' }
			}),
			createBlockObject({ type: 'heading', content: 'Rollback Procedure', props: { level: 2 } }),
			createBlockObject({
				type: 'code',
				content:
					'drop index if exists idx_docs_fts;\nalter table shared_documents drop column if exists fts_vector;',
				props: { language: 'sql' }
			})
		]
	},

	// 12. 1-on-1 Sync Meeting Agenda
	{
		id: 'one-on-one',
		title: '1-on-1 Sync Meeting Agenda',
		category: 'Workflow',
		badge: 'Management',
		description:
			'Bi-weekly manager and engineer sync agenda focused on priorities, blockers, and career growth.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: '1-on-1 Sync: Alex & Jamie',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Frequency: Bi-weekly | Focus: Growth, priorities, and roadblocks.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Wins & Reflections', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: 'What went particularly well over the last two weeks? Highlight achievements.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Blockers & Challenges', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: 'Where do you need support or cross-team unblocking?',
				props: {}
			})
		]
	},

	// 13. Weekly Team Standup Notes
	{
		id: 'weekly-standup',
		title: 'Weekly Team Standup Notes',
		category: 'Workflow',
		badge: 'Team',
		description:
			'Weekly team alignment doc for sharing shipped items, current focus, and team announcements.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Weekly Engineering Sync — Week 44',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Key Goal: Finalize Svelte 5 engine refactor before staging freeze.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'What We Shipped', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: '- Virtualized canvas with 10k block support\n- Supabase share link integration',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Current Focus', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: '- Expanding template catalog to 25+ curated engineering presets.',
				props: {}
			})
		]
	},

	// 14. Technical Blog Post Outline
	{
		id: 'blog-post-draft',
		title: 'Technical Blog Post Draft',
		category: 'Docs',
		badge: 'Content',
		description:
			'Engaging developer blog structure with problem hook, technical deep-dive, code snippet, and recap.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Why We Ditched Legacy Stores for Svelte 5 Runes',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Estimated Read Time: 6 min | Target Audience: Frontend Engineers',
				props: { variant: 'info' }
			}),
			createBlockObject({
				type: 'heading',
				content: 'The Bottleneck of Global Subscriptions',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'paragraph',
				content:
					'When handling large documents with hundreds of block nodes, store reactivity triggered unnecessary broad invalidations.',
				props: {}
			}),
			createBlockObject({
				type: 'heading',
				content: 'Enter Fine-Grained Signals',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'paragraph',
				content: 'With Svelte 5 Runes, state updates touch only the exact DOM elements affected.',
				props: {}
			})
		]
	},

	// 15. Feature Launch Checklist
	{
		id: 'launch-checklist',
		title: 'Feature Launch Checklist',
		category: 'Product',
		badge: 'Checklist',
		description:
			'Comprehensive pre-launch checklist covering security reviews, QA sign-off, docs, and rollback plans.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Launch Checklist: Cloud Document Sharing',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Target Go-Live: Friday 15:00 UTC | Deployment Platform: Vercel',
				props: { variant: 'warning' }
			}),
			createBlockObject({ type: 'heading', content: 'Pre-Deployment Checks', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'[x] Unit & Architecture tests passing (100%)\n[x] Playwright E2E workflows verified\n[x] Supabase Row Level Security policies active\n[ ] CDN cache headers verified',
				props: {}
			})
		]
	},

	// 16. Security Disclosure Policy (SECURITY.md)
	{
		id: 'security-policy',
		title: 'Security Disclosure Policy (SECURITY.md)',
		category: 'Docs',
		badge: 'Security',
		description:
			'Standard responsible disclosure guidelines, supported versions, and vulnerability reporting protocols.',
		blocks: [
			createBlockObject({ type: 'heading', content: 'Security Policy', props: { level: 1 } }),
			createBlockObject({
				type: 'callout',
				content: 'Please report sensitive security issues privately to security@naratas.dev.',
				props: { variant: 'warning' }
			}),
			createBlockObject({ type: 'heading', content: 'Supported Versions', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: 'Only the latest major version (v1.x) receives active security patches.',
				props: {}
			}),
			createBlockObject({
				type: 'heading',
				content: 'Reporting a Vulnerability',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'paragraph',
				content:
					'Include detailed reproduction steps, browser version, and proof-of-concept payload.',
				props: {}
			})
		]
	},

	// 17. Contributing Guidelines (CONTRIBUTING.md)
	{
		id: 'contributing-guide',
		title: 'Contributing Guidelines (CONTRIBUTING.md)',
		category: 'Docs',
		badge: 'Community',
		description:
			'Open source contributor onboarding guide with branch naming, commit standards, and PR workflows.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Contributing to Naratas',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'We welcome PRs for bug fixes, performance optimizations, and documentation.',
				props: { variant: 'success' }
			}),
			createBlockObject({ type: 'heading', content: 'Development Workflow', props: { level: 2 } }),
			createBlockObject({
				type: 'code',
				content:
					'npm run test:arch   # Check architectural line limits\nnpm run test:unit   # Run Vitest test suite\nnpm run check       # Verify TypeScript types',
				props: { language: 'bash' }
			}),
			createBlockObject({
				type: 'paragraph',
				content:
					'Ensure all tests pass and code adheres to zero-slop standards before opening a pull request.',
				props: {}
			})
		]
	},

	// 18. User Story & Acceptance Criteria
	{
		id: 'user-story',
		title: 'User Story & Acceptance Criteria',
		category: 'Product',
		badge: 'Agile',
		description:
			'Gherkin-style acceptance criteria format with Given-When-Then testable specifications.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'User Story: Keyboard Shortcut Document Saving',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'As a writer, I want to press Ctrl+S so I can download my document as Markdown.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Acceptance Criteria', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Given the user is on the /editor page\nWhen the user presses Ctrl + S or Cmd + S\nThen the browser default save dialog is prevented\nAnd a .md file is immediately triggered for download\nAnd a toast notification confirms the saved filename.',
				props: {}
			})
		]
	},

	// 19. Daily Engineering Journal (DevLog)
	{
		id: 'dev-log',
		title: 'Daily Engineering Journal / DevLog',
		category: 'Workflow',
		badge: 'Journal',
		description:
			'Personal engineering logbook for tracking daily breakthroughs, experiments, and technical notes.',
		blocks: [
			createBlockObject({ type: 'heading', content: 'DevLog — 2026-10-29', props: { level: 1 } }),
			createBlockObject({
				type: 'callout',
				content: 'Focus of the day: Zero-overhead reactive pipelines in Svelte 5.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Key Takeaways', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Using $state.raw for undo/redo snapshots eliminates the proxy overhead on large nested block collections.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Next Actions', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: 'Explore LZ-string compression for long URL share payloads.',
				props: {}
			})
		]
	},

	// 20. Code Review Checklist
	{
		id: 'code-review-checklist',
		title: 'Comprehensive Code Review Checklist',
		category: 'Engineering',
		badge: 'Quality',
		description:
			'Exhaustive checklist for PR authors and reviewers ensuring correctness, security, and performance.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Code Review Guidelines & Checklist',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'High quality code is maintainable, tested, and self-documenting.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Checklist Criteria', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'[ ] Architecture: Boundaries respected (UI does not import DB/services)\n[ ] Modularity: File line counts under 180 lines\n[ ] Security: No unescaped user inputs or XSS vectors\n[ ] Reactivity: Svelte 5 Runes used strictly with no legacy syntax.',
				props: {}
			})
		]
	},

	// 21. Troubleshooting & Debug Runbook
	{
		id: 'debug-runbook',
		title: 'Troubleshooting & Debug Runbook',
		category: 'Engineering',
		badge: 'Runbook',
		description:
			'Operational runbook for diagnosing and triaging production errors with verified triage steps.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Runbook: Resolving High Latency in Document Serialization',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Trigger: AST serialization taking > 50ms for 1,000 blocks.',
				props: { variant: 'warning' }
			}),
			createBlockObject({ type: 'heading', content: 'Investigation Steps', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'1. Inspect browser profiler flamegraph during blockToMarkdown conversion.\n2. Ensure regex lookaheads are compiled outside iterative loops.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Resolution', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content: 'Replace sequential string concatenation with mapped array joins.',
				props: {}
			})
		]
	},

	// 22. Design System Token Specifications
	{
		id: 'design-tokens',
		title: 'Design System Token Specifications',
		category: 'Docs',
		badge: 'Design System',
		description:
			'Reference sheet for core color palettes, typography scale, spacing tokens, and border radius rules.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Naratas Design System — Core Tokens',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Theme Mode: Adaptive Light & Zinc-950 Dark with High Contrast Accents.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Typography Scale', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'- H1: text-3xl font-extrabold tracking-tight\n- H2: text-xl font-bold tracking-tight\n- Body: text-sm font-normal text-zinc-800 dark:text-zinc-200',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Color Palettes', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Primary: Zinc-900 / Zinc-100\nAccent: Emerald-600 / Emerald-400\nSurfaces: White/90 backdrop blur to Zinc-900/90',
				props: {}
			})
		]
	},

	// 23. Competitive Landscape Analysis
	{
		id: 'competitive-landscape',
		title: 'Competitive Landscape Analysis',
		category: 'Product',
		badge: 'Strategy',
		description:
			'Strategic market matrix analyzing features, pricing, differentiators, and target demographics.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Market Analysis: Lightweight Block Document Editors',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content:
					'Core Moat: Zero-slop Svelte 5 client performance with local-first offline storage.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Key Competitors', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'- Notion: Feature-rich but heavy initial bundle and noticeable lag on large pages.\n- Obsidian: Great offline markdown but requires local filesystem setup and lacks seamless web sharing.',
				props: {}
			}),
			createBlockObject({ type: 'heading', content: 'Naratas Advantage', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Instant browser boot in < 50ms with instant Supabase cloud sharing and 1-click Markdown export.',
				props: {}
			})
		]
	},

	// 24. Company Handbook / SOP
	{
		id: 'company-sop',
		title: 'Standard Operating Procedure (SOP)',
		category: 'Workflow',
		badge: 'Handbook',
		description:
			'Organizational standard operating procedure document for remote communication and workflows.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'SOP: Asynchronous Communication Standards',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content:
					'Rule of Thumb: Default to written public documentation over synchronous meetings.',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Principles', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					"1. Provide full context in initial messages.\n2. Record decision summaries in ADRs.\n3. Respect colleagues' time zones with flexible expectations.",
				props: {}
			})
		]
	},

	// 25. Technical Paper & Book Summary
	{
		id: 'paper-summary',
		title: 'Technical Paper & Book Summary',
		category: 'Workflow',
		badge: 'Research',
		description:
			'Structured distillation template for summarizing computer science papers or engineering books.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'Paper Notes: Conflict-free Replicated Data Types (CRDTs)',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content: 'Authors: Shapiro et al. | Year: 2011 | Field: Distributed Systems',
				props: { variant: 'info' }
			}),
			createBlockObject({ type: 'heading', content: 'Core Thesis', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'State-based and operation-based CRDTs guarantee strong eventual consistency without centralized consensus locks.',
				props: {}
			}),
			createBlockObject({
				type: 'heading',
				content: 'Application to Block Editors',
				props: { level: 2 }
			}),
			createBlockObject({
				type: 'paragraph',
				content: 'Enables concurrent multi-device writing without destructive merge conflicts.',
				props: {}
			})
		]
	},

	// 26. Press Release / Launch Announcement
	{
		id: 'press-release',
		title: 'Product Launch Press Release',
		category: 'Product',
		badge: 'Marketing',
		description:
			'Amazon-style "Working Backwards" press release for framing upcoming product features.',
		blocks: [
			createBlockObject({
				type: 'heading',
				content: 'FOR IMMEDIATE RELEASE: Naratas Unveils Blazing Fast Editor',
				props: { level: 1 }
			}),
			createBlockObject({
				type: 'callout',
				content:
					'Bandung / Global — Naratas announces the fastest block document editor for modern developers.',
				props: { variant: 'success' }
			}),
			createBlockObject({ type: 'heading', content: 'Summary', props: { level: 2 } }),
			createBlockObject({
				type: 'paragraph',
				content:
					'Engineered with Svelte 5 and TypeScript, Naratas combines the block flexibility of Notion with the speed and privacy of local Markdown files.',
				props: {}
			})
		]
	}
];
