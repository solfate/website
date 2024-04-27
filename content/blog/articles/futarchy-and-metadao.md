---
author: teague
date: "Apr 26 2024"
image: articles/futarchy-and-metadao/cover.jpg
title: "MetaDAO: The First Futarchy"
description:
  "Exploring futarchy, its principles, and applications, particularly how
  MetaDAO integrates it into its decentralized governance framework."
tags: MetaDAO, Futarchy, DAO
---

Modern governance systems can be flawed and riddled with poor decision-making
due to human error at high levels of varying organizations. Whether it's a small
community or a large nation, making decisions that benefit the collective while
considering diverse perspectives is complex and difficult.

![](/public/media/blog/articles/futarchy-and-metadao/cover.jpg)

Traditional governance systems often rely on elected officials or appointed
leaders to make these decisions, but what if there was a more efficient and
transparent way to govern? Enter futarchy, a new concept that seeks to
revolutionize governance models by leveraging prediction markets to make
decisions.

In this article, we'll explore the concept of futarchy, its principles, and
applications, with a specific focus on how the project
[MetaDAO](https://linktr.ee/themetadao) is incorporating it into its
decentralized governance framework.

## Understanding Futarchy

Futarchy, a term coined by economist
[Robin Hanson](https://twitter.com/robinhanson) in 2000, combines elements of
democracy and betting markets to create a unique decision-making system. At its
core, futarchy relies on prediction markets to determine the best course of
action for a given decision. Unlike traditional voting systems where individuals
cast ballots based on their preferences, prediction markets allow participants
to bet on the likelihood of future events or outcomes.

The fundamental premise of futarchy is simple yet powerful: decision-makers
propose policies or actions, and prediction markets are set up to determine the
expected consequences of those decisions. Participants trade shares based on
their beliefs about the outcomes, with prices reflecting the aggregated thoughts
of the crowd. Once the decision is made and the outcome observed, the market
resolves and the results inform future governance choices.

## MetaDAO: Integrating Futarchy into Decentralized Governance

Built on Solana, MetaDAO is the first application of a futarchy in real
practice, branding itself as, “An organization governed by markets, not
politics”. Through transparent and efficient decision-making mechanisms, the
MetaDAO aims to cultivate an environment conducive to innovation and
collaboration, empowering individuals to contribute to the advancement and
development of Web3 technologies.

The success of futarchy in the MetaDAO is based on the belief that since asset
prices in an efficient market reflect all known information at any given time,
they should provide the best prediction of future events based on all available
current knowledge.

Members of the MetaDAO are branded as _“futards”_, or one who participates or
associates themselves in futarchy. A core group of futards act as the main
contributors to the MetaDAO, as they continue to look for more support across
Social Media, Marketing, Philosophy, Onboarding, Engagement, and Research.

Futards can be classified within 3 general roles within the DAO, each making
specific contributions to its ongoing success.

1. **Analysts**

- “Thinkers” of the MetaDAO
- Actively trading markets
- Can intensely study a situation, prioritizing reason over emotions in their
  verdicts

2. **Entrepreneurs**

- “Action-takers” of the MetaDAO
- Take on major projects and build teams
- Needs to be able to convince analysts of project strength, and convince
  cyber-agents to join their team
- Risk-takers

3. **Cyber-Agents**

- “Builders” of the MetaDAO
- Coders, engineers, designers, marketers

The combined synergies between analysts, entrepreneurs, and cyber-agents are
what will make MetaDAO successful in using futarchy as a governance model.

So, how does MetaDAO incorporate futarchy into its decentralized governance
framework? Let's break down the 3 different
[open-sourced programs](https://github.com/metaDAOproject/futarchy) that MetaDAO
is composed of:

1. **Conditional Vault Program**

- Tied to a specific underlying token (META/USDC) and settlement authority
  (MetaDAO)
- Simulates transaction reversion, allowing MetaDAO participants to use
  conditional tokens to redeem underlying tokens after proposal finalization
- Contains Pass & Fail Vaults/Markets

2. **Time-Weighted Average Price (TWAP) Program**

- Determines the fair market value of the conditional tokens traded within a
  given conditional market
- Ensures the governing process is represented by the most accurate price within
  a set time

3. **Autocrat Program**

- Orchestrates futarchy by initializing proposals within MetaDAO
- Creates requisite conditional vaults & markets after each proposal When
  proposal finalization is triggered, the TWAP of each conditional market is
  checked, and either finalizes or reverts the pass/fail markets based on which
  is higher
  - For example, if someone mints conditional-on-pass META and trades it for
    conditional-on-pass USDC, either the proposal will pass and they can redeem
    conditional-on-pass USDC for USDC, or the proposal will fail and they can
    redeem their conditional-on-fail META for their original META.
    ([MetaDAO Docs](https://docs.themetadao.org/mechanics/implementation))

![Source:
[MetaDAO Documentation](https://docs.themetadao.org/metadao/how-it-works)](/public/media/blog/articles/futarchy-and-metadao/futarchy-markets-example.jpg)

## Participating in the MetaDAO

Being an active futard and contributor is an easy process to start, with a wide
array of options to choose how you want to participate whether you’d like to be
an analyst, entrepreneur, or cyber-agent.

One of the most common forms of participation is trading the conditional markets
of proposals going through the DAO. Trading these markets directly reflects your
beliefs about the DAO, and how it should properly allocate its time and
resources to the right initiatives.

To participate in trading these conditional markets, you will need to obtain
$META through a DEX platform, and then use those tokens to mint your conditional
tokens which are then used to vote on the proposals.

todo: image here

Aside from participating in trading the conditional markets for proposals,
futards can also participate in the MetaDAO by creating proposals using the
MetaDAO proposal templates, improving areas of the MetaDAO’s codebase, or
creating marketing materials surrounding the protocol or proposals!

## Benefits of Futarchy in MetaDAO

With its different approach to DAO governance, the integration of futarchy into
MetaDAO's governance framework aims to offer several key benefits over other
frameworks:

1. **Transparency and Accountability**: By basing decisions on prediction
   markets, MetaDAO can ensure more transparency in the decision-making process.
   Participants can see the rationale behind each decision and understand the
   factors driving them.

2. **Efficiency**: Futarchy streamlines the decision-making process by
   leveraging the collective intelligence of the community. Instead of relying
   on lengthy debates or subjective opinions, decisions are informed by market
   signals, leading to more efficient outcomes.

3. **Incentive Alignment**: Participants in MetaDAO have a direct financial
   stake in the outcomes of proposed initiatives. This alignment of incentives
   encourages thoughtful analysis and decision-making, as individuals seek to
   maximize their returns by accurately predicting future outcomes. With other
   types of DAO participation typically poor, futarchy gives participants extra
   incentives to be active on proposals, as they are strongly incentivized to
   correct mispricings for financial gains.

4. **Adaptability**: Futarchy allows the MetaDAO to adapt and respond quickly to
   changing circumstances. If a proposed initiative is not achieving its desired
   outcomes, the prediction markets provide early warning signals, allowing the
   community to course-correct or reallocate resources as needed.

## Conclusion

Futarchy represents a new paradigm shift in experimental governance models,
offering a data-driven approach to decision-making that prioritizes
transparency, efficiency, and collective intelligence. By integrating the
principles of futarchy into its decentralized governance framework, MetaDAO is
paving the way for a new model of organizational management in the Web3 space.
As futarchy continues to evolve and mature, its potential applications may
extend far beyond blockchain and cryptocurrency, offering a compelling model for
governance in diverse contexts around the world. With MetaDAO leading the
charge, we can’t wait to watch the first futarchy in practice!

Be sure to join the [MetaDAO Discord](https://discord.com/invite/metadao) for
more information on how to get involved, and dive into their
[docs](https://docs.themetadao.org/) for more information on futarchy and how
the MetaDAO works!
