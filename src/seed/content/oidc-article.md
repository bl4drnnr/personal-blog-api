CI pipelines increasingly authenticate to cloud providers with [OIDC federation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect) instead of long-lived keys. The design is sound; the *trust policies* people attach to it usually are not. This post walks through the token exchange, the common misconfigurations, and a detection strategy that does not depend on the provider's audit log arriving on time.

The short version: if your trust policy validates only the issuer and audience, any repository in the organization — or in some setups, any fork — can mint credentials into your account. The `sub` claim is the entire security boundary, and it is a free-text field you have to constrain yourself.

## How the token exchange works

The runner requests a signed JWT from the CI provider's OIDC issuer and presents it to the cloud provider's STS endpoint. The response is a set of short-lived credentials scoped to whatever role the trust policy maps the token onto.

```bash
# What the runner effectively does
TOKEN=$(curl -s -H "Authorization: bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \
  "$ACTIONS_ID_TOKEN_REQUEST_URL&audience=sts.amazonaws.com" | jq -r '.value')

aws sts assume-role-with-web-identity \
  --role-arn "$ROLE_ARN" \
  --role-session-name ci-deploy \
  --web-identity-token "$TOKEN"
```

The JWT carries claims describing the workflow context. The ones that matter for authorization:

| Claim | Example | Constrained by default? |
| --- | --- | --- |
| `iss` | `token.actions.githubusercontent.com` | yes |
| `aud` | `sts.amazonaws.com` | yes |
| `sub` | `repo:org/repo:ref:refs/heads/main` | **no** |
| `ref` | `refs/heads/main` | no |
| `repository_visibility` | `private` | no |

Table: Claims in a GitHub Actions OIDC token and whether typical trust policies validate them.

## Where the trust breaks

> A trust policy that matches `repo:org/*` is not federation. It is an organization-wide credential with extra steps.

The failure mode is almost always the subject pattern. Consider the difference between these two conditions:

```json
"Condition": {
  "StringLike": {
    "token.actions.githubusercontent.com:sub": "repo:acme/*"
  }
}
```

versus the correct, branch-pinned form:

```json
"Condition": {
  "StringEquals": {
    "token.actions.githubusercontent.com:sub": "repo:acme/deploy:ref:refs/heads/main"
  }
}
```

With the wildcard form, an attacker who can create a repository — or in permissive setups, open a pull request from a fork — gets to assume the deployment role. Inline `aud` checks do not help; the audience is attacker-controllable at token request time.

## Detection without waiting for CloudTrail

Provider audit logs lag. A `sts:AssumeRoleWithWebIdentity` event can take minutes to appear, which is plenty of time to exfiltrate whatever the role can read. A faster signal is the *shape* of the session that follows.

Sessions minted through CI federation are predictable: same role, same session-name prefix, same source ASN, and a narrow set of API calls. Model that baseline and alert on divergence. A simple scoring function over the first $n$ API calls of a session works well in practice:

$$
S(session) = \sum_{i=1}^{n} w_i \cdot \mathbb{1}[call_i \notin B]
$$

where $B$ is the baseline call set for the role and $w_i$ weights calls by sensitivity ( `iam:*` and `sts:*` near the top). Anything above a small threshold pages a human.

![Detection pipeline overview](https://picsum.photos/seed/oidc-detect/1200/630 "Figure 1 — Scoring federated sessions against the per-role baseline before audit logs land.")

## Hardening checklist

- Pin `sub` to repository **and** ref with `StringEquals`, never `StringLike` with a trailing wildcard.
- One role per repository; no shared deployment roles across teams.
- Set the session duration to the pipeline's p99 runtime, not the default hour.
- Alert on federated sessions calling anything outside their recorded baseline.

None of this is exotic. The uncomfortable part is inventorying the trust policies you already have — in most organizations that audit finds at least one `repo:org/*`.
