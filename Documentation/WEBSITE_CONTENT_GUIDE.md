# Website Content Update Guide

This guide will teach you how to update your church website content by editing the `churchInformation.json` file using GitHub's web interface or mobile app.

## Quick Start

**To update your website:**

1. Go to your GitHub repository (you'll get the link after being added to the organization)
2. Navigate to `src` → `data` → `churchInformation.json`
3. Click the pencil icon (✏️) to edit
4. Make your changes (see sections below)
5. Scroll down and click "Commit changes"
6. Your website will automatically update in 2-3 minutes!

## What You Can Update

The website gets its information from a file called `churchInformation.json`. This file contains all the text, contact info, service times, and other details that appear on your website.

### Basic Church Information

```json
"name": "Oatville Community Church",
"tagline": "Small church with a big heart",
"mission": "reach the lost and show and grow in Christ's love",
"description": "A non-denominational community church..."
```

**What to change:**

- `"name"`: Your church's official name
- `"tagline"`: A short catchy phrase about your church
- `"mission"`: Your church's mission statement
- `"description"`: A longer description of your church

### Contact Information

```json
"contact": {
  "phone": "(316) 390-3591",
  "email": "oatvillecommunitychurch@gmail.com"
},
"location": {
  "address": "3814 S Hoover Rd",
  "city": "Wichita",
  "state": "KS",
  "zipCode": "67215"
}
```

**What to change:**

- Update phone numbers, email, or address as needed
- Make sure the address is exactly as you want it to appear on Google Maps

### Service Times

```json
"services": {
  "sundayWorship": {
    "name": "Sunday Worship",
    "time": "11:00 AM & 5:00 PM",
    "description": "Traditional hymns, contemporary music..."
  },
  "wednesdayPrayer": {
    "name": "Wednesday Prayer",
    "time": "6:00 PM",
    "description": "Community prayer gathering..."
  }
}
```

**What to change:**

- Update service times when they change
- Modify service names or descriptions
- Add new services or remove ones you no longer have

### Office Hours

```json
"hours": {
  "sunday": "9:30 AM - 1:00 PM",
  "monday": "8:30 AM - 4:00 PM",
  "tuesday": "8:30 AM - 4:00 PM",
  "wednesday": "8:30 AM - 4:00 PM",
  "thursday": "8:00 AM - 4:00 PM",
  "friday": "Closed",
  "saturday": "2:00 PM - 5:00 PM"
}
```

**What to change:**

- Update when your office hours change
- Use "Closed" for days when the office is closed
- Use format like "9:00 AM - 5:00 PM" for open days

### Social Media Links

```json
"socialMedia": {
  "facebook": "https://www.facebook.com/oatvillecc/",
  "youtube": "https://www.youtube.com/@OatvilleCommunityChurch",
  "instagram": "https://www.instagram.com/oatvillecommunitychurch/"
}
```

**What to change:**

- Update links when your social media usernames change
- Remove platforms you don't use by deleting the entire line
- Add new platforms by copying the format

### Leadership Information

```json
"leadership": [
  {
    "name": "John Doe",
    "role": "Pastor",
    "bio": "Committed to biblical teaching..."
  },
  {
    "name": "Jane Smith",
    "role": "Children's Ministry Lead",
    "bio": "Creating a safe, Christ-centered environment..."
  }
]
```

**What to change:**

- Update names, roles, and bios when staff changes
- Add new staff members by copying the format
- Remove staff members by deleting their entire section

### Frequently Asked Questions

```json
"faq": [
  {
    "q": "What time are Sunday worship services?",
    "a": "Sunday worship is at 11:00 AM and 5:00 PM..."
  },
  {
    "q": "Is there something for my children?",
    "a": "Yes. Children's ministry and nursery are available..."
  }
]
```

**What to change:**

- Update answers when information changes
- Add new questions by copying the format
- Remove questions by deleting their entire section

### Testimonials

```json
"testimonials": [
  {
    "name": "Emily",
    "quote": "From day one I felt like family here."
  },
  {
    "name": "James",
    "quote": "Biblical teaching and genuine community changed my life."
  }
]
```

**What to change:**

- Add new testimonials from church members
- Update or remove existing ones
- Keep quotes short (20-40 words work best)

## Step-by-Step Editing Instructions

### Using GitHub Web Interface (Computer)

1. **Navigate to the File**
   - Go to your repository: `https://github.com/Oatville-Community-Church/oatvillechurchweb`
   - Click on the `src` folder
   - Click on the `data` folder
   - Click on `churchInformation.json`

2. **Edit the File**
   - Click the pencil icon (✏️) in the top right of the file view
   - Make your changes carefully
   - Make sure to keep all quotation marks and commas

3. **Save Your Changes**
   - Scroll down to "Commit changes"
   - Add a brief description like "Updated service times"
   - Click "Commit changes"

### Using GitHub Mobile App

1. **Open the App**
   - Open the GitHub app on your phone/tablet
   - Navigate to the Oatville-Community-Church organization
   - Tap on the `oatvillechurchweb` repository

2. **Find the File**
   - Tap "Browse files"
   - Tap `src` → `data` → `churchInformation.json`

3. **Edit and Save**
   - Tap the pencil icon to edit
   - Make your changes
   - Tap "Commit changes" at the top right
   - Add a description and commit

## Important Formatting Rules

### Keep the Structure

- **Always keep the commas** between items
- **Always keep the quotation marks** around text
- **Don't delete the curly braces** `{` `}`
- **Don't delete the square brackets** `[` `]`

### Example of Correct Format

```json
"services": {
  "sundayWorship": {
    "name": "Sunday Worship",
    "time": "10:30 AM",
    "description": "Come join us for worship"
  }
}
```

### Common Mistakes to Avoid

- ❌ Missing comma: `"name": "John" "role": "Pastor"`
- ✅ Correct: `"name": "John", "role": "Pastor"`
- ❌ Missing quotes: `name: John Doe`
- ✅ Correct: `"name": "John Doe"`

## What Happens After You Save

1. **Automatic Build**: GitHub will automatically rebuild your website (takes 2-3 minutes)
2. **Live Updates**: Changes appear on your live website
3. **YouTube Updates**: The latest YouTube video updates automatically every week

## YouTube Video Updates

**Good news!** Your latest YouTube videos update automatically every Sunday at 2 AM. You don't need to do anything for this to work.

If you ever change your YouTube channel, you'll need to update the YouTube channel ID in the file:

```json
"you-tube": {
  "channel-id": "UCLiIrzYVgwFD0rIEYQoGC5A"
}
```

## Common Updates You'll Make

### Updating Service Times

Most common update - when service times change seasonally:

```json
"services": {
  "sundayWorship": {
    "time": "NEW TIME HERE"
  }
}
```

### Adding Special Events

For holiday services or special events:

```json
"services": {
  "specialEvents": {
    "name": "Easter Service",
    "time": "April 9th at 10:00 AM",
    "description": "Join us for our Easter celebration"
  }
}
```

### Updating Contact Info

When phone numbers or email changes:

```json
"contact": {
  "phone": "NEW PHONE NUMBER",
  "email": "NEW EMAIL ADDRESS"
}
```

## Troubleshooting

### If Your Changes Don't Appear

1. Wait 5 minutes - the site takes time to rebuild
2. Check if there's a red X next to your latest commit (means there was an error)
3. Try refreshing your browser with Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### If You Made a Mistake

1. Don't panic! Every change is saved in history
2. Contact your technical support person
3. They can easily restore previous versions

### If the Site Looks Broken

1. Check your recent changes for missing commas or quotes
2. Look at the "Actions" tab in GitHub for error messages
3. Contact technical support if needed

## Getting Help

### Before You Contact Support

1. Double-check your formatting (commas, quotes, brackets)
2. Make sure you didn't accidentally delete important punctuation
3. Try waiting 5 minutes for changes to appear

### When to Contact Support

- The website appears broken after your changes
- You need to add new sections or features
- You want to update the website design or layout
- You need help with image uploads

### What Information to Include

- What you were trying to change
- What you expected to happen
- What actually happened
- Screenshots if the site looks wrong

## Quick Reference

| What You Want to Update | Where to Find It | Example |
|------------------------|------------------|---------|
| Service times | `services` → specific service → `time` | `"time": "10:30 AM"` |
| Phone number | `contact` → `phone` | `"phone": "(316) 555-0123"` |
| Church address | `location` → `address`, `city`, etc. | `"address": "123 Main St"` |
| Office hours | `hours` → specific day | `"monday": "9 AM - 5 PM"` |
| Pastor information | `leadership` → find pastor entry | `"name": "Pastor John"` |
| Add new FAQ | `faq` → copy existing format | `{"q": "Question?", "a": "Answer"}` |
| Social media links | `socialMedia` → platform name | `"facebook": "https://..."` |

---

**Remember:** The website automatically updates YouTube videos weekly, so you only need to focus on church information, service times, and announcements. Make small changes at first until you're comfortable with the process!
