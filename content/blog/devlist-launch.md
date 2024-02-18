---
date: "Jan 30 2024 01:00 EST"
image: devlist-launch.jpg
title: "Launch of the Solana DevList"
description:
  "Using soul-bound NFTs, the Solana DevList is a public list of wallets
  verified to be owned by Solana Developers. It is a free and public good."
author: nick
tags: devlist, token-extensions
---

Introducing the [Solana DevList](./devlist-launch), a publicly accessible list
of Solana wallet addresses verified to be owned by Solana developers. Each
member of the DevList was approved to join, claiming a non-transferrable
membership token, because they were verified having code contributions to the
Solana ecosystem.

The DevList is a free and public good for the Solana ecosystem. We at Solfate
charge no fee to claim the DevList membership token. Members will only pay for
the usual Solana transaction and rent storage cost to claim the token. No more.

[![Launch of the Solana DevList: A List of Verified Solana Developers](/public/media/blog/devlist-launch.jpg)](./devlist-launch.md)

## What is the goal of the DevList?

The goal is simple: create a publicly accessible list of Solana wallets that are
verified to be owned by real Solana developers.

You could think of it like a _"high quality marketing list of Solana
developers"_ where anyone can access this list to provide value and interact
with the members. Token gated experiences, airdrops, discounts, etc. No
restrictions.

## How to join the DevList

In order to apply to join the Solana DevList, we will ask for a few pieces of
information:

- any Solana wallet,
- your GitHub account, and
- your X/Twitter account

Your Solana wallet will be used to sign in to the Solfate website. By connecting
a wallet, you will be asked to sign a plaintext message (following the "Sign In
With Solana" spec when supported by your wallet) that will enable us to verify
you do in fact control this wallet.

You are also required to connect a GitHub account, using our GitHub OAuth
application. By connecting a GitHub account using GitHub's OAuth API, we are
able to verify a person actually owns the connected GitHub username. This OAuth
connection uses the standard GitHub API and only grants Solfate read-only access
to your GitHub profile information (just like any other "Sign in with GitHub"
flow). We do not get access to private repos.

Next, you will be asked to connect your Twitter / X account, using our Twitter
OAuth application. Just like GitHub, this only grants Solfate read-only access
to your profile information using the Twitter API (just like any other "Sign in
with Twitter" flow).

## Why connect to GitHub and Twitter?

There are two primary reasons we require all DevList membership applications to
connect both a GitHub and Twitter/X account:

1. checking code contributions, and
2. sybil resistance

With a connected GitHub account, we are able to confirm a person does in fact
own a specific GitHub username. We then use the public GitHub API to see public
code contributions in the Solana ecosystem. Like your commits to open source
repos.

However, many people write a lot of code in private repos. And since we have no
way of seeing these private repos and a specific GitHub account's contributions
to them, we also use the connected Twitter accounts to check a person's social
presence to help see if they are a real person and not trying to bot the system.

### Sybil resistance

Sybil resistance is hard and is largely an unsolved problem. Many very smart
teams are doing their best to combat sybil attacks. Often times, the most
commonly used solution comes down to lots of data analysis.

One of the primary ways that Solfate and the DevList attempt to combat sybil
attacks is by requiring a person to connect both a GitHub and Twitter account.
While this is a friction point for applicants, it allows us to perform various
checks against these external platform accounts to be relatively sure that a
specific DevList application was submitted by a real person.

**We rely on a simple consensus idea:** if your GitHub account has gotten PRs
approved and merged into popular, well respected repos (managed by different
organizations with different merge criteria), the GitHub account is very likely
to be owned by a real person.

## How does DevList approval work

Once you apply to join the DevList, we will attempt to verify your GitHub
account has meaningfully contributed code to the Solana ecosystem.

First by attempting to automatically approve your membership based on your
GitHub account's public activity, then by a combination of manual review of your
public GitHub repositories and vouchers from other Solana developers in the
ecosystem.

For automated approvals, we run an automation script that will check a preset
list of public and commonly contributed repos. Using the public GitHub API, our
script will check how much activity your specific GitHub account has on these
repos. If our automation script can determine you have made many contributions
to these commonly used repos, it will auto approve your DevList application.

This automated script checks many well known and widely used public GitHub
repos. It is by no means an exhaustive list, but rather a starting point to
attempt to auto approve DevList applicants.

**Note:** If you would like to submit a well maintained public GitHub repo to
our automation script, please
[open a PR and do so](https://github.com/solfate/website). All will be carefully
considered!

If our automation script is not able to auto approve your DevList application,
you will be added to our manual review queue. In this manual review, we will
manually check your GitHub account's public repos and code contributions and
consult vouchers from other developers and builders in the Solana ecosystem.

We will continue to work our way though this queue as diligently as we can.
Often in batches.

## How to claim the DevList NFT

Once your DevList application has been approved, you will be able to claim the
DevList membership token and officially become a member of the Solana DevList!

**This membership token is a non-transferrable NFT** (some call them soul-bound
tokens) that uses the new Solana Token Extension program. Once you mint your
DevList membership token, you will NOT be able to transfer it but you can always
burn the membership token.

You can claim the DevList token to any Solana wallet you would like, including a
Ledger hardware wallet. But remember: it is non-transferrable.

On the DevList claim page, you will be asked to sign a plaintext message then a
Solana transaction. Both are required. If you are using a Ledger, be sure to
toggle on the "Using a Ledger" setting and have "_blind signing_" enabled on
your Ledger.

**Note:** At the time of this being written, Ledger hardware wallets do not
support some common Solana instructions (like setting priority fees) and do not
support signing plaintext messages. As a workaround, many platforms/services
(including the Solfate and the DevList) will ask Ledger devices to sign a simple
transaction with a single SPL memo instruction. At this time, this is the
closest we can all get to allowing Ledger hardware wallets to sign plaintext
messages.

## Apply to join the DevList today!

You can apply to join the DevList today: [solfate.com/devlist](/devlist)
