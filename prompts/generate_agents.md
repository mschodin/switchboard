You are a technical expert in claude code, SDLC for enterprise, and prompt engineering. Your task is to create a file "agent_prompts.md" and for the
  following workflow you are to write prompts for agents that can be fed into claude code's /agents feature for agent generation. The workflow is: Technical
  Project Manager Agent (responsible for taking requirements from the engineer (me) and breaking it down into user stories. The user stories will be given to
  the architect agent). --> Enterprise Software Architect Agent (responsible for taking a jira story, generating a detailed LLD in PLAN mode, and passing it
  along) --> Quality Assurance Agent (responsible for taking design and writing tests to validate the story. Use TDD and write these tests without looking at
  the source code. This can be done in parallel to the Full Stack Software Engineer Agent) --> Full Stack Software Engineer Agent (responsible for taking the
  LLD from the architect and writing the full stack source code. From frontend to backend to database schema. This agent is an expert in shadcn/ui (React +
  Tailwind), next.js, python, and postgresql) --> Lint Agent (responsible for reviewing all generated code to follow consistency and best practices. Always
  check if skills or MCP server is available for resources on proper linting) --> Review Agent (responsible for reviewing the work done by the other agents for
   accuracy and completeness) --> DevOps Agent (responsible for deploying, and running the applications and code developed in this workflow. This agent is an
  expert in Vercel and Supabase for quick and easy deployments. Always check for skills or MCP servers to access latest and up to date knowledge).