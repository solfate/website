"use client";

import React, { memo, useCallback, useState } from "react";

import solanaIcon from "@/../public/icons/solana-black.svg";
import githubIcon from "@/../public/icons/github-square.svg";
import xIcon from "@/../public/icons/x-square.svg";
import infoIcon from "@/../public/icons/info.svg";
import Image, { ImageProps } from "next/image";
import Dialog, { DialogHeader, DialogProps } from "@/components/core/Dialog";

export const DeveloperListForm = memo(() => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <DeveloperListQuestionsDialog
        isOpen={dialogOpen}
        setIsOpen={setDialogOpen}
      />

      <div className="max-w-2xl mx-auto space-y-4">
        <TaskItemCard
          title="Solana Wallet"
          description="Connect any Solana wallet. Even a burner."
          imageSrc={solanaIcon}
          buttonLabel={"Connect"}
          onClick={() => alert("wallet")}
        />
        <TaskItemCard
          title="GitHub"
          description="Prove your contributions to the Solana ecosystem"
          imageSrc={githubIcon}
          buttonLabel={"Connect"}
          onClick={() => alert("github")}
        />
        <TaskItemCard
          title="X / Twitter"
          description="Prove you participate in the Solana community"
          imageSrc={xIcon}
          buttonLabel={"Connect"}
          onClick={() => alert("twitter")}
        />
        <TaskItemCard
          title="Answer these 2 questions"
          description="Quick and to the point. ~2 minutes to complete."
          imageSrc={infoIcon}
          buttonLabel={"Start"}
          onClick={() => setDialogOpen(true)}
        />
      </div>
    </>
  );
});

type TaskItemCardProps = {
  title: string;
  buttonLabel: string;
  description: string;
  imageSrc: ImageProps["src"];
  onClick?: React.ComponentProps<"button">["onClick"];
};

export const TaskItemCard = ({
  title,
  buttonLabel,
  description,
  imageSrc,
  onClick,
}: TaskItemCardProps) => {
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
        onClick={onClick}
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

export const DeveloperListQuestionsDialog = (props: DialogProps) => {
  //   const {
  //     profileData,
  //     updateProfileData,
  //     elementEditorOpen,
  //     setElementEditorOpen,
  //     elementToEdit,
  //   } = useContext(ProfileEditorContext);

  // initialize the state tracker for the on-page form state
  const [hasChanges, setHasChanges] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    why: "",
    who: "",
  });

  // auto reset the editor's state when the `elementToEdit` changes
  //   useEffect(() => {
  //     setFormData(elementToEdit);
  //     setHasChanges(false);
  //   }, [elementToEdit, setFormData, setHasChanges]);

  // helper function to handle the various input state changes
  function updateFormState(name: keyof typeof formData, value: string) {
    // track the status of pending changes
    if (!hasChanges) setHasChanges(true);
    // actually update the form's state
    const data = { ...formData };
    data[name] = value as never;
    setFormData(data);
  }

  /**
   *
   */
  const onSubmitHandler = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // if (!profileData || !elementToEdit || !formData) return;

      // todo:

      // reset the dialog state
      // resetDialog(null);
    },
    [
      // comment for better diffs
      formData,
      // profileData,
      // elementToEdit,
      // updateProfileData,
      // resetDialog,
    ],
  );

  return (
    <Dialog {...props} className="max-w-lg">
      <form onSubmit={onSubmitHandler} className={"grid h-full w-full"}>
        <section className="gap-0 bg-white">
          <DialogHeader
            title={"Answer these 2 questions"}
            description={"Quick and to the point. ~2 minutes to complete."}
          />

          <section className="p-5 space-y-5 w-full">
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
                onChange={(e) => updateFormState("why", e.target.value)}
                className="input w-full h-28"
                placeholder="Share details that may be relevant (max 250 chars)"
              ></textarea>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-200 w-6 h-6">
                  2
                </div>
                <h5 className="font-semibold text-base">
                  Who can vouch for you?
                </h5>
              </div>
              <textarea
                onChange={(e) => updateFormState("who", e.target.value)}
                className="input w-full h-28"
                placeholder="Share anyone you think will vouch for you and your contributions to the Solana ecosystem (i.e. people, entities, communities) (max 250 chars)"
              ></textarea>
            </div>
          </section>

          <section className="h-full px-8 py-4 bg-slate-100">
            <section className="flex items-center w-full gap-3 place-self-end">
              <button
                type="submit"
                disabled={!hasChanges}
                className="order-2 btn w-full btn-black justify-center"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="order-1 w-full btn btn-ghost justify-center !border-gray-300"
                onClick={() => props.setIsOpen(false)}
              >
                Cancel
              </button>
            </section>
          </section>
        </section>
      </form>
    </Dialog>
  );
};
