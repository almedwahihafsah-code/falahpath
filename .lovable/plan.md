

## Goal
Embed the Excel-defined Quranic classification system into the app and seed Surah Al-Baqarah (286 verses) as the first classified surah, so users can browse, classify, and link any verse to the existing Falah domains/tasks.

## What the Excel defines (6-layer schema)

| Layer | Purpose | Examples |
|---|---|---|
| 1. المجال (Domain) | A–F top-level + sub-domain | A_الله_والغيبيات, B_الإنسان, C_الكون, D_الهداية, E_الحياة_العملية, F_المصير_والآخرة |
| 2. المحور (Theme) | Recurring theme | التوحيد, الابتلاء, التمكين, الصبر, الشكر, التوبة, الحكمة… |
| 3. الوظيفة الخطابية (Function) | Speech act | أمر, نهي, وعد, وعيد, قصة, مثل, حوار, تقرير, تعزية, تحفيز, تصحيح |
| 4. السياق (Context) | مكي/مدني + occasion | مكية / مدنية, سياق السورة, سبب النزول |
| 5. الأثر التربوي (Educational effect) | بناء_الإيمان, تزكية_النفس, تصحيح_السلوك, إحياء_الرجاء… |
| 6. العلامات الذكية (Smart tags) | #سنة_إلهية, #تمكين, #قيادة, #تحول… |

## Database (Lovable Cloud)

Five new tables, all readable by everyone (public Quran reference data), writable only by admins.

- `surahs` — id, number (1–114), name_ar, name_translit, revelation (مكية/مدنية), verses_count, order_revelation
- `verses` — id, surah_number, verse_number, text_ar (uthmani), text_simple, page, juz; unique(surah_number, verse_number)
- `verse_classifications` — id, verse_id, domain_code (A–F), sub_domain, themes[], function, context, educational_effects[], tags[], notes, created_by, created_at, updated_at
- `classification_taxonomy` — type (domain|theme|function|effect|tag), code, label_ar, parent_code, description — seeded from the Excel reference sheets
- `user_roles` + `app_role` enum (`admin`, `user`) + `has_role()` security-definer function (per project rules — never store role on profiles)

Seed data from Excel:
- All taxonomy rows from sheets 3–7 of the workbook
- Surah Al-Baqarah metadata + all 286 verses (text fetched from a reliable open source — see Technical notes)
- The example verse القصص:5 as a reference classification

Reference verses are PUBLIC SELECT. Only admins INSERT/UPDATE/DELETE classifications and verses.

## UI

### New page: `/quran` — Quran Explorer
Top bar: surah selector (114 surahs, only Al-Baqarah enabled at launch, others greyed "قريبًا"), juz/page jump, search by tag/domain/theme.

Main: vertical list of verses with verse number badge, Arabic text in `font-quran`, and a chips row showing assigned classifications (domain color, themes, function, tags). Click a verse → side drawer with full classification, reflection notes, and an **"أضف إلى مهامي"** button that creates a task in the existing `tasks` table with the inferred domain.

Filters (left rail on desktop, sheet on mobile):
- Domain (A–F) toggle chips
- Theme multi-select
- Function multi-select
- Smart tags multi-select
- Context (مكي/مدني)
- "مصنّفة فقط" toggle

### New page: `/quran/admin` (admins only)
Form to add/edit a verse classification: dropdowns for all 6 layers populated from `classification_taxonomy`, multi-select for themes/effects/tags, free-text reflection. Includes a "تصنيف بالذكاء الاصطناعي" button that calls a new edge function suggesting a draft classification using Lovable AI (`google/gemini-2.5-pro`) which the admin reviews and saves.

### Landing page (`/`)
Add a "تصنيف القرآن" card to the existing Services section linking to `/quran`.

### App home (`/app`)
Add a 5th tab **"القرآن"** with a quick widget: random classified verse + "استكشف التصنيف الكامل" CTA to `/quran`.

## Smart Guide alignment
The Smart Guide (`/guide`) already maps situations to domains. Extend its response so when it suggests a behavior, it also surfaces 1–3 relevant classified verses from `verse_classifications` matching the inferred domain/theme. Add a "آيات لهذا الموقف" section under the existing reflection.

## Technical notes
- **Verse text source**: Word doc OCR is incomplete and has errors mid-surah. Fetch canonical Uthmani text for Al-Baqarah (286 verses) from a public Quran JSON source at seed time (e.g. `quran.com` API or an open `quran-json` dataset bundled in `src/data/quran/al-baqarah.json`) — this guarantees accurate Rasm.
- **Bismillah image** from the Word doc: copy to `src/assets/bismillah.png` and show at the top of each surah view.
- **Color tokens**: extend `index.css` with 6 semantic HSL tokens (`--domain-a` … `--domain-f`) so each domain has a consistent color across chips, filters, and the verse drawer.
- **Components to create**: `src/components/quran/SurahHeader.tsx`, `VerseCard.tsx`, `ClassificationDrawer.tsx`, `ClassificationForm.tsx`, `FilterRail.tsx`, `ClassificationChips.tsx`.
- **Data files**: `src/data/quran/al-baqarah.json` (verses), `src/data/quran/taxonomy.ts` (mirror of seeded taxonomy for instant UI rendering), `src/data/quran/surahs.ts` (114-surah index).
- **Edge function**: `supabase/functions/classify-verse/index.ts` — accepts `verse_id`, calls Lovable AI with the 6-layer schema as JSON-mode prompt, returns a draft classification.
- **Admin bootstrap**: first signed-in user is granted `admin` via a one-time SQL insert noted in the migration; subsequent admins added via a tiny "Manage admins" panel on `/quran/admin`.
- **RLS**: `verses` and `surahs` and `classification_taxonomy` SELECT public. `verse_classifications` SELECT public, INSERT/UPDATE/DELETE admin-only via `has_role(auth.uid(),'admin')`.

## Out of scope (follow-ups)
- Seeding the remaining 113 surahs (will be added per request once Al-Baqarah flow is validated)
- Audio recitation playback
- Tafsir text per verse
- Translation toggle (English/French)
- Public submission workflow for non-admin classifications

## Files to create / edit
**New**: 6 components in `src/components/quran/`, `src/pages/QuranExplorer.tsx`, `src/pages/QuranAdmin.tsx`, `src/data/quran/al-baqarah.json`, `src/data/quran/surahs.ts`, `src/data/quran/taxonomy.ts`, `supabase/functions/classify-verse/index.ts`, migration with 5 tables + role system + seed data, `src/assets/bismillah.png`.
**Edit**: `src/App.tsx` (routes), `src/pages/AppHome.tsx` (5th tab), `src/pages/Index.tsx` (Services card), `src/pages/Guide.tsx` (related verses block), `src/components/falah/Navbar.tsx` (Quran link), `src/index.css` (domain color tokens).

