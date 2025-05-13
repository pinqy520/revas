---
# AI Metadata Tags
ai_keywords:
  [documentation, standards, guide, style, metadata, ai, quality, maintenance]
ai_contexts: [usage, development]
ai_relations: [docs/ai-index/overview.md, docs/ai-index/navigation-guide.md]
---

# Documentation Standards Guide

This guide outlines the standards and processes for creating, maintaining, and optimizing documentation for the Revas project. Its primary audience includes human developers and AI assistants involved in documentation tasks.

<!-- AI-IMPORTANCE:level=critical -->

## Core Principles

1.  **AI-First Optimization:** All documentation should be structured and written with AI comprehension as a primary goal. This includes clear headings, metadata, and explicit relationship linking.
2.  **Accuracy:** Documentation must accurately reflect the current state of the codebase.
3.  **Clarity:** Use clear, concise language. Avoid jargon where possible, or explain it if necessary.
4.  **Completeness:** Cover all essential aspects of a feature, module, or concept.
5.  **Consistency:** Adhere to the defined structure, style, and terminology across all documents.
6.  **Discoverability:** Ensure documents are easily findable through navigation guides and inter-document linking.
<!-- AI-IMPORTANCE:level=critical -->

## Document Lifecycle Process

All documentation follows this lifecycle:

1.  **Create:** A new document is created when a new significant feature, module, or architectural component is introduced.
2.  **Update:** Existing documents are updated when:
    - The corresponding code changes (features, APIs, behavior).
    - Inaccuracies or omissions are found.
    - Clarity can be improved.
3.  **Split (Rarely):** If a document becomes too large or covers too many distinct topics, it may be split into multiple, more focused documents.
4.  **Deprecate:** If a feature or module is deprecated, its documentation should be clearly marked as deprecated, explaining the reasons and alternatives.
5.  **Archive (Very Rarely):** If a feature is entirely removed and its historical context is no longer relevant, documentation might be archived (removed from active navigation but kept in version control).

## Metadata and Structural Specifications

### 1. Document Frontmatter (Metadata)

<!-- AI-IMPORTANCE:level=high -->

Every Markdown document in the `docs/` directory (excluding the `.roo/` rules directory) **must** begin with a YAML frontmatter block containing AI-specific metadata.

```markdown
---
# AI Metadata Tags
ai_keywords: [keyword1, keyword2, ...]
ai_contexts: [architecture|development|implementation|usage]
ai_relations: [path/to/related/doc1.md, path/to/related/doc2.md]
---
```

<!-- AI-IMPORTANCE:level=high -->

- `ai_keywords`: A list of 3-7 relevant keywords that describe the document's main topics. These help AI assistants in precise searching and topic identification.
- `ai_contexts`: Specifies the primary purpose(s) or perspective(s) of the document. Choose one or more from:
  - `architecture`: Describes system structure, design principles, high-level component interactions.
  - `development`: Provides guidance for coding, building, or extending features.
  - `implementation`: Details the specific internal workings of a module or feature.
  - `usage`: Explains how to use a feature, API, or component from an external perspective.
- `ai_relations`: A list of relative paths to other documentation files that are directly related to this document. This helps AI build a knowledge graph. Links should be functional.

### 2. Document Structure

