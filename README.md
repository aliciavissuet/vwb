# Vision Without Borders

Static launch-page skeleton for Vision Without Borders.

## Local Preview

From this folder:

```sh
python3 -m http.server 5176
```

Then open `http://127.0.0.1:5176/`.

## Notes

- `index.html` is the basic homepage with the animated wordmark identity.
- `src/styles.css` contains the page and wordmark animation styles.

## Netlify form email notifications

The `contact` and `sponsor-inquiry` forms are handled by Netlify Forms. After a
deploy, add an email notification for each form in the Netlify site dashboard:

1. Open **Forms** and select **Enable form detection** if it is not already enabled.
2. Redeploy the site so Netlify discovers both forms.
3. Open **Project configuration → Notifications → Emails and webhooks → Form submission notifications**.
4. Choose **Add notification → Email notification**.
5. Select the form, enter the destination email address, and save.
6. Repeat for the other form.

Netlify only discovers form changes during a deploy. Test each form on the
deployed site and confirm both the submission in Netlify and the notification
email. Check the recipient's spam folder during the first test.
