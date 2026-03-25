import { ModalContentProps, ModalProps } from "@heroui/react";
import { UseDisclosureReturn } from "@heroui/use-disclosure";
import { Modal, ModalContent } from "./modal";

export interface DialogueProps extends Omit<ModalProps, "children"> {
  disclosure: UseDisclosureReturn;
  children: ModalContentProps["children"];
}

export const Dialogue: React.FC<DialogueProps> = ({
  disclosure,
  children,
  ...props
}) => {
  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} {...props}>
      <ModalContent>{children}</ModalContent>
    </Modal>
  );
};
