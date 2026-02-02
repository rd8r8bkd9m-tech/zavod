# Content Factory Development Roadmap

## Sprint 1: Architecture & Brand DNA (Current)
**Goal:** Move from "random generation" to "structured campaigns" and deep brand understanding.
- [x] **Structured Brand Memory:** Replace simple text field with a detailed profile (Audience, USP, Tone, Forbidden terms).
- [x] **Campaign Entity:** Introduce "Campaigns" to group content by marketing objective (e.g., "Summer Sale", "Product Launch").
- [x] **Prompt Engineering V2:** Update Gemini service to inject specific brand attributes into every prompt.
- [x] **Campaign Dashboard:** New UI to manage campaigns and view aggregated stats.

## Sprint 2: The Visual Studio
**Goal:** Add capability to generate and manage visual assets.
- [ ] **Image Generation UI:** Interface for Prompt-to-Image (Flux/Midjourney simulation or API).
- [ ] **Asset Gallery:** Digital Asset Management (DAM) system to store uploaded logos and generated images.
- [ ] **Image Editor:** Basic cropping/overlay functionality (e.g., adding text to an image).
- [ ] **Multimedia Posts:** Update `ContentItem` to support image attachments.

## Sprint 3: The Publishing Engine
**Goal:** Move from "Drafting" to "Real-world Distribution".
- [ ] **Job Queue System:** Implement a client-side queue (or server prep) for scheduled tasks.
- [ ] **VK & WordPress Integrations:** Implement real API calls for these platforms.
- [ ] **Status Workflow Enforcement:** Strict state machine (Draft -> Approval -> Scheduled -> Published).
- [ ] **Export Packages:** "Download ZIP" feature for manual platforms (video file + text file + cover).

## Sprint 4: Autonomous Agents 2.0
**Goal:** True "Set and Forget" functionality.
- [ ] **News Monitoring Agent:** Agent that actively scrapes (simulated) RSS/News sources for specific keywords.
- [ ] **Repurposing Agent:** Automatically watches a YouTube channel and drafts posts whenever a new video is uploaded.
- [ ] **Multi-Step Chains:** Chains of thought (e.g., Research -> Outline -> Write -> Criticize -> Refine).

## Sprint 5: Analytics & Monetization
**Goal:** Business intelligence and SaaS features.
- [ ] **Aggregated Analytics:** Dashboard merging data from Telegram, VK, and Web.
- [ ] **Team Collaboration:** Comments, "Request Changes", and role-based access (Viewer/Editor).
- [ ] **Billing Integration:** Credit usage tracking and Stripe checkout simulation.
- [ ] **Performance Reports:** PDF export of monthly content performance.
