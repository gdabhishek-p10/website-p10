# CTI Discovery Brief and Solution Proposal

Oct 7, 2026 · @Abhishek

## Summary

Rupen Philloura, General Manager of CTI's Miami Cruise Terminal A, wants two things now: one connected view of terminal safety and asset management, and biometric identification for employees. He prefers integrating the systems he named (Octave Attune EAM, SafetyCulture, Honeywell) over adding another standalone tool.

We propose two pieces:

- **Safety and asset layer:** an integration layer, one dashboard and automated workflows across his existing systems, with AI monitoring added once the base works.
- **Employee biometrics:** an identity service that plugs into CTI's existing access control and workforce systems, built around consent and privacy.

Still to confirm with Rupen: which systems CTI runs today, how they share data now, whether the licences include API access, and the scope and legal approach for biometrics. These are listed in the last section.

## Prospect and company

**Rupen Philloura** is General Manager of Miami Cruise Terminal A, according to [CTI's team page](https://cruisetermint.com/team/). He has 20+ years in operations and transportation across the public and private sectors. Most recently he was Director of Terminal Operations, Customer Service and the Airport Operations Center at Miami International Airport, leading 200+ staff. Earlier he held senior roles at San Francisco and Tampa airports and ran an aviation consultancy. His LinkedIn profile could not be read automatically, so this comes from CTI's own page.

**Cruise Terminals International (CTI)** develops and operates cruise terminals and port infrastructure. Its team page says about 400 people work on its projects worldwide.

| Location | What CTI does there |
| --- | --- |
| Miami, USA | Owns and operates Terminal A at PortMiami under a long-term concession. 2.1M+ guests in 2024. 1,460-ft pier for Icon-class ships. Shore power completed August 2024. |
| Barcelona, Spain | Developing Terminal G for Royal Caribbean Group, set to open in 2026. |
| Fiumicino, Italy | Waterfront and cruise port development, about 600M euros. |
| Ravenna, Italy | Cruise terminal built as the first public-private partnership of its kind in Italy. |
| St. Thomas, USVI | Redevelopment of Crown Bay. |

Other people likely to matter: David Candib (SVP Commercial & Operations, ex-Carnival port operations) for the safety and operations side, and Sandra Guzman (Head of HR) for workforce and biometrics. Greg Lanter became CEO in January 2026. Sources: [CTI team page](https://cruisetermint.com/team/), [CTI Miami page](https://cruisetermint.com/destination/miami/).

## What Rupen asked for

These points come from our discussion notes.

**1. Terminal safety and asset management**

- How CTI can monitor safety issues across the terminal.
- How assets are tracked and managed.
- He named Hexagon Octave, SafetyCulture and Honeywell.
- The discussion was about integrating these systems, not creating another isolated tool.
- Topics covered: APIs, dashboards, workflow automation and possibly AI-driven safety monitoring.

**2. Employee biometrics**

- He asked specifically about biometric implementation for employees.
- Topics covered: employee identification and authentication, and how biometrics could connect with access control, attendance and workforce systems, and operational workflows.

The notes do not say whether his systems are disconnected today or what gap he wants closed. We should not assume either until he confirms.

## Terminal safety in plain terms

Terminal safety means keeping passengers, staff, contractors and equipment safe, and keeping the terminal compliant with the rules that apply to it.

**Why it is risky.** On ship turnaround day, thousands of passengers arrive, bags are moved, vehicles drive around and workers repair things, all within a few hours. Accidents can happen where people and vehicles mix, on wet floors, and when equipment fails. Other risk areas are fire and life safety, hazardous work such as work at height or electrical work, and crowd or medical emergencies.

**Who is responsible.** The terminal operator covers the building and its own staff. The cruise line covers the ship and often sets its own terminal requirements. The port authority sets port-wide rules, and regulators cover things like maritime security. No single party sees the whole picture.

**How it works day to day**

1. **Prevent:** write safety rules, train staff and plan for risks.
2. **Check:** inspect the building and equipment regularly with checklists.
3. **Spot problems:** alarms, cameras and staff reports show when something is wrong.
4. **Fix fast:** the control room sends the right person to deal with it.
5. **Record and learn:** log every incident, find the cause and make sure the fix is done.

In many organizations each step lives in a different tool. Whether that is true at CTI is a question for Rupen, not something we know.

## The three systems

Each tool answers a different question, and Attune EAM is the one to understand best.

| System | Simple role | Integration notes |
| --- | --- | --- |
| [Octave Attune EAM](https://www.octave.com/products/asset-performance-management/attune/eam) (formerly HxGN EAM) | "What equipment do we have, and is it maintained?" | Described as API-first on [G2](https://www.g2.com/products/octave-attune-eam-hxgn-eam/reviews). Octave's support job ad mentions REST and SOAP APIs. Supports SAML single sign-on. |
| [SafetyCulture](https://www.getapp.co.uk/software/102403/iauditor) | "Did staff check things, and what did they find?" | Has an open API for exporting inspection data. Some features sit on higher-priced plans. |
| [Honeywell building systems](https://buildings.honeywell.com/ca/en/automation/life-safety) | "Are alarms, cameras and doors working, and what is happening now?" | Fire and life safety, security, and one-screen building control. Access control and video sit under its security products. |

Octave is Hexagon's software business, now branded separately. The spin-off was still awaiting approval in the sources we found.

**What Attune EAM does**

- **Assets:** one record per piece of equipment, with location, history and details.
- **Work orders:** every repair or planned job, with the technician, parts and hours.
- **Inspections:** routes and checks on equipment. An out-of-range result can create a repair work order automatically.
- **Safety management:** hazards and precautions, permits to work, and lock-out/tag-out procedures.
- **Inventory and purchasing:** spare parts and stock levels.
- **Mobile app:** technicians can see and close work orders and record inspections, even offline.

**Automatic scheduling of regular servicing.** Preventive maintenance schedules generate work orders at a frequency or meter reading you set, for one item or a system of items (per [Octave's help docs](https://docs.hexagonppm.com/r/en-US/HxGN-EAM-Help/1275437)). For example, "inspect this item monthly" or "service after a set number of running hours." The work order then appears on the technician's mobile app. Alert management can also create work orders or send emails when conditions are met.

**AI in Octave.** Octave Aria is a built-in assistant that helps users search and understand EAM data and documents. Attune APM adds failure prediction from equipment data. This AI works inside Octave's own data, so our value is AI that looks across all three systems together. We have not confirmed which of these CTI has licensed.

**Overlap to clarify.** Attune EAM and SafetyCulture can both run inspections and trigger follow-up. We need to know how CTI splits that work, so the integration connects the tools instead of duplicating them.

## Proposed solution 1: unified safety and asset layer

We build a layer that sits on top of CTI's existing systems and replaces none of them.

- **Integration layer:** connectors that pull data from each system through its API or webhooks into one data model for incidents, inspections, alarms and assets.
- **Operations dashboard:** one live view for the terminal GM and operations team. It shows open safety issues by zone, overdue inspections, asset status and turnaround-day readiness, with drill-down into the source system.
- **Workflow automation:** rules that connect the systems. A failed inspection could create a work order in Attune EAM, notify the zone supervisor and escalate if it is not closed in time. An alarm could attach the asset's maintenance history automatically.
- **Single asset view:** each asset (gangway, conveyor, lift, fire system) linked to its maintenance history, inspections and incidents.
- **AI layer, added after the base works:** pattern detection across incidents and inspections to flag repeat problem areas, and plain-language summaries for daily or weekly reports. Video analytics on existing cameras, for example to spot missing PPE or blocked exits, is an optional pilot that needs a privacy review first.

The diagram below shows how data flows through the layer. The first build should be limited to what CTI's API access and licences allow.

&#91;embedded content: integration layer · 3 sources, 3 outputs\]

Each system keeps doing its own job. The layer reads from all three and feeds one dashboard, shared workflows and AI insights.

## Proposed solution 2: employee biometrics

Biometric identification should add to CTI's existing access and workforce systems, not replace them.

- **Identity layer:** biometric verification (face or fingerprint, depending on the hardware CTI prefers) for staff and contractors.
- **Access control link:** doors and restricted zones check the biometric against the person's role and permissions.
- **Attendance link:** verified clock-ins feed the attendance and workforce system, which reduces buddy punching.
- **Operational link:** the safety platform can show who was in a zone during an incident, and contractor induction and certification checks can be tied to access.
- **Privacy by design:** consent and opt-out handling, templates stored on the device or encrypted, retention limits and audit logs.

**Points to check before scoping**

- Terminal A is a US port facility, so staff access is probably already governed by rules such as TWIC and port or CBP requirements. Biometrics would likely supplement these, not replace them. Confirm with CTI.
- Florida has no biometric law like Illinois' BIPA that we are aware of, but CTI's counsel should confirm. If this extends to Italy or Spain, GDPR treats biometric data as special-category data. That needs a strong legal basis, a data protection impact assessment and often employee-representative consultation.
- Ask about union or workforce consultation, and whether HR (Sandra Guzman) owns the workforce-system side.

## Suggested phasing

Start small at Miami Terminal A and expand once the pilot proves value. Durations are our own rough estimates, to be confirmed after discovery.

1. **Discovery (about 2-3 weeks):** map CTI's current systems, APIs, access control hardware and TWIC and port requirements. Check what PortMiami and the cruise lines control.
2. **Safety and asset pilot (about 6-10 weeks):** the integration layer and dashboard for Terminal A, covering one or two of the three systems and a small set of workflows.
3. **Biometrics pilot:** one entry point or one staff group, integrated with the existing access control.
4. **Expand:** add the AI monitoring layer, then extend to Barcelona Terminal G, which opens in 2026 and is the easiest place to build this in from the start.

## Questions for the next call, and things to verify

**Questions for Rupen**

- [ ] Is this scoped to Miami Terminal A only, or all CTI sites?
- [ ] Who decides and who holds the budget: Rupen, David Candib (Commercial & Operations) or Sandra Guzman (HR) for the workforce side?
- [ ] Which of Attune EAM, SafetyCulture and Honeywell are live today, and which are only being considered?
- [ ] Is Attune EAM cloud or on-premise, and which version? Does the licence include API access? Is Aria or Attune APM used?
- [ ] How do you split inspections between Attune EAM and SafetyCulture, and how do the systems share data now?
- [ ] Where do things fall through the cracks today?
- [ ] Which access control and attendance systems must the biometrics connect to?
- [ ] Which three safety incident types do you most want to catch earlier?
- [ ] What are the timeline and the success measure?

**Things we have not verified**

- Octave's actual API documentation and which endpoints CTI's version exposes. Our evidence is a review site and a job ad.
- Current API terms and plans for SafetyCulture and Honeywell products at CTI.
- Legal position on biometrics in each CTI location, which needs CTI's counsel.
- Rupen's LinkedIn profile, which blocks automated access.

**Risks**

- Video analytics on existing cameras is the highest-risk piece for privacy and staff acceptance, so we position it as an optional pilot.
- Octave already sells AI, so a generic "AI for maintenance" pitch would overlap with it. Our angle is AI across all the systems.

## Sources

- [CTI team page](https://cruisetermint.com/team/)
- [CTI Miami page](https://cruisetermint.com/destination/miami/)
- [CTI home](https://cruisetermint.com/)
- [Octave brand launch](https://www.octave.com/newsroom/press-releases/2026/octave-launches-new-brand)
- [Octave Attune EAM product page](https://www.octave.com/products/asset-performance-management/attune/eam)
- [Octave Attune EAM overview](https://www.octave.com/eam)
- [Octave Attune](https://www.octave.com/ru/attune)
- [Attune EAM 12.3.1 release review](https://progressive-tsl.com/discover-whats-new-in-octave-attune-eam-12-3-1/)
- [Octave IDC MarketScape announcement](https://www.octave.com/newsroom/press-releases/2026/octave-named-leader-in-idc-marketscape)
- [G2 reviews of Attune EAM](https://www.g2.com/products/octave-attune-eam-hxgn-eam/reviews)
- [EAM safety management docs](https://docs.hexagonppm.com/r/en-US/EAM-System-Overview/1261945)
- [EAM inspection docs](https://docs.hexagonppm.com/r/en-US/EAM-System-Overview/1261939)
- [EAM Mobile docs](https://docs.hexagonppm.com/r/en-US/HxGN-EAM-Mobile-User/12.0/1262482)
- [EAM PM schedules help](https://docs.hexagonppm.com/r/en-US/HxGN-EAM-Help/1275437)
- [SafetyCulture on GetApp](https://www.getapp.co.uk/software/102403/iauditor)
- [SafetyCulture API connector docs](https://docs.nexla.com/user-guides/connectors/safetyculture_api)
- [Honeywell life safety](https://buildings.honeywell.com/ca/en/automation/life-safety)
- [Honeywell security](https://buildings.honeywell.com/pl/en/products/security)

Product details come from search results and vendor pages, not from hands-on testing. Search snippets were not all opened in full.