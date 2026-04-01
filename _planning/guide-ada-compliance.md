# Your Website Just Got Hit With an ADA Demand Letter: Here's Exactly What to Do

You got the letter today. Maybe it arrived by email, maybe certified mail. A law firm you've never heard of is claiming your website violates the Americans with Disabilities Act and WCAG accessibility standards. They want money — probably somewhere between $5,000 and $25,000 — or they'll sue you.

First: breathe. You have time. These cases move slowly, and the next 72 hours matter more than the next 30 days.

Second: this guide covers everything you need to know and do, in order, without spending $15,000 on a law firm to tell you the same things.

---

## Part 1: What This Letter Actually Is

### The Shakedown Pattern

Let's be direct about what's happening. A law firm — often working with one or a small handful of serial plaintiffs — uses automated scanning tools to crawl thousands of small business websites looking for accessibility violations. These violations are real. WCAG standards are real. But the enforcement pattern is predatory by design.

Here's the business model: the firm sends demand letters to hundreds of businesses simultaneously. Most businesses panic and settle. Settlement amounts range from $5,000 to $30,000 plus legal fees. Of the settlement money, the plaintiff (the person whose name is on the complaint) typically receives a few hundred dollars. The law firm keeps the rest. One Reddit commenter whose company settled put it plainly: the actual plaintiff received "in the low hundreds" while the firm kept the remainder of a "low five figures" settlement.

This is legal. That's what makes it infuriating.

The ADA does apply to websites — courts have increasingly ruled that way, though there's no single federal statute that explicitly covers commercial websites. Title III of the ADA prohibits discrimination in places of public accommodation, and most federal circuits now treat commercial websites as places of public accommodation. The legal grey area is real, but it's shrinking, and betting your business on a jurisdictional argument is expensive.

### Who Sends These Letters

A small number of law firms account for the vast majority of ADA demand letters sent to small businesses. Firms like Seyfarth Shaw, Scott+Scott, and dozens of smaller operations have built practices around high-volume ADA demand letter campaigns. Some employ full-time accessibility scanners. Some purchase access to tools that identify violations at scale.

The plaintiff on the letter is often a serial litigant — someone who files hundreds of ADA complaints per year. Courts are aware of this. Some judges have been openly skeptical of serial plaintiffs. But that skepticism hasn't stopped the letters from arriving.

### How They Pick Targets

They run automated scans. Your website showed up as having detectable violations — alt text missing on images, color contrast ratios below threshold, form fields without labels, missing ARIA landmarks, or other issues that automated tools can identify without a human ever visiting your site.

They're not targeting you specifically because of your business. They're targeting you because your site failed a scan. This matters for your response strategy.

### The Real Numbers

Before you do anything else, understand the actual financial landscape:

- Average small business ADA settlement: $10,000–$25,000 plus your own legal fees ($2,000–$8,000)
- Full defense through trial: $50,000–$150,000 (almost never worth it for a small business)
- Hiring an accessibility-focused lawyer to negotiate: $1,500–$5,000
- Fixing the actual violations yourself: $0–$500 in tools and your time
- Hiring a developer to fix everything: $500–$3,000 depending on site complexity
- Ongoing compliance monitoring: $0–$30/month using scanner tools

The math is not in favor of fighting. The math is strongly in favor of fixing your site and having documentation that you made a good faith effort before the letter arrived — or immediately after.

---

## Part 2: What ADA and WCAG Actually Require for Your Website

### The Legal Basis (Plain English)

The ADA was passed in 1990, long before commercial websites existed. Title III prohibits discrimination against people with disabilities at "places of public accommodation" — restaurants, stores, hotels, etc. Courts have extended this to websites, though not uniformly across all jurisdictions.

The Department of Justice has referenced WCAG 2.1 Level AA as the appropriate standard for web accessibility, and in 2024 finalized a rule explicitly requiring state and local government websites to meet WCAG 2.1 AA. For private businesses, the standard is less formally codified but WCAG 2.1 and 2.2 Level AA is what every demand letter cites and what courts use as a benchmark.

There is no official federal law that says "your website must meet WCAG 2.2 AA." There is also no court that has said otherwise when a case actually goes to trial. Treat WCAG 2.2 AA as the standard you need to meet.

### What "WCAG 2.2 AA" Means in Plain English

WCAG stands for Web Content Accessibility Guidelines. It's published by the W3C (World Wide Web Consortium), an international standards body. The current version is 2.2. There are three levels: A (minimum), AA (standard), AAA (enhanced). Level AA is what matters for ADA compliance.

WCAG organizes requirements around four principles, abbreviated POUR:

**Perceivable** — Users must be able to perceive all content. This means images need text descriptions for blind users, videos need captions for deaf users, and content can't rely solely on color to convey meaning.

