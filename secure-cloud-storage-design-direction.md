# Design direction: Hybrid Secure Cloud Storage

Project: Design and Implementation of a Hybrid Secure Cloud Storage System Using AES File Encryption and Asymmetric Key Protection
Prepared: 7 October 2026
Purpose: An agent-ready visual and interaction brief for the landing page and authenticated web application. This document guides presentation; it does not define the cryptographic architecture.

## 1. Recommended aesthetic

Build a calm, precise secure workspace. Use deep navy, restrained blue accents, orderly typography, fine borders, and purposeful whitespace. The product should feel credible, approachable, and useful during a final-year-project demonstration.

Use a dark landing page for a strong first impression and a light application for extended file-management tasks. Connect both with the same logo, blue accent, typography, icon family, spacing, and component shapes. Dark mode in the application is optional and should follow completion of the core light theme.

Working product name: VaultSpace. Treat this as a placeholder, not an established or availability-checked brand.

Three possible directions:

| Direction | Visual character | Best fit | Trade-off |
| --- | --- | --- | --- |
| Secure workspace — recommended | Navy landing page, light app, blue actions, structured layouts | A polished, practical academic prototype | Requires careful consistency between the two surfaces |
| Privacy-first minimalism | Mostly white, soft neutral backgrounds, generous spacing | A friendly personal-storage service | May need stronger technical detail to distinguish this project |
| Technical console | Charcoal app, dense information, monospace metadata, restrained cyan | A developer or administrator tool | Less welcoming for everyday file users |

Use the first direction. Bring the clarity of the second into normal workflows and reserve console-like metadata for expandable technical details.

## 2. Inspiration references

Inspect the linked pages and public product screenshots. Borrow layout principles, not logos, exact copy, proprietary illustrations, or product claims.

| Reference | Link | What to study |
| --- | --- | --- |
| Proton Drive | https://proton.me/drive | Product imagery, approachable file-storage communication, familiar file-management patterns |
| Tresorit | https://tresorit.com/ | Security explanations, controlled access as a product benefit, credible presentation of file workflows |
| Linear UI design article | https://linear.app/now/how-we-redesigned-the-linear-ui | Sidebar alignment, hierarchy, information density, neutral surfaces, light/dark theme relationships |

These are design references, not a claim that this prototype has their security properties, certifications, or features.

Optional image-search terms:
- Proton Drive web app file manager screenshot
- Linear light theme sidebar interface
- secure cloud storage dashboard UI
- navy SaaS landing page product preview
- encrypted file upload progress interface

## 3. Visual system

### Colour tokens

| Token | Hex | Use |
| --- | --- | --- |
| landing-background | #0B1220 | Landing page base |
| landing-surface | #111C30 | Dark product-preview frame and technical sections |
| landing-text | #F8FAFC | Main text on dark backgrounds |
| landing-muted | #B8C5D8 | Supporting text on dark backgrounds |
| app-background | #F6F8FB | Main application canvas |
| surface | #FFFFFF | Tables, forms, dialogs, panels |
| text-primary | #0F172A | Main text in application |
| text-secondary | #526174 | Secondary labels and help text |
| border | #DCE3EC | Structural separators; not a substitute for focus outlines |
| primary | #2563EB | Main action and selected navigation |
| primary-hover | #1D4ED8 | Primary button hover |
| success | #15803D | Confirmed successful operations |
| warning | #B45309 | Warnings and pending attention |
| danger | #B91C1C | Failures and destructive actions |

Use white text on the primary blue button. Use green for verified results, not as a second competing brand colour. Verify actual text, focus, and control contrast in their rendered combinations. Never rely on colour alone to communicate status.

### Typography and shape

- Use Inter or a comparable highly readable sans serif; provide a system-font fallback.
- Use a monospace family only for file IDs, fingerprints, checksums, and selected technical values.
- Landing heading: approximately 56–64 px on desktop, 34–40 px on mobile; no more than three lines.
- Application page titles: 24–28 px.
- Body: 16 px; table and form labels: 14 px; secondary metadata: 12–13 px.
- Use a 4 px spacing base, with common gaps of 8, 12, 16, 24, 32, and 48 px.
- Buttons and inputs: 8 px radius. Cards and panels: 12 px. Large hero preview: 16 px.
- Use subtle shadows for floating panels and dialogs. Prefer borders for ordinary tables and cards.
- Use one consistent outline icon set. Pair important icons with labels.

### Imagery and movement

Use a real interface preview as the hero visual. A simple geometric file/key motif can support it. Create these with SVG or CSS for sharpness and easy implementation.

Keep animation short and functional: 120–200 ms hover transitions, upload progress, panel opening. Respect reduced-motion preferences. Avoid continuous background animation.

## 4. Landing-page composition

