# Website Content Management Guide

## Quick Start

### Updating Website Content

1. Edit JSON files in `src/data/` folder:
   - `churchInformation.json` - Service times, contact info, mission
   - `ministries.json` - Ministry descriptions and details  
   - `planvisit.json` - Visitor information and expectations

2. Build and deploy:

   ```bash
   npm run build
   git add .
   git commit -m "Update content"
   git push
   ```

### Updating Images

1. Replace image files in `src/images/` folder
2. Keep the same filenames for automatic replacement
3. Build and deploy (same as above)

## Error Prevention

### The system automatically prevents common errors

- **JSON syntax errors** - Build will fail with exact error location
- **Invalid commits** - Git hooks prevent broken code from being saved
- **Image cache issues** - Browser automatically gets new images

### If you see an error message

- **"Trailing comma detected"** - Remove the comma from the line shown
- **"Unexpected token"** - Check JSON syntax around the highlighted area
- Run `npm run lint` to see all issues at once

## Key Commands

```bash
npm run build    # Build website for deployment
npm run dev      # Preview changes locally
npm run lint     # Check for errors only
```

## JSON File Structure

### Example: Adding a new ministry

```json
{
  "ministries": [
    {
      "name": "Youth Ministry",
      "description": "Ministry for teens and young adults",
      "meetingTime": "Sundays at 6:00 PM",
      "contact": "pastor@church.org"
    }
  ]
}
```

**Important**: No comma after the last item in a list or object.

## Getting Help

1. Check error messages - they show exactly what to fix
2. Use `npm run lint` to validate JSON files
3. The build process prevents broken content from going live

The system is designed to catch errors before they affect the website.
