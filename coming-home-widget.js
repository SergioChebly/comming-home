// Coming Home — iPhone widget (Scriptable app)
const ARRIVE = new Date("2026-12-23T18:00:00+02:00"); // Beirut, 6 PM
const START  = new Date("2026-10-16T12:00:00+03:00");
const PAGE   = "https://sergiochebly.github.io/comming-home/";
const PHOTO  = PAGE + "photo.jpg"; // optional: upload your photo to the repo with this name

const GOLD  = new Color("#f6c27a");
const CREAM = new Color("#f7ece0");
const MIST  = new Color("#b9b3c4");

async function background() {
  try {
    const img = await new Request(PHOTO).loadImage();
    const ctx = new DrawContext();
    const s = img.size;
    ctx.size = s; ctx.opaque = true;
    ctx.drawImageInRect(img, new Rect(0, 0, s.width, s.height));
    ctx.setFillColor(new Color("#1b1d33", 0.55)); // darken so text stays readable
    ctx.fillRect(new Rect(0, 0, s.width, s.height));
    return ctx.getImage();
  } catch (e) { return null; }
}

function bar(p) {
  const W = 300, H = 10, c = new DrawContext();
  c.size = new Size(W, H); c.opaque = false; c.respectScreenScale = true;
  const bg = new Path(); bg.addRoundedRect(new Rect(0, 0, W, H), 5, 5);
  c.addPath(bg); c.setFillColor(new Color("#ffffff", 0.2)); c.fillPath();
  const fg = new Path(); fg.addRoundedRect(new Rect(0, 0, Math.max(H, W * p), H), 5, 5);
  c.addPath(fg); c.setFillColor(GOLD); c.fillPath();
  return c.getImage();
}

const w = new ListWidget();
w.url = PAGE; // tapping the widget opens the full page
const g = new LinearGradient();
g.colors = [new Color("#3a2d4a"), new Color("#1b1d33")];
g.locations = [0, 1];
w.backgroundGradient = g;
const img = await background();
if (img) w.backgroundImage = img;
w.setPadding(14, 14, 14, 14);

const now = new Date();
const left = ARRIVE - now;

const title = w.addText("Coming home to you");
title.font = Font.semiboldSystemFont(11);
title.textColor = GOLD;
w.addSpacer();

if (left <= 0) {
  const t = w.addText("I'm home ❤️");
  t.font = Font.boldRoundedSystemFont(26);
  t.textColor = CREAM;
} else {
  const days = Math.floor(left / 86400000);
  const row = w.addStack();
  row.bottomAlignContent();
  const n = row.addText(String(days));
  n.font = Font.boldRoundedSystemFont(42);
  n.textColor = CREAM;
  row.addSpacer(4);
  const d = row.addText(days === 1 ? "day" : "days");
  d.font = Font.mediumSystemFont(14);
  d.textColor = MIST;

  const hours = Math.floor((left % 86400000) / 3600000);
  const sub = w.addText(`+ ${hours}h · 23 Dec, 6:00 PM`);
  sub.font = Font.systemFont(10);
  sub.textColor = MIST;

  w.addSpacer(8);
  const p = Math.min(1, Math.max(0, (now - START) / (ARRIVE - START)));
  const b = w.addImage(bar(p));
  b.imageSize = new Size(130, 5);
}

w.refreshAfterDate = new Date(Date.now() + 30 * 60 * 1000); // update every ~30 min

if (config.runsInWidget) Script.setWidget(w);
else await w.presentSmall();
Script.complete();
