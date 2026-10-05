# PoC Portfolio: Buyer, Market Size and Priority Analysis (P&C Insurance, US + UK/Lloyd's)

*Prepared 1 October 2026.*

**Assumptions**
- The "[industry]" and "[geography]" placeholders were unfilled, so I used P&C insurance and US + UK/Lloyd's.
- The nine PoCs were read from the "PoC Portfolio at a Glance" screenshot.
- Anything marked **(A)** is my assumption, not a sourced fact.
- Source tags like [S3] point to the Sources list at the end.

---

## 1. Buyers: PoC-by-buyer matrix

● = primary buyer, ○ = secondary buyer. Sponsor roles are my judgment (A) and were not researched.

| # | PoC | US carriers | UK insurers / Lloyd's managing agents | MGAs / coverholders | Agencies / brokers | TPAs | Reinsurers | Likely internal sponsor (A) |
|---|---|---|---|---|---|---|---|---|
| 01 | Intelligent Underwriting Platform (commercial property) | ● | ● | ● | | | ○ | Chief Underwriting Officer, Head of Commercial Property |
| 02 | FNOL Triage & Routing | ● | ● | ○ | | ● | | Chief Claims Officer, Claims Transformation lead |
| 03 | CAT Surge: Real-Time Exposure & Response | ● | ● | ○ | | | ● | Head of Cat / Exposure Management, Chief Risk Officer |
| 04 | AI-Powered Subrogation Identification | ● | ○ | | | ● | | Head of Recovery / Subrogation, Chief Claims Officer, CFO |
| 05 | AI Fraud Scoring | ● | ● | ○ | | ○ | | Head of SIU / Fraud |
| 06 | Customer Churn / Retention Prediction | ● | ○ | ○ | ● | | | Chief Distribution or Customer Officer, Head of Retention |
| 07 | Prodigy: Agency Copilot | ○ (agency channel) | | ○ | ● | | | Agency principal, Operations Director |
| 08 | Sage: Policyholder Assistant | ● | ● | ○ | | ○ | | Chief Customer Officer, Head of Contact Centre |
| 09 | Bordereaux Processing for MGAs | ● (as capacity providers) | ● | ● | | ○ | ● | Head of Delegated Authority, MGA COO |

---

## 2. Buyer segments: counts

| Segment | Count | Unit | Source and notes | PoCs served |
|---|---|---|---|---|
| US P&C insurers | **~2,500+** | Legal entities | S&P analysed 2,500+ P&C entities [S1]. No reliable group count found. | 01–06, 08, 09 |
| US MGAs | **~700–1,100** | Legal entities | 850+ found in statutory filings plus ~250 small ones estimated, so ~1,100 [S3]. A second source says 700+ met the NAIC reporting threshold [S5]. A third says ~600 [S6]. | 01, 02, 03, 05, 06, 08, 09 |
| UK MGAs | **233–359** | Firms | 233 MGA Association members [S5]. 359 FCA-authorised London Market intermediaries including MGAs, 2024 [S9]. | 01, 09 |
| Lloyd's managing agents | **57** | Legal entities | Lloyd's, at 31 Dec 2025 [S7] | 01, 02, 03, 05, 08, 09 |
| Lloyd's syndicates | 103 | Syndicates (managed by the 57 agents) | [S7] | Not a separate buyer |
| Lloyd's coverholders | 3,015 | Approved entities, global | [S7] | 09 (mostly as bordereaux producers) |
| UK personal and commercial insurers | **274** | FCA-authorised firms, 2024 | [S9] | 02, 05, 06, 08 |
| All PRA-regulated UK insurers | 584 | All types, including life and ISPVs | [S10] | Cross-check only |
| US independent agencies | **~37,000** | Agencies, down from 39,000 in 2024 | Big "I" 2026 study [S12] | 06, 07 |
| UK P&C intermediaries | **3,921** | FCA-authorised firms, 2024, excluding appointed representatives | [S9] | 07 |
| US reinsurance carriers | **~219** | "Businesses" | IBISWorld [S14], low confidence | 03, 09 |
| TPAs | **No reliable count found** | n/a | Only market-size reports. Named leaders: Sedgwick, Crawford, CorVel, Charles Taylor [S15]. | 02, 04 |

### Overlaps (so they are not double-counted)

