// Hacker News Top 8 Widget - Full Width Cards

// ─── Config ──────────────────────────────────────────────────────────────────

const VERSION = "2026-02-24 20:45"

const CONFIG = {
  storyCount: 8,
  api: {
    topStories: "https://hacker-news.firebaseio.com/v0/topstories.json",
    item: (id) => `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
    comments: (id) => `https://news.ycombinator.com/item?id=${id}`,
  },
  colors: {
    backgroundTop: new Color("#1c1c2e", 0.95),
    backgroundBottom: new Color("#2a2a3e", 0.95),
    badgeBackground: new Color("#ff6600", 0.25),
    accent: new Color("#ff9955"),
    separator: new Color("#666688"),
    meta: new Color("#aaaacc"),
    divider: new Color("#ffffff", 0.1),
  },
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchTopStories() {
  const req = new Request(CONFIG.api.topStories)
  const ids = await req.loadJSON()
  const topIds = ids.slice(0, CONFIG.storyCount)

  const stories = await Promise.all(
    topIds.map((id) => new Request(CONFIG.api.item(id)).loadJSON())
  )
  return stories.filter((s) => s && s.title)
}

// ─── Widget builders ──────────────────────────────────────────────────────────

function buildWidget() {
  const widget = new ListWidget()

  const gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [CONFIG.colors.backgroundTop, CONFIG.colors.backgroundBottom]
  widget.backgroundGradient = gradient
  widget.setPadding(10, 12, 10, 12)

  return widget
}

function addNumberBadge(parent, number) {
  const badge = parent.addStack()
  badge.size = new Size(20, 20)
  badge.cornerRadius = 6
  badge.backgroundColor = CONFIG.colors.badgeBackground
  badge.centerAlignContent()

  const text = badge.addText(`${number}`)
  text.font = Font.boldSystemFont(11)
  text.textColor = CONFIG.colors.accent
  text.centerAlignText()
}

function addMetaRow(parent, story) {
  const meta = parent.addStack()
  meta.layoutHorizontally()
  meta.spacing = 6

  function addLabel(text, color) {
    const t = meta.addText(text)
    t.font = Font.systemFont(8)
    t.textColor = color
  }

  function addSeparator() {
    addLabel("•", CONFIG.colors.separator)
  }

  if (story.score) {
    addLabel(`${story.score} points`, CONFIG.colors.accent)
    addSeparator()
  }

  if (story.descendants) {
    addLabel(`${story.descendants} comments`, CONFIG.colors.meta)
    addSeparator()
  }

  if (story.time) {
    const hoursAgo = Math.floor((Date.now() / 1000 - story.time) / 3600)
    addLabel(`${hoursAgo}h ago`, CONFIG.colors.meta)
  }
}

function addStoryRow(widget, story, index) {
  const row = widget.addStack()
  row.layoutHorizontally()
  row.centerAlignContent()
  row.setPadding(4, 0, 4, 0)
  row.url = story.url || CONFIG.api.comments(story.id)

  addNumberBadge(row, index + 1)
  row.addSpacer(10)

  const content = row.addStack()
  content.layoutVertically()

  const title = content.addText(story.title)
  title.font = Font.semiboldSystemFont(10)
  title.textColor = Color.white()
  title.lineLimit = 1

  content.addSpacer(2)
  addMetaRow(content, story)
}

function addDivider(widget) {
  widget.addSpacer(3)
  const line = widget.addStack()
  line.size = new Size(0, 1)
  line.backgroundColor = CONFIG.colors.divider
  widget.addSpacer(3)
}

function addErrorMessage(widget, error) {
  const text = widget.addText(`Error: ${error.message}`)
  text.font = Font.systemFont(10)
  text.textColor = Color.white()
}

function populateWidget(widget, stories) {
  stories.forEach((story, index) => {
    addStoryRow(widget, story, index)
    if (index < stories.length - 1) {
      addDivider(widget)
    } else {
      widget.addSpacer(3)
    }
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

;(async () => {
  console.log(`[HN Widget] version: ${VERSION}`)

  const widget = buildWidget()

  try {
    const stories = await fetchTopStories()
    populateWidget(widget, stories)
  } catch (e) {
    console.error(e)
    addErrorMessage(widget, e)
  }

  if (config.runsInWidget) {
    Script.setWidget(widget)
  } else {
    widget.presentLarge()
  }

  Script.complete()
})()
