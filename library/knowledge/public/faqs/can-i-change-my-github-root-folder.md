# Can I change my GitHub root folder?

Yes. In the dashboard, go to **Settings → GitHub root** and pick a new folder.

When you change the root, TGL:

- Re-discovers every git repository under the new folder.
- Drops any repos from its inventory that no longer live under the root (their findings stay in the database for 30 days in case you change your mind).
- **Does not** move your existing files. You move them; TGL adapts.
- **Does not** move your SSH keys. If you want them in the new location, regenerate from **Settings → SSH** (the old keys remain on GitHub; you can delete them there).

> **Tip:** Pick a stable location upfront. Changing the root is supported, but it's a bigger deal than just picking again.
