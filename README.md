# Bridge to BITS

Development docs for the Bridge to BITS website.

## Getting the contact form working

The contact form sends emails through EmailJS to `bridgetobits@gmail.com`. Here's how to set it up:

### Initial setup

First, head over to [EmailJS](https://www.emailjs.com/) and create an account. Once you're in:

1. **Add an email service** — Connect Gmail (or whatever provider you're using). You'll get a Service ID from this.

2. **Create a template** — This is what your emails will look like. Make sure to include these variables:
   - `to_email`
   - `from_name`
   - `from_email`
   - `phone`
   - `message`

3. **Grab your Public Key** — Go to Account → API Keys and copy it.

4. **Update your environment** — Open `.env.local` and add these:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

5. Restart the dev server and you're good to go.

### Template example

If you're wondering what the template should look like, here's a basic one:

**Subject:**
```
New Contact — {{from_name}} ({{from_email}})
```

**Body:**
```
To: {{to_email}}
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}

Message:
{{message}}
```

The form automatically sends to `bridgetobits@gmail.com`. If you need to change this, check out `app/contact/page.tsx`.
