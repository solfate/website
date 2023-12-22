"use client";

import { memo } from "react";

import solanaIcon from "@/../public/icons/solana-black.svg";
import githubIcon from "@/../public/icons/github-square.svg";
import xIcon from "@/../public/icons/x-square.svg";
import infoIcon from "@/../public/icons/info.svg";
import Image, { ImageProps } from "next/image";

export const DeveloperListForm = memo(() => (
  <div className="max-w-2xl mx-auto space-y-4">
    <ConnectionCard
      title="Solana Wallet"
      description="Connect any Solana wallet. Even a burner."
      imageSrc={solanaIcon}
      buttonLabel={"Connect"}
    />
    <ConnectionCard
      title="GitHub"
      description="Prove your contributions to the Solana ecosystem"
      imageSrc={githubIcon}
      buttonLabel={"Connect"}
    />
    <ConnectionCard
      title="X / Twitter"
      description="Prove you participate in the Solana community"
      imageSrc={xIcon}
      buttonLabel={"Connect"}
    />
    <ConnectionCard
      title="Answer these 2 questions"
      description="Quick and to the point. ~2 minutes to do."
      imageSrc={infoIcon}
      buttonLabel={"Start"}
    />

    {/* <div className="card">
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-200 w-6 h-6">
            1
          </div>
          <h5 className="font-semibold text-base">
            Why should you be on this list?
          </h5>
        </div>
        <textarea
          className="input w-full h-28"
          placeholder="Share details that may be relevant (max 250 chars)"
        ></textarea>
      </div>
    </div>
    <div className="card">
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-200 w-6 h-6">
            2
          </div>
          <h5 className="font-semibold text-base">Who can vouch for you?</h5>
        </div>
        <textarea
          className="input w-full h-28"
          placeholder="Share anyone you think will vouch for you and your contributions to the Solana ecosystem (i.e. people, entities, communities) (max 250 chars)"
        ></textarea>
      </div>
    </div> */}
  </div>
));

type ConnectionCardProps = {
  title: string;
  buttonLabel: string;
  description: string;
  imageSrc: ImageProps["src"];
  onClick?: any;
};

export const ConnectionCard = ({
  title,
  buttonLabel,
  description,
  imageSrc,
  onClick,
}: ConnectionCardProps) => {
  return (
    <div className="card flex items-center justify-between">
      <div className="flex gap-3 items-center">
        <Image
          priority
          src={imageSrc}
          alt="Connect GitHub"
          className="w-10 h-10 md:w-12 md:h-12"
        />
        <div className="space-y-0">
          <h4 className="font-semibold text-xl inline-flex gap-2">{title}</h4>
          <p className="text-sm">{description}</p>
        </div>
      </div>

      <button
        type="button"
        className="btn btn-black w-28 justify-center"
        // disabled={true}
        // onClick={() => alert("")}
      >
        {buttonLabel}
        {/* <FeatherIcon
            name="Check"
            strokeWidth={2}
            size={20}
            className="bg-green-600 text-white rounded-full p-[4px] flex-shrink-0"
          /> */}
        {/* <FeatherIcon
            name="X"
            strokeWidth={2}
            className="bg-red-600 text-white rounded-full p-[5px] h-7 w-7 flex-shrink-0"
          /> */}
      </button>
    </div>
  );
};