### Navigation

Place the wordmark on the left. On the right: Features, How it works, Security, Sign in, and a primary Create account button. Each link must lead to an implemented route or section.

### Hero

Use a two-column layout inside an approximately 1200 px container.

Left:
- Small eyebrow: SECURE CLOUD STORAGE
- Headline: “Your files. Protected at every step.”
- Supporting copy: “Store and retrieve encrypted files with protected encryption keys and controlled access.”
- Primary CTA: Create account
- Secondary CTA: See how it works

Right:
- A large, realistic preview of the file workspace.
- Show a few plausible files with readable names, sizes, and encryption states.
- Show a selected file with compact security details.
- Any static preview or sample data must be labelled as illustrative.

Use a restrained background glow behind the preview if it improves depth. Keep text surfaces opaque and readable.

### Capability strip

Show three concise capabilities directly below the hero:
1. File encryption
2. Protected encryption keys
3. Integrity verification

Use actual implemented algorithm names only after backend decisions are confirmed.

### How it works

Explain upload and retrieval in ordinary language:
- Upload: file encryption → encryption-key protection → encrypted storage.
- Retrieval: authorisation → key recovery → decryption and integrity checks → download.

Use a small accurate diagram or sequence of labelled panels. The location of encryption and decryption must match the implemented architecture; do not imply browser-side processing if it happens on the server.

### Feature sections

Show one feature with a relevant interface crop at a time:
- Manage encrypted files.
- Understand file protection through readable details.
- Retrieve files with clear operation feedback.

A small asymmetrical feature grid is acceptable. Avoid a page composed entirely of identical feature cards.

### Security explanation and footer

Provide a brief explanation of symmetric file encryption and asymmetric key protection. Link to a fuller technical explanation if implemented.

Finish with a single account-creation CTA and a restrained footer identifying the academic project.

Do not add pricing, customer-logo strips, invented testimonials, certification badges, or unsupported usage counts.

## 5. Application layout

### Application shell

Desktop:
- Approximately 232 px left sidebar.
- Approximately 64 px top bar.
- Main content with 24–32 px padding.
- Optional 360–400 px file-detail panel, only when there is sufficient viewport width.

Sidebar:
- My files — default screen.
- Activity — only if backed by actual logged events.
- Security — account and key-management information.
- Settings.

Show storage usage only if a real quota and usage measurement exist. Show Shared files, Trash, folders, and admin navigation only when implemented.

Top bar:
- Page heading or breadcrumb.
- File search within the user's authorised file set.
- Account menu.
- One dominant Upload files action.

### My files

Make the file list the central workspace. Avoid leading with a row of decorative analytics cards.

Table columns:
- File name and file-type icon.
- Size.
- Uploaded date.
- Encryption state.
- Row action menu.

Show integrity status in the list only if the backend exposes meaningful verification state and time. Prefer a fuller explanation in file details.

Interactions:
- Clicking a file opens its detail panel.
- A visible row action or menu provides Download and Delete.
- Add Rename only if the product supports it.
- Multi-select and bulk operations are optional; do not make them core dependencies.
- Long names truncate with access to the full value.
- Sorting reflects actual data, and search cannot expose other users' files.

### File-detail panel

Use progressive disclosure.

Default section:
- Full filename, size, uploaded date.
- Encryption state.
- Key-protection state.
- Integrity result, what was checked, and last verification time where available.
- Download and Delete actions.

Expandable Technical details section:
- Actual encryption algorithm.
- Actual asymmetric protection scheme.
- Key identifier and public-key fingerprint if available.
- File identifier.
- Integrity mechanism and relevant verification metadata.

Never display raw private keys, plaintext AES keys, passwords, session tokens, or other secrets. Do not use the panel as a secret-key viewer.

## 6. Essential interaction states

### Upload

Provide a click-to-select input and keyboard-accessible drag-and-drop area. Show supported file limits from actual configuration.

Use a queue with filename, size, progress, and per-file state. The displayed stages must correspond to real operation signals.

Possible stages:
- Preparing
- Encrypting
- Protecting key
- Uploading
- Complete
- Failed

The backend may perform some of these together. In that case, show a truthful combined state such as “Processing securely” rather than invented granular progress. Do not animate a fake percentage for cryptographic work.

Only mark a file as stored after the server confirms the required file and metadata writes. Expose retries or cancellation only when supported.

### Download

Show preparation progress, then the file download. If authorisation, key recovery, decryption, or the required integrity check fails, show a clear failure and do not present the operation as successful.

Integrity labels should distinguish:
- Not checked.
- Check in progress.
- Verified at a stated time.
- Verification failed.

A historical verification result must not be presented as a fresh download-time check. The wording must match whether the system checks ciphertext, decrypted content, authenticated encryption, or another mechanism.

