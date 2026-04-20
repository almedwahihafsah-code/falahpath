

## Goal
Align the Falah app with the core services of `ellfalah.netlify.app` while keeping the existing identity (auth, Smart Guide, Cloud sync). The reference site is a **gamified Quranic life planner** organized in 4 tabs: Tasks, Domains, Daily Journal, Achievements — with points/levels, verse of the day, and energy/peace meters.

## Gap analysis

| Reference feature | Current state | Action |
|---|---|---|
| Tasks (title, desc, domain, priority, due date, type) | Missing | **Build** |
| 8 Domains with progress | Have static cards (slider scoring only) | **Enhance** with task counts |
| Daily Journal (10 worship habits with points, Quran reading, reflection minutes, peace/energy sliders, daily note) | Partial (9 habits, no points) | **Enhance** |
| Achievements (level, points, badges) | Missing | **Build** |
| Verse of the Day card | Missing | **Build** |
| Top stats bar (tasks/completed/points/level) | Missing | **Build** |
| Tabbed AppHome layout | Single scroll | **Refactor** to tabs |

## Plan

### 1. Backend (Lovable Cloud)
Add 3 tables with RLS (user_id-scoped):
- `tasks` — id, user_id, title, description, domain_id, priority (high/med/low), due_date, type (task/habit/goal), status, completed_at, points
- `daily_journal` — id, user_id, date (unique per user), quran_juz, reflection_minutes, peace_level (1-10), energy_level (1-10), note
- `user_progress` — user_id (PK), total_points, level, streak_days, last_activity_date

Move existing localStorage data (scores, habits, custom habits) to Cloud-backed tables for cross-device sync:
- `domain_scores` — user_id, domain_id, score, week_of
- `habit_completions` — user_id, habit_key, date, points_earned

### 2. Frontend — refactor `/app` into tabbed layout

```text
┌─────────────────────────────────────────┐
│  [Top Stats] tasks | completed | pts | lvl │
│  [Verse of the Day card]                 │
│  [Weekly Falah Meter %]                  │
│  ─────────────────────────────────────── │
│  📋 Tasks | 🌿 Domains | 🌅 Journal | 🏆 │
└─────────────────────────────────────────┘
```

**Tab 1 — Tasks**: Add-task form (title, desc, domain dropdown, priority, due date, type). List with filter chips (All/Active/Completed + by domain). Complete = +points. Delete action.

**Tab 2 — Domains**: 8 cards with emoji + title + subtitle + `X/Y tasks Z%` progress. Click to filter Tasks tab. Keep slider scoring at the bottom.

**Tab 3 — Daily Journal**: 10 worship habits each with point value (+10/+15/+8). Quran juz counter (-/+). Reflection minutes (-5/+5). Peace slider (قلق ↔ مطمئن). Energy slider (متعب ↔ نشيط). Daily note textarea. Save button.

**Tab 4 — Achievements**: Level badge + progress to next level. Points history. Unlocked badges (e.g. "صائم الفجر 7 أيام", "ختمة جزء", "10 صدقات"). Streak counter.

### 3. New shared components
- `VerseOfTheDay` card (rotates daily from a curated list in `src/data/verses.ts`)
- `StatsBar` (4 mini-cards: tasks, completed, points, level)
- `TaskCard`, `TaskForm`, `JournalForm`, `AchievementBadge`

### 4. Smart Guide alignment
Existing "Add to daily habits" button stays. Additionally add **"أنشئ مهام من هذه الاقتراحات"** to push AI actions into the new `tasks` table with the inferred domain.

### 5. Points & leveling logic
- Each completed task/habit awards points (configurable per item, defaults from reference: fajr+10, quran+15, dhikr+10, prayers+8, charity+12, sport+10, learning+10).
- Level = `floor(sqrt(points / 50))` (level 1 at 50pts, level 2 at 200, level 3 at 450…).
- Streak increments when user logs any activity on consecutive days.

### 6. Landing page (`/`)
Add a new **"خدماتنا"** section above CTA showcasing the 4 core services (Tasks Planner, 8 Domains, Daily Journal, Achievements) with icons + 1-line descriptions, ensuring the landing accurately reflects what users get inside the app.

### 7. Migration of existing data
On first load after deploy, if localStorage has `falah_scores_v1` / `falah_habits_v1` / `falah_custom_habits_v1`, push them to Cloud once then clear local keys.

## Out of scope (can be follow-ups)
- Multi-week analytics charts
- Sharing/export of weekly report as PDF
- Push notifications / reminders
- Dark mode toggle (reference has 🌙 toggle)

## Files to create / edit
**New**: `src/data/verses.ts`, `src/components/falah/StatsBar.tsx`, `src/components/falah/VerseOfTheDay.tsx`, `src/components/falah/TaskForm.tsx`, `src/components/falah/TaskList.tsx`, `src/components/falah/JournalForm.tsx`, `src/components/falah/Achievements.tsx`, `src/lib/falah-points.ts`, migration SQL.
**Edit**: `src/pages/AppHome.tsx` (full refactor to tabs), `src/pages/Index.tsx` (add Services section), `src/pages/Guide.tsx` (add "create tasks" button), `src/data/falah.ts` (add emoji + points to habits).

