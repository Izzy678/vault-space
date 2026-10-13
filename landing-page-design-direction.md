# Landing Page Design Direction

**Project:** Design and Implementation of a Hybrid Secure Cloud Storage System Using AES File Encryption and Asymmetric Key Protection  
**Scope:** Public landing page only  
**Audience:** The frontend implementation agent  
**Working product name:** VaultSpace — replace with the project's chosen name  
**Prepared:** 9 October 2026

## 1. Design objective

Create a polished, credible landing page that explains the secure-storage system, demonstrates its interface, and directs visitors to create an account or sign in.

The visual direction is a calm, precise secure workspace: deep navy, restrained blue accents, readable typography, fine borders, generous spacing, and a realistic file-workspace preview.

The page should make three points immediately:
1. Users can upload and retrieve files through a familiar interface.
2. Files are encrypted, and their encryption keys receive separate asymmetric protection.
3. Access and integrity checks are part of the retrieval workflow.

This is a final-year-project prototype. Present real capabilities honestly and give its academic context in the footer.

## 2. Scope boundaries

Implement the landing page and its responsive behaviour. Include a static product preview as landing-page content.

Do not implement the authenticated file workspace, upload processing, login forms, vault setup, or cryptography as part of this task. Buttons should lead to existing authentication/application routes or configurable destinations.

The current project architecture and implemented functionality remain authoritative for technical copy. This design brief does not change the encryption, storage, or key-management architecture.

## 3. Selected 21st.dev inspiration

Use these three components as the main references. They were selected from their public descriptions and static previews; interactive behaviour has not been tested.

### A. Hero Section 6 — Tailark / Méschac Irung

**Direct link:** https://21st.dev/@meschacirung/components/hero-section-6  
**Original source linked by the listing:** https://tailark.com/hero-section

**What to take:**
- A prominent centred headline and concise supporting paragraph.
- Two clearly differentiated calls to action.
- A large product-interface preview below the headline.
- Generous spacing between navigation, copy, and the preview.
- A restrained frame around the preview.

**How to adapt:**
- Change the surrounding page to deep navy.
- Keep the product preview light for contrast and legibility.
- Use our storage-related copy and our own wordmark.
- Replace the reference product screenshot with a file-workspace illustration.
- Remove unrelated company logos, promotional badges, and stock content.

**Decision:** Use the centred headline plus preview-below arrangement as the default desktop hero. This is the selected composition; do not switch to a generic split hero without a clear layout reason.

The listing identifies this component as MIT licensed. Preserve required notices when incorporating its source.

### B. Features 8 — Tailark / Méschac Irung

**Direct link:** https://21st.dev/@meschacirung/components/features-8  
**Original source linked by the listing:** https://tailark.com/features

**What to take:**
- The balance between explanatory text and a visual panel.
- Minimal icon tiles and fine separators.
- A structured feature composition rather than many identical cards.
- A clear heading that introduces the section.

**How to adapt:**
- Replace the reference integration/service icons with file, key, access, and verification icons.
- Give file encryption and key protection the greatest visual emphasis.
- Use a compact file-security summary as the supporting visual.
- Rewrite every label for this project's real capabilities.
- Share the hero's typography, spacing, blue accent, and corner radii.

The listing identifies this component as MIT licensed. Preserve required notices when incorporating its source.

### C. How It Works — chamaac

**Direct link:** https://21st.dev/@chamaac/components/how-it-works  
**Original source linked by the listing:** https://chamaac.com/components/sections/how-it-works

**What to take:**
- Numbered process cards.
- A visible relationship between successive steps.
- Short titles and one plain-language explanation per step.

**How to adapt:**
- Show four steps: Select a file → Encrypt the file → Protect its key → Store securely.
- Use our blue accent for step numbers and connectors.
- Keep connectors and animation subtle.
- Stack the steps vertically on narrow screens.
- Add a short retrieval explanation underneath.
- Simplify scroll/pinning effects if they interfere with reading, mobile use, or reduced-motion support.

Check the source's current licence and usage terms before incorporating its code; a licence was not confirmed from the retrieved listing.

### Reference-use rule

Inspect each linked component before implementation. Adapt these references into one coherent page rather than stitching together different themes. If the existing frontend does not support their React/Tailwind conventions, reproduce the layout principles using the existing stack.

Do not copy another product's brand, screenshot, testimonials, or security claims. Do not blindly execute installation commands from a component page. Review source, dependencies, and licence requirements first.

## 4. Visual system

### Colours

