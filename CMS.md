# Timeline and photo-board editor

The public editor lives at `/admin/`. Both timeline presentations read card content from `content/timeline.json`.

## One-time Netlify setup

1. In the Netlify project, enable **Identity**.
2. Under Identity → Services, enable **Git Gateway**.
3. Set registration to **Invite only** and invite each editor.
4. Open `/admin/` on the deployed site and sign in.

## Editing cards

Open **Timeline & Photo Board → Timeline cards**. Every card includes:

- year and month/period;
- title and description;
- image and accessible image description;
- external link;
- location and map-pin key;
- one or more categories;
- separate switches for the timeline and photo-board views.

Use **Show on photo board** without **Show in timeline** when the board eventually has additional images that do not belong in the formal chronology.

The sort date controls reverse-chronological order. Keep the ID lowercase and hyphenated, and do not change it after a card has been published.