- US MGAs, UK MGAs and Lloyd's coverholders overlap heavily. US MGAs placed about $8.5B at Lloyd's [S4].
- Lloyd's managing agents appear in both the FCA and PRA lists.
- Some reinsurers sit in the US P&C carrier rankings, for example Everest Re and PartnerRe [S16].
- The US agency figure covers independent P&C agencies only. IBISWorld's 430,059 "brokers and agencies" is a much wider universe [S13].
- Entity counts overstate decision-makers, because buying decisions happen at group level.

---

## 3. Reality check: where raw counts overstate the market

### Concentration

- The top 10 US P&C groups hold about 48% of premium [S2]. The biggest carriers build in-house or buy enterprise suites.
- In the UK, 18 insurers make up over 80% of the PRA-regulated general insurance market [S11].
- About 30,000 of 39,000 US independent agencies earn under $1.25M in revenue [S13], so most have little budget.
- Only 19 US MGAs write $500M or more [S5].

### AI adoption

- UK insurers: 95% say they use AI, but that is a small sample of 118 firms across all financial services, and "using AI" is a loose definition [S17].
- US carriers: AI in production is at 22% [S21]. Another survey puts full adoption at 34%, up from 8% [S20, secondary].
- Underwriting: only 16% of P&C insurers use AI to augment underwriters, and 60% plan to by 2028 [S22, secondary].
- Claims, issuance and churn: 23% use AI for claims processing, 18% for policy issuance and 15% for churn prediction [S18].
- Agencies: AI use rose from 15% to 46% (2024 to 2026) [S12]. Those agencies are now harder to sell to.
- 67% of insurers and MGAs plan to raise AI spend [S19, secondary].

### Competitive crowding (my read of vendor landscapes, mostly vendor-written sources)

| PoC | Crowding | Who is in the way |
|---|---|---|
| 05 Fraud | Heaviest | Verisk, FRISS, Shift Technology and SAS lead detection [S23] |
| 02 FNOL | Heavy | Guidewire, Duck Creek, Snapsheet, Five Sigma and Shift hold FNOL and triage [S27] |
| 08 Sage | Heavy | Many voice and chat vendors with Guidewire and Duck Creek connectors [S27] |
| 03 CAT | Heavy at the modelling layer | Moody's RMS and Verisk dominate; ZestyAI and Cape Analytics take property-level risk [S26] |
| 07 Prodigy | Moderate to heavy | Applied (bought Planck and Cytora), Vertafore (Velocity AI, April 2026), Indemn, AgencyZoom [S28] |
| 01 Underwriting | Moderate to heavy | Cytora (now owned by Applied) and AIG's in-house assistant [S22, S28] |
| 09 Bordereaux | Heavy in London, lighter in the US | VIPR claims ~50% of Lloyd's managing agents (a vendor claim); Quantemplate and FurtherAI also compete [S25] |
| 04 Subrogation | Moderate | Shift, Avalon, CLARA, EXL and WNS [S24] |
| 06 Churn | Moderate | Earnix and Verisk analytics. Adoption is low (15%) [S18, S29]. |

---

## 3b. Addressable buyers per PoC

The raw counts above are sourced. The filters below are my assumptions (A), so treat the ranges as illustrative.

**Main assumption (A):** only **150–300 US carrier buying units** are realistic. That is the 2,500+ entities collapsed to groups, minus the top ~25 enterprise players, captives and tiny niche writers.

| # | PoC | Addressable buyers (A) | How I got there | Overstatement flag |
|---|---|---|---|---|
| 01 | Underwriting | **~500–900** | US MGAs 30–40% (~210–440), UK MGAs ~70–125, Lloyd's agents ~45, UK insurers ~80, US carriers 25% (~40–75) | Moderate |
| 09 | Bordereaux | **~500–800** | 50% of US and UK MGAs plus Lloyd's agents | High: the MGA pools overlap |
| 07 | Prodigy | **~4,000–5,000** | ~7,000–9,000 agencies above $1.25M revenue, less the 46% already using AI | High: low spend per agency |
| 02 | FNOL | **~150–250** | Auto-writing carriers (65%) plus ~50 UK | Heavy crowding |
| 08 | Sage | **~140–230** | Carriers with large service operations (60%) plus ~50 UK | Heavy crowding |
| 06 | Churn | **~125–200** | Personal-lines carriers (50%) plus ~50 UK; agency demand reaches you through their AMS vendor | Moderate |
| 04 | Subrogation | **~135–270, plus TPAs (uncounted)** | Claims-heavy carriers (90%) | Moderate |
| 05 | Fraud | **~150–250** | Same pool as FNOL | Heavy crowding |
| 03 | CAT | **~200–320** | Property carriers (70%) ~105–210, Lloyd's agents ~55, reinsurers ~40–55 | Heavy crowding |

