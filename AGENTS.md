<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- Tarot AI interpretation runs only in a server function (src/lib/tarot/interpret.functions.ts); card drawing stays client-side so cards reveal even when AI is unavailable.
- Card art lives as local files in public/cards/<card-id>.jpg (public-domain RWS 1909 scans); deck.ts derives image paths from card ids so a test can verify every card has a file.
