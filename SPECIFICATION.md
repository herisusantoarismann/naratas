# 📐 BlockCraft Document Engine — Master Technical Specification

Dokumen ini adalah **Kontrak Spesifikasi Mutlak** untuk membangun aplikasi **BlockCraft (Notion-Lite Block Document Engine)** menggunakan **SvelteKit + Svelte 5 Runes**.
Semua nama file, nama fungsi, nama variabel/property, nama prop komponen, dan `data-testid` di bawah ini **DIUJI SECARA HARFIAH** oleh 6 file test Vitest (`tests/*.test.ts`) dan 1 file E2E Playwright (`e2e/editor-workflow.spec.ts`).

---

## 1. Struktur File yang WAJIB Kamu Buat Sendiri

Project ini hanya menyediakan folder `tests/` dan `e2e/`. Kamu wajib membuat struktur folder `src/` persis seperti di bawah ini:

```text
src/
├── lib/
│   ├── utils/
│   │   ├── sanitize.ts
│   │   ├── markdown.ts
│   │   ├── slashCommands.ts
│   │   └── virtualizer.ts
│   ├── actions/
│   │   ├── clickOutside.ts
│   │   ├── shortcut.ts
│   │   ├── caretManager.ts
│   │   └── slashMenuPosition.ts
│   ├── components/
│   │   └── ui/
│   │       ├── Button.svelte
│   │       ├── Badge.svelte
│   │       └── Modal.svelte
│   └── features/
│       └── editor/
│           ├── documentEngine.svelte.ts
│           ├── BlockRenderer.svelte
│           ├── SlashCommandMenu.svelte
│           ├── InspectorDrawer.svelte
│           ├── VirtualBlockCanvas.svelte
│           └── blocks/
│               ├── HeadingBlock.svelte
│               ├── ParagraphBlock.svelte
│               ├── CalloutBlock.svelte
│               └── CodeBlock.svelte
└── routes/
    ├── +layout.svelte
    ├── +page.svelte
    ├── editor/
    │   └── +page.svelte
    └── templates/
        └── +page.svelte
```

---

## 2. Aturan Arsitektur & Clean Code (`tests/01-architecture.test.ts`)

1. **Zero Svelte 4 Legacy Syntax:** Dilarang memakai `export let`, `$:`, `createEventDispatcher`, atau `<slot>` di file `.svelte` mana pun. Wajib 100% Svelte 5 (`$state`, `$state.raw`, `$derived`, `$effect`, `$props`, `$bindable`, `{@render children?.()}`).
2. **Pure Utilities (`src/lib/utils/*.ts`):**
   - Hanya boleh berisi file `.ts` murni.
   - Haram mengakses `window`, `document`, `localStorage`, atau `fetch`.
   - Haram mengimpor dari `components/`, `features/`, atau `routes/`.
   - Haram memutasi parameter array/objek secara langsung.
3. **Atomic UI Isolation (`src/lib/components/ui/*.svelte`):**
   - Haram mengimpor dari `features/` atau `routes/`.
   - Haram mengakses `localStorage` atau `fetch`.
   - Maksimal **120 baris** per file `.svelte`.
4. **Feature & Route Modularity:**
   - File `.svelte` di `features/` dan `routes/` maksimal **180 baris** per file.

---

## 3. Spesifikasi Detail Pure Utils (`tests/02-unit-utils-serializer.test.ts`)

### A. `src/lib/utils/sanitize.ts`

- **`sanitizeBlockContent(rawText)`**:
  - Menghapus seluruh tag `<script>...</script>`, tag event inline (`onerror=`, `onload=`), dan tag HTML berbahaya, lalu melakukan `.trim()`.
  - Jika `rawText` bukan string atau `null`/`undefined`, kembalikan `""`.
- **`isValidDocumentTitle(title)`**:
  - Mengembalikan `boolean`. Valid jika setelah di-trim panjangnya antara **3 sampai 120 karakter**.
- **`createBlockObject({ id, type = 'paragraph', content = '', props = {} })`**:
  - Mengembalikan objek blok standar:
    ```js
    {
      id: string, // gunakan id yang diberikan atau generate unik
      type: 'paragraph' | 'heading' | 'callout' | 'code' | 'divider',
      content: sanitizeBlockContent(content),
      props: { ...props }, // misal: { level: 1 } untuk heading, { variant: 'info' } untuk callout, { language: 'js' } untuk code
      updatedAt: number // timestamp Date.now()
    }
    ```

### B. `src/lib/utils/markdown.ts`

