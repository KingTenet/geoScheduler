# AI Assistant Interface and Project Structure

## Project Container

- Projects act as containers for conversations and project knowledge
- Each project maintains its own context

## Project Knowledge

- Collection of non-binary files providing context for conversations
- Can be updated by the user to expand context
- Persists across conversations within the same project

## Conversations

- Associated with specific projects
- Content from one conversation is not automatically available in others
- Important information from conversations can be added to project knowledge for future reference

## AI Assistant Awareness

- Has access to current conversation and project knowledge
- Does not retain information between conversations unless added to project knowledge
- Cannot access information from other projects or conversations

## Best Practices for Interaction

1. Specify relevant files or sections when referencing project knowledge
2. Mention recent updates to project knowledge at the start of conversations
3. Summarize or add important information from previous conversations to project knowledge
4. Be explicit about which parts of the project knowledge are relevant to the current query

## Interface Limitations

- AI doesn't have direct awareness of the UI or interaction method
- Binary files are not part of project knowledge

## Persistence

- This summary itself can be added to project knowledge for future reference
