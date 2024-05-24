# AI technologies for the web:

## Options to run AI models:

- API call to LLM provider
  - Examples:
    - OpenAI's API: ChatGPT
    - Google's API: Gemini
    - Anthropic's API: Claude
  - Benefits: Easy
  - Drawbacks: Cost
- Host own LLM on server
  - Examples:
    - https://github.com/bentoml/OpenLLM
      - Llama 2 (Meta) --> Free
      - Mistral (Mistral AI) --> Paid?
  - Benefits: Security, Privacy, Customisation, Avoid vendor-lock-in
  - Drawbacks: Setup costs, Updates
- LLM on client

  - Examples:
    - Transformers.js: https://huggingface.co/docs/transformers.js/index
      - https://syntax.fm/show/740/local-ai-models-in-javascript-machine-learning-deep-dive-with-xenova
    - Benefits: Costs (free models)
    - Drawbacks: Download time

- LLM in Browser (https://developer.chrome.com/docs/ai/built-in): This might be the next area where browsers try to get ahead. Google integrates Gemini Nano. Will Apple work together with OpenAI. Apple has devices and OpenAI the techonlogy.

## Experiments:

- Transformer.js

1. Install library: https://huggingface.co/docs/transformers.js/main/en/installation
2. Use pipeline API and optionally provide model. Models can be implicit. Explicit models can be found by clicking on one of the tasks.
3. See more examples: https://huggingface.co/docs/transformers.js/main/en/index#examples

- OpenAI API with NextJS Server Components: https://www.youtube.com/watch?v=UDm-hvwpzBI (Good way to sell more compute time)
  - Why use the Vercel AI SDK?: https://sdk.vercel.ai/docs/introduction#why-use-the-vercel-ai-sdk
  - Problems:
    - Seems too focused on tools / functions
    - Documentation is confusing
      - Role tool specified here, but seems to cause problems: https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/stream-ui#messages-role (tool vs function)
      - No way to overwrite openAI settings. Lots of abstractions

## Discussion:

- Own experience with AI?
- AI in projects?
- Ideas for further exploration?