- **Title:** Use a clear, descriptive H1 heading (`# Title`) as the first element after the frontmatter.
- **Headings:** Use Markdown headings (`##`, `###`, etc.) to structure content logically. Ensure a clear hierarchy.
- **Paragraphs:** Keep paragraphs relatively short and focused on a single idea.
- **Lists:** Use bulleted or numbered lists for sequences or collections of items.
- **Code Blocks:**
  - Use triple backticks (```) for code blocks.
  - Specify the language (e.g., `typescript`, `javascript`, `json`, `markdown`) for syntax highlighting and AI understanding.
  - Provide context or explanation for code snippets.
- **Links:**
  - Use relative paths for links to other documents within the `docs/` directory.
  - Ensure all links are valid.
  - Use descriptive link text. Example: `[Node System Internals](modules/core/node.md:1)` instead of `[click here](modules/core/node.md:1)`.
  - Include line numbers in links for specific references, e.g., `[NodeProps definition](../core/Node.ts:50)`.

## AI Marker Usage Guide

To enhance AI understanding and focus, use the following special comment markers within Markdown content.

### 1. Importance Markers

These markers signal the relative importance of a piece of information.

```markdown
<!-- AI-IMPORTANCE:level=critical -->

This information is absolutely essential for understanding the core concept. AI should prioritize this.

<!-- AI-IMPORTANCE:level=high -->

This information is highly relevant and significantly contributes to understanding.

<!-- AI-IMPORTANCE:level=normal -->

This is standard informational content.
```

- Place the marker **before** the paragraph or section it applies to.
- Use `critical` sparingly for truly foundational concepts.

### 2. Contextual Information Blocks

These markers define the context or purpose of a specific block of information.

```markdown
<!-- AI-CONTEXT-START:type=architecture -->

This section describes the architectural aspects of the feature.

<!-- AI-CONTEXT-END -->

<!-- AI-CONTEXT-START:type=development -->

This part provides guidance for developers implementing or using this feature.

<!-- AI-CONTEXT-END -->

<!-- AI-CONTEXT-START:type=implementation -->

Here, we delve into the specific internal implementation details.

<!-- AI-CONTEXT-END -->

<!-- AI-CONTEXT-START:type=usage -->

This explains how to use the feature from an end-user or API consumer perspective.

<!-- AI-CONTEXT-END -->
```

- The `type` attribute should match one of the `ai_contexts` values.
- Ensure every `AI-CONTEXT-START` has a corresponding `AI-CONTEXT-END`.
- These blocks help AI assistants switch perspectives or filter information based on the current task.

## Document Review Checklist and Quality Assurance Process

Before any new or updated documentation is considered final, it must undergo a review process. AI assistants, particularly in **Summary Mode**, are responsible for much of this.

### Review Checklist:

1.  **Accuracy:**
    - [ ] Is the information technically correct and up-to-date with the codebase?
    - [ ] Do code examples work as described?
    - [ ] Are API signatures (parameters, return types) accurate?
2.  **Completeness:**
    - [ ] Does the document cover all essential aspects of the topic?
    - [ ] Are there any obvious omissions?
3.  **Clarity:**
    - [ ] Is the language clear, concise, and easy to understand?
    - [ ] Are technical terms defined or used appropriately?
    - [ ] Is the structure logical and easy to follow?
4.  **Metadata:**
    - [ ] Is the frontmatter present and complete?
    - [ ] Are `ai_keywords` relevant and sufficient?
    - [ ] Are `ai_contexts` appropriate for the content?
    - [ ] Are `ai_relations` accurate and do all links work?
5.  **AI Markers:**
    - [ ] Are `AI-IMPORTANCE` markers used appropriately?
    - [ ] Are `AI-CONTEXT-START/END` blocks used effectively to delineate information?
    - [ ] Are markers correctly formatted?
6.  **Formatting and Style:**
    - [ ] Does the document adhere to Markdown best practices?
    - [ ] Are headings, lists, and code blocks used correctly?
    - [ ] Is the overall style consistent with other documentation?
7.  **Links:**
    - [ ] Do all internal and external links work?
    - [ ] Is link text descriptive?

### Quality Assurance Process (primarily for Summary Mode):

1.  **Self-Review:** The author (human or AI) performs an initial review using the checklist.
2.  **Peer Review (if human author):** Another developer reviews the documentation.
3.  **AI Validation (Summary Mode):**
    - The AI in Summary Mode systematically checks the document against the standards.
    - Verifies metadata relationships by attempting to "navigate" them.
    - Cross-references content with its understanding of the codebase (where possible).
4.  **Iterative Refinement:** Address any issues found during reviews.
5.  **Final Approval:** Once all checks pass, the documentation is considered ready.

---

By adhering to these standards, we can build a robust, AI-friendly documentation system that significantly enhances the development experience for both humans and AI assistants working on the Revas project.