---

## 4. Priority ranking

Each PoC is scored 1–5 on four criteria with equal weights; for crowding, 5 means the least crowded. The scores are my judgment (A).

| Rank | PoC | Buyers | Demand | Crowding | Deal and motion | Total |
|---|---|---|---|---|---|---|
| 1 | 01 Underwriting | 4 | 5 | 2 | 4 | **15** |
| 2 | 09 Bordereaux | 4 | 4 | 2 | 4 | **14** |
| 3= | 04 Subrogation | 3 | 3 | 3 | 4 | **13** |
| 3= | 07 Prodigy | 5 | 4 | 2 | 2 | **13** |
| 5 | 06 Churn | 3 | 3 | 3 | 3 | **12** |
| 6= | 02 FNOL | 3 | 4 | 1 | 3 | **11** |
| 6= | 05 Fraud | 3 | 4 | 1 | 3 | **11** |
| 8= | 03 CAT Surge | 3 | 3 | 1 | 3 | **10** |
| 8= | 08 Sage | 3 | 3 | 1 | 3 | **10** |

### Tier 1: lead with these

- **01 Underwriting.** Underwriting is where insurers expect AI to pay off most, yet only about 16% use it there today. Buyers are plentiful and deals are mid-to-large. Applied and Cytora are real competitors.
- **09 Bordereaux.** It has a clear pain point and a clear buyer. Compete in US program business and with carriers auditing MGAs, not head-on with VIPR in London.

### Tier 2: pursue selectively

- **04 Subrogation.** The ROI is measurable and only a few vendors compete. Evidence of demand is thin: the $15B "missed recoveries" figure comes from a vendor press release citing the NAIC [S24].
- **07 Prodigy.** The pool is the largest by far, but deal sizes are small, AMS vendors are bundling AI, and agencies say they lack AI knowledge (60%) [S12]. This works only through a channel or an AMS marketplace.
- **06 Churn.** Adoption is low (15%), which leaves room. Budget evidence is weak, and Earnix and the AMS vendors are adjacent.

### Tier 3: deprioritise, or bundle into other PoCs

- **02 FNOL, 05 Fraud, 08 Sage.** These sit in the most crowded segments and are often bundled into claims suites. Demand is real, but you would be displacing incumbents.
- **03 CAT Surge.** It's a narrow buyer pool, and Moody's and Verisk own the data and the models. Revisit it as a feature inside Underwriting.

---

## 5. What I did NOT research

- Deal sizes and sales cycles. Everything on these is my judgment, with only a few vendor price anecdotes.
- US carrier group counts. I found no reliable figure, so the 150–300 buying units are my assumption.
- TPA counts, in either the US or the UK. I also did not look at self-insureds, captives, risk retention groups, surplus lines or fronting carriers.
- Brokers and wholesalers, including the London market brokers, and US broker counts beyond independent agencies.
- Regulatory constraints on each PoC: NAIC AI model bulletins, state rules, FCA Consumer Duty and Colorado-style AI laws.
- Primary-source checks. Several adoption figures reached me through secondary blogs: Conning, WTW, AM Best and Grant Thornton via [S19, S20, S22]. I did not read the originals.
- Which vendors have already signed which carriers, and whether anyone has built your PoCs in-house.
- The sponsor roles in section 1, which I have not validated with any buyers.
- Segments outside US + UK/Lloyd's, including Canada, EU and Bermuda.
- Dating: the UK FCA firm counts are 2024 data, and the 3,921 intermediary figure may count differently from other years.

---

## Sources

