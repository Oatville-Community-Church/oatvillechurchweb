# Image Management Guide

This guide will teach you how to add, update, and manage images on your church website using GitHub's web interface.

## Overview

Your website uses images for:

- Church exterior and interior photos
- Banners and headers
- Event photos
- Staff photos
- Ministry photos

All images should be placed in the `src/images/` folder of your repository.

## Image Requirements

### File Formats

**Recommended formats:**

- **WebP** or **AVIF**: Best for photos (smallest file size, great quality)
- **JPEG**: Good for photos (widely supported)
- **PNG**: Good for graphics with transparency
- **SVG**: Best for logos and simple graphics

### File Sizes

**Important:** Keep images optimized for web use:

- **Maximum file size**: 500KB per image
- **Recommended size**: Under 200KB
- **Website will automatically optimize** some images during build

### Image Dimensions

**For best results:**

- **Header/banner images**: 1200px wide by 600px tall
- **Church photos**: 800px wide (height can vary)
- **Staff photos**: 400px wide by 400px tall (square)
- **Event photos**: 600px wide (height can vary)

## Adding New Images

### Step 1: Prepare Your Image

1. **Resize your image** using your phone's built-in editor or a computer program
2. **Save with a descriptive name** using lowercase letters and hyphens
   - ✅ Good: `christmas-service-2024.jpg`
   - ✅ Good: `pastor-john-headshot.jpg`
   - ❌ Bad: `IMG_1234.jpg`
   - ❌ Bad: `Photo Dec 12, 2024.jpeg`

### Step 2: Upload to GitHub (Web Interface)

1. **Navigate to Images Folder**
   - Go to your repository: `https://github.com/Oatville-Community-Church/oatvillechurchweb`
   - Click `src` → `images`

2. **Upload File**
   - Click "Add file" → "Upload files"
   - Drag your image file into the box OR click "choose your files"
   - Select your image file

3. **Commit the Upload**
   - Scroll down to "Commit changes"
   - Add a description like "Added Christmas service photo"
   - Click "Commit changes"

### Step 3: Upload to GitHub (Mobile App)

1. **Open GitHub App**
   - Navigate to your repository
   - Tap "Browse files"
   - Tap `src` → `images`

2. **Add File**
   - Tap the "+" icon
   - Select "Upload files"
   - Choose your image from your photo library

3. **Commit**
   - Add a description
   - Tap "Commit changes"

## Using Images on Your Website

### In the JSON File

After uploading an image, you can reference it in your `churchInformation.json` file:

```json
"site": {
  "socialImage": "/images/your-new-image.jpg"
}
```

### Common Image References

**Banner/header image:**

```json
"site": {
  "socialImage": "/images/church-banner.jpg"
}
```

**Staff photos** (you'll need technical help to add these to the website display)

## Replacing Existing Images

### Option 1: Same Filename (Easiest)

If you want to replace an existing image with a new one:

1. **Name your new image exactly the same** as the old one
2. **Upload using the same steps** as adding new images
3. **The website will automatically use the new image**

### Option 2: Different Filename

If you want to use a different filename:

1. **Upload the new image** following the steps above
2. **Update the JSON file** to reference the new image name
3. **Optionally delete the old image** (see deletion section below)

## Deleting Images

### Step 1: Make Sure It's Not Being Used

Before deleting an image, make sure it's not referenced in:

- Your `churchInformation.json` file
- Any HTML files
- Any other parts of your website

### Step 2: Delete the File

1. **Navigate to the image** in `src/images/`
2. **Click on the image filename**
3. **Click the trash can icon** (🗑️)
4. **Scroll down and commit** the deletion

## Image Optimization Tips

### Before Uploading

**On your phone:**

1. Use your phone's built-in photo editor to resize
2. Crop to focus on the important parts
3. Adjust brightness/contrast if needed

**On your computer:**

1. Use free tools like GIMP, Paint.NET, or online tools
2. Resize to appropriate dimensions
3. Save in an optimized format

### File Naming Best Practices

**Good naming:**

- `church-exterior-winter.jpg`
- `vacation-bible-school-2024.jpg`
- `pastor-smith-headshot.jpg`
- `christmas-service-altar.jpg`

**Avoid:**

- Spaces in filenames
- Special characters (!, @, #, etc.)
- Very long names
- Generic names like "image1.jpg"

## Common Image Uses

### Church Photos

**Location**: `src/images/`
**Names**: `church-exterior.jpg`, `church-interior.jpg`
**Used for**: Homepage, about section, social media

### Event Photos

**Location**: `src/images/`
**Names**: `event-name-year.jpg`
**Examples**: `easter-service-2024.jpg`, `vbs-kids-2024.jpg`

### Banners

**Location**: `src/images/`
**Names**: `church-banner.jpg`, `OCC_banner.jpg`
**Used for**: Social media sharing, page headers

## Troubleshooting

### Image Not Showing Up

1. **Check the filename** - make sure it matches exactly what you put in the JSON file
2. **Check the path** - images should start with `/images/`
3. **Wait a few minutes** - the website needs time to rebuild
4. **Check file size** - very large images might not load properly

### Image Too Large

If your image file is over 500KB:

1. **Resize the image** to smaller dimensions
2. **Compress the image** using online tools
3. **Convert to WebP format** if possible

### Image Looks Blurry

1. **Check original image quality** - make sure it's sharp before uploading
2. **Try uploading a larger version** - the website will resize it appropriately
3. **Use appropriate dimensions** for the intended use

### Upload Failed

1. **Check your internet connection**
2. **Make sure the file isn't corrupted**
3. **Try a different file format** (e.g., JPEG instead of PNG)
4. **Check file size** - GitHub has a 25MB limit per file

## Getting Help with Images

### When to Contact Technical Support

- Adding new image sections to the website
- Creating image galleries
- Setting up automatic image optimization
- Complex image layout changes
- Staff photo sections

### What You Can Do Yourself

- Replace existing images
- Add new images to the images folder
- Update image references in the JSON file
- Basic image optimization before upload

### Information to Include When Asking for Help

- What type of images you want to add
- Where on the website they should appear
- How many images you plan to use
- Any specific layout requirements

## Best Practices Summary

1. **Optimize images before uploading** (resize and compress)
2. **Use descriptive filenames** with hyphens instead of spaces
3. **Keep file sizes under 200KB** when possible
4. **Test images on mobile devices** to ensure they look good
5. **Backup important photos** separately before uploading
6. **Update JSON references** when changing image names
7. **Delete unused images** to keep the repository clean

---

**Remember**: The website automatically optimizes some images during the build process, but starting with appropriately sized images will give you the best results and fastest loading times for your visitors.
