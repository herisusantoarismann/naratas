import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { BlockObject } from '../../types/blocks.type';

// Detect environment variables safely in Vite / SvelteKit / Vercel
const supabaseUrl =
	typeof import.meta !== 'undefined' && import.meta.env
		? (import.meta.env.PUBLIC_SUPABASE_URL as string) ||
			(import.meta.env.VITE_SUPABASE_URL as string) ||
			''
		: '';

const supabaseAnonKey =
	typeof import.meta !== 'undefined' && import.meta.env
		? (import.meta.env.PUBLIC_SUPABASE_ANON_KEY as string) ||
			(import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
			''
		: '';

let cachedClient: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
	return Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('https://'));
}

export function getSupabaseClient(): SupabaseClient | null {
	if (!isSupabaseConfigured()) {
		return null;
	}
	if (!cachedClient) {
		cachedClient = createClient(supabaseUrl, supabaseAnonKey);
	}
	return cachedClient;
}

export interface SharedDocumentRecord {
	id: string;
	title: string;
	blocks: BlockObject[];
	created_at?: string;
}

/**
 * Upload document to Supabase 'shared_documents' table
 */
export async function shareDocumentToSupabase(
	title: string,
	blocks: BlockObject[]
): Promise<{ id?: string; error?: string }> {
	const client = getSupabaseClient();
	if (!client) {
		return {
			error:
				'Supabase belum dikonfigurasi. Atur PUBLIC_SUPABASE_URL & PUBLIC_SUPABASE_ANON_KEY di .env'
		};
	}

	try {
		const docId =
			typeof crypto !== 'undefined' && crypto.randomUUID
				? crypto.randomUUID()
				: Math.random().toString(36).substring(2, 12);
		const { data, error } = await client
			.from('shared_documents')
			.insert([
				{
					id: docId,
					title: title || 'Untitled Document',
					blocks: blocks,
					created_at: new Date().toISOString()
				}
			])
			.select('id')
			.single();

		if (error) {
			return { error: error.message };
		}

		return { id: (data?.id as string) || docId };
	} catch (err: unknown) {
		const msg = err instanceof Error ? err.message : 'Gagal menghubungi Supabase.';
		return { error: msg };
	}
}

/**
 * Fetch a shared document from Supabase
 */
export async function fetchSharedDocument(
	id: string
): Promise<{ title: string; blocks: BlockObject[]; createdAt: string } | null> {
	const client = getSupabaseClient();
	if (!client) return null;

	try {
		const { data, error } = await client
			.from('shared_documents')
			.select('id, title, blocks, created_at')
			.eq('id', id)
			.single();

		if (error || !data) {
			return null;
		}

		return {
			title: data.title as string,
			blocks: data.blocks as BlockObject[],
			createdAt: data.created_at as string
		};
	} catch {
		return null;
	}
}

/**
 * Fallback: Portable instant share URL using Base64
 */
export function generatePortableShareHash(title: string, blocks: BlockObject[]): string {
	try {
		const payload = JSON.stringify({ t: title, b: blocks });
		const b64 = typeof window !== 'undefined' ? window.btoa(encodeURIComponent(payload)) : '';
		return b64;
	} catch {
		return '';
	}
}

export function parsePortableShareHash(
	hash: string
): { title: string; blocks: BlockObject[] } | null {
	try {
		const raw = hash.replace(/^#share=/, '').replace(/^#/, '');
		if (!raw) return null;
		const json = decodeURIComponent(window.atob(raw));
		const parsed = JSON.parse(json);
		if (parsed && Array.isArray(parsed.b)) {
			return {
				title: parsed.t || 'Shared Document',
				blocks: parsed.b
			};
		}
		return null;
	} catch {
		return null;
	}
}
