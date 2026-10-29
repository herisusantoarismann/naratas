<script lang="ts">
	interface Props {
		size?: 'sm' | 'md' | 'lg' | 'xl' | number;
		variant?: 'mark' | 'full';
		class?: string;
	}

	let { size = 'md', variant = 'full', class: className = '' }: Props = $props();

	const dimension = $derived(
		typeof size === 'number'
			? size
			: size === 'sm'
				? 24
				: size === 'md'
					? 32
					: size === 'lg'
						? 44
						: 56
	);
</script>

<div class="inline-flex items-center gap-2.5 select-none {className}">
	<!-- Naratas Precision Mark (Sunda "Rintis Jalan" Architectural N) -->
	<svg
		width={dimension}
		height={dimension}
		viewBox="0 0 64 64"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		class="shrink-0 transition-transform hover:scale-105"
		aria-hidden="true"
	>
		<defs>
			<linearGradient id="naratas-bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
				<stop offset="0%" stop-color="#18181b" />
				<stop offset="100%" stop-color="#09090b" />
			</linearGradient>
			<linearGradient
				id="naratas-bridge"
				x1="16"
				y1="16"
				x2="48"
				y2="48"
				gradientUnits="userSpaceOnUse"
			>
				<stop offset="0%" stop-color="#ffffff" />
				<stop offset="100%" stop-color="#e4e4e7" />
			</linearGradient>
			<filter id="emerald-glow" x="38" y="8" width="22" height="22" filterUnits="userSpaceOnUse">
				<feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="#10b981" flood-opacity="0.5" />
			</filter>
		</defs>

		<!-- Container Squircle -->
		<rect width="64" height="64" rx="16" fill="url(#naratas-bg)" />
		<rect width="62" height="62" x="1" y="1" rx="15" stroke="#27272a" stroke-width="1.5" />

		<!-- Left Vertical Pillar (Foundation) -->
		<rect x="15" y="17" width="8" height="30" rx="3" fill="#fafafa" />

		<!-- Right Vertical Pillar (Structure) -->
		<rect x="41" y="17" width="8" height="30" rx="3" fill="#fafafa" />

		<!-- Dynamic Diagonal Bridge / Path (Naratas Stroke) -->
		<path d="M17 19L47 43" stroke="url(#naratas-bridge)" stroke-width="8" stroke-linecap="round" />

		<!-- Live Cursor Dot (Origin Point) with Glow -->
		<circle cx="49" cy="15" r="4.5" fill="#10b981" filter="url(#emerald-glow)" />
	</svg>

	{#if variant === 'full'}
		<div class="flex flex-col leading-none">
			<div class="flex items-center gap-1.5">
				<span class="text-base font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
					Naratas
				</span>
				<span
					class="rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"
				>
					v1.0
				</span>
			</div>
			<span class="text-[10px] font-medium tracking-wide text-zinc-400 dark:text-zinc-500">
				Block Docs
			</span>
		</div>
	{/if}
</div>
