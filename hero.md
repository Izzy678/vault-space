# VaultSpace — Hero Redesign Direction

**Status:** Implementation brief for the next hero revision  
**Scope:** Landing-page hero, its animation, and its transition into the next section  
**Direction:** A cinematic flowing field surrounding a protected core, with a few recognisable files travelling through the scene  
**Reference:** The user-supplied recording of the QRONOS template preview from [21st.dev](https://21st.dev/), titled `Cap 2026-10-09 at 19.05.28.mp4`.

## 1. Explicit migration instruction

We are moving from the **current hero section** to the **new hero described in this document**.

The current hero uses a large circular vault dial/orbit behind centred text: concentric rings, radial ticks, a central sphere or disc, a crosshair, rotating geometric outlines, a near-black background, and subtle red accents. It establishes a security atmosphere, but most of its visual interest sits in the centre. The sides feel inactive, and the graphic communicates an abstract security system more clearly than cloud file storage.

Replace that dominant dial composition with a flowing field that occupies the wider hero. Introduce a small number of document objects that belong to the flow. Preserve the useful foundation: VaultSpace branding, dark monochrome palette, restrained red accents, readable centred copy, and clear account-creation action.

This is a change in the hero's visual system, not just an instruction to add files on top of the existing orbit. The full old dial and the full new vortex must not run together.

| Current element | Migration action | New treatment |
| --- | --- | --- |
| Large central dial with numerous concentric rings | Replace | Flowing strands sweeping through the wider scene |
| Radial ticks and crosshair | Remove as dominant motifs | Sparse path details and occasional subtle points of light |
| Large rotating square/diamond outlines | Remove | Curved paths with a sense of depth |
| Heavy central sphere/disc | Rework | A quiet protected core with restrained edge lighting |
| Floating VAULT lettering | Remove | Recognisable document silhouettes |
| Black/white/red palette | Retain and refine | Near-black surfaces, silver-grey strands, minimal deep red |
| Balanced two-line headline | Retain | Stable, prominent foreground text |
| Primary and secondary hero buttons | Retain | Functional links using existing application routes |
| Technical paragraph beneath the buttons | Keep out of the hero | Explain encryption in the security section |
| Blocky skyline/pixel transition from earlier versions | Remove if still present | Flow fading into the next section |

## 2. Intended impression

The hero should feel private, controlled, dimensional, and alive. It should suggest files moving through a protected environment rather than a decorative radar display.

A visitor should quickly understand:

1. VaultSpace is encrypted cloud storage.
2. The product helps them protect and retrieve their files.
3. Creating an account is the main next step.

The visual must reward attention without requiring the visitor to watch a complete animation to understand the product.

## 3. How to use the reference

The QRONOS recording shows a fine monochrome field that narrows through the centre and expands above and below the content. The broad sweeps and layered strands give the composition depth. A moving logo strip also occupies its lower edge.

Borrow these principles:

- Broad flowing geometry that connects different parts of the hero.
- Fine lines and restrained highlights rather than large coloured surfaces.
- A sense of near and distant layers.
- Stable text surrounded by movement.
- A deliberate use of the lower edge of the composition.

Adapt the reference to VaultSpace:

- Protect the reading area. The reference's bright central strands cross behind text; our version must be quieter there.
- Give movement a storage-related meaning through document objects.
- Introduce a protected core without rebuilding the old mechanical dial.
- Use a real product preview in the next section instead of borrowing the reference's brand-logo strip.

The recording is the visual reference. No exact component URL, source package, price, availability, or licence has been verified. Do not invent a component link or assume the code is freely reusable. If its source is used, verify its terms separately; the effect can also be implemented as an original composition.

## 4. Overall composition

Use a full-width dark scene below the existing navigation. Keep the headline, description, and buttons in a centred foreground content column.

The flowing field should sweep through the upper corners, around the sides of the copy, and into the lower portion of the hero. Avoid making a narrow bright funnel directly behind the paragraph. A slightly asymmetric sweep will feel more natural than perfectly mirrored rings.

Suggested scene placement on desktop:

| Region | Treatment |
| --- | --- |
| Upper left and upper right | Fine distant strands entering the scene |
| Left side, above the content midpoint | Nearest recognisable document object |
| Central reading area | Dark, calm space for headline, description, and actions |
| Centre, slightly below the headline | Subtle protected core, partially obscured by the reading mask |
| Right side, below the content midpoint | Smaller locked document or image object |
| Lower left or lower right | One distant file/folder silhouette, if needed |
| Bottom edge | Wider strands fading into the next section |

The decorative paths may be cropped by the scene boundary to suggest scale. Text, buttons, and meaningful navigation must never be cropped.

## 5. Visual layers and reading mask

Build the hero as separate layers so readability can be adjusted without destroying the atmosphere.

| Back-to-front order | Layer | Notes |
| --- | --- | --- |
| 1 | Near-black base | No blue or light-blue cast |
| 2 | Subtle ambient depth | Very faint charcoal shading and restrained red glow |
| 3 | Distant flow | Thin, low-contrast strands with sparse points |
| 4 | Protected core and nearer flow | Slightly brighter edges and greater depth |
| 5 | File objects | Sparse, recognisable silhouettes travelling along related paths |
| 6 | Reading mask | Soft dark gradient that quiets decoration behind the content |
| 7 | Hero content | Real HTML text and interactive buttons |
| 8 | Optional scroll cue | Quiet and subordinate to the primary action |

The reading mask should have a soft falloff. It must not appear as a rectangular panel behind the heading. Tune its shape to cover the paragraph and buttons as well as the headline.

Decorative elements must not pass in front of text or buttons at any point in their paths. Use depth, path placement, and masking to enforce this throughout the animation.

## 6. Palette and surface treatment

Starting tokens; adjust after checking the rendered scene:

| Role | Suggested value | Use |
| --- | --- | --- |
| Main background | `#080808` | Hero and navigation continuity |
| Secondary charcoal | `#151515` | Depth and document surfaces |
| Primary text | `#F5F5F5` | Heading and primary labels |
| Supporting text | `#B8B8B8` | Description |
| Fine strand colour | `#7A7A7A` | Render at restrained opacity |
| Strong strand highlight | `#B5B5B5` | Occasional edges, outside the reading area |
| Deep red accent | `#A52632` | Core rim, short path highlights, lock detail |
| Primary action | `#FFFFFF` / `#111111` | White surface and dark label |

The palette is deliberately monochrome with a small amount of red. Bright red must not dominate the scene or become a pulsing alarm colour. Avoid blue glows, multicolour gradients, and broad neon effects.

Depth should come from light, scale, overlap, and line density. Texture is optional and should be almost imperceptible. Do not add grain merely to fill space.

## 7. Hero copy and typography

Use the following as the default copy for this visual revision:

**Eyebrow:** `ENCRYPTED CLOUD STORAGE`

**Headline:**

> Your files. Protected  
> at every step.

**Description:**

> Store your files privately in the cloud. Unlock your vault and retrieve them whenever you need them.

**Primary action:** `Create account`  
**Secondary action:** `See how it works`

Keep the category explicit. The visual alone must not leave visitors guessing whether VaultSpace is a password manager, consultancy, or storage application.

Typography guidance:

- Reuse the site's existing font initially. Introduce a new font only if it clearly improves the complete design.
- Desktop headline starting range: 64–80 px, bold, with restrained negative tracking and a line height around 1.05–1.12.
- Desktop heading width: roughly 760–900 px; tune it to preserve the intentional two-line composition.
- Supporting text: approximately 18–20 px with comfortable line spacing and a width around 540–620 px.
- Eyebrow: approximately 11–13 px, moderately tracked, readable grey rather than alarm red.
- Do not leave `step.` alone on its own line.
- On narrow screens, allow sensible wrapping instead of forcing desktop line breaks that cause overflow.

Avoid adding an algorithm list, technical caption, fake testimonial, or fabricated user count to the hero. Any security promise must match the implemented product. This brief changes presentation; it does not authorise changes to cryptographic behaviour or recovery guarantees.

## 8. Actions and navigation

Preserve the current VaultSpace navigation and functional destinations. Maintain a clear separation between navigation and scene without introducing a heavy contrasting band.

The hero's `Create account` action should be the strongest action in the content area. Use an approximately 48–56 px button height with a comfortable click target. The secondary action should have a quieter dark surface and a visible border.

Connect `Create account` to the existing registration flow. Connect `See how it works` to the existing explanatory section or route. Do not invent new destinations or create non-functional buttons for visual completeness.

Navigation can retain its existing account actions. On mobile, keep branding and essential navigation usable independently of the animation.

## 9. Flowing field behaviour

The field should look like multiple fine paths belonging to one coherent structure. It must not resemble unrelated ribbons scattered around the page.

Use curved paths that broaden near the edges and converge near the protected core, while maintaining the dark reading area. Vary brightness gently to reveal different depths. A few small points may travel along the paths to suggest movement, but the scene must not become a particle storm.

Starting motion parameters:

- Broad field cycle: roughly 24–40 seconds.
- Small highlight travel: roughly 10–18 seconds.
- Low-amplitude drift; avoid rapid wobbling, aggressive twisting, or constant zoom.
- Continuous loops with no visible reset.
- Keep major geometry stable enough that the page does not appear to sway.

These are tuning ranges, not a requirement to animate every strand. A convincing scene may use mostly stable curves with a few moving highlights and files.

## 10. Protected core

The core is a subtle visual anchor representing the user's protected vault. It is not a literal depiction of a server performing encryption.

Use a quiet dimensional form: a dark sphere, rounded vault-like shape, or restrained luminous centre. Give it limited silver edge lighting and a small deep-red accent. Its presence should be sensed without turning into another giant flat disc behind the words.

Do not restore dense dial ticks, a targeting crosshair, or multiple large rotating polygons. Keep the core quieter than the headline and nearer documents.

## 11. Floating file objects

Use **3–4 files on desktop**, fewer on smaller screens. Count is a ceiling to start from, not a quota to fill.

Suggested objects:

| Object | Appearance | Position and motion |
| --- | --- | --- |
| Document | Folded corner, a few short content lines, optional `.pdf` label | Nearest object on a left-side path |
| Image | Small framed thumbnail with an abstract landscape outline | Right-side path, slightly farther away |
| Folder | Simple charcoal folder silhouette | Lower edge, distant and faint |
| Optional locked document | Small lock badge within the document shape | Short arc near the outer core boundary |

Files should feel like lightweight objects in the environment. Do not make them large glass dashboard cards, notifications, or random emoji. Use a consistent visual language, restrained silver edges, and minimal text.

Suggested starting sizes: around 72–120 px for the nearest desktop object and 40–70 px for distant objects. Keep the nearest object below the headline in visual prominence. Avoid high-detail miniature UI that cannot be read at its actual size.

Movement guidance:

- Travel along curved paths related to the field.
- Use slight scale and opacity changes to suggest depth.
- Limit tilt to a gentle angle; avoid tumbling documents.
- Offset timing so the objects do not move in synchrony.
- Keep all paths outside the protected reading area.
- Ensure file loops do not snap, teleport, or suddenly change scale.

Use fictional demo files only. The landing-page scene must not display a signed-in user's real file names or contents.

## 12. Optional file-protection sequence

A small narrative can make the animation meaningful:

1. A recognisable document moves along a path towards the protected region.
2. A restrained lock badge appears, or its visible content lines become abstract encrypted markings.
3. The protected document continues into the wider field.

Keep this understated and infrequent, approximately once per 12–20 seconds. It must not resemble a real upload progress indicator or promise an upload speed.

For the established browser-encryption architecture, the document must appear protected **before** it enters the area representing cloud storage. The protected core is a visual metaphor for the user's vault, not evidence that the backend receives plaintext and encrypts it. Do not change the architecture to fit the animation.

This sequence is optional. Implement the readable composition and basic motion first; add the sequence only if it strengthens the scene.

## 13. Entrance and interaction

The hero should be readable immediately. Entrance motion is a short refinement rather than a loading ceremony.

Suggested sequence:

| Time after first paint | Behaviour |
| --- | --- |
| Immediately | Navigation and meaningful hero content are available |
| First 0–400 ms | Field and core settle through a restrained fade |
| First 100–500 ms | Optional small opacity/position refinement on the content group |
| First 250–650 ms | File objects become visible and begin their slow loops |

Avoid letter-by-letter reveals, large content slides, and multi-second delays before buttons appear. If animation assets initialise slowly, retain the readable static hero while they load.

Optional pointer response should be subtle, with small scene offsets on devices that support a fine pointer. It must not be necessary to reveal content or understand the scene. Do not enable pointer-dependent effects on touch screens.

Do not make every element move independently in response to the cursor. The field should behave as one environment.

## 14. Bottom edge and next section

The reference's lower logo strip contributes to its visual density. VaultSpace should use product evidence rather than copying those brand logos.

Default treatment: broaden the flow near the bottom and fade it into a section showing the actual vault interface. The next section can begin close enough that the page feels continuous, rather than separated by a large empty gap.

If a useful product preview exists, a small upper slice may enter the bottom of the hero. Treat this as an enhancement after the main composition works. Do not create a full duplicate dashboard within the hero or use invented interface controls that misrepresent the application.

No pixel skyline, oversized black spacer, fake integration carousel, or sudden unrelated colour block at this boundary.

## 15. Responsive direction

The scene must be recomposed for smaller screens, rather than shrinking the entire desktop arrangement.

| Viewport | Composition |
| --- | --- |
| Large desktop | Wider flow, 3–4 files, centred copy, subtle core |
| Laptop | Narrower sweep, 2–3 files, intentional headline wrapping |
| Tablet | Flow concentrated above and below the content, 1–2 files |
| Mobile | Simplified arcs, at most 1–2 quiet objects near outer edges, strong reading mask |

Mobile requirements:

- Headline starting range around 36–46 px, adjusted to available width.
- Description around 16–18 px.
- Comfortable side padding, generally 20–24 px.
- Stack buttons when they cannot fit comfortably side by side.
- Keep the content's position stable when mobile browser chrome changes size.
- Use a sufficient content-based minimum height; do not force a fixed viewport height that clips actions.
- Remove any file whose path would overlap text at that size.
- Avoid a tall empty opening above the headline.
- Keep all meaningful content and actions accessible if decoration is disabled.

## 16. Accessibility and reduced motion

- Render the heading, description, and actions as semantic HTML.
- Keep exactly one page-level hero heading within the existing page hierarchy.
- Mark purely decorative scene elements as hidden from assistive technology and remove them from the tab order.
- Decorative layers must not intercept pointer events.
- Maintain readable text contrast at every animation position, including bright crossings and glow states.
- Preserve visible keyboard focus and meaningful link/button labels.
- Honour `prefers-reduced-motion`: show a static composition with recognisable files and no orbit travel, parallax, pulsing, or protection sequence.
- Avoid flashing and abrupt high-contrast changes.
- Users must not need animation, colour, or hover to understand the product.

## 17. Implementation approach

Inspect the existing frontend and hero component before selecting an approach. Reuse the project's established tooling where it can deliver the effect cleanly.

Possible approaches:

| Approach | Appropriate use |
| --- | --- |
| SVG and CSS | A restrained scene with manageable curve count, lightweight document vectors, and modest motion |
| Canvas background plus HTML/SVG files | A denser field where drawing many fine strands is more practical than maintaining many DOM nodes |
| Existing WebGL setup | Genuine depth or an established renderer already used in the project |

Choose the simplest approach that achieves the approved appearance. A new 3D framework is not automatically necessary. The source recording does not establish how its effect was implemented.

Suggested component responsibilities; adapt names to the repository:

- `HeroSection`: semantic content, layout, routes, and responsive structure.
- `HeroFlowField`: decorative curves, ambient depth, and scene motion.
- `ProtectedCore`: quiet central visual anchor.
- `FloatingFile`: consistent document/image/folder shapes and related paths.
- Shared scene configuration: density, opacity, paths, speed, and breakpoint adjustments.

Keep content separate from the renderer. The animation must not be required for the headline or actions to work. Reuse existing UI and animation dependencies where appropriate; remove unused assets and animation loops belonging to the old hero.

## 18. Performance and fallback

Performance is part of the design. The hero should feel calm because its motion is deliberate, not because the device is struggling.

- Provide a usable static first paint before any heavier renderer initialises.
- Reduce strand count, particles, resolution, and file count on smaller or constrained devices.
- Prefer restrained drawing and transform work over per-frame layout changes.
- Cap renderer resolution where needed instead of blindly using a high device pixel ratio.
- Pause decorative animation when the page is hidden or the hero is offscreen.
- Clean up animation loops, observers, and listeners when the component unmounts.
- Avoid adding a background video unless a measured comparison justifies its size and cost.
- Aim for smooth motion on a typical laptop, with a simpler stable scene on weaker devices.
- If the renderer fails or is unavailable, show the static field or a quiet dark hero with fully usable content.

Benchmark the revised page against the existing hero. Record any material load or rendering regression and simplify the effect before considering the migration complete.

## 19. Implementation sequence

1. Inspect the existing hero, navigation, registration route, explanatory section, and motion setup.
2. Preserve working content and actions; remove the dominant old dial and obsolete decorative elements.
3. Establish the new static flow composition with the protected reading area.
4. Set the category label, intentional headline wrapping, description, and buttons.
5. Add the quiet core and 2–3 file objects; resolve placement before adding more.
6. Add slow field movement and coherent file paths.
7. Adapt tablet/mobile composition and implement reduced-motion/static modes.
8. Add the optional protection sequence or lower product-preview slice only if the base scene benefits.
9. Review the scene across animation positions and viewports, then tune density and contrast.
10. Verify functionality and remove unused assets/dependencies introduced by the replaced hero.

Do not substitute unrelated page changes for completing this hero. Existing authentication, storage, and encryption behaviour remain governed by the project architecture.

## 20. Definition of done

### Visual acceptance

- [ ] The new flowing field replaces the full old dial composition.
- [ ] The sides have purposeful visual interest without becoming cluttered.
- [ ] The hero clearly identifies VaultSpace as encrypted cloud storage.
- [ ] The headline has deliberate line breaks and remains the strongest element.
- [ ] The paragraph and buttons remain readable throughout the complete motion cycle.
- [ ] There are only a few coherent file objects, positioned along related paths.
- [ ] The core has subtle depth and does not resemble another oversized flat disc.
- [ ] The palette remains black/charcoal/silver with restrained red, without blue lighting.
- [ ] The bottom transitions naturally into the next section.
- [ ] The scene feels like one environment rather than several unrelated effects.

### Functional and technical acceptance

- [ ] Account creation and explanatory links use working existing destinations.
- [ ] Keyboard navigation and visible focus work.
- [ ] No decorative element captures clicks or appears as an actionable control.
- [ ] Reduced-motion mode provides a complete static composition.
- [ ] Mobile content and buttons fit without horizontal overflow or clipping.
- [ ] The renderer can fail without breaking meaningful content.
- [ ] Decorative animation pauses appropriately and cleans up correctly.
- [ ] Motion remains smooth without unacceptable regression from the previous hero.
- [ ] Demo documents do not expose real user data or appear as live uploads.

### Review evidence

Provide desktop and mobile screenshots, a short recording of a complete representative motion sequence, and a reduced-motion screenshot. Check at approximately 1440, 1280, 768, and 390 px widths, plus a shorter laptop viewport. Inspect multiple animation positions for text overlap and abrupt resets. Use the actual vault interface when including a product preview.

## 21. Final instruction to the implementation agent

Implement this as a deliberate migration from VaultSpace's current circular dial hero to a flowing protected-file environment. Retain the strong dark palette and centred message, spread visual interest across the scene, and use a few documents to make the storage purpose tangible. Prioritise clear copy, readable actions, coherent movement, and a usable mobile/static version. Match the reference's depth and flow while creating an original VaultSpace composition.