| Token | Value | Application |
| --- | --- | --- |
| background | #0B1220 | Page base |
| surface-dark | #111C30 | Process/security panels |
| text-primary | #F8FAFC | Main text on navy |
| text-secondary | #B8C5D8 | Supporting copy on navy |
| accent | #2563EB | Primary CTA and selected emphasis |
| accent-hover | #1D4ED8 | Primary CTA hover |
| accent-light | #93C5FD | Small accent text on dark surfaces |
| border-dark | #2A3950 | Dark-surface separators |
| preview-background | #F6F8FB | Product-preview canvas |
| preview-surface | #FFFFFF | Preview rows and panels |
| preview-text | #0F172A | Text inside the light preview |
| preview-muted | #526174 | Secondary preview labels |
| preview-border | #DCE3EC | Preview separators |
| success | #15803D | Verified result inside the light preview |

Use blue as the single main accent. Use green only to indicate a confirmed example status, with a text label and icon.

Use white text on blue primary buttons. Verify contrast in actual rendered combinations; subtle structural borders are not suitable focus indicators.

### Typography

- Inter, with a system sans-serif fallback.
- Desktop hero heading: 56–64 px, approximately 1.08 line height, weight 600–700.
- Mobile hero heading: 34–40 px.
- Section headings: 32–40 px desktop, 26–30 px mobile.
- Body: 16–18 px, approximately 1.6 line height.
- Eyebrows and metadata: 12–14 px.
- Monospace only for small illustrative technical identifiers, if needed.
- Avoid tiny uppercase body copy and thin headings.

### Spacing and shape

- Main container: max-width approximately 1200 px.
- Text-only blocks: max-width approximately 640–720 px.
- Horizontal padding: 20 px mobile, 32 px tablet, 40–48 px desktop.
- Section spacing: 88–112 px desktop, 56–72 px mobile.
- Use a 4 px spacing base.
- Buttons: 8 px radius and approximately 44–48 px height.
- Panels: 12 px radius.
- Hero preview frame: 16 px radius.
- Use fine borders for ordinary structure and one controlled shadow beneath the hero preview.

### Icons and decorative assets

Use a consistent outline icon family, such as Lucide if already supported. Relevant motifs: file, folder, key, shield, cloud, lock, and check circle.

Use a small original geometric wordmark/icon. Do not lead the hero with a giant floating padlock.

Decorative background: one faint blue radial glow behind the preview. An optional low-opacity grid can add structure, but omit it if it introduces visual noise.

## 5. Page structure and approved copy

Build in this order:

| Order | Section | Purpose |
| --- | --- | --- |
| 1 | Navigation | Orient visitors and expose sign-in/account actions |
| 2 | Hero and product preview | Explain the product and show the interface |
| 3 | Capability strip | Reinforce the three core security capabilities |
| 4 | Feature explanation | Explain protection and everyday usability |
| 5 | How it works | Show the upload and retrieval workflow |
| 6 | Security explanation | Explain hybrid encryption in accessible language |
| 7 | FAQs | Resolve predictable user questions |
| 8 | Final CTA | Give visitors a clear next action |
| 9 | Footer | Identify the project and provide useful navigation |

### 5.1 Navigation

Desktop:
- Left: wordmark.
- Centre/right: Features, How it works, Security.
- Far right: Sign in and Create account.

Anchor targets:
- Features → #features
- How it works → #how-it-works
- Security → #security

Use a restrained sticky header with a mostly opaque navy background and bottom border. Add anchor scroll offsets so the header does not cover section headings.

On mobile, keep the wordmark and a labelled menu button visible. The expanded menu must provide all navigation and authentication actions.

Use existing registration/login routes. If unavailable, define configurable destinations and document them for the implementer. Do not ship dead buttons or pretend that registration has succeeded.

### 5.2 Hero

**Eyebrow:** SECURE CLOUD STORAGE

**Headline:**  
Your files.  
Protected at every step.

**Supporting copy:**  
Upload and retrieve encrypted files with protected encryption keys, controlled access, and integrity verification.

**Primary CTA:** Create account  
**Secondary CTA:** See how it works

**Small supporting line:**  
File encryption · Asymmetric key protection · Secure retrieval

Keep the headline and paragraph centred. Place both CTAs underneath, then show the large workspace preview. Use navy negative space to frame the light preview.

Do not add “Free forever” or pricing-related promises unless they are real product decisions.

### 5.3 Hero product preview

The preview is a landing-page illustration, not a functioning storage dashboard. Place a small visible “Illustrative workspace” caption beside or beneath it.

Show:
- A compact sidebar: My files, Activity, Security.
- A toolbar: My files, search shape, Upload files.
- Three or four believable sample files.
- Filename, size, and encryption status.
- A selected-file security summary in a side panel.

Example sample files:
- Research-notes.pdf
- Project-report.docx
- Experiment-data.csv

Example selected-file details:
- File encryption: Encrypted
- Key protection: Protected
- Integrity: Example verified result

Keep example security states clearly within the illustrative preview. They must not look like a live assessment of the visitor's files.

