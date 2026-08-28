# Portfolio Content Skill

Read the public portfolio of Caique Nonato da Silva (IT Coordinator and Angular developer).

## When to use

- Summarize professional experience, skills, projects, or education
- Answer recruiter questions about the candidate's background
- Find links to GitHub repositories or contact channels

## How to fetch content

Request the site root with Markdown content negotiation:

```http
GET /
Accept: text/markdown
```

The response includes structured sections in Portuguese and English with YAML frontmatter.

## Contact API

To send a contact message, use the Netlify function documented in `/.well-known/openapi/contact.json`.
Authentication metadata is available at `/.well-known/oauth-protected-resource`.
