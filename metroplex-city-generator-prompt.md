# Metroplex Metal Roofs — City Page Generator
# Hermes Prompt Template for Batch City Generation
# Updated: June 2026
# Run once per city — output is a valid CITY_DATA JSON object

---

## MODEL ROUTING — READ FIRST

This workflow uses a **two-pass system per city** to minimize API cost without sacrificing content quality.

### When to use Haiku (`claude-haiku-4-5`)
Use Haiku for all **structured data lookups** — fields that are factual, deterministic, and don't require prose judgment:
- `zip` — primary zip code lookup
- `slug` — URL-safe slug generation
- `metaTitle` — keyword-formula fill (under 60 chars, templated)
- `metaDesc` — keyword-formula fill (under 155 chars, templated)
- `localStat.val` — median home value lookup
- `nearbyCities` — geographically adjacent city list
- `neighborhoods` — real subdivision/community names

Also use Haiku for:
- JSON validation checks on Sonnet output
- Retry formatting on failed validation
- WordPress REST API post formatting

### When to use Sonnet (`claude-sonnet-4-6`)
Use Sonnet for all **prose fields** — content that goes directly on the website and must read as locally authentic:
- `heroHeadline` — city-specific two-line hook
- `heroSub` — 2-sentence neighborhood-aware subheadline
- `localContext` — 3-sentence hail/deductible/market paragraph
- `hoaNote` — conditional HOA guidance paragraph
- `review.text` — homeowner testimonial copy
- `review.name` / `review.neighborhood` — realistic local names

### Cost estimate at this split
~40% of fields go to Haiku, ~60% to Sonnet.
40 cities × 2 calls = 80 API calls total (~$0.40 Sonnet + ~$0.02 Haiku = ~$0.42 total batch).

---

## PASS 1 — HAIKU: STRUCTURED DATA

**Model:** `claude-haiku-4-5`
**Max tokens:** 600

### System prompt (Pass 1)
You are a data lookup assistant. Return ONLY a valid JSON object — containing ONLY prose fields — see field list below. The structured data fields will be merged in by Hermes. No preamble, no markdown fences, no explanation. The object must be parseable by JSON.parse().

### User prompt template (Pass 1)
Return structured data for {{CITY_NAME}}, TX ({{COUNTY}} County, {{REGION}} region of DFW).

Return a JSON object with exactly these fields:

```json
{
  "name": "{{CITY_NAME}}",
  "state": "TX",
  "county": "{{COUNTY}}",
  "region": "{{REGION}}",
  "zip": "<primary zip code>",
  "slug": "<url-safe lowercase, e.g. flower-mound>",
  "metaTitle": "<max 60 chars — Metal Roofing {{CITY_NAME}} TX | Metroplex Metal Roofs>",
  "metaDesc": "<max 155 chars — include primary keyword, 1 local detail, soft CTA>",
  "localStat": {
    "val": "<median home value, format $XXXk or $X.XM, 2024-2025 data>",
    "label": "Median Home Value",
    "source": "{{CITY_NAME}}, TX 2025"
  },
  "neighborhoods": [
    "<8-12 real, well-known subdivisions or master-planned communities. Proper capitalization. No invented names.>"
  ],
  "nearbyCities": [
    { "name": "<City>", "slug": "<url-slug>" }
  ]
}
```

RULES:
- Return ONLY the JSON object.
- nearbyCities: 5-7 genuinely adjacent DFW cities only.
- neighborhoods: real names only, no fabrication.
- metaTitle must be under 60 characters.
- metaDesc must be under 155 characters.

---

## PASS 2 — SONNET: PROSE FIELDS

**Model:** `claude-sonnet-4-6`
**Max tokens:** 900

Pass the structured data from Pass 1 into the prompt context so Sonnet can write prose that references real neighborhood names.

### System prompt (Pass 2)
You are a local SEO copywriter specializing in home improvement and roofing content for the Dallas–Fort Worth metroplex. You write hyper-local, factually accurate content that differentiates each city page from every other city page. You never use generic filler phrases. You write as if you live in DFW and know these neighborhoods personally.

Return ONLY a valid JSON object containing ONLY the prose fields listed below. No preamble, no markdown fences, no explanation.

### User prompt template (Pass 2)
Write prose content for a metal roofing city page targeting {{CITY_NAME}}, TX ({{COUNTY}} County, {{REGION}} region of DFW).

Here is the structured data already gathered for this city -- use these real neighborhood names and the median home value in your prose:
```
{{PASS_1_JSON}}
```

Return a JSON object with exactly these fields:

```json
{
  "heroHeadline": "<Two lines separated by \n. Line 1: city-specific hook. Line 2: emotional/outcome statement. Do NOT use 'The Last Roof You'll Ever Need' -- reserved for homepage. Write something specific to {{CITY_NAME}}'s character and market.>",

  "heroSub": "<2 sentences, 40-55 words. Reference a specific neighborhood from the list above. Reference the hail risk or 2% deductible reality. Conversational but authoritative. No exclamation marks.>",

  "localContext": "<3 sentences, 65-85 words. Sentence 1: {{CITY_NAME}}'s specific hail corridor or weather exposure. Sentence 2: deductible math at {{CITY_NAME}}'s home values (use the median value from structured data). Sentence 3: why metal makes particular sense here. Reference county, carrier trends, or HOA density where accurate.>",

  "hoaNote": "<If {{CITY_NAME}} has significant HOA presence: 2-3 sentences about HOA approval for metal roofing -- mention standing seam and stone-coated steel as commonly approved, that we provide spec sheets and samples for HOA submissions. If primarily non-HOA (rural, older suburb), return empty string \"\".>",

  "review": {
    "name": "<Realistic first name + last initial. Do NOT use real person names.>",
    "neighborhood": "<One of the neighborhoods from the structured data above.>",
    "text": "<2-3 sentence homeowner testimonial specific to {{CITY_NAME}}. Reference something local -- HOA approval, a hail event, a specific neighborhood, or the decision to upgrade from asphalt. First person. Sounds like a real homeowner, not marketing copy. 45-70 words.>",
    "rating": 5
  }
}
```

