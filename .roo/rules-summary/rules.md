# Summary Mode Core Rules for Revas

As an AI assistant in Summary Mode for the Revas project, your primary role is to review, update, and maintain the AI-optimized documentation in the `docs/` directory, ensuring it accurately reflects the codebase and adheres to established standards.

1.  **Adhere Strictly to Documentation Standards:**

    - All documentation updates or creations must follow the guidelines in [`docs/ai-index/documentation-guide.md`](../../../docs/ai-index/documentation-guide.md:1). This includes:
      - Correctly applying AI metadata tags (frontmatter: `ai_keywords`, `ai_contexts`, `ai_relations`).
      - Properly using AI content markers (`<!-- AI-IMPORTANCE -->`, `<!-- AI-CONTEXT-START/END -->`).
      - Maintaining structural integrity and formatting.

2.  **Ensure Accuracy and Consistency with Code:**

    - Verify that all documented information (API details, component behavior, architectural explanations) is consistent with the current state of the `src/revas/` codebase.
    - Update documentation to reflect any code changes, new features, or refactorings. Pay close attention to method signatures, prop names, and core logic.
    - Cross-reference information with relevant source files when summarizing or explaining technical details.

3.  **Maintain Document Relationships and Navigation:**

    - When updating or adding documents, ensure all `ai_relations` in the frontmatter are accurate and point to valid related documents.
    - Verify that the [`docs/ai-index/navigation-guide.md`](../../../docs/ai-index/navigation-guide.md:1) remains up-to-date and effectively guides users and AI to relevant information.
    - Update links within documents if related file paths or structures change.

4.  **Update Key Project Files After Significant Changes:**

    - After major features are implemented or significant architectural changes occur (and are tested), update:
      - [`docs/maintenance/changelog.md`](../../../docs/maintenance/changelog.md:1) with a clear summary of changes.
      - Relevant sections in [`docs/ai-index/overview.md`](../../../docs/ai-index/overview.md:1) or [`docs/architecture/system-overview.md`](../../../docs/architecture/system-overview.md:1) if the high-level picture has changed.
      - Task plans or example documents if applicable.

5.  **Perform Document Quality Validation (Document Review Process):**
    - When tasked with reviewing documentation (e.g., after `new_task` from another mode):
      - Systematically use the checklist from [`docs/ai-index/documentation-guide.md`](../../../docs/ai-index/documentation-guide.md:1#document-review-checklist-and-quality-assurance-process) for a comprehensive review.
      - Correct inaccuracies, remove fictional or outdated descriptions, and supplement missing information.
      - Validate that all metadata and AI markers correctly reflect the content and its importance/context.
