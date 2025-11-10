# Template Creation Guide for Developers

## Overview
This guide explains how to create custom templates for the WebSiteBuilder platform. Templates are used to generate static websites based on user input.

---

## Template Structure

Each template must be a folder containing these files:

```
template-name/
├── index.ejs          (Required - Main HTML template)
├── style.css          (Required - Styling)
├── metadata.json      (Required - Template information)
└── template.png       (Required - Preview image)
```

---

## 1. index.ejs (HTML Template)

The main HTML file using EJS templating syntax.

### Available Variables

All these variables are passed to your template:

```javascript
{
  name: String,              // Website name
  siteType: String,          // Site type (Portfolio, Blog, Business, etc.)
  about: String,             // About content
  description: String,       // Short description
  services: Array,           // List of services ["Service 1", "Service 2", ...]
  contact: {                 // Contact information
    phone: String,
    email: String
  },
  address: String,           // Business address
  website: String,           // Website URL
  socialAccounts: Array,     // Social media links
  images: Array              // Uploaded image filenames
}
```

### Social Accounts Structure

```javascript
socialAccounts: [
  {
    type: "Facebook",  // or Twitter, Instagram, LinkedIn, YouTube, GitHub, Pinterest
    url: "https://..."
  }
]
```

### EJS Syntax Examples

**Display simple variable:**
```html
<h1><%= name %></h1>
<p><%= about %></p>
```

**Conditional rendering:**
```html
<% if (description) { %>
  <p><%= description %></p>
<% } %>
```

**Loop through arrays:**
```html
<% if (services && services.length > 0) { %>
  <ul>
    <% services.forEach(function(service) { %>
      <li><%= service %></li>
    <% }); %>
  </ul>
<% } %>
```

**Display images:**
```html
<% if (images && images.length > 0) { %>
  <div class="gallery">
    <% images.forEach(function(image) { %>
      <img src="<%= image %>" alt="Gallery Image">
    <% }); %>
  </div>
<% } %>
```

**Display contact information:**
```html
<% if (contact && contact.email) { %>
  <p>Email: <%= contact.email %></p>
<% } %>
<% if (contact && contact.phone) { %>
  <p>Phone: <%= contact.phone %></p>
<% } %>
```

**Display social media links:**
```html
<% if (socialAccounts && socialAccounts.length > 0) { %>
  <div class="social-links">
    <% socialAccounts.forEach(function(account) { %>
      <% if (account.url) { %>
        <a href="<%= account.url %>" target="_blank">
          <%= account.type %>
        </a>
      <% } %>
    <% }); %>
  </div>
<% } %>
```

---

## 2. style.css (Styling)

Standard CSS file for your template styling.

### Best Practices

```css
/* Use reset for consistency */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Make it responsive */
@media (max-width: 768px) {
  /* Mobile styles */
}

/* Use modern CSS features */
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
}

/* Image handling */
img {
  max-width: 100%;
  height: auto;
  display: block;
}
```

---

## 3. metadata.json (Template Information)

Template metadata for the system.

```json
{
  "name": "template-name",
  "description": "Template description",
  "author": "Your Name",
  "version": "1.0.0",
  "siteType": "Portfolio",
  "fields": [
    "name",
    "siteType",
    "about",
    "description",
    "services",
    "contact",
    "address",
    "website",
    "socialAccounts",
    "images"
  ]
}
```

### Site Types
- Portfolio
- Blog
- Business
- Personal
- Event
- E-commerce

---

## 4. template.png (Preview Image)

- **Dimensions**: Recommended 1200x800px or 16:9 ratio
- **Format**: PNG or JPG
- **Size**: Under 500KB for faster loading
- **Content**: Screenshot or mockup of your template

---

## Complete Template Example

### Minimal Example

