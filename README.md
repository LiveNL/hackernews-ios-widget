# Hacker News iOS Widget

A [Scriptable](https://scriptable.app) widget that shows the top 10 Hacker News stories on your iPhone home screen, with live data straight from the official HN API.

<img width="603" height="1311" alt="Widget preview" src="https://github.com/user-attachments/assets/f5e1f3ed-fb2e-44d3-b5e8-dfdbf04d831e" />


---

## Features

- **Top 10 stories** from [Hacker News](https://news.ycombinator.com), refreshed automatically by iOS
- **Numbered badges** so you always know the ranking at a glance
- **Two tap targets per story:**
  - Tap the **title** → opens the article
  - Tap the **meta row** (points · comments · time) → opens the HN comments thread
- **Ask HN / Show HN** posts (no external URL) fall back to the comments page on both taps
- Dark purple gradient background that sits cleanly on any home screen
- Built entirely with the Scriptable JavaScript API — no server, no backend, no tracking

---

## Requirements

- iPhone with [Scriptable](https://apps.apple.com/app/scriptable/id1405459188) installed (free)

---

## Installation

1. Install **Scriptable** from the App Store
2. Open Scriptable and tap **+** to create a new script
3. Copy the contents of [`hacker-news-widget.js`](hacker-news-widget.js) and paste it into the script editor
4. Tap **Run** once to verify it works — a large widget preview will appear
5. Go to your home screen, long-press, tap **+**, and add a **Scriptable** widget in the **large** size
6. Long-press the widget → **Edit Widget**, then set **Script** to the script you just created

---

## How it works

When the widget runs, it:

1. Fetches the current [top story IDs](https://hacker-news.firebaseio.com/v0/topstories.json) from the HN Firebase API
2. Loads the details for the top 10 in parallel
3. Renders each story as a row with a rank badge, title, and a meta line showing points, comment count, and age
4. Sets deep-link URLs on the title and meta stacks independently so each tap target opens the right destination

iOS refreshes the widget automatically in the background based on its own scheduling — typically every 15–60 minutes.

---

## Customisation

All tuneable values are at the top of the script in the `CONFIG` object:

| Key | Default | Description |
|---|---|---|
| `storyCount` | `10` | Number of stories to fetch and display |
| `colors.*` | — | All colours used in the widget |
