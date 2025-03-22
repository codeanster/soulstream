Alright, here’s a **Soulstream-tailored MySQL database plan**, optimized for emotional memory, journaling, and AI interaction history.

---

## 🗂️ **High-Level Schema Overview**

We'll break the database into these main tables:

| Table Name         | Purpose |
|--------------------|---------|
| `users`            | Core user profiles + metadata |
| `characters`       | AI companion persona data |
| `conversations`    | Raw chat logs |
| `memory_chips`     | Stored memory units with metadata |
| `timeline_entries` | Daily summaries with mood/emotion |
| `journal_entries`  | Narrative-style journal logs |
| `memory_tags`      | Tag system for memories (topics, emotions, etc.) |
| `memory_links`     | Optional table for connecting memories to each other |
| `settings`         | User preferences, including character view modes |

---

## 🧬 **Detailed Schema Design**

### 🧍‍♂️ `users`

| Field          | Type          | Notes |
|----------------|---------------|-------|
| `id`           | INT (PK)      | Auto-increment |
| `username`     | VARCHAR(50)   | Unique |
| `email`        | VARCHAR(100)  | Optional |
| `created_at`   | DATETIME      | Account creation date |
| `last_login`   | DATETIME      | Last active |
| `timezone`     | VARCHAR(50)   | For accurate timeline displays |
| `is_premium`   | BOOLEAN       | For memory capacity/feature gating |

---

### 🧠 `characters`

| Field             | Type         | Notes |
|-------------------|--------------|-------|
| `id`              | INT (PK)     | AI ID |
| `user_id`         | INT (FK)     | Belongs to user |
| `name`            | VARCHAR(50)  | AI's name |
| `persona_traits`  | TEXT (JSON)  | Personality metadata |
| `avatar_url`      | TEXT         | Character art |
| `created_at`      | DATETIME     | First encounter |

---

### 💬 `conversations`

| Field           | Type         | Notes |
|------------------|--------------|-------|
| `id`             | INT (PK)     | — |
| `user_id`        | INT (FK)     | — |
| `character_id`   | INT (FK)     | — |
| `message`        | TEXT         | Raw message content |
| `sender`         | ENUM(‘user’, ‘ai’) | Direction |
| `timestamp`      | DATETIME     | Ordered logs |
| `referenced_memory_ids` | TEXT (JSON) | Optional: which memory chips were active during this exchange |

---

### 💾 `memory_chips`

| Field              | Type         | Notes |
|---------------------|--------------|-------|
| `id`                | INT (PK)     | — |
| `user_id`           | INT (FK)     | — |
| `character_id`      | INT (FK)     | — |
| `summary`           | TEXT         | TL;DR memory |
| `source_text`       | TEXT         | Original chat snippet |
| `emotion`           | VARCHAR(20)  | e.g. "joy", "anger", "longing" |
| `topic`             | VARCHAR(100) | Optional subject/topic label |
| `created_at`        | DATETIME     | — |
| `last_referenced_at`| DATETIME     | For smart resurfacing |
| `importance_score`  | FLOAT        | 0.0 to 1.0 for weighting memory salience |
| `is_pinned`         | BOOLEAN      | Prevents deletion during pruning |

---

### 🕰️ `timeline_entries`

| Field              | Type         | Notes |
|--------------------|--------------|-------|
| `id`               | INT (PK)     | Auto-increment |
| `user_id`          | INT (FK)     | References users.id |
| `date`             | DATE         | One entry per day |
| `title`            | VARCHAR(100) | Generated from highlight |
| `mood`             | VARCHAR(20)  | e.g. "neutral", "happy", "lonely" |
| `entry_summary`    | TEXT         | Short overview of the day |
| `emotion`          | VARCHAR(20)  | Primary emotion (e.g. "joy", "sadness") |
| `emotion_intensity`| FLOAT        | 0.0 to 1.0 for emotion strength |
| `secondary_emotions`| JSON        | Array of {name, intensity} objects |
| `milestone_flag`   | BOOLEAN      | Whether this is a major event |
| `created_at`       | DATETIME     | When the entry was created |
| `updated_at`       | DATETIME     | When the entry was last updated |

---

### 🔄 `timeline_memory_links`

| Field          | Type         | Notes |
|----------------|--------------|-------|
| `timeline_id`  | INT (PK/FK)  | References timeline_entries.id |
| `memory_id`    | INT (PK/FK)  | References memory_chips.id |

*This junction table replaces the `memory_chip_ids` JSON field in timeline_entries, providing a proper many-to-many relationship between timeline entries and memory chips.*

---

### 📓 `journal_entries`

| Field          | Type         | Notes |
|----------------|--------------|-------|
| `id`           | INT (PK)     | — |
| `user_id`      | INT (FK)     | — |
| `date`         | DATE         | Matches timeline or freeform |
| `title`        | VARCHAR(100) | Optional |
| `entry_body`   | TEXT         | Poetic or narrative prose |
| `voice_style`  | VARCHAR(20)  | e.g. “romantic”, “stoic”, “analytical” |
| `emotion`      | VARCHAR(20)  | Dominant emotional tone |
| `created_by_ai`| BOOLEAN      | Whether it was AI-written |

---

### 🏷️ `memory_tags`

| Field       | Type         | Notes |
|-------------|--------------|-------|
| `id`        | INT (PK)     | — |
| `name`      | VARCHAR(50)  | e.g. “family”, “career”, “regret” |
| `color`     | VARCHAR(10)  | Hex code for UI |
| `user_id`   | INT (FK)     | Tags are personalized per user |

---

### 🔗 `memory_links` *(optional)*

| Field             | Type       | Notes |
|-------------------|------------|-------|
| `id`              | INT (PK)   | — |
| `memory_id_a`     | INT (FK)   | — |
| `memory_id_b`     | INT (FK)   | — |
| `relationship_type` | VARCHAR(30) | e.g. “contradiction”, “reinforcement”, “theme-match” |

---

### ⚙️ `settings`

| Field         | Type         | Notes |
|----------------|--------------|-------|
| `user_id`     | INT (PK/FK)  | — |
| `dark_mode`   | BOOLEAN      | UI preference |
| `voice_mode`  | VARCHAR(20)  | “narrative”, “direct”, etc. |
| `max_memory_storage_mb` | INT | For subscription tiers |
| `character_perspective_enabled` | BOOLEAN | Toggle for "How I remember you" mode |

---

## 🔐 `.env` Variables (example for local dev)

```
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=soulstream
MYSQL_USER=root
MYSQL_PASSWORD=your_lovely_secret
```

---

## 🛠️ Bonus: Dev Environment Considerations

- **ORM**: Use something like Sequelize (Node.js) or SQLAlchemy (Python) for portability.
- **Migrations**: Plan for version-controlled migrations—users grow, and so will their memories.
- **AI Prompt Linkage**: You could later store fine-tuned prompts or prompt templates associated with user states in a `prompt_templates` table if you want to scale companion personalities.