- **`blocksToMarkdown(blocks)`**:
  - Menerima array `blocks` (tidak boleh memutasi array input!) dan mengembalikan string Markdown yang dipisahkan oleh dua baris baru (`\n\n`):
    - `type === 'heading'`: `# {content}` (sesuai `props.level` 1, 2, atau 3; default level 1).
    - `type === 'paragraph'`: `{content}`
    - `type === 'callout'`: `> [{props.variant.toUpperCase()}] {content}` (default variant `'INFO'`).
    - `type === 'code'`: ` ```{props.language || 'plaintext'}\n{content}\n``` `
    - `type === 'divider'`: `---`
- **`markdownToBlocks(markdownString)`**:
  - Mem-parsing string Markdown (dipisahkan `\n\n`) kembali menjadi array objek blok menggunakan `createBlockObject`.

### C. `src/lib/utils/slashCommands.ts`

- **`SLASH_COMMANDS`**: Konstanta array berisi daftar command standar:
  - `{ id: 'h1', label: 'Heading 1', type: 'heading', props: { level: 1 }, keywords: ['h1', 'title', 'heading 1'] }`
  - `{ id: 'h2', label: 'Heading 2', type: 'heading', props: { level: 2 }, keywords: ['h2', 'subtitle', 'heading 2'] }`
  - `{ id: 'paragraph', label: 'Text Paragraph', type: 'paragraph', props: {}, keywords: ['text', 'p', 'paragraph'] }`
  - `{ id: 'callout', label: 'Callout Box', type: 'callout', props: { variant: 'info' }, keywords: ['alert', 'note', 'callout'] }`
  - `{ id: 'code', label: 'Code Block', type: 'code', props: { language: 'javascript' }, keywords: ['code', 'snippet', 'pre'] }`
  - `{ id: 'divider', label: 'Divider Line', type: 'divider', props: {}, keywords: ['hr', 'line', 'divider'] }`
- **`filterSlashCommands(query)`**:
  - Menerima string `query` (dengan atau tanpa awalan `/`, misal `"/head"` atau `"code"`), mengembalikan item dari `SLASH_COMMANDS` yang `label`, `type`, atau salah satu `keywords`-nya cocok secara _case-insensitive_.

### D. `src/lib/utils/virtualizer.ts`

- **`calculateBlockViewport({ scrollTop, viewportHeight, estimatedBlockHeight, totalBlocks, overscan = 3 })`**:
  - Mengembalikan `{ startIndex, endIndex, offsetY, totalHeight }`.

---

## 4. Spesifikasi Detail `DocumentEngine` (`tests/03-unit-document-engine.test.ts`)

File: `src/lib/features/editor/documentEngine.svelte.ts`
Export class bernama **`DocumentEngine`**:

### State & Derived Properties (Wajib menggunakan Svelte 5 Runes):

- `title` (`$state`): String judul dokumen (default: `'Untitled Document'`).
- `blocks` (`$state`): Array objek blok.
- `activeBlockId` (`$state`): ID blok yang sedang fokus/aktif (`string | null`).
- `searchQuery` (`$state`): String pencarian blok (default: `''`).
- `typeFilter` (`$state`): Filter tipe blok (`'all' | 'heading' | 'paragraph' | 'callout' | 'code'`, default: `'all'`).
- `filteredBlocks` (`$derived` getter): Mengembalikan daftar blok yang cocok dengan `typeFilter` dan `searchQuery` (case-insensitive pada `content`).
- `stats` (`$derived` getter): Mengembalikan objek:
  - `totalBlocks`: jumlah total blok
  - `wordCount`: jumlah total kata dari seluruh `content` blok (abaikan blok kosong/divider)
  - `charCount`: jumlah total karakter dari seluruh `content` blok
  - `readingTimeMinutes`: `Math.ceil(wordCount / 200)` (0 jika `wordCount === 0`)
- `canUndo` (`$derived` getter): `boolean` (true jika ada riwayat di undo stack).
- `canRedo` (`$derived` getter): `boolean` (true jika ada riwayat di redo stack).

### Methods pada `DocumentEngine`:

- `constructor(initialData = null)`:
  - Jika `initialData` diberikan (`{ title, blocks }`), inisialisasi dengan data tersebut.
  - Jika tidak, coba muat dari `localStorage.getItem('blockcraft_doc_v1')` (pastikan aman untuk SSR jika `localStorage` tidak ada).
  - Jika masih kosong, mulai dengan 1 blok default `{ type: 'paragraph', content: '' }`.
- `setTitle(newTitle)`: Validasi dengan `isValidDocumentTitle`. Jika tidak valid, lempar `Error('Invalid document title')`. Simpan history & localStorage.
- `addBlock({ type = 'paragraph', content = '', props = {}, afterBlockId = null } = {})`:
  - Menambahkan blok baru. Jika `afterBlockId` diberikan dan ditemukan, sisipkan persis setelah blok tersebut; jika tidak, tambahkan di akhir array.
  - Set `activeBlockId` ke ID blok baru tersebut, rekam ke history undo, simpan ke `localStorage`, dan kembalikan objek blok baru.
