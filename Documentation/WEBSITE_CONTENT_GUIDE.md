# Website Content Update Guide

This guide will teach you how to update your church website content by editing JSON data files using GitHub's web interface or mobile app.

## Quick Start

**To update your website:**

1. Go to your GitHub repository (you'll get the link after being added to the organization)
2. Navigate to `src` → `data` → choose the file you want to edit:
   - `churchInformation.json` - General church info, contact details, leadership
   - `planvisit.json` - Plan Your Visit page content
   - `ministries.json` - Ministries page content
3. Click the pencil icon (✏️) to edit
4. Make your changes (see sections below)
5. Scroll down and click "Commit changes"
6. Your website will automatically update in 2-3 minutes!

## What You Can Update

The website gets its information from JSON data files in the `src/data` folder. Each file controls different parts of your website:

- **`churchInformation.json`** - Basic church info, contact details, leadership, social media
- **`planvisit.json`** - Complete content for the "Plan Your Visit" page
- **`ministries.json`** - All ministry information and volunteer opportunities

⚠️ **IMPORTANT**: Always keep the exact same structure (field names) - only change the values inside the quotes!

### Basic Church Information (churchInformation.json)

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

### Plan Your Visit Content (planvisit.json)

This file controls everything on the "Plan Your Visit" page:

```json
"hero": {
  "title": "Plan Your Visit",
  "subtitle": "We're excited to welcome you to our church family!"
},
"serviceTimes": {
  "title": "Service Times",
  "sunday": {
    "time": "11:00 AM & 5:00 PM",
    "description": "Traditional hymns, contemporary music, and biblical teaching"
  }
}
```

**What to change:**

- Update service times and descriptions
- Modify welcome messages and visitor information
- Update FAQ answers about what to expect
- Change accessibility information
- ⚠️ **Keep field names like `"hero"`, `"serviceTimes"` exactly the same - only change the text inside quotes**

### Ministries Content (ministries.json)

This file controls the entire "Ministries" page:

```json
"hero": {
  "title": "Our Ministries",
  "subtitle": "Discover ways to connect, serve, and grow in faith"
},
"ministries": [
  {
    "name": "Children's Ministry",
    "icon": "👶",
    "description": "Age-appropriate learning and activities for children",
    "schedule": "Sundays during worship service"
  }
]
```

**What to change:**

- Update ministry names, descriptions, and schedules
- Modify volunteer opportunity descriptions
- Change contact information for ministry leaders
- Update FAQ about ministries
- ⚠️ **Keep field names like `"ministries"`, `"volunteerOpportunities"` exactly the same - only change the content**

### Contact Information (churchInformation.json)

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

### Service Times (churchInformation.json)

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

### Office Hours (churchInformation.json)

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

### Social Media Links (churchInformation.json)

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

### Leadership Information (churchInformation.json)

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

### Frequently Asked Questions (churchInformation.json)

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

### Testimonials (churchInformation.json)

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
   - Click on the file you want to edit:
     - `churchInformation.json` - General church info
     - `planvisit.json` - Plan Your Visit page
     - `ministries.json` - Ministries page

2. **Edit the File**
   - Click the pencil icon (✏️) in the top right of the file view
   - Make your changes carefully
   - **CRITICAL**: Keep all field names exactly the same - only change values inside quotes
   - Make sure to keep all quotation marks and commas

3. **Save Your Changes**
   - Scroll down to "Commit changes"
   - Add a brief description like "Updated service times" or "Updated ministries"
   - Click "Commit changes"

### Using GitHub Mobile App

1. **Open the App**
   - Open the GitHub app on your phone/tablet
   - Navigate to the Oatville-Community-Church organization
   - Tap on the `oatvillechurchweb` repository

2. **Find the File**
   - Tap "Browse files"
   - Tap `src` → `data` → choose your file:
     - `churchInformation.json` - General church info
     - `planvisit.json` - Plan Your Visit page
     - `ministries.json` - Ministries page

3. **Edit and Save**
   - Tap the pencil icon to edit
   - Make your changes (keep structure the same!)
   - Tap "Commit changes" at the top right
   - Add a description and commit

## Important Formatting Rules

### Keep the Structure - CRITICAL RULE

**⚠️ NEVER change field names - only change the content inside quotes!**

✅ **CORRECT** - Only change the value:

```json
"title": "NEW TITLE HERE"
```

❌ **WRONG** - Don't change field names:

```json
"newFieldName": "NEW TITLE HERE"
```

### Maintain JSON Format

- **Always keep the commas** between items
- **Always keep the quotation marks** around text
- **Don't delete the curly braces** `{` `}`
- **Don't delete the square brackets** `[` `]`
- **Don't change field names** like `"hero"`, `"ministries"`, `"serviceTimes"`

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
- ❌ Changing field names: `"newName": "John Doe"`
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

### Updating Service Times (churchInformation.json)

Most common update - when service times change seasonally:

```json
"services": {
  "sundayWorship": {
    "time": "NEW TIME HERE"
  }
}
```

### Updating Plan Your Visit Info (planvisit.json)

For seasonal changes or updated visitor information:

```json
"serviceTimes": {
  "sunday": {
    "time": "NEW TIME HERE",
    "description": "NEW DESCRIPTION HERE"
  }
}
```

### Updating Ministry Information (ministries.json)

For changes to ministry schedules or descriptions:

```json
"ministries": [
  {
    "name": "KEEP THE SAME",
    "schedule": "NEW SCHEDULE HERE",
    "description": "NEW DESCRIPTION HERE"
  }
]
```

### Adding Special Events (churchInformation.json)

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

### Updating Contact Info (churchInformation.json)

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

| What You Want to Update | File to Edit | Where to Find It | Example |
|------------------------|---------------|------------------|---------|
| Service times | `churchInformation.json` | `services` → specific service → `time` | `"time": "10:30 AM"` |
| Phone number | `churchInformation.json` | `contact` → `phone` | `"phone": "(316) 555-0123"` |
| Church address | `churchInformation.json` | `location` → `address`, `city`, etc. | `"address": "123 Main St"` |
| Office hours | `churchInformation.json` | `hours` → specific day | `"monday": "9 AM - 5 PM"` |
| Pastor information | `churchInformation.json` | `leadership` → find pastor entry | `"name": "Pastor John"` |
| Add new FAQ | `churchInformation.json` | `faq` → copy existing format | `{"q": "Question?", "a": "Answer"}` |
| Social media links | `churchInformation.json` | `socialMedia` → platform name | `"facebook": "https://..."` |
| Plan Visit page content | `planvisit.json` | Various sections | `"title": "New Title"` |
| Ministry descriptions | `ministries.json` | `ministries` → find ministry | `"description": "New desc"` |
| Volunteer opportunities | `ministries.json` | `volunteerOpportunities` | `"title": "New opportunity"` |

---

**Remember:** The website automatically updates YouTube videos weekly, so you only need to focus on church information, service times, ministries, and announcements.

**CRITICAL REMINDER**: Always keep the exact same structure (field names like `"hero"`, `"ministries"`, `"serviceTimes"`) - only change the content inside the quotes! Make small changes at first until you're comfortable with the process!