**Operable** — Users must be able to operate the interface. This means everything must work with a keyboard (no mouse required), users need enough time to read content, and nothing should flash in ways that cause seizures.

**Understandable** — Users must be able to understand content and how the interface works. Forms need clear labels and error messages. Navigation must be consistent. Language should be identified.

**Robust** — Content must work with current and future assistive technologies. This is mostly about valid HTML code and proper use of ARIA attributes (technical labels that tell screen readers what elements are).

The specific violations that get cited in 90% of small business demand letters fall under Perceivable and Operable. We'll cover each one with exact fix instructions.

### The Four Violations That Are Cited in Almost Every Letter

**1. Missing alt text on images**

Every image on your website needs a text description called "alt text" or an "alt attribute." Screen readers — software used by blind and low-vision users — read alt text aloud. Without it, a screen reader says "image" or the file name, which is useless.

WCAG Success Criterion 1.1.1 (Level A) requires text alternatives for all non-text content.

What you need to do: Add a brief, descriptive sentence to every meaningful image. For a product photo: "Blue ceramic coffee mug, 12 oz, white interior." For a decorative image that conveys no information: use an empty alt attribute (`alt=""`) which tells the screen reader to skip it.

Time estimate: 30 minutes for a 20-product store. 2 hours for a 100-product store. This is the highest-priority fix.

**2. Color contrast**

Text must have sufficient contrast against its background so people with low vision or color blindness can read it. WCAG Success Criterion 1.4.3 (Level AA) requires:
- Normal text (under 18pt / 14pt bold): minimum contrast ratio of 4.5:1
- Large text (18pt+ / 14pt+ bold): minimum contrast ratio of 3:1
- UI components (buttons, form fields, icons): minimum contrast ratio of 3:1

What a contrast ratio means: pure black text on pure white background is 21:1. Light gray text on white background might be 1.5:1 — too low. Your designer's "clean minimal aesthetic" with light gray text is almost certainly failing this requirement.

Time estimate: Check in 15 minutes using the free tools below. Fixing it might take an hour if your designer or theme allows color adjustments, or a few hours if you need to override CSS.

**3. Form labels**

Every form field on your website — contact form, email signup, checkout fields — must have a visible label that's programmatically connected to the field. A placeholder (the gray text inside the field that disappears when you type) does not count as a label.

WCAG Success Criterion 1.3.1 (Level A) and 3.3.2 (Level AA) cover this.

What this looks like broken: A contact form where the field just says "Name" inside the box as placeholder text, and that text disappears when you click the field. A screen reader user who navigates to the field now has no idea what it's for.

What you need: A visible label above or next to each field that stays visible even when the field is filled in.

Time estimate: 20–60 minutes depending on how many forms you have and what platform you're on.

**4. Keyboard navigation**

Every interactive element on your website — links, buttons, dropdown menus, modals, carousels — must be reachable and usable with only a keyboard (Tab, Enter, Arrow keys, Escape). Users with motor disabilities who can't use a mouse depend on keyboard navigation.

WCAG Success Criteria 2.1.1 (Level A) and 2.1.2 (Level A) cover this.

How to check right now: Close your mouse. Open your website. Press Tab repeatedly. Can you reach every link and button? Can you tell which element is currently focused (there should be a visible highlight or outline)? Can you activate buttons with Enter? If your site uses modals or dropdowns, can you close them with Escape?

Time estimate: Testing takes 20 minutes. Fixing issues depends heavily on your platform. Many keyboard navigation problems require developer help.

---

## Part 3: The Settlement Trap

### Why Settlement Agreements Are Designed to Hurt You

If you've received a draft settlement agreement, read this section carefully before signing anything.

The agreements these law firms send are not negotiated in good faith. They're templates designed to maximize ongoing leverage over you. Here's what each major clause actually means:

**"Substantial compliance with WCAG 2.2 Level AA within [X] months"**

This sounds reasonable. It isn't. WCAG 2.2 AA has 50 success criteria. Automated tools only catch about 30% of violations — the rest require manual testing. "Substantial compliance" is undefined. You can spend $10,000 on remediation and still have an automated scan show failures because WCAG is complex and automated tools are imperfect. You've agreed to something you cannot fully control.

**The 24-month monitoring period**

This is the second payment mechanism. After you settle and do your remediation work, the firm retains the right to rescan your site for two years. If they find new violations — and they will, because websites change constantly — they can claim you've breached the agreement and reopen the case. You're not buying resolution; you're buying a 24-month surveillance arrangement.

**"Good faith efforts" with no defined standard**

This language, usually buried in the remediation section (often Section 4 or 5 of the template), is intentionally vague. You agree to make "good faith efforts" toward compliance. What counts as good faith? The agreement doesn't say. The firm gets to decide unilaterally whether your efforts were sufficient. If they decide they weren't, they have a breach of contract claim on top of the original ADA claim.

**The confidentiality clause**