RULES:
- Return ONLY the JSON object. No markdown. No code fences. No explanation.
- heroHeadline must contain exactly one \n character.
- hoaNote must be a string (empty string if not applicable).
- Do not reuse heroHeadline or heroSub from any other city.
- Do not fabricate statistics. Reference only the data provided above.

---

## MERGE STEP -- HAIKU

After both passes complete, use Haiku to merge the two JSON objects into a single CITY_DATA object:

```
merged = { ...pass1_json, ...pass2_json }
write to /city-data/{slug}.json
```

---

## HERMES AGENT INSTRUCTIONS

```
FOR EACH row in city_list:

  PASS 1 -- Haiku structured data:
  1. Extract city_name, county, region
  2. Build pass1_prompt from Pass 1 template above
  3. Call Anthropic API:
       model: claude-haiku-4-5
       max_tokens: 600
       system: <Pass 1 system prompt>
       messages: [{ role: "user", content: <pass1_prompt> }]
  4. Parse response as JSON -> store as pass1_json
  5. Validate: check all required keys exist, metaTitle < 60 chars, metaDesc < 155 chars
  6. On validation fail: retry once with note "Return only valid JSON."

  PASS 2 -- Sonnet prose:
  7. Inject pass1_json into Pass 2 user prompt (replace {{PASS_1_JSON}})
  8. Call Anthropic API:
       model: claude-sonnet-4-6
       max_tokens: 900
       system: <Pass 2 system prompt>
       messages: [{ role: "user", content: <pass2_prompt> }]
  9. Parse response as JSON -> store as pass2_json
  10. Validate: check all prose keys exist, heroHeadline contains \n
  11. On validation fail: retry once with note "Return only valid JSON."

  MERGE:
  12. merged_json = { ...pass1_json, ...pass2_json }
  13. Write to /city-data/{slug}.json

  RATE LIMIT:
  14. Pause 2 seconds between city batches

  AFTER ALL CITIES:
  15. POST each JSON file to WordPress via REST API
      endpoint: /wp-json/wp/v2/pages
      template: city-page-template.php
      custom_fields: city_data = <merged_json>
```

---

## CITY LIST FOR BATCH GENERATION
Run one batch (Pass 1 + Pass 2 + Merge) per row.

| City Name            | County    | Region              |
|----------------------|-----------|---------------------|
| Southlake            | Tarrant   | North Fort Worth    |
| Westlake             | Tarrant   | North Fort Worth    |
| Keller               | Tarrant   | North Fort Worth    |
| Colleyville          | Tarrant   | North Fort Worth    |
| Trophy Club          | Tarrant   | North Fort Worth    |
| Flower Mound         | Denton    | North Dallas        |
| Frisco               | Collin    | North Dallas        |
| Prosper              | Collin    | North Dallas        |
| Celina               | Collin    | North Dallas        |
| McKinney             | Collin    | North Dallas        |
| Allen                | Collin    | North Dallas        |
| Plano                | Collin    | North Dallas        |
| Murphy               | Collin    | North Dallas        |
| Wylie                | Collin    | North Dallas        |
| Sachse               | Dallas    | East Dallas         |
| Garland              | Dallas    | East Dallas         |
| Rowlett              | Dallas    | East Dallas         |
| Rockwall             | Rockwall  | East DFW            |
| Heath                | Rockwall  | East DFW            |
| Forney               | Kaufman   | East DFW            |
| Mansfield            | Tarrant   | South Fort Worth    |
| Midlothian           | Ellis     | South Fort Worth    |
| Waxahachie           | Ellis     | South Fort Worth    |
| Burleson             | Johnson   | South Fort Worth    |
| Arlington            | Tarrant   | Mid-Cities          |
| Grapevine            | Tarrant   | Mid-Cities          |
| Euless               | Tarrant   | Mid-Cities          |
| Bedford              | Tarrant   | Mid-Cities          |
| Hurst                | Tarrant   | Mid-Cities          |
| North Richland Hills | Tarrant   | Mid-Cities          |
| Denton               | Denton    | North DFW           |
| Argyle               | Denton    | North DFW           |
| Bartonville          | Denton    | North DFW           |
| Highland Village     | Denton    | North DFW           |
| Lewisville           | Denton    | North DFW           |
| Coppell              | Dallas    | North Dallas        |
| Las Colinas          | Dallas    | North Dallas        |
| Carrollton           | Dallas    | North Dallas        |
| Richardson           | Dallas    | North Dallas        |

---

## WORDPRESS BNTEGP TION NOTES

Once city data JSON files are generated:

1. Install ACF (Advanced Custom Fields) Pro on WordPress
2. Create a field group "City Page Data" mapped to the city page template
3. Fields map 1:1 to CITY_DATA keys
4. Hermes posts each city page via WP REST API with ACF fields populated
5. RankMath pulls metaTitle and metaDesc from ACF fields automatically
6. Set permalink structure: /metal-roofing-{slug}-tx/
