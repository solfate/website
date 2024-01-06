"use client";

import { Disclosure } from "@headlessui/react";
import { FeatherIcon } from "@/components/core/FeatherIcon";
import Link from "next/link";

export const DeveloperListFAQ = () => {
  return (
    <section className="w-full pt-14 space-y-6" id="faq">
      <section className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
        <p className="mx-auto text-sm text-gray-700">
          Got a question? It is likely answered here.
        </p>
      </section>

      <div className="mx-auto w-full max-w-lg space-y-3">
        <div id="tos"></div>
        <FAQItem statement={`Must Read - Terms of Service`}>
          <p>
            Consider this Frequently Asked Questions (FAQ) and the following
            information as the Terms of Service (TOS) for this Verified
            Developers List (&quot;list&quot;):
          </p>
          <p>
            By providing any information to Solfate and/or the maintainers of
            this list (&quot;the maintainers&quot;), including linking external
            accounts like GitHub, you agree that you have read and understand
            the information herein. By submitting information or an official
            membership request to join this list, you are opting in to be a
            member of this list. As a member of this list, no monetary value has
            been promised or guaranteed, however implied or inferred, either
            implicitly or explicitly.
          </p>
          <p>
            Applying to join this list is in no way a promise or guarantee you
            will be finally or wholly eligible to claim the membership token,
            officially joining the public list.
          </p>
          <p>
            Blockchains allow for permissionless actions, with or without your
            direct consent or knowledge to any specific laws in any region,
            especially the laws and regulations to you may be subject to. After
            claiming and/or having minted the non-transferrable digital asset
            for this public list on the blockchain, anyone may or may-not
            permissionlessly interact with the owner of the digital asset via
            the owner&apos;s blockchain address, with or without affiliation to
            the maintainers. These interactions do not and should not convey or
            imply affiliation or endorsement or approval on behalf of the
            maintainers.
          </p>
          <p>
            From time-to-time, the maintainers may work directly or indirectly
            with others to aid them in interacting with the members of this
            list. Including but not limited to: providing a list of the member
            provided blockchain wallet address(es). The subsequent actions of
            these individuals or groups do not necessarily mean they are
            endorsed by the maintainers, how ever implied or inferred.
          </p>
          <p>
            Finally, the information described within this FAQ and Terms of
            Service may be updated or revised at any time, with or without
            notice. The specific changes are trackable in this website&apos;s
            code repository via git commit history and are your responsibility
            to know and understand the changes. Furthermore, by opting in to
            this list you accept these future changes.
          </p>
        </FAQItem>
        <FAQItem statement={`What is this "Verified Developers List"?`}>
          <p>
            The goal of this &quot;Verified Developers List&quot; project is to
            create a publicly available list of wallet address for developers in
            the Solana ecosystem.
          </p>
          <p>
            Specifically, a list of developers that have meaningfully
            contributed source code the the Solana ecosystem.
          </p>
          <p>
            These verified contributors will be eligible to claim and mint a
            non-transferrable (&quot;soul-bound&quot;) membership token, joining
            the list publicly, and allowing anyone to more easily interact with
            their Solana wallet address.
          </p>
          <p>
            We do not directly link the non-transferrable membership token to
            any individual&apos;s personal information, but rather go by two
            ideas:
          </p>
          <ul className="ml-4">
            <li>1. one person, one token</li>
            <li>2. if you are on this list, you are a Solana developer</li>
          </ul>
        </FAQItem>
        <FAQItem statement={`How does this work?`}>
          <p>
            When a person joins this list, we will have collected a few key
            pieces of information: a Solana wallet address and GitHub username.
          </p>
          <p>
            We will perform checks of the GitHub account for public code
            contributions to the Solana ecosystem. Including multiple popular
            Solana focuses repositories and libraries. (see the data privacy
            FAQ)
          </p>
          <p>
            Once a person is verified to having meaningfully contributed source
            code to the Solana ecosystem, they may be approved on the list and
            become eligible to claim/mint a non-transferrable
            (&quot;soul-bound&quot;) token with the Solana wallet address they
            used to join the list.
          </p>
          <p>
            Minting and owning this soul-bound token acts as a public notice to
            all that the owner has contributed source code to the Solana
            ecosystem. Allowing anyone to more easily interact with the token
            holders, including providing value as they see fit (i.e. airdrops,
            product discounts, services, etc).
          </p>
          <p>
            Note: The maintainers of this list are also avid members of the
            Solana ecosystem. As such, we may personally vouch for and add
            members to this list (with a general goal of one person, one member
            token).
          </p>
        </FAQItem>
        <FAQItem
          statement={`What is a "soul-bound" or "non-transferrable" token?`}
        >
          <p>
            A soul-bound token is a non-transferrable digital asset. Once
            created on the blockchain (i.e minted to your Solana wallet), you
            will NOT be able to transfer or sell it.
          </p>
          <p>
            In our case here, you should also be able to burn the asset and
            remove it from existence. By doing so, you are &quot;opting
            out&quot; and removing yourself from the public list. But again, you
            may not transfer it to another wallet.
          </p>
        </FAQItem>
        <FAQItem statement={`Is this an NFT collection?`}>
          <p>Yes, but not like the usual pfp collections you have seen.</p>
          <p>
            Think of this &quot;NFT collection&quot; more like a public list of
            wallet addresses owned by developers. Developers with verified
            source code contributions to the Solana ecosystem.
          </p>
        </FAQItem>

        <FAQItem statement={`Will it cost anything to mint the token?`}>
          <p>This is a free claimable token. No purchase required.</p>
          <p>
            The only costs to claim the soul-bound NFT are the standard costs on
            the Solana blockchain (i.e. transaction fees and account storage
            fees like &quot;rent&quot;) which go to the network and not the list
            maintainers.
          </p>
          <p>
            The maintainers of this list do not receive any special payments or
            kickbacks from this project. We consider this a public good.
          </p>
          <p>
            As members of the list themselves, the maintainers are expected to
            receive the same onchain interactions as all other members. With the
            one possible exception of if a &quot;length of time on list&quot;
            based system is ever used, the maintainers would be expected to get
            the same onchain interactions as other list members in the same time
            based cohort (which could be more onchain interactions than some
            others on the list).
          </p>
          <p>
            Again, to be clear: we do NOT charge a fee or price to mint this
            soul-bound token. No purchase required, just network fees.
          </p>
        </FAQItem>
        <FAQItem statement={`What GitHub and Twitter access am I giving?`}>
          <p>Read-only access.</p>
          <p>
            When you are connecting a GitHub and/or Twitter account, you are
            doing so through &quot;applications&quot; that were registered on
            those platforms and operated by the maintainers of Solfate website.
            Each of these &quot;external applications&quot; may have platform
            specific names for the data and access they provide, but as a
            general statement: we only ask for read-only access.
          </p>
          <p>
            The data these platforms provides to Solfate is pretty standard, but
            for transparency: we initially did request read-only permission to
            private repos. We no longer do this and have force revoked all
            access permissions we initially collected. More details posted in
            <Link
              href="https://twitter.com/SolfateHQ/status/1743399473433157986"
              target="_blank"
            >
              this tweet thread
            </Link>
            too.
          </p>
        </FAQItem>
        <FAQItem
          statement={`What information is stored? Is my information private?`}
        >
          <p>Yes, your private information will stay private. Promise.</p>
          <p>
            Aside from the public Solana wallet address you connect, we also
            collect profile information from the external platform accounts you
            connect via their APIs (i.e. GitHub, Twitter/X, etc). This
            information is stored in our database so we may do verification and
            validation of it (like checking for source code contributions).
          </p>
          <p>
            Note: The grand majority of the information we store is already
            publicly accessible on these external platforms via their respective
            public profile pages.
          </p>
          <p>
            We will NEVER share specific private personal information that we
            may collect (i.e. email address). We may however, make general
            statements about the information we have collected, like stating or
            displaying who is a member of this list. But we will NOT share
            specific information like &quot;person X owns Solana wallet Y and
            token Z&quot; (unless this information is already publicly available
            via other data sources like simple onchain data analysis or info you
            have shared elsewhere).
          </p>
          <p>
            For transparency, we initially did request read-only permission to
            private repos. We no longer do this and have force revoked all
            access permissions we initially collected. More details posted in
            <Link
              href="https://twitter.com/SolfateHQ/status/1743399473433157986"
              target="_blank"
            >
              this tweet thread
            </Link>
            too.
          </p>
          <p>
            You can view the specific information that each external platform
            provides via their APIs on their websites. Including:{" "}
            <Link
              href={
                "https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user"
              }
              className="underline"
            >
              GitHub
            </Link>
            {", "}
            <Link
              href={
                "https://developer.twitter.com/en/docs/twitter-api/users/lookup/api-reference/get-users-id"
              }
              className="underline"
            >
              X/Twitter
            </Link>
            {", and even the "}
            <Link
              href={"https://github.com/nickfrosty/solfate"}
              className="underline"
            >
              open source repo for this site
            </Link>
            .
          </p>
          <p>When the non-transferrable token is claimed for a person,</p>
        </FAQItem>
        <FAQItem statement={`What's the catch? Spoiler: there is none`}>
          <p>
            No catch. We see this as a public good for the Solana ecosystem.
          </p>
          <p>
            It&apos;s a public list of wallet addresses owned by verified
            contributors to the Solana ecosystem. Publicly available and ripe
            for anyone to easily provide interact with or provide value to.
          </p>
        </FAQItem>
      </div>
    </section>
  );
};

const FAQItem = ({
  statement,
  children,
}: {
  statement: string;
  children: React.ReactNode;
}) => (
  <Disclosure>
    {({ open }) => (
      <>
        <Disclosure.Button className="card items-center flex hover:border-gray-400 w-full justify-between px-4 py-2 text-left text-sm font-medium">
          <span>{statement}</span>
          <FeatherIcon
            name="ChevronDown"
            className={`${open ? "rotate-180 transform" : ""} h-5 w-5`}
          />
        </Disclosure.Button>
        <Disclosure.Panel
          as="div"
          className="space-y-2 px-5 p-2 text-sm text-gray-500"
        >
          {children}
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>
);
