# Cloudflare Domain Setup for GitHub Pages

This guide will help you point your Cloudflare domain to your GitHub Pages website.

## Prerequisites

- You have a domain registered through Cloudflare
- You have access to your Cloudflare dashboard
- Your GitHub repository is set up for GitHub Pages
- You've been added to the GitHub organization with appropriate permissions

## Step 1: Access Cloudflare Dashboard

1. **Log into Cloudflare**
   - Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
   - Sign in with your Cloudflare credentials

2. **Select Your Domain**
   - Click on your domain name (example: `oatville-community-church.org`)

## Step 2: Set Up DNS Records

You need to create DNS records to point your domain to GitHub Pages.

### Option A: Root Domain (oatville-community-church.org)

1. **Go to DNS Settings**
   - Click "DNS" in the left sidebar
   - Click "Records"

2. **Add A Records**
   Add these four A records (delete any existing A records for @ first):

   | Type | Name | Content | Proxy Status |
   |------|------|---------|--------------|
   | A | @ | 185.199.108.153 | DNS only (gray cloud) |
   | A | @ | 185.199.109.153 | DNS only (gray cloud) |
   | A | @ | 185.199.110.153 | DNS only (gray cloud) |
   | A | @ | 185.199.111.153 | DNS only (gray cloud) |

3. **Add WWW CNAME (Optional)**
   If you want `www.yoursite.com` to work too:

   | Type | Name | Content | Proxy Status |
   |------|------|---------|--------------|
   | CNAME | www | oatville-community-church.org | DNS only (gray cloud) |

### Option B: Subdomain (`www.oatville-community-church.org`)

If you prefer to use www as your main site:

1. **Add CNAME Record**

   | Type | Name | Content | Proxy Status |
   |------|------|---------|--------------|
   | CNAME | www | oatville-community-church.github.io | DNS only (gray cloud) |

2. **Add Root Redirect (Optional)**
   To redirect the root domain to www:

   | Type | Name | Content | Proxy Status |
   |------|------|---------|--------------|
   | CNAME | @ | `www.oatville-community-church.org` | Proxied (orange cloud) |

## Step 3: Configure GitHub Pages

1. **Go to Your Repository**
   - Sign in to GitHub
   - Navigate to: `https://github.com/Oatville-Community-Church/oatvillechurchweb`

2. **Access Settings**
   - Click "Settings" tab (at the top of the repository)
   - Scroll down to "Pages" in the left sidebar

3. **Configure Custom Domain**
   - In the "Custom domain" field, enter your domain: `oatville-community-church.org`
   - Click "Save"
   - Check "Enforce HTTPS" (this may take a few minutes to become available)

## Step 4: Update Configuration Files

**Important:** You need to update the website configuration to use your custom domain:

1. **Update GitHub Actions**
   - Go to the repository files
   - Navigate to `.github/workflows/deploy.yml`
   - Click the pencil icon to edit
   - Find the line that says `SITE_URL: "https://oatville-community-church.org"`
   - Change it to your actual domain
   - Scroll down and click "Commit changes"

2. **Update Weekly Update Action**
   - Navigate to `.github/workflows/weekly-update.yml`
   - Click the pencil icon to edit
   - Find the line that says `SITE_URL: "https://oatville-community-church.org"`
   - Change it to your actual domain
   - Scroll down and click "Commit changes"

## Step 5: Wait for Propagation

- DNS changes can take up to 48 hours to fully propagate
- Your site should start working within a few hours
- GitHub will automatically generate an SSL certificate for HTTPS

## Step 6: Verify Setup

1. **Test Your Domain**
   - Try visiting your domain in a web browser
   - Both `http://` and `https://` should work
   - `https://` should be automatically redirected if you enabled "Enforce HTTPS"

2. **Check GitHub Pages Status**
   - Go back to your repository settings → Pages
   - You should see a green checkmark and "Your site is published at `https://yourdomain.com`"

## Troubleshooting

### Site Not Loading

- Double-check DNS records match exactly
- Verify the custom domain is set in GitHub Pages settings
- Wait longer for DNS propagation (up to 48 hours)

### SSL Certificate Issues

- Make sure "Enforce HTTPS" is checked in GitHub Pages settings
- SSL certificates can take up to 24 hours to provision
- Try visiting with `http://` first, then enable HTTPS later

### DNS Propagation Check

- Use online tools like [whatsmydns.net](https://www.whatsmydns.net) to check if your DNS has propagated globally
- Enter your domain and select "A" record type

## Important Notes

- **Keep Proxy Status as "DNS only" (gray cloud)** for GitHub Pages to work properly
- **Don't enable Cloudflare's proxy (orange cloud)** on the records pointing to GitHub Pages
- **Save your Cloudflare login credentials** in a safe place
- **The site will rebuild automatically** every time you make changes

## Need Help?

If something isn't working:

1. Check the GitHub Pages settings in your repository
2. Verify DNS records in Cloudflare match this guide exactly
3. Wait 24-48 hours for full propagation
4. Contact your technical support person if issues persist

---

**Next Step:** Once your domain is working, refer to the "Website Content Update Guide" to learn how to update your church website content.
