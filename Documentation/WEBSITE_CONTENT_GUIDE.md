# Website Content Update Guide

This guide shows how to update the church website by editing simple text files in GitHub (on a computer or in the mobile app).

## Quick Start

1. Open the repository on GitHub and go to the **`content`** folder.
2. Click the file you want to change (see the table below).
3. Click the pencil icon (✏️) to edit.
4. Change the text after the colons.
5. Scroll down and click **Commit changes**.
6. The website updates by itself in 2-3 minutes.

## Which File Do I Edit?

| To change… | Open this file in `content/` |
|---|---|
| Church name, tagline, address, phone, email, social links | `church.md` |
| Office hours | `hours.md` |
| Service times and events on the home page | `services.md` |
| "About" section on the home page | `about.md` |
| Frequently asked questions | `faq.md` |
| Testimonials | `testimonials.md` |
| Giving information | `giving.md` |
| Pastor and leadership | `leadership.md` |
| "What We Believe" page (and showing/hiding it) | `beliefs.md` |
| "Plan Your Visit" page | `plan-visit.md` |
| Ministries page heading and "Get Involved" section | `ministries/_index.md` |
| One ministry | `ministries/01-worship-music.md` (and the other numbered files) |

You will never need to touch anything in `src/data/`. That folder holds technical settings and the automatic YouTube updates.

### What each file changes on the live website

| File | What it controls |
|---|---|
| `church.md` | Name, tagline, welcome message, address, phone and email (used across every page) |
| `hours.md` | The "Church Hours" list on the home page |
| `services.md` | The "Service Times & Programs" cards on the home page |
| `about.md` | The mission and community text on the home page |
| `faq.md`, `testimonials.md`, `events.md` | Home page FAQ, testimonials and the next-service date (search engines) |
| `plan-visit.md` | Everything on the Plan Your Visit page (including its questions and accessibility list) |
| `ministries/01-….md` … | One card each on the Ministries page |
| `ministries/_index.md` | Ministries page heading, Volunteer Opportunities, FAQ and the "Get Involved" buttons |
| `beliefs.md` | The What We Believe page (hidden until `approved: true`) |

**Not shown anywhere on the website yet:** `leadership.md`, `giving.md`, the "Our Worship" part of `about.md`, the `mission:` line in `church.md`, and the `upcoming:` list in `events.md`. Editing those won't change any page until your technical support person adds a place for them.

**Still handled by technical support** (not editable here): the page layouts and headings, the Ministries "ministry catalog" that search engines read, and the Church Hours that search engines read (these are separate from the list on the home page).

## What a File Looks Like

Every file has a section at the top between two lines of three dashes (`---`). Lines starting with `#` are notes to you and are ignored.

```yaml
---
# Office hours
hours:
  sunday: 9:30 AM - 1:00 PM
  monday: 8:30 AM - 4:00 PM
  friday: Closed
---
```

To change Sunday's hours, edit only the text after `sunday:`.

### Lists

Lists use a dash at the start of each line. To add an item, copy a line and change the text. Keep the same indentation.

```yaml
schedule:
  - Sunday School - 9:45 AM
  - Children's Church during worship
  - Vacation Bible School (Summer)
```

### Ministry Files

A ministry file has the same top section, and the **description is the normal text below the second `---` line**. You can write it freely:

```md
---
id: childrens-ministry
title: Children's Ministry
icon: 👶
detailsTitle: Age Groups
details:
  - Nursery (0-2 years)
  - Preschool (3-5 years)
leader: Susan Oglesby
---

Safe, caring environments where kids learn Scripture, prayer, and foundational truths.
```

- `detailsTitle` is the heading above the bullet list (the colon is added for you).
- `details` are the bullet points (add or remove lines).
- `leader` is optional. Delete the line to hide the "Leader" line.

**To add a ministry:** open an existing ministry file, copy its contents into a new file in the same folder (Add file → Create new file), name it with the next number (for example `07-seniors.md`), and change the text. A new card appears on the page, in number order. Each ministry needs a unique `id` made of lowercase letters and dashes.

**To remove a ministry:** delete its file. **To keep a draft without publishing it:** add the line `draft: true` to the top section; drafts only show in a local preview, never on the live site.

## Formatting Rules (only three)

1. **Indentation matters.** Use spaces (never the Tab key) and keep the same number of spaces as the line above it.
2. **Keep the labels.** Only change the text *after* the colon, never the word before it (such as `phone:` or `time:`).
3. **Quotes are needed in a few cases.** If your text contains a colon followed by a space (like `Note: bring a Bible`), starts with a special character (`"`, `'`, `#`, `*`, `&`, `-`, `[`, `{`), or is only `true`, `false` or a number, put the whole text in double quotes: `"Note: bring a Bible"`.

### Examples

✅ `phone: (316) 390-3591`
✅ `time: "Sundays at 10:45 AM: all ages"` (quotes because of the colon)
❌ `time: Sundays at 10:45 AM: all ages` (breaks the file)
❌ `phne: (316) 390-3591` (changed the label)

## Common Updates

### Service times (`services.md`) and office hours (`hours.md`)

Each service is one card on the home page. Change only the text after `time:`:

```yaml
services:
  - name: Sunday Worship
    time: 10:45 AM
    description: Traditional hymns and contemporary music.
```

To add a card, copy a whole group (from the dash to the last line) and change the text. Office hours work the same way, with `days:` and `time:`. Service times also appear on the Plan Your Visit page (`plan-visit.md`, under `serviceTimes`), so update both.

### Phone, email or address (`church.md`)

```yaml
contact:
  phone: (316) 390-3591
  email: oatvillecommunitychurch@gmail.com
```

### Add a frequently asked question (`faq.md`)

Copy an existing pair (the `q:` and `a:` lines, including the dash) and change the text. Please don't use a double quote (`"`) in a question or answer; the check will stop the update if you do. Use an apostrophe or rephrase:

```yaml
faq:
  - q: What time are Sunday worship services?
    a: Sunday worship is at 10:45 AM (Central).
```

### Show or hide the "What We Believe" page (`beliefs.md`)

```yaml
beliefsPage:
  approved: false
```

Change `false` to `true` to publish the page and its menu links, or back to `false` to hide it.

## Editing on the GitHub Mobile App

1. Open the app and go to the `Oatville-Community-Church` organization → `oatvillechurchweb`.
2. Tap **Browse files** → `content` → the file you want.
3. Tap the pencil icon, make your change, then tap **Commit changes** and add a short description.

## What Happens After You Save

1. GitHub checks your file. If something is wrong (for example, a bad indent), the update **will not go live**, and the previous version of the site stays up.
2. If the check passes, the site rebuilds and your change appears in 2-3 minutes.
3. YouTube videos update automatically every week. You don't need to do anything.

## If Something Goes Wrong

- **Look for a red ✗** next to your latest commit (or open the **Actions** tab). Click it to see a message that names the file and line, for example `content/hours.md:6: …`. Fix that line and commit again.
- **Made a mistake?** Every change is saved in history, so nothing is lost. Contact technical support and they can restore any earlier version.
- **Change not showing?** Wait 5 minutes, then refresh with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac).

## When to Contact Support

- The website looks broken after your change
- You want a new section, page or feature
- You want to change the design or layout
- You need help uploading images

Please include what you were trying to change, what you expected, what happened, and a screenshot if the site looks wrong.

**Tip:** Make small changes at first until you're comfortable with the process.
