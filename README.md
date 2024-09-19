# Messaging Suggestions App

<a href="https://help-me-respond.onrender.com" target="_blank">Live Demo</a>

This application simulates a chat session between an **Injured Worker** and a **Claims Adjuster**. The Adjuster has the option of generating an LLM suggested response to the Worker's message. The Adjuster can adjust the suggested response, send it as is, or discard it altogether.

## Getting Started

1. Clone the repository:
    ```bash
    git clone https://github.com/Vakarva/messaging-suggestions/
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the application:
    ```bash
    npm start
    ```

## Usage

1. Enter your API key (supports OpenAI and Anthropic)
2. Write messages as the **Worker** and the **Adjuster**.
3. The **Adjuster** can generate an LLM-suggested response.
4. Add additional context via **Settings** in the **Navbar**.

### Hotkeys

From within the chat text area:

-   **Mod + Enter** - Send message
-   **Mod + Shift + Enter** - Generate LLM response
-   **Mod + Shift + ,** - Undo LLM response
-   **Mod + Shift + .** - Redo LLM response
    https://help-me-respond.onrender.com