- `updateBlockContent(id, newContent)`:
  - Sanitasi `newContent` dengan `sanitizeBlockContent`, update `content` dan `updatedAt` pada blok `id`. Rekam ke history & localStorage.
- `transformBlockType(id, newType, newProps = {})`:
  - Mengubah `type` dan `props` dari blok `id` (misal saat memilih dari Slash Command). Jika `content` diawali dengan `/` (seperti `"/h1"`), bersihkan command `/` tersebut menjadi `""`. Rekam ke history & localStorage.
- `splitBlockAtCursor(id, cursorIndex)`:
  - Memotong `content` blok `id` pada indeks `cursorIndex`.
  - Bagian kiri (`content.slice(0, cursorIndex)`) tetap di blok `id`.
  - Bagian kanan (`content.slice(cursorIndex)`) menjadi blok `'paragraph'` baru persis di bawah blok `id`.
  - `activeBlockId` berpindah ke blok baru. Rekam sebagai 1 langkah history.
- `mergeWithPrevious(id)`:
  - Jika blok `id` adalah blok pertama (index 0), jangan lakukan apa-apa (return `false`).
  - Jika ada blok sebelumnya (dan bukan `'divider'`), gabungkan `content` blok `id` ke akhir `content` blok sebelumnya, hapus blok `id`, dan pindahkan `activeBlockId` ke blok sebelumnya. Rekam ke history & return `true`.
- `moveBlock(id, direction)`:
  - `direction` bernilai `'up'` atau `'down'`. Menukar posisi blok dengan tetangganya. Rekam ke history.
- `deleteBlock(id)`:
  - Menghapus blok `id`. Jika setelah dihapus array `blocks` menjadi kosong (0 blok), otomatis buat 1 blok `'paragraph'` kosong agar dokumen selalu memiliki minimal 1 blok.
- `setSearchQuery(query)` & `setTypeFilter(type)`: Mengubah state filter.
- `undo()` & `redo()`: Mengembalikan state `title` dan `blocks` ke snapshot sebelumnya/berikutnya.
- `exportMarkdown()`: Mengembalikan hasil `blocksToMarkdown(this.blocks)`.
- `exportJSON()`: Mengembalikan string JSON `{ title: this.title, blocks: this.blocks }`.
- `importJSON(jsonString)`: Mem-parsing string JSON, memvalidasi strukturnya, mengganti `title` & `blocks`, serta merekam ke history.
- `bulkLoadBlocks(rawBlocksArray)`: (Tier 4) Memuat ribuan blok sekaligus secara instan (< 50ms untuk 2.500 blok).

---

## 5. Spesifikasi Custom Actions (`tests/04-unit-actions.test.ts`)

1. **`src/lib/actions/clickOutside.ts` (`export function clickOutside(node, callback)`)**:
   - Memanggil `callback(event)` saat klik terjadi di luar `node`. Wajib membersihkan listener pada `destroy()`.
2. **`src/lib/actions/shortcut.ts` (`export function shortcut(node, { key, ctrl = false, shift = false, callback })`)**:
   - Mendengarkan `keydown` di `window`. Jika kombinasi cocok, panggil `event.preventDefault()` dan `callback(event)`. Wajib `removeEventListener` pada `destroy()`.
3. **`src/lib/actions/caretManager.ts` (`export function caretManager(node, { isFocused = false, cursorOffset = null } = {})`)**:
   - Jika `isFocused === true` saat mount atau `update()`, panggil `node.focus()`. Jika `node` adalah `<input>` atau `<textarea>` dan `cursorOffset !== null`, panggil `node.setSelectionRange(cursorOffset, cursorOffset)`.
4. **`src/lib/actions/slashMenuPosition.ts` (`export function slashMenuPosition(node, anchorRect)`)**:
   - Mengatur `node.style.position = 'fixed'`, `node.style.top = "${anchorRect.bottom + 8}px"`, dan `node.style.left = "${anchorRect.left}px"`. Mendukung `update(newRect)`.

---

## 6. Spesifikasi Komponen & Data-TestId (`tests/05-components-blocks.test.ts` & `e2e/`)

### A. Atomic UI (`src/lib/components/ui/`)

- **`Button.svelte`**: Props `{ variant = 'primary', type = 'button', disabled = false, ariaLabel, onclick, children }`. Merender `<button type={type} data-variant={variant} {disabled} aria-label={ariaLabel} {onclick}>`.
- **`Badge.svelte`**: Props `{ text, tone = 'neutral' }`. Merender `<span data-testid="ui-badge" data-tone={tone}>{text}</span>`.
- **`Modal.svelte`**: Props `{ open = false, title, onClose, children }`. Jika `open === true`, merender `<div role="dialog" aria-modal="true" aria-label={title}>` dengan tombol `<button type="button" aria-label="Close modal" onclick={onClose}>`.