### Key setup and recovery

The security screen follows the chosen architecture:
- Explain which credentials are needed to recover file keys.
- Present key import, export, backup, or recovery actions only when supported.
- Explain loss-of-access implications accurately.
- Treat account-password reset and recovery of encrypted files as separate concerns when the implementation makes them separate.
- Never imply that AES plus asymmetric protection alone guarantees zero-knowledge or end-to-end encryption.

If a supported key-backup flow exports private material, use an explicit dedicated flow that accurately describes its protection. Do not expose it as ordinary file metadata.

### Other required states

Design loading, no files, no search matches, upload failure, download failure, unauthorised access, expired session, and deletion confirmation. Use specific messages rather than generic “Something went wrong” copy.

Empty files state:
- Title: “Your secure workspace is ready.”
- Description: “Upload your first file to get started.”
- Primary action: Upload file.

Deletion confirmation should name the target and describe the actual deletion/recovery behaviour.

## 7. Responsive and accessibility requirements

- At narrow widths, collapse navigation into a drawer.
- Stack the landing hero copy above the preview.
- Render essential file information as a compact mobile list; open details as a full page or accessible sheet.
- At intermediate widths, open file details in an overlay rather than squeezing the table.
- Ensure visible keyboard focus, labelled fields, accessible dialogs, and sensible focus restoration.
- Use touch targets of approximately 44 px for primary mobile controls.
- Announce upload and verification completion/failure without flooding assistive technology with progress changes.
- Show text and an icon for statuses.
- Support long filenames, enlarged text, and reduced motion.

## 8. Implementation guidance

Respect the project's chosen framework and installed libraries. Do not migrate the stack for visual reasons.

For a React frontend, reusable components might include:
- AppShell and Sidebar
- FileTable and FileRow
- FileDetails
- UploadDialog and UploadQueue
- StatusBadge
- EmptyState
- ConfirmDeleteDialog
- TechnicalDetails
- LandingHero and HowItWorks

Use semantic theme tokens instead of scattered colour literals. Share primitives across landing and app while allowing distinct surface colours.

Keep encryption, integrity, and access states separate in the data model presented to the UI. A green “Encrypted” label must never stand in for a successful integrity check or an access-control decision.

Build in this order:
1. Theme tokens and shared controls.
2. Application shell and My files.
3. Upload and retrieval states.
4. File details and security screen.
5. Landing page using the established app preview.
6. Responsive and accessibility refinement.

For visual prototypes, use a clearly labelled demo mode. Real operation success must depend on real API responses.

## 9. Avoid

- Neon green hacker styling, Matrix text, glitch effects, or terminal screens as the main interface.
- Giant floating locks as the principal hero content.
- Heavy glass blur behind tables or important text.
- Unrelated stock photography.
- Large gradients on every card.
- Multiple competing accent colours.
- Security scores without a defined calculation.
- “Unhackable,” “100% secure,” “military-grade,” or unverified certification claims.
- End-to-end or zero-knowledge claims without an architecture that supports them.
- Features that expand the project scope merely to fill a dashboard.

## 10. Completion criteria

The design is ready when:
- A new user can find Upload immediately.
- A file's encryption, key protection, and integrity information are understandable.
- A complete upload and download can be demonstrated with truthful states.
- Failure paths are clear and recoverable where supported.
- The landing page reflects the actual application and implemented security model.
- Mobile, keyboard, long-filename, loading, and empty states have been checked.
- The interface feels coherent across landing, authentication, workspace, and security screens.

## 11. Short prompt to give the implementation agent

Design and implement a calm, precise secure-cloud-storage interface for my final-year project: “Design and Implementation of a Hybrid Secure Cloud Storage System Using AES File Encryption and Asymmetric Key Protection.”

Use a deep-navy landing page and a light file-management application, connected by Inter typography, blue primary actions, subtle borders, consistent outline icons, and restrained motion. Study Proton Drive for storage presentation, Tresorit for security explanations, and Linear's UI design article for sidebar alignment and information hierarchy.

Make the application file-first: a left sidebar, top toolbar with Upload files, readable file table, upload queue, and file-detail panel. Make encryption state, key protection, and integrity results visible without overwhelming normal workflows. Put algorithm values and fingerprints in expandable technical details. Never expose secrets.

Use a real application preview in the landing hero, followed by the project's three core capabilities, an accurate how-it-works explanation, a security section, and a clear CTA. Do not invent testimonials, security certifications, pricing, or unsupported features.

Follow this full brief for colours, spacing, interaction states, responsive behaviour, scope, and acceptance criteria. Respect the existing stack. Use real API responses for operation states and label any prototype data clearly. Security claims and the location of cryptographic processing must match the implemented architecture.

