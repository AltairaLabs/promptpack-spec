---
title: "How to Declare Governance"
sidebar:
  order: 4
---

Record what a regulated reader asks about an agent, in the pack that defines it: what it is for, who answers for it, what each tool can affect, which obligations follow from what it does, which of those recur, and who must not be reviewing whom.

Every field in this guide is a **declaration**. None of them configures, enforces or gates anything — a runtime's policy reads them and decides. A pack declaring none of them is valid and unchanged.

## Prerequisites

- A PromptPack on the v1.8+ schema (v1.6+ for steps 1 and 2)
- Familiarity with [Validators and Evals](/docs/spec/architecture-patterns#validators-vs-evals) — obligations point at both
- The [Governance schema reference](/docs/spec/schema-guide#governance-v160) open alongside

Work through the steps in order. Each delivers value on its own, and the later ones take more effort to fill in honestly.

## Step 1: Describe the agent

Start with `metadata.governance` — the facts about the agent as designed.

```yaml
metadata:
  governance:
    intended_purpose: >
      Produces an indicative affordability assessment from application data
      and bureau records. Every decline is reviewed by an underwriter.
    foreseeable_misuse:
      - Issuing a final decline without underwriter review
      - Use outside consumer lending
    autonomy_level: acts_with_approval
    accountable_owner: lending-risk
    approved_environments: [production-uk]
    requires_ai_disclosure: true
```

`accountable_owner` names a team or role, never a person — a named individual is stale the day they change team, and the agent hasn't changed. It matters more than it looks: step 5 uses it to express segregation of duties.

## Step 2: Say what each tool can affect

Add `action_scope` to every tool. This is what lets a policy act on *consequence* rather than on a list of tool names that goes stale when the next tool is added.

```yaml
tools:
  fetch_bureau_record:
    name: fetch_bureau_record
    description: Retrieve a credit bureau record
    action_scope:
      effect: read
      data_classes: [dpv:PersonalData, pd:Financial]
  record_assessment:
    name: record_assessment
    description: Write the indicative assessment to the application file
    action_scope:
      effect: write
      reversibility: reversible
      data_classes: [dpv:PersonalData]
```

An omitted `action_scope` means **undeclared**, not `read`. Declare it on every tool.

## Step 3: Use shared terms

Open values — `operator_role`, `risk_classification`, `intended_deployment_contexts`, `capabilities`, `data_classes` — accept a CURIE. Prefer the [well-known prefixes](/docs/spec/schema-guide#well-known-prefixes-v180), which need no declaration:

```yaml
metadata:
  governance:
    operator_role: dpv:DataController
    risk_classification: eu-aiact:RiskLevelHigh
    intended_deployment_contexts: [sector-finance:ConsumerCredit]
    capabilities: [dpv:AutomatedDecisionMaking, ai:Profiling]
```

Free strings stay valid indefinitely, and an undeclared prefix only warns. For your own scheme, declare it once:

```yaml
metadata:
  governance:
    vocabularies:
      acme: https://acme.example/governance#
```

:::caution[A term records a classification; it doesn't make one]
`eu-aiact:RiskLevelHigh` says what your organisation concluded. Whether that conclusion is right is a legal judgement the term can't make for you.
:::

## Step 4: Map capabilities to obligations

`capabilities` is a list of labels. `obligations` says what each label obliges, and which controls discharge it.

First give the guardrail you'll name an `id`:

```yaml
prompts:
  prescreen:
    # ...
    validators:
      - id: decline-reasons-guard
        type: required_section
        message: A negative assessment must list the factors behind it.
        params:
          section: factors
```

Then declare the obligation:

```yaml
metadata:
  governance:
    obligations:
      - id: art22-human-review
        obligation: legal-eu-gdpr:Article22
        applies_to: { capability: dpv:AutomatedDecisionMaking }
        controls:
          - field: autonomy_level
          - validator: decline-reasons-guard
          - eval: decline-carries-reasons
          - external: Underwriter queue with four-hour SLA
```

Each control carries exactly one key, and each is a different claim:

| Control | Claim |
|---|---|
| `field` | This is declared — the named governance field must be filled in |
| `validator` | This is enforced in the response path |
| `eval` | This is watched — a named measurement exists |
| `external` | This is handled outside the pack |

Most real obligations want a `validator` *and* an `eval`: one stops the case you anticipated, the other notices the one you didn't. Use `external` honestly — an operator-side control described in prose is better than one dressed up as a guardrail.

## Step 5: Add recurring reviews

Obligations that recur go in `reviews`, with an ISO 8601 cadence and an owning team:

```yaml
metadata:
  governance:
    reviews:
      - id: quarterly-bias-test
        type: pp:BiasTesting
        cadence: P3M
        owner: fair-lending-team
        satisfies: [art22-human-review]
        eval: demographic-parity
```

Don't record when a review last happened, in the entry or in its `extensions`. A date inside a versioned artifact is stale by design; completions are runtime state, and runtimes key them by `reviews[].id`. Keep that `id` stable across pack versions for as long as the review means the same thing.

## Step 6: Require independence for reviewing agents

If this agent reviews another's output, say what it must not share with whatever produced that output:

```yaml
metadata:
  governance:
    accountable_owner: finance-controls
    independent_of:
      axes: [accountable_owner, model, provider, prompts]
      enforcement: strict
```

The requirement names no counterparty. The producer is usually in another pack, and the runtime resolves it from the composition it is running.

- **`accountable_owner`** is organisational independence: a different team answers for the review than for what it reviews. This is how a pack expresses **segregation of duties**.
- **`model`**, **`provider`**, **`tools`**, **`prompts`** are technical independence. They guard against correlated mistakes, not against compromise — an injected producer isn't stopped by a reviewer on a different model.

There is no duty field on tools. The stronger separation is structural: put approval and execution in **two packs**, with two digests, two owners and two admission decisions. [Regulated environments](/docs/regulated-environments#segregation-of-duties) shows the arrangement and the admission policy that checks it.

## Step 7: Annotate decision points

Anything your own policy needs that the schema doesn't model goes in `extensions` — on `governance`, on an obligation or review, or on any [decision point](/docs/spec/schema-guide#policy-annotation-v180) (`Prompt`, `Validator`, `Eval`, `AgentDef`, `WorkflowState`, `Composition`, `Tool`):

```yaml
validators:
  - id: change-ticket-guard
    type: required_pattern
    params:
      pattern: "CHG-\\d{6}"
    extensions:
      acme.example/control:
        framework_ref: ACME-CHG-4.2
        severity: high
```

Namespace the keys. No conforming implementation validates or interprets them, and they are never passed to the guardrail as configuration — that's what `params` is for.

## Complete Example

```yaml
id: credit-prescreen
name: Credit Pre-screening
version: 2.1.0
template_engine: { version: v1, syntax: "{{variable}}" }

metadata:
  governance:
    intended_purpose: >
      Produces an indicative affordability assessment from application data
      and bureau records. Every decline is reviewed by an underwriter.
    foreseeable_misuse:
      - Issuing a final decline without underwriter review
      - Use outside consumer lending
    autonomy_level: acts_with_approval
    accountable_owner: lending-risk
    operator_role: dpv:DataController
    risk_classification: eu-aiact:RiskLevelHigh
    intended_deployment_contexts: [sector-finance:ConsumerCredit]
    capabilities: [dpv:AutomatedDecisionMaking, ai:Profiling]
    approved_environments: [production-uk]
    requires_ai_disclosure: true

    obligations:
      - id: art22-human-review
        obligation: legal-eu-gdpr:Article22
        applies_to: { capability: dpv:AutomatedDecisionMaking }
        controls:
          - field: autonomy_level
          - validator: decline-reasons-guard
          - external: Underwriter queue with four-hour SLA
      - id: art22-explanation
        obligation: legal-eu-gdpr:Article22-3
        applies_to: { capability: ai:Profiling }
        controls:
          - validator: decline-reasons-guard
          - eval: decline-carries-reasons

    reviews:
      - id: quarterly-bias-test
        type: pp:BiasTesting
        cadence: P3M
        owner: fair-lending-team
        satisfies: [art22-human-review, art22-explanation]
        eval: demographic-parity
      - id: annual-accuracy-review
        type: pp:AccuracyReview
        cadence: P1Y
        owner: lending-risk

tools:
  fetch_bureau_record:
    name: fetch_bureau_record
    description: Retrieve a credit bureau record
    action_scope:
      effect: read
      data_classes: [dpv:PersonalData, pd:Financial]
  record_assessment:
    name: record_assessment
    description: Write the indicative assessment to the application file
    action_scope:
      effect: write
      reversibility: reversible
      data_classes: [dpv:PersonalData]

evals:
  - id: decline-carries-reasons
    description: Any negative assessment states the factors behind it
    type: llm_judge
    params:
      criteria: Response lists the specific factors driving the assessment
    metric: { name: promptpack_decline_reasons, type: boolean }
    trigger: every_turn
  - id: demographic-parity
    description: Approval rates across protected groups stay within tolerance
    type: custom
    trigger: on_session_complete

prompts:
  prescreen:
    id: prescreen
    name: Affordability Pre-screen
    version: 2.0.0
    system_template: |
      Assess indicative affordability from the supplied application and
      bureau data. State the factors behind every assessment.
    validators:
      - id: decline-reasons-guard
        type: required_section
        message: A negative assessment must list the factors behind it.
        params:
          section: factors
```

## Validation Checklist

- [ ] Every tool declares `action_scope`
- [ ] `accountable_owner` and every `reviews[].owner` name a team or role, not a person
- [ ] Every control carries exactly one of `field`, `validator`, `eval`, `external`
- [ ] Every `controls[].validator` matches a `Validator.id`, and validator ids are unique across the pack
- [ ] Every `controls[].eval` and `reviews[].eval` matches an eval `id` in the pack or a prompt
- [ ] Every `controls[].field` names a governance field that is actually declared
- [ ] Every `reviews[].satisfies` entry matches an `obligations[].id`
- [ ] Every `cadence` is an ISO 8601 duration (`P3M`, `P1Y`), not bare `P`
- [ ] No completion dates anywhere, including in `extensions`
- [ ] Pack validates against the v1.8 JSON schema

:::caution[Common Mistakes]
- **Naming a person as owner**: the pack needs a new version every time they move team.
- **A control that names nothing real**: a misspelt validator or eval id fails validation. That is the point — an obligation can't be discharged by a name.
- **Treating an `eval` control as proof**: it says a measurement exists, not that the last run passed.
- **Only technical `independent_of` axes on an approver**: without `accountable_owner` you have diversity of judgement, not separation of duties.
:::

## Next Steps

- [Regulated environments](/docs/regulated-environments) — what a pack does and doesn't give an oversight function
- [Governance schema reference](/docs/spec/schema-guide#governance-v160) — every property table
- [RFC 0013: Governance Declarations](/docs/rfcs/governance-declarations) — design rationale for steps 1–3
- [RFC 0016: Governance Obligations, Vocabulary and Policy Annotation](/docs/rfcs/governance-and-policy-annotation) — design rationale for steps 4–7, with worked examples for the EU AI Act, GDPR, HIPAA and financial services