You're typically prohibited from disclosing the settlement amount or terms to anyone other than your attorneys, accountants, and immediate family. This clause exists to prevent exactly what's happening in that Reddit thread — other business owners finding out how these settlements work. It's not there to protect your privacy. It's there to protect the firm's business model.

**What you should do before signing anything**

Do not sign a settlement agreement without having an attorney review it. A single hour of attorney time ($200–$400) to review a settlement agreement can save you from the monitoring and reopening provisions. If you can't afford that, at minimum negotiate to remove or narrow the monitoring period, define "good faith efforts" with specific objective standards (like "site will pass an automated scan using [specific tool]"), and eliminate or limit the confidentiality clause.

### The Real Cost Comparison

Settling without fixing the underlying issues: $10,000–$25,000 now, plus potential reopening, plus the next firm that scans your site.

Settling plus fixing the site: $10,000–$25,000 plus $500–$3,000 in remediation. But you're protected going forward.

Fixing the site now and disputing: $0–$500 in remediation, $0–$1,500 in legal fees for a dispute response, and you eliminate or greatly reduce your exposure. If the firm doesn't file suit (and most don't), the matter ends.

Ignoring the letter: This is not an option. Ignoring it removes any good faith defense you have and increases your exposure if they do file.

---

## Part 4: Your 72-Hour Action Plan

Do these in order. Today.

### Hour 1: Run the Free Scans

**WAVE (wave.webaim.org)**
Go to this URL right now. Enter your homepage URL. Hit Enter. You'll see a visual overlay on your site with red icons (errors), yellow icons (alerts), and green icons (structural elements). Red icons are your priority — these are definitive violations. Download or screenshot the results. Do this for your homepage, your most-visited product or service page, your contact page, and your checkout page if you have one.

Cost: Free.

**axe DevTools (browser extension)**
Install the axe DevTools extension for Chrome or Firefox (deque.com/axe/devtools — the free version is sufficient). Run it on the same pages. It catches different violations than WAVE. Together, these two tools cover roughly 30–40% of possible WCAG violations — the ones most likely to appear in a demand letter.

Cost: Free.

**WebAIM Color Contrast Checker (webaim.org/resources/contrastchecker)**
Go to this page. Use your browser's color picker or "inspect element" to find the hex color codes for your main text color and background color. Plug them in. The tool will tell you if you pass or fail for normal and large text.

Cost: Free.

**Google Lighthouse**
In Chrome, right-click anywhere on your site, select "Inspect," click the "Lighthouse" tab, select "Accessibility," and click "Analyze page load." This gives you an accessibility score and a list of specific issues with links to explanations. A score below 90 means you have significant work to do.

Cost: Free.

### Hours 2–8: Fix the Most Common Violations

Work through this list in order. Each fix prevents violations that appear in demand letters.

**Fix 1: Add alt text to images (Priority: Critical)**

Find every image on your site that conveys information. Product photos, staff photos, logos with text in them, banner images. Each needs a descriptive alt attribute.

How to write good alt text:
- Describe what the image shows, not what it is. Not "image of mug" but "Handmade ceramic mug with speckled blue glaze, 12 oz"
- For product images, include key details a buyer would want: color, material, size if visible
- For logos: use the business name as the alt text
- For decorative images (backgrounds, spacers, purely aesthetic images): use alt="" (empty alt text tells screen readers to ignore it)
- For icons that are links: describe the destination, not the icon. A shopping cart icon that goes to your cart should have alt="Shopping cart"

What you should NOT do: Use the file name as alt text ("IMG_4521.jpg"), use "image of" as a prefix, write alt text longer than 125 characters, or skip it entirely.

**Fix 2: Check and fix form labels (Priority: Critical)**

Go to every form on your site — contact form, email signup, checkout, search bar. For each field:
1. Is there a visible label that stays visible when the field is filled in?
2. If you click on the label text, does it move your cursor into the field? (This is the programmatic connection.)

If you're using a contact form plugin or app, check its settings for label options. Most modern form builders have label settings you can turn on. Avoid using placeholder text as your only label.

**Fix 3: Test keyboard navigation (Priority: High)**

Go to your website. Unplug or disable your mouse. Press Tab to move through the page. Check:
- Can you reach every link and button?
- Is there a visible focus indicator (highlight, outline, underline) on the current element?
- Can you activate buttons and links with Enter or Space?
- If you have dropdown menus, can you open them with keyboard?
- If you have a modal or popup, can you close it with Escape?

Write down everything that fails. Some of these require developer help — flag them but don't let them block the fixes you can make yourself.

**Fix 4: Fix color contrast (Priority: High)**