- [S1] [S&P Global: 2025 US P&C market report](https://www.spglobal.com/market-intelligence/en/news-insights/research/2025-us-p-and-c-insurance-market-report-projects-stability-amid-broader-volatility)
- [S2] [Agency Checklists: NAIC 2025 market share, top P&C insurers](https://agencychecklists.com/2025/03/17/naic-2025-market-share-report-pc-insurers-74868/)
- [S3] [Insurance Journal: MGAs by the numbers (Conning)](https://www.insurancejournal.com/news/national/2025/07/09/830954.htm)
- [S4] [Conning: 2025 MGA study](https://www.conning.com/about-us/news/ir-pr---mga-2025)
- [S5] [Genasys: MGA briefing (secondary)](https://www.genasystech.com/mga-policy-administration-briefing/)
- [S6] [Beinsure: MGA rankings (low-quality source)](https://beinsure.com/top-ranking-mga-worldwide/)
- [S7] [Lloyd's: how the market works](https://www.lloyds.com/about-lloyds/our-market/lloyds-market)
- [S9] [FCA: authorised firms data, Feb 2025](https://www.fca.org.uk/freedom-information/information-authorised-firms-enforcement-outcomes-february-2025)
- [S10] [PRA Business Plan 2025/26](https://www.bankofengland.co.uk/prudential-regulation/publication/2025/april/pra-business-plan-2025-26)
- [S11] [PRA: 2026 DyGIST update](https://www.bankofengland.co.uk/prudential-regulation/publication/2025/july/update-on-2026-dygist)
- [S12] [ProgramBusiness: Big "I" 2026 Agency Universe Study](https://programbusiness.com/news/independent-agency-count-falls-to-37000-as-ai-use-marketing-spending-rise/)
- [S13] [Producerflow: US agency statistics (OPTIS estimate)](https://www.producerflow.com/blog/us-insurance-agency-producer-statistics)
- [S14] [IBISWorld: US reinsurance carriers](https://www.ibisworld.com/united-states/industry/reinsurance-carriers/1329/)
- [S15] [GlobeNewswire: TPA market report 2026](https://www.globenewswire.com/news-release/2026/04/27/3281499/0/en/insurance-third-party-administrators-tpas-global-market-report-2026-yoy-revenue-grew-by-32-billion-ai-driven-claims-automation-to-boost-insurance-tpa-growth-through-2030.html)
- [S16] [Reinsurance News: Top 100 US P&C insurers](https://www.reinsurancene.ws/top-100-u-s-property-casualty-insurance-companies/)
- [S17] [Bank of England / FCA: AI in UK financial services 2024](https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024)
- [S18] [Earnix: 2026 insurance trends report](https://earnix.com/newsroom/press-releases/ai-insurance-trends-report-2026/)
- [S19] [ScienceSoft: Q2 2026 insurance AI trends (secondary)](https://www.scnsoft.com/insurance/insurance-ai-trends)
- [S20] [Outcome Catalyst: insurance AI trends 2026 (secondary, cites Conning)](https://www.outcomecatalyst.com/blog/insurance-ai-data-trends-2026)
- [S21] [Roots: State of AI adoption in insurance 2025](https://www.roots.ai/hubfs/Reports%20and%20Whitepapers/Roots%20-%20State%20of%20AI%20Adoption%20in%20Insurance%202025.pdf)
- [S22] [Insuretech Trends: agentic AI in underwriting (secondary, cites WTW)](https://insuretechtrends.com/5-ways-agentic-ai-is-transforming-insurance-underwriting-in-2026/)
- [S23] [Hesper AI: fraud platforms 2026 (vendor)](https://gethesperai.com/blog/top-fraud-detection-platforms-2026/)
- [S24] [Guideflow: subrogation software 2026](https://www.guideflow.com/blog/subrogation-software) and [Reinsurance News: CLARA subrogation launch](https://www.reinsurancene.ws/clara-analytics-introduces-ai-enhanced-subrogation-detection-to-maximise-claim-recoveries/)
- [S25] [VIPR Solutions](https://www.viprsolutions.com/), [Quantemplate](https://www.quantemplate.com/solutions/bordereaux-management) and [FurtherAI](https://www.furtherai.com/blog/software-for-bordereaux-management) (all vendor sites)
- [S26] [Aon catastrophe risk management survey](https://www.aon.com/getmedia/8d001a7c-277d-4833-a1af-1c2ae7e37384/20250806-global-catastrophe-risk-mgmt-survey.pdf) and [Carrier Management: ZestyAI and Verisk launches](https://www.carriermanagement.com/news/2026/09/03/291681.htm)
- [S27] [Hesper AI: claims automation 2026 (vendor)](https://gethesperai.com/blog/insurance-claims-automation-2026-whats-automated/)
- [S28] [Applied Epic review](https://insuranceaitools.com/tools/applied-epic/) and [Vertafore AI](https://aiproplaybook.com/tools/vertafore-ai)
- [S29] [Insurify: Verisk retention report](https://insurify.com/car-insurance/news/insurers-use-ai-to-predict-customer-churn/)