On mobile, simplify the preview to filenames, encryption labels, and one security summary. Avoid shrinking a full desktop screenshot until all text becomes unreadable.

If the actual application already exists, prefer a sanitised screenshot from that application, with no real private filenames or account details. Otherwise create a semantic HTML/SVG illustration. Do not use AI-generated UI text or copied screenshots from the reference products.

### 5.4 Capability strip

Use three compact icon-and-text items, with fine separators rather than large cards:

| Title | Description |
| --- | --- |
| File encryption | Uploaded file content is protected using AES encryption. |
| Protected keys | Each file's encryption key receives separate asymmetric protection. |
| Integrity verification | Verification checks help detect corrupted or altered data during retrieval. |

Do not write AES-256, RSA-OAEP, or another specific parameter unless confirmed by the project implementation.

### 5.5 Features section

**Anchor:** #features  
**Heading:** Familiar storage. Clear protection.  
**Introduction:** Manage your files through a straightforward interface, with security built into the storage and retrieval workflow.

Adapt Tailark Features 8 into an asymmetric composition: explanatory copy on one side, a meaningful security-summary panel on the other.

Feature content:
- **Encrypted file storage:** Store encrypted file content in cloud storage.
- **Separate key protection:** Protect the unique AES key associated with each uploaded file.
- **Controlled access:** Authenticate users and check permission before releasing stored data.
- **Verified retrieval:** Provide clear feedback when retrieval and the required integrity checks succeed or fail.

Display algorithm names only when they match the implementation. The visual panel should communicate these four concepts using labelled icons, not a fabricated security score.

### 5.6 How it works section

**Anchor:** #how-it-works  
**Heading:** From upload to protected storage.

Adapt chamaac's connected process cards into four steps:

| Step | Title | Copy |
| --- | --- | --- |
| 01 | Select your file | Choose a file from your device. |
| 02 | Encrypt the content | The system encrypts the file using a unique AES key. |
| 03 | Protect the file key | Asymmetric encryption protects the AES key separately. |
| 04 | Store securely | The encrypted file and protected key are stored for authorised retrieval. |

**Retrieval note:**  
When you retrieve a file, the system checks access, recovers its protected key using the required cryptographic credentials, decrypts the content, and completes the required integrity verification before providing the original file.

Adapt this note to the authoritative project workflow if the exact check order differs. If explaining where encryption happens, use the agreed architecture: do not move browser operations to the backend or vice versa in the page's copy.

Use static connectors by default. Optional scroll reveal should enhance comprehension without hiding content or forcing visitors through a pinned sequence.

### 5.7 Security explanation

**Anchor:** #security  
**Heading:** Two methods. One protected workflow.

Use two equal explanatory panels:
- **AES protects file content.** Symmetric encryption handles the file data. Each uploaded file uses its own generated encryption key.
- **Asymmetric encryption protects the key.** The AES key is protected separately and recovered using the appropriate cryptographic credentials.

Supporting paragraph:
Authentication controls entry to the system. Access checks govern file retrieval. Integrity verification helps identify data that fails the system's required checks.

Use a small file/key illustration or labelled diagram. Avoid dumping ciphertext, source code, or large technical specifications into the page.

“End-to-end encrypted,” “zero-knowledge,” and “only you can decrypt” must appear only if the actual architecture and threat model support those claims. AES plus asymmetric key protection alone is not enough to establish them.

### 5.8 FAQs

Use a simple accessible accordion with four or five questions. Content must remain usable without animation.

**What happens to my uploaded files?**  
Their content is encrypted, and the encrypted data is stored in cloud storage. The system keeps the information needed for authorised retrieval.

**Do I need to enter an AES key for every download?**  
The application manages each file's AES key through its protected-key workflow. Users should not be asked to manually copy or type AES keys.

**Why use both AES and asymmetric encryption?**  
AES handles file-content encryption, while asymmetric encryption protects the AES key.

**What is a vault passphrase?**  
In the agreed vault workflow, it is a separate secret used to unlock the protected cryptographic credentials needed for file operations. It has a different purpose from the account-login password.

**Can I recover my files if I lose my vault passphrase?**  
Recovery depends on the implemented recovery or backup mechanism. Do not promise that an account-password reset restores access to encrypted files. If there is no file-recovery mechanism, say that losing the required credentials can make the files inaccessible.

Before publishing, align the vault FAQ wording with the authoritative project direction and real recovery functionality. Do not invent a recovery feature.

### 5.9 Final CTA

**Heading:** Start your secure file workspace.  
**Copy:** Create an account to begin storing and retrieving protected files.  
**Button:** Create account  
**Secondary link:** Already have an account? Sign in

Use a broad dark panel with a fine border and modest blue accent. Keep this section visually quieter than the hero.

### 5.10 Footer

Show:
- Wordmark.
- “An academic prototype exploring hybrid encryption for secure cloud storage.”
- Features, How it works, Security, Sign in.
- Current year.