### B. Block Components (`src/lib/features/editor/blocks/`)

Semua komponen blok menerima props standar:
`{ block, isActive = false, onContentChange, onSplit, onMerge, onSlashTrigger, onDelete }`

- **`HeadingBlock.svelte`**:
  - Wrapper memiliki `data-testid="block-heading"` dan `data-level={block.props?.level || 1}`.
  - Memiliki `<input data-testid="block-input" value={block.content} ... />`.
- **`ParagraphBlock.svelte`**:
  - Wrapper memiliki `data-testid="block-paragraph"`.
  - Memiliki `<input>` atau `<textarea>` dengan `data-testid="block-input"` dan nilai `block.content`.
  - Jika user mengetik `/` di awal atau saat konten mulai dengan `/`, panggil `onSlashTrigger?.(block.id, inputValue)`.
  - Saat tombol `Enter` ditekan (tanpa Shift), panggil `onSplit?.(block.id, selectionStart)`.
  - Saat tombol `Backspace` ditekan ketika `block.content === ''` atau kursor di posisi `0`, panggil `onMerge?.(block.id)`.
- **`CalloutBlock.svelte`**:
  - Wrapper memiliki `data-testid="block-callout"` dan `data-variant={block.props?.variant || 'info'}`.
  - Memiliki input `data-testid="block-input"`.
- **`CodeBlock.svelte`**:
  - Wrapper memiliki `data-testid="block-code"` dan menampilkan badge bahasa `block.props?.language || 'javascript'`.
  - Memiliki `<textarea data-testid="block-input">`.

### C. Editor Feature Components (`src/lib/features/editor/`)

- **`SlashCommandMenu.svelte`**:
  - Props: `{ open = false, query = '', onSelect, onClose }`.
  - Jika `open === true`, render `<div role="listbox" data-testid="slash-command-menu">` yang menampilkan hasil `filterSlashCommands(query)`.
  - Setiap item memiliki `<button type="button" role="option" data-testid="slash-item-{cmd.id}" onclick={() => onSelect(cmd)}>`.
- **`InspectorDrawer.svelte`**:
  - Props: `{ open = false, markdown = '', json = '', stats = { totalBlocks: 0, wordCount: 0, readingTimeMinutes: 0 } }`.
  - Menampilkan `data-testid="stat-words"`, `data-testid="stat-blocks"`, `<pre data-testid="markdown-preview">{markdown}</pre>`, dan `<pre data-testid="json-preview">{json}</pre>`.
- **`VirtualBlockCanvas.svelte`**:
  - Props: `{ blocks = [], viewportHeight = 500, estimatedBlockHeight = 48 }`.
  - Hanya me-render item yang masuk dalam rentang `calculateBlockViewport` dengan atribut `data-testid="virtual-block-row"`.

---

## 7. Spesifikasi Halaman SvelteKit & E2E Flow (`e2e/editor-workflow.spec.ts`)

1. **`src/routes/+layout.svelte`**:
   - Memiliki `<nav aria-label="Main Navigation">` dengan 3 link:
     - `<a href="/">Overview</a>`
     - `<a href="/editor">Editor</a>`
     - `<a href="/templates">Templates</a>`
2. **`src/routes/+page.svelte` (Overview Dashboard)**:
   - Menampilkan `<h1>BlockCraft Workspace</h1>`, ringkasan statistik dokumen (`data-testid="overview-total-blocks"`, `data-testid="overview-word-count"`), dan tombol/link menuju `/editor`.
3. **`src/routes/editor/+page.svelte` (Main Block Editor)**:
   - Input judul dokumen: `<input data-testid="doc-title-input" />`.
   - Toolbar:
     - `<button type="button" data-testid="btn-add-block">Add Block</button>`
     - `<button type="button" data-testid="btn-undo">Undo</button>`
     - `<button type="button" data-testid="btn-redo">Redo</button>`
     - `<button type="button" data-testid="btn-toggle-inspector">Inspector</button>`
   - Filter bar: `<input data-testid="block-search-input" placeholder="Search blocks..." />` dan `<select data-testid="block-type-filter">`.
   - Daftar blok yang merender setiap blok dalam container `data-testid="block-list"` dan setiap baris blok dibungkus `data-testid="editor-block-wrapper"`.
   - Mengintegrasikan `SlashCommandMenu` dan `InspectorDrawer`.
4. **`src/routes/templates/+page.svelte` (Starter Templates)**:
   - Menampilkan minimal 2 kartu template (`data-testid="template-card"`), salah satunya memiliki tombol `<button type="button" data-testid="btn-use-template-rfc">Use Engineering RFC Template</button>` yang mengisi `localStorage` (`blockcraft_doc_v1`) dengan dokumen template siap pakai (minimal 3 blok: heading, callout, paragraph).
