// Hacker News Top 8 Widget - Echt Full Width Cards

const widget = new ListWidget()

// Dark glassmorphic background
const gradient = new LinearGradient()
gradient.locations = [0, 1]
gradient.colors = [
  new Color("#1c1c2e", 0.95),
  new Color("#2a2a3e", 0.95)
]
widget.backgroundGradient = gradient
widget.setPadding(12, 12, 12, 12)

try {
  // Fetch top story IDs
  const topStoriesUrl = "https://hacker-news.firebaseio.com/v0/topstories.json"
  const topStoriesReq = new Request(topStoriesUrl)
  const topStoryIds = await topStoriesReq.loadJSON()

  // Fetch details for top 8 stories
  const storyPromises = []
  for (let i = 0; i < 8; i++) {
    const storyUrl = `https://hacker-news.firebaseio.com/v0/item/${topStoryIds[i]}.json`
    const storyReq = new Request(storyUrl)
    storyPromises.push(storyReq.loadJSON())
  }

  const stories = await Promise.all(storyPromises)

  // Display stories - GEEN individuele card backgrounds meer
  for (let index = 0; index < stories.length; index++) {
    const story = stories[index]
    if (!story || !story.title) continue

    // Story row - geen background, geen padding, geen margins
    const rowStack = widget.addStack()
    rowStack.layoutHorizontally()
    rowStack.centerAlignContent()
    rowStack.setPadding(6, 0, 6, 0)

    // Make row tappable
    const storyUrl = story.url || `https://news.ycombinator.com/item?id=${story.id}`
    rowStack.url = storyUrl

    // Number badge
    const badgeStack = rowStack.addStack()
    badgeStack.size = new Size(24, 24)
    badgeStack.cornerRadius = 6
    badgeStack.backgroundColor = new Color("#ff6600", 0.25)
    badgeStack.centerAlignContent()

    const numberText = badgeStack.addText(`${index + 1}`)
    numberText.font = Font.boldSystemFont(11)
    numberText.textColor = new Color("#ff9955")
    numberText.centerAlignText()

    rowStack.addSpacer(10)

    // Content stack
    const contentStack = rowStack.addStack()
    contentStack.layoutVertically()

    // Title
    const titleText = contentStack.addText(story.title)
    titleText.font = Font.semiboldSystemFont(10)
    titleText.textColor = Color.white()
    titleText.lineLimit = 1

    contentStack.addSpacer(3)

    // Metadata row
    const metaStack = contentStack.addStack()
    metaStack.layoutHorizontally()
    metaStack.spacing = 6

    // Points
    if (story.score) {
      const pointsText = metaStack.addText(`${story.score} points`)
      pointsText.font = Font.systemFont(8)
      pointsText.textColor = new Color("#ff9955")
    }

    // Separator
    const sep1 = metaStack.addText("•")
    sep1.font = Font.systemFont(8)
    sep1.textColor = new Color("#666688")

    // Comments
    if (story.descendants) {
      const commentsText = metaStack.addText(`${story.descendants} comments`)
      commentsText.font = Font.systemFont(8)
      commentsText.textColor = new Color("#aaaacc")
    }

    // Separator
    const sep2 = metaStack.addText("•")
    sep2.font = Font.systemFont(8)
    sep2.textColor = new Color("#666688")

    // Time
    if (story.time) {
      const hoursAgo = Math.floor((Date.now() / 1000 - story.time) / 3600)
      const timeText = metaStack.addText(`${hoursAgo}h ago`)
      timeText.font = Font.systemFont(8)
      timeText.textColor = new Color("#aaaacc")
    }

    // Separator line between stories
    if (index < stories.length - 1) {
      widget.addSpacer(6)
      const separatorStack = widget.addStack()
      separatorStack.size = new Size(0, 1)
      separatorStack.backgroundColor = new Color("#ffffff", 0.1)
      widget.addSpacer(6)
    } else {
      widget.addSpacer(6)
    }
  }

} catch (e) {
  console.error(e)
  const errorText = widget.addText(`Error: ${e.message}`)
  errorText.font = Font.systemFont(10)
  errorText.textColor = Color.white()
}

// Show widget
if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentLarge()
}

Script.complete()