**index.ejs:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= name %></title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <h1><%= name %></h1>
        <% if (siteType) { %>
          <p><%= siteType %></p>
        <% } %>
    </header>
    
    <main>
        <!-- Images -->
        <% if (images && images.length > 0) { %>
        <section class="gallery">
            <% images.forEach(function(image) { %>
                <img src="<%= image %>" alt="Image">
            <% }); %>
        </section>
        <% } %>

        <!-- About -->
        <section>
            <h2>About</h2>
            <p><%= about %></p>
        </section>

        <!-- Services -->
        <% if (services && services.length > 0) { %>
        <section>
            <h2>Services</h2>
            <ul>
                <% services.forEach(function(service) { %>
                    <li><%= service %></li>
                <% }); %>
            </ul>
        </section>
        <% } %>

        <!-- Contact -->
        <section>
            <h2>Contact</h2>
            <% if (contact && contact.email) { %>
                <p>Email: <%= contact.email %></p>
            <% } %>
            <% if (contact && contact.phone) { %>
                <p>Phone: <%= contact.phone %></p>
            <% } %>
            <% if (address) { %>
                <p>Address: <%= address %></p>
            <% } %>
        </section>

        <!-- Social Media -->
        <% if (socialAccounts && socialAccounts.length > 0) { %>
        <section>
            <h2>Follow Us</h2>
            <% socialAccounts.forEach(function(account) { %>
                <% if (account.url) { %>
                    <a href="<%= account.url %>" target="_blank">
                        <%= account.type %>
                    </a>
                <% } %>
            <% }); %>
        </section>
        <% } %>
    </main>
    
    <footer>
        <p>&copy; <%= new Date().getFullYear() %> <%= name %></p>
    </footer>
</body>
</html>
```

**style.css:**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    color: #333;
}

header {
    background: #667eea;
    color: white;
    text-align: center;
    padding: 2rem;
}

main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

section {
    margin-bottom: 3rem;
}

h2 {
    margin-bottom: 1rem;
    color: #667eea;
}

.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
}

.gallery img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 8px;
}

footer {
    background: #333;
    color: white;
    text-align: center;
    padding: 1rem;
}

@media (max-width: 768px) {
    main {
        padding: 1rem;
    }
}
```

**metadata.json:**
```json
{
  "name": "simple-template",
  "description": "A clean and simple template",
  "author": "Developer Name",
  "version": "1.0.0",
  "siteType": "Portfolio"
}
```

---

## Advanced Features

### 1. Add External Libraries

**Font Awesome Icons:**
```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

**Google Fonts:**
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
```

### 2. JavaScript Interactions

```html
<script>
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
</script>
```

### 3. Responsive Images

```html
<% if (images && images.length > 0) { %>
    <picture>
        <source media="(max-width: 768px)" srcset="<%= images[0] %>">
        <img src="<%= images[0] %>" alt="Responsive Image">
    </picture>
<% } %>
```

---

## Upload Methods

### Method 1: Direct File Upload
1. Go to Admin Dashboard
2. Select "Upload Files Directly"
3. Choose `index.ejs`, `style.css`, and `template.png`
4. Select site type
5. Enter folder name or leave blank for auto-naming

### Method 2: ZIP Upload
1. Create a ZIP file containing all template files
2. Go to Admin Dashboard
3. Select "Upload ZIP"
4. Choose your ZIP file
5. Upload

---

## Testing Your Template

1. Upload your template via Admin Dashboard
2. Go to the Editor page
3. Select your template
4. Fill in test data
5. Generate and preview the website
6. Check all sections display correctly
7. Test on different screen sizes

---

## Common Issues

### Images Not Displaying
- Ensure images array is checked: `<% if (images && images.length > 0) { %>`
- Use correct syntax: `<%= image %>` not `<%= images[0] %>`

### Missing Data
- Always check if variable exists before using
- Use conditional rendering: `<% if (variable) { %>`

### Broken Layout
- Test with different amounts of data
- Use responsive CSS units (%, rem, vw)
- Add media queries for mobile

### EJS Errors
- Close all EJS tags properly
- Don't use `<%=` for logic, use `<%` instead
- Check bracket matching in forEach loops

---

## Tips for Better Templates

1. **Always use conditional rendering** to handle missing data
2. **Make it responsive** - test on mobile devices
3. **Use semantic HTML** (header, main, section, footer)
4. **Optimize images** - use object-fit for consistent sizes
5. **Add transitions** for better user experience
6. **Test with real data** before publishing
7. **Comment your code** for future updates
8. **Use CSS variables** for easy theming
9. **Keep it simple** - users want clean designs
10. **Validate HTML/CSS** before uploading

---

## Resources

- **EJS Documentation**: https://ejs.co/
- **CSS Tricks**: https://css-tricks.com/
- **MDN Web Docs**: https://developer.mozilla.org/
- **Can I Use**: https://caniuse.com/

---

## Support

For questions or issues:
- Check existing templates in `/backend/templates/` folder
- Review the developer-portfolio template for advanced example
- Test thoroughly before deploying

---

**Happy Template Building! 🚀**
