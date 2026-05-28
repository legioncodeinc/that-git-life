# Why port 3050?

Because nothing else is on it.

Common dev-tool ports — 3000, 3001, 8000, 8080, 8888 — are crowded. TGL needed an "uncommon" port (per the brief) so it doesn't collide with whatever you're already running.

## Can I change it?

Yes:

```bash
tgl start --port 3055
```

The CLI will remember the new port for subsequent `tgl start` calls.

## Where do I open it?

[http://localhost:3050](http://localhost:3050) — or whatever port you configured.

> Note: TGL serves over plain HTTP (not HTTPS) because it's local-only. Your browser treats `127.0.0.1` as a secure context, so this is safer than it sounds.
