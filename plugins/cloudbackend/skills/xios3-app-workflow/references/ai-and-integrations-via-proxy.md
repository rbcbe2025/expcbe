# AI calls and integrations — through a proxy, never from the browser

Hand-written, 2026-11-04. Every external service an application talks to (an AI model, a mail or map
API, an analytics endpoint) is reached through a **proxy channel** the tenant's Administrator configures
in the console, and called from process markup. The manual's proxy guide and the chatbot tutorial are
bundled as `references/proxy-and-channels.md`; this page is the rules around them. Lint G11 refuses a
`fetch` to an external host.

## The shape

1. **Console › Proxy › Create**: the provider's base URL, the path, the headers that carry the key, and
   the ACL that says which roles may call it. The key lives here and nowhere else (G12). Pin the domain,
   the path and the headers so the application cannot override them.
2. **In the process**: a `channel` operation that mounts the proxy, and a `callService` step that sends
   the body and receives the answer into an alias. The exact markup is in `references/proxy-and-channels.md`;
   copy it, do not reconstruct it.
3. **The body**: JSON built in the process. `eval="pct"` substitutes verbatim, so free text with a line
   break or a quote breaks the JSON at the provider, and `escape-string()` writes `\'`, which JSON rejects.
   Keep a JSON-escaped copy in a hidden `textarea` and substitute that (xios3-app-basics
   `references/javascript-as-steps.md`, "the proxy JSON body").
4. **The answer**: into an alias; the process writes what must be stored (`database` create, `change` and
   `save`); JavaScript computes, the process writes.

## AI calls: the cost rules

An AI proxy is spend. Four rules, each from a measured mistake:

- **A key of its own** at the provider, with a monthly limit, never the tenant's main key.
- **Pinned** domain, path and headers; the body is the only thing the application supplies.
- **The ACL names the roles** that may call it. Whether a `user id 0` row admits any signed-in identity
  or anyone at all is not documented; assume the wider reading until measured on your tenant.
- **Probe limits with a body the provider must reject** (`max_tokens: 1` on the cheapest model). A 1 MB
  probe with an acceptable body was accepted, answered and billed twice.

Write the cost model into the spec's channel row: provider, model, the limit, who may call it, what one
call costs at the expected size. "AI capabilities" in v1 means one call with a visible result and a
written cost; everything else is v2.

## Integrations

- **Outbound** (an API the app calls): a proxy channel per service, the same shape as above.
- **Inbound** (a service that calls the tenant): the console's Webhooks section (bundled in
  `references/deployments-and-webhooks.md`); the payload format is documented there.
- **The CloudBackend API from a deployed app**: the runtime talks to the REST API with the signed-in
  user's own session, so an application reads and writes its containers without any stored credential;
  the cards in cloudbackend-rest-api say what each operation needs. A script outside the app logs in in
  the user's own terminal and reads the token from an environment variable (cloudbackend-saas-launch,
  "Credentials: never").
- **An MCP server over the app's data** is a separate codebase against those cards (*planned* in
  `docs/api.md`), not part of the deployment.

## Analytics as a proxied call

There is no built-in analytics in a deployment; the console's Statistics section shows connecting
identities and usage (check its demo-data switch is off before reading). When the spec names an endpoint:
a proxy channel to it, a `callService` from the main view's `Loaded` trigger (and from the screens the
spec lists), a consent state the app keeps before the first call, and the endpoint named in the privacy
notice. "None" is the default and a fine v1.