Add privacy, terms, source-code, or project-documentation links only if they exist. Do not create empty destinations.

## 6. Motion and responsive behaviour

Motion:
- Hover/focus transitions: approximately 150–200 ms.
- Optional one-time fade/translate reveal with a small movement.
- Respect prefers-reduced-motion.
- No autoplay video, continuous particles, glitch effects, animated ciphertext, or mandatory parallax.

Responsive:
- Desktop: centred hero with full-width preview below; features can use two columns.
- Tablet: reduce horizontal padding and preview density.
- Mobile: single-column sections, stacked process cards, readable simplified preview.
- Allow CTA labels to fit without truncation.
- Ensure no horizontal overflow at approximately 375 px width.
- Avoid fixed hero heights that clip larger text.

## 7. Accessibility and implementation guidance

- Use semantic header, nav, main, section, and footer elements.
- Use one h1 and logical heading order.
- Make CTAs genuine links when they navigate.
- Give icon-only controls accessible names.
- Use visible keyboard focus on every interactive element.
- Mobile menu and FAQ controls need appropriate expanded-state semantics.
- Use text and icons together for status examples.
- Support keyboard access, enlarged text, and reduced motion.
- Keep decorative imagery out of the accessibility tree.
- If using a screenshot, provide meaningful alt text.
- Lazy-load below-fold images; avoid delaying the main hero asset unnecessarily.

Respect the existing frontend framework. React, TypeScript, Tailwind, and shadcn/ui are compatible with the references, but this task is not permission to migrate the project.

Suggested landing-only components:
- LandingNavbar
- LandingHero
- WorkspacePreview
- CapabilityStrip
- LandingFeatures
- HowItWorks
- SecurityExplanation
- LandingFaq
- FinalCta
- LandingFooter

Use shared tokens and consistent primitives. Reuse an existing component library where practical. Keep external dependencies proportionate to the page: a static process section should not require a large animation package.

For 21st.dev components:
1. Inspect the current preview, code, dependencies, and licence.
2. Use the component's Copy prompt or reviewed source as an implementation starting point.
3. Replace demo copy, imagery, links, and brands.
4. Apply the page's theme tokens throughout.
5. Check mobile layouts and accessibility after adaptation.

## 8. Things to avoid

- Hacker/Matrix styling, neon green, terminal-heavy visuals.
- Giant generic padlocks as the hero's main content.
- Heavy glass blur behind readable content.
- Inconsistent styles from multiple component authors.
- Decorative analytics, fake security scores, or fake activity counters.
- Customer-logo strips, testimonials, and user counts for an unlaunched prototype.
- Pricing sections or enterprise plans without a real requirement.
- “Unhackable,” “100% secure,” “military-grade,” or unearned certifications.
- Unconfirmed security guarantees.
- Application features added just to make the landing page look fuller.

## 9. Acceptance criteria

The landing page is complete when:
- The hero communicates encrypted storage and protected keys without requiring technical expertise.
- Its main composition recognisably follows Hero Section 6, adapted to our theme.
- Features and workflow sections use the selected references coherently.
- All three 21st.dev links remain available in this brief for the agent.
- The preview shows a plausible file workspace and is visibly illustrative.
- Authentication CTAs and section links have real destinations.
- Technical copy matches the authoritative project architecture.
- No unsupported product, certification, or recovery claims appear.
- Mobile layouts, keyboard focus, FAQ interactions, and reduced motion have been checked.
- No authenticated application implementation has been added to this task.

## 10. Agent implementation prompt

Build only the public landing page for my final-year project: “Design and Implementation of a Hybrid Secure Cloud Storage System Using AES File Encryption and Asymmetric Key Protection.”

Follow this document as the design brief. Use deep navy backgrounds, restrained blue CTAs, Inter typography, fine borders, generous spacing, and a light illustrative file-workspace preview. Use the existing product name; otherwise treat VaultSpace as a placeholder.

Use these specific 21st.dev references:
- Hero Section 6: https://21st.dev/@meschacirung/components/hero-section-6
- Features 8: https://21st.dev/@meschacirung/components/features-8
- How It Works: https://21st.dev/@chamaac/components/how-it-works

Study and adapt their composition into one consistent design. Use the centred hero headline with a large product preview below. Include navigation, capability strip, features, a four-step upload explanation, security explanation, FAQs, final CTA, and academic-project footer.

Respect the existing stack and review source, dependencies, and licences before incorporating component code. Create a responsive, accessible page with working section anchors and authentication links. Keep the preview clearly illustrative.

Follow the project's authoritative architecture for security claims, browser/server responsibilities, vault passphrase, and recovery wording. Do not implement cryptography or the authenticated application in this task. Do not invent pricing, testimonials, user counts, certifications, or recovery capabilities.

