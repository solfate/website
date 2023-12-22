import { Dispatch, Fragment, SetStateAction, memo } from "react";

import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import styles from "@/styles/Dialog.module.css";

export type DialogProps = SimpleComponentProps & {
  isLoading?: boolean;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
  onSubmitHandler?: Function;
};

export default function Dialog({
  isOpen,
  setIsOpen,
  children,
  className = "max-w-md",
}: DialogProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className={styles.dialog}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <div className={styles.overlay} aria-hidden="true" />
        </Transition.Child>

        <div className={styles.container}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <HeadlessDialog.Panel
              className={`${styles.panel} !p-0 ${className}`}
            >
              {children}
            </HeadlessDialog.Panel>
          </Transition.Child>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}

export const DialogHeader = memo(
  ({ title, description }: { title: string; description?: string }) => (
    <section className="p-5 text-center border-b h-min border-slate-200">
      <h4 className="text-xl font-semibold">{title}</h4>
      {!!description && <p className="text-sm text-gray-500">{description}</p>}
    </section>
  ),
);