Run your text and background colors through the contrast checker. If you fail:
- For WordPress, Wix, Squarespace, or Shopify: look for the color settings in your theme customizer and increase the darkness of your text color or background
- The easiest fix is making text darker. Off-black (#333333) on white passes easily. Light gray (#999999) on white often fails
- Pay special attention to placeholder text in form fields — it almost always fails contrast requirements
- Check text over images or colored backgrounds — these almost always fail

### Day 2: Document Everything

Create a simple document (Google Doc is fine) with:
- The date you received the demand letter
- The date you ran each scan tool and what you found
- Screenshots of each scan result
- A list of every fix you made with the date
- Before/after screenshots for contrast changes

This documentation is your good faith record. If the matter proceeds to any legal proceeding, this document shows you took immediate remedial action.

### Day 3: Send the Dispute Letter and Post the Accessibility Statement

Both templates are in Part 8 of this guide. Send the dispute letter. Post the accessibility statement on your website.

---

## Part 5: Platform-Specific Fix Guides

### Shopify

**What Shopify handles automatically:**
- Skip navigation links (on most modern themes)
- Basic ARIA landmark regions
- Alt text fields for product images (but you have to fill them in)
- Keyboard-accessible navigation on Dawn and other official themes

**What Shopify does NOT handle:**
- Alt text on your product images — you must fill this in manually for every image
- Alt text on images in your theme's banner sections and custom content blocks
- Color contrast if you've customized colors from the theme defaults
- Form labels if you're using third-party form apps

**How to add alt text to product images in Shopify:**
1. Go to Products > All Products
2. Click on a product
3. Click on an image
4. Find the "Alt text" field
5. Write your description
6. Save

Do this for every product image. There is no bulk editor for alt text in standard Shopify — you have to do them one by one or use a paid app.

**For images in theme content sections:**
Go to Online Store > Themes > Customize. Click on each section that contains images. Look for an "Image alt text" field and fill it in.

**For color contrast:**
Go to Online Store > Themes > Customize > Theme Settings > Colors. Test your text and background colors at webaim.org/resources/contrastchecker before making changes. Keep a record of your original settings.

**Recommended Shopify Accessibility Apps:**
- accessiBe ($49/month) — automated overlay; addresses some issues but not a complete solution and has been criticized in the accessibility community. Better than nothing for immediate optics, not a substitute for real fixes.
- UserWay ($49/month) — similar to accessiBe; same caveats
- Accessibility Checker by Recart (free) — identifies issues, doesn't fix them automatically

Important caveat about Shopify: One Reddit commenter noted that some Shopify accessibility issues "are entirely down to Shopify and the theme designer to sort." This is partially true — your theme choice matters. The Dawn theme (Shopify's default) has better accessibility than many third-party themes. If your theme is from a third-party developer and has significant accessibility problems, contact the theme developer and document that contact. It establishes that you identified the issue and sought remediation.

**Shopify Estimated Fix Time:**
- Alt text on 50 products (1 image each): 1–2 hours
- Alt text on 50 products (3–5 images each): 4–8 hours
- Color contrast adjustments: 30 minutes
- Form label review: 20 minutes

### WordPress

**What WordPress handles automatically:**
- Block themes (Twenty Twenty-Three, Twenty Twenty-Four) have reasonable baseline accessibility
- Gutenberg editor generates reasonably semantic HTML

**What WordPress does NOT handle:**
- Alt text on images — you must fill this in for every image in the media library
- Color contrast if you've customized your theme colors
- Accessibility of third-party plugins and page builders
- Form labels if you're using contact form plugins incorrectly

**How to add alt text to images in WordPress:**
1. Go to Media > Library
2. Click on an image
3. Fill in the "Alt Text" field on the right side
4. Click Update

For images already placed in posts or pages: edit the post/page, click on the image block, and find the "Alt text" field in the right sidebar.

**Recommended WordPress Accessibility Plugins:**
- WP Accessibility by Joe Dolson (free) — addresses common accessibility issues including skip links, focus management, and landmark regions. Highly respected in the accessibility community.
- One Click Accessibility (free) — adds accessibility toolbar, skip links, keyboard navigation improvements
- Equalize Digital Accessibility Checker ($14/month or $119/year) — scans your WordPress content for WCAG violations with specific fix instructions. Best tool for ongoing compliance monitoring.
- Monster Insights Accessibility addon — if you're already using Monster Insights

**For page builders (Elementor, Divi, WPBakery):**
Page builders are a significant accessibility risk. They generate complex HTML that often fails keyboard navigation and ARIA requirements. If you're using a page builder, the above plugins will catch issues but not automatically fix them. You may need a developer to address structural issues.

**WordPress color contrast:**
Go to Appearance > Customize > Colors. If your theme doesn't offer color controls, you'll need to add custom CSS or use a child theme. A developer can add a small CSS override in under an hour ($50–$150).

**WordPress Estimated Fix Time:**
- Alt text for 50 images in media library: 1–2 hours
- Alt text for embedded images in posts: add 30 minutes per 20 posts
- Installing WP Accessibility plugin: 10 minutes
- Color contrast CSS override: 30 minutes with developer help

### Wix

**What Wix handles:**
- Wix has invested in accessibility and its editor has accessibility tools built in
- Many Wix templates are designed with accessibility in mind
- Wix has an Accessibility Wizard in the dashboard

**What Wix does NOT handle automatically:**
- Alt text on your specific images — you must fill these in
- Custom-added elements that override theme defaults

**How to use Wix's Accessibility Wizard:**
1. In the Wix Editor, click the Accessibility icon (person with circle icon) in the left sidebar
2. Follow the wizard's checklist
3. This covers many basic issues but not everything

**How to add alt text in Wix:**
1. Click on an image in the Wix Editor
2. Click the Settings (gear) icon
3. Find "What's in the image?" and fill in your description
4. Click Apply

**Wix color contrast:**
Click on a text element, go to text settings, and change the text color. Use the contrast checker to verify before and after.

**Wix Estimated Fix Time:**
- Running Accessibility Wizard: 30 minutes
- Alt text for all images: 1–3 hours depending on image count
- Color contrast review: 30 minutes

### Squarespace

**What Squarespace handles:**
- Skip navigation links are included in most modern templates
- Basic semantic HTML structure
- Keyboard navigation on navigation menus in most templates

**What Squarespace does NOT handle:**
- Alt text on your images
- Accessibility of custom code blocks
- Color contrast if you've changed default colors

**How to add alt text in Squarespace:**
1. Click on an image block in the page editor
2. Click the pencil (edit) icon
3. Go to the "Media" tab or look for the "Caption/Alt text" field
4. Fill in the description

For gallery blocks, click on each image individually and find the "Image Description" field — this becomes the alt text.

**Squarespace color contrast:**
Go to Design > Site Styles (or Custom CSS). Change text colors to darker values. Test with the contrast checker.

**Squarespace Estimated Fix Time:**
- Alt text for all images: 1–4 hours
- Color contrast review: 30–60 minutes

---

## Part 6: The Prioritized Fix Checklist

Use this checklist to track your remediation. Complete items in order — these are ranked by how often they appear in demand letters and how easy they are to fix.

### Week 1 (Do these first — highest impact, most accessible to non-developers)

- [ ] **Add alt text to all product/service images** — 1–8 hours depending on catalog size. Free.
- [ ] **Add alt text to all banner, hero, and content images** — 30–90 minutes. Free.
- [ ] **Check and fix color contrast on body text** — 30 minutes to check, 30 minutes to fix. Free.
- [ ] **Check and fix color contrast on buttons** — 15 minutes. Free.
- [ ] **Verify all form fields have visible labels** — 20–45 minutes. Free.
- [ ] **Run WAVE scan and screenshot results** — 15 minutes. Free.
- [ ] **Run axe scan and screenshot results** — 15 minutes. Free.
- [ ] **Post accessibility statement page** — 15 minutes. Free.
- [ ] **Send dispute letter** — 30 minutes. Free (or $200–$400 if you have an attorney review it first).

### Week 2 (Important but slightly more technical)

- [ ] **Test keyboard navigation on all pages** — 30 minutes. Free.
- [ ] **Verify skip navigation link exists and works** — 10 minutes to check, 30 minutes to fix if missing.
- [ ] **Check focus indicators are visible** — 15 minutes to check; CSS fix is 30 minutes.
- [ ] **Add captions to any videos** — Time varies; YouTube auto-captions as a starting point, then correct them.
- [ ] **Check page titles are descriptive** — 15 minutes. Each page's browser tab title should describe the page, not just say your business name on every page.
- [ ] **Verify all links have descriptive text** — 20 minutes. Links that say "click here" or "read more" fail WCAG 2.4.4.

### Week 3 (More technical — may need developer help)

- [ ] **Add proper ARIA labels to icon-only buttons** — Developer: 1–2 hours ($100–$300).
- [ ] **Fix any keyboard traps in modals or popups** — Developer: 1–3 hours ($100–$400).
- [ ] **Ensure proper heading hierarchy (H1, H2, H3 in order)** — Mix of self-fix and developer.
- [ ] **Add language attribute to HTML** — Developer: 15 minutes ($50). Your page's HTML should declare `lang="en"` (or your language). Most platforms do this automatically.
- [ ] **Verify error messages on forms are descriptive** — 30 minutes to check.

### Week 4 (Ongoing monitoring setup)

- [ ] **Set up a monthly automated scan** — 30 minutes to configure. $0–$30/month.
- [ ] **Document all fixes with before/after screenshots** — Ongoing.
- [ ] **Schedule quarterly manual keyboard navigation test** — Put it on your calendar.
- [ ] **Enable domain privacy** — 10 minutes. Free with most registrars or $10–$15/year add-on.

---

## Part 7: When to Hire a Lawyer, When Not To, and What You're Paying For

### When you do not need a lawyer

- To run the scans and fix your website. This is a technical/operational task, not a legal one.
- To write and post an accessibility statement.
- To decide whether to send a dispute letter. (You should send one. Template is in Part 8.)

### When you need a lawyer

- Before signing any settlement agreement. One hour of attorney time ($200–$400) to review the settlement terms is worth it. The monitoring period and reopening clauses are where small businesses get hurt twice.
- If you receive a court filing (summons and complaint). At this point you have legal deadlines and need representation.
- If the demand amount is above $15,000 and the firm seems serious about litigating.

### What $1,500 Gets You

An attorney charges $1,500 to:
- Review the demand letter and assess the specific claims
- Send a formal dispute response on their letterhead
- Negotiate the demand amount down (often to $3,000–$8,000 if you're going to settle)
- Advise you on the strength of the plaintiff's standing

This is often enough. Many firms back down when they receive a formal attorney response because they know you're not going to panic-pay. The attorney response signals you understand the process.

What $1,500 does not get you: a complete legal defense, ongoing representation, or protection if they actually file suit.

How to find an attorney for this: Search "ADA website demand letter attorney" plus your state. Look for attorneys who specifically mention website accessibility or ADA Title III in their practice description. Expect to pay $200–$400/hour. A one-time consultation and letter is typically 3–5 hours of work.

One Reddit commenter reported hiring a lawyer for $1,500, showing up to court, and the plaintiff's attorney not appearing — the case was dismissed. This is reportedly common. These firms file suits to scare businesses into settling, not to actually litigate. But you cannot count on this. Fix your site.

### What $15,000 Gets You

Full defense of an ADA website accessibility lawsuit through trial gets you:
- Multiple attorneys billing at $300–$500/hour
- Depositions, discovery, expert witnesses
- A trial that will take 12–24 months
- A result that's still uncertain because courts vary on ADA website requirements

This is rarely the right choice for a small business. The only scenario where spending $15,000 on defense makes sense is if the settlement demand is also $15,000 or more AND your site is actually largely accessible AND you have evidence the plaintiff's claims are fabricated.

### What to Tell the Attorney in Your First Call

- The date of the demand letter
- The firm and plaintiff name
- The settlement amount demanded
- The deadline given in the letter
- The specific violations cited
- What you've done to fix the site since receiving the letter
- Whether you've run automated scans and what they showed

Bring this information and you'll spend less time (and money) on the call.

---

## Part 8: The Templates

### Dispute Letter Template

Send this by email (so you have a timestamp) and by certified mail to the address on the demand letter. Use your business letterhead or just your business name and address at the top. Do not use this template if you've already hired an attorney — let them send their own version.

---

[Your Name]
[Your Business Name]
[Your Address]
[Your Email]
[Date]

[Law Firm Name]
[Law Firm Address]

Re: Demand Letter Dated [Date of Their Letter] — [Your Website URL]

To [Attorney Name or "Counsel"] at [Law Firm Name]:

We are in receipt of your letter dated [date] regarding alleged accessibility deficiencies on our website, [yourwebsite.com]. We write to formally dispute your characterization of our website and to document our good faith remediation efforts.

We dispute that any violation of the Americans with Disabilities Act has occurred. The legal basis for applying Title III of the ADA to private commercial websites remains unsettled in many jurisdictions, and we have not conceded liability.

Upon receiving your letter, we immediately took the following remediation steps:

[List each specific fix you made, with the date. For example:]
- Added alt text to all product images (completed [date])
- Corrected color contrast ratios across all pages to meet WCAG 2.1 AA standards (completed [date])
- Added visible labels to all form fields (completed [date])
- Verified keyboard navigation functionality across all pages (completed [date])

We have also posted an Accessibility Statement on our website at [URL of your accessibility statement page], which includes contact information for users who experience any remaining barriers.

We are committed to making our website accessible to all users and have taken and continue to take affirmative steps toward that goal. We have run automated accessibility scans using WAVE and axe DevTools and have addressed identified violations. We will continue to monitor and improve our site's accessibility.

We do not believe litigation is appropriate or justified given our immediate and documented remediation efforts. If you intend to proceed, we request that you file in the appropriate court so this matter may be properly adjudicated. We will vigorously contest both liability and damages.

If you wish to discuss this matter, you may reach us at [your email and phone].

Sincerely,

[Your Name]
[Your Title]
[Your Business Name]

---

**Notes on this letter:**
- "We do not believe litigation is appropriate" is firm without being aggressive
- Documenting your remediation steps is the most important part — get specific
- "File in the appropriate court" signals you're not going to panic-pay
- Do not apologize, do not admit fault, do not acknowledge that violations existed

### Accessibility Statement Template

Post this as a standalone page on your website. Title it "Accessibility Statement" and link it in your footer. This serves two purposes: it's good faith documentation, and it's what WCAG 2.4.1 suggests for providing an accessibility feedback mechanism.

---

**Accessibility Statement**

[Your Business Name] is committed to ensuring digital accessibility for people with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards.

**Our Goal**

We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible to people with disabilities, including visual, auditory, physical, speech, cognitive, and neurological disabilities.

**Current Status**

We have recently conducted an accessibility review of this website and are actively working to address identified issues. We have made the following improvements:

[List your specific fixes here — same list as in your dispute letter]

We recognize that accessibility is an ongoing effort and are committed to continued improvement.

**Known Limitations**

[If you know of specific issues you haven't fixed yet, list them here. This shows good faith.]

**Feedback and Contact**

We welcome your feedback on the accessibility of this website. If you experience accessibility barriers, please contact us:

- Email: [your email address]
- Phone: [your phone number]
- Response time: We will try to respond within 2 business days

We take accessibility feedback seriously and will work to address any barriers you identify.

**Date of Last Review**

This statement was last reviewed on [date].

---

---

## Part 9: Insurance — The Option Most Business Owners Don't Know About

### The Employment Practices Liability Insurance (EPLI) Rider

One Reddit commenter whose company had just settled mentioned their insurance broker recommended "a 3rd Party Claimant rider on an Employment Practices Insurance policy." This is real and worth understanding.

Employment Practices Liability Insurance (EPLI) primarily covers discrimination and harassment claims by employees. Some insurers offer an extension or rider that covers third-party ADA claims — meaning claims by customers or members of the public alleging discrimination, including website accessibility claims.

Not every EPLI policy covers this. You need to ask specifically about:
- Third-party ADA claims coverage
- Website accessibility claim coverage
- Whether there's an exclusion for intentional violations (there usually is — this is why having documented remediation efforts matters)

**How to get it:**
Call your current business insurance broker and ask: "Does my current policy or any add-on cover third-party ADA discrimination claims, including website accessibility claims?" If they say no, ask if it's available as a rider.

If you don't have a broker, contact an insurance broker who specializes in small business liability. Companies that offer this type of coverage include Hiscox, Travelers, CNA, and others — availability and pricing vary significantly by state, business type, and claims history.

**Cost:**
EPLI policies for small businesses typically run $800–$3,000/year. A rider for third-party ADA claims may add $200–$800/year. This is not cheap, but compared to a $15,000 settlement, the math is clear.

**Important:** Buy this insurance now, not after you receive the next demand letter. Insurers won't cover claims you knew about before you bought the policy.

**What insurance will and won't cover:**
- Will cover: Legal defense costs, settlement amounts (above your deductible)
- Won't cover: Remediation costs (fixing your website), fines, penalties

---

## Part 10: Domain Privacy — Why It Matters and How to Enable It

### Why This Matters for ADA Letters

Domain WHOIS records are public. When you register a domain name, your name, email address, and mailing address are recorded and publicly searchable unless you enable domain privacy (also called WHOIS privacy or privacy protection).

Law firms that send bulk demand letters use WHOIS lookups to find contact information for website owners. One Reddit commenter recommended: "Pay the money to your domain registrar to hide the ownership of your business."

Enabling domain privacy won't protect you from letters sent to your business address, but it prevents automated scraping of your personal contact information. It also means demand letters go to your registrar's proxy address first, which can buy time and reduce your exposure to future campaigns.

**How to enable it:**

The process is the same at every major registrar — find your domain management settings and look for privacy or WHOIS protection.

- **GoDaddy:** Domain Settings > Domain Privacy + Protection. $9.99/year, or free on some plans.
- **Namecheap:** Domain list > Manage > WhoisGuard. Free for the first year, then $1.98/year. Often included free.
- **Google Domains (now Squarespace Domains):** Included automatically at no extra cost.
- **Cloudflare Registrar:** Included free.
- **Hover:** Included free with all domains.

If you're using Shopify Domains, GoDaddy, or another registrar that charges for this, $10/year is worth paying. Do it today.

---

## Part 11: How to Prevent This From Happening Again

### The Ongoing Monitoring Stack (Under $30/Month)

You cannot fix your site once and consider the matter closed. Websites change constantly — you add products, update content, install new plugins, update your theme. Each change can introduce new accessibility violations.

**Free options:**
- WAVE browser extension: Run it manually on changed pages when you make updates. Takes 2 minutes per page.
- axe DevTools free version: Same approach — run it manually.
- Google Lighthouse: Built into Chrome, no installation needed.

**Low-cost automated options:**
- accessScan (accessscan.com): Automated scanning with a free tier for small sites.
- Siteimprove Accessibility (siteimprove.com): Paid plans starting around $100/month — overkill for most small businesses.
- Accessibility monitoring tools integrated into website scanners: Many website monitoring tools now include accessibility checks.

**What to monitor:**
1. Your homepage
2. Your product/service pages
3. Your checkout or contact form pages
4. Any page you've recently updated

**The quarterly audit checklist:**

Set a calendar reminder for every three months. Do this:

- [ ] Run WAVE on homepage, main product/service page, contact page
- [ ] Run axe on the same pages
- [ ] Check color contrast on any colors you've changed
- [ ] Test keyboard navigation on homepage
- [ ] Verify all new images added in the past quarter have alt text
- [ ] Check any new forms for proper labels
- [ ] Update your accessibility statement with the new review date

Total time: 45–60 minutes per quarter.

### The 30-Day Compliance Roadmap

**Week 1 (Days 1–7):**
Focus on alt text and color contrast. These are the two violations cited in nearly every demand letter and are entirely within your control regardless of platform. By end of week 1, you should have:
- Alt text on every meaningful image
- All text passing color contrast requirements
- WAVE and axe scans run and documented
- Accessibility statement posted
- Dispute letter sent

**Week 2 (Days 8–14):**
Focus on forms and keyboard navigation. Go through every form on your site. Test keyboard navigation on every page. Document what you find. Fix what you can fix without a developer. Flag what needs developer help.

Also in week 2: Enable domain privacy if you haven't. Contact your insurance broker about EPLI coverage.

**Week 3 (Days 15–21):**
Address more technical issues. If you flagged keyboard navigation problems, form label issues, or other issues requiring developer help, this is when to engage a developer. Budget $300–$1,000 for targeted technical fixes. A freelance web developer who knows accessibility (search "WCAG remediation freelancer" on Upwork or Fiverr) can address specific issues efficiently.

Also in week 3: Run your final pre-documentation scan. Screenshot everything. Update your accessibility statement.

**Week 4 (Days 22–30):**
Set up ongoing monitoring. Configure your quarterly audit calendar reminder. If you've been corresponding with the law firm that sent the demand letter, assess the status — have they responded to your dispute letter? Have they gone quiet? Consult an attorney if you haven't already and they've escalated.

By day 30, you should have:
- Documented remediation efforts with dates
- A website that passes automated scans on the main pages
- An accessibility statement live on your site
- A dispute letter on record
- Domain privacy enabled
- A quarterly monitoring schedule in place

---

## Part 12: Honest Assessment of Accessibility Overlays

You'll see ads for "one-click ADA compliance" tools — accessiBe, UserWay, AudioEye, and similar products that claim to make your site fully accessible for $20–$50/month. These are called overlays.

Here's the honest truth about overlays: they are controversial, imperfect, and should not be your only compliance strategy. They work by injecting JavaScript into your site that attempts to fix accessibility issues on the fly. They catch some issues. They miss others. They sometimes create new problems. The National Federation of the Blind and other disability organizations have published statements against overlays as a complete solution.

More importantly for your legal situation: overlays do not constitute full WCAG compliance, and if a law firm scans your site using standard methods, they may still find violations even with an overlay active.

What overlays are useful for:
- As a supplementary layer on top of real fixes
- For catching issues your manual remediation missed
- For providing an accessibility toolbar that users can customize (larger text, high contrast mode, etc.)

What overlays are not:
- A substitute for fixing actual code-level issues
- A legal shield against ADA claims
- A guarantee of compliance

If you choose to use an overlay, use it in addition to the fixes outlined in this guide, not instead of them. And be aware that some accessibility advocates actively criticize overlay vendors — if your site's accessibility is ever scrutinized, having an overlay-only approach may be seen as bad faith.

---

## The Bottom Line

You received a demand letter. Here's the situation in plain terms:

The violations are probably real. The law firm sending the letter is running a high-volume operation. Most of the violations are fixable by a non-developer in a few hours. The settlement agreement is designed to trap you, not resolve the issue. Fixing your site is cheaper than settling. Documenting your fixes is as important as making them.

The sequence:

1. Today: Run WAVE. Run axe. Start fixing alt text. It takes two hours and costs nothing.
2. Today: Send the dispute letter. It's in Part 8. Send it certified mail and email.
3. This week: Fix color contrast, form labels. Post the accessibility statement.
4. This week: Enable domain privacy. Call your insurance broker.
5. Next two weeks: Address keyboard navigation and more technical issues.
6. Ongoing: Quarterly audits. Monthly automated scans.

Do not panic. Do not ignore the letter. Do not sign anything without having an attorney review it. And do not pay $20,000 to a firm when the actual problem — a website that fails a 15-minute free scan — is something you can start fixing right now.

---

*This guide was written for informational purposes. It is not legal advice. Consult an attorney licensed in your jurisdiction before making legal decisions. That said: run the WAVE scan first. That's not legal advice, it's just common sense.*
