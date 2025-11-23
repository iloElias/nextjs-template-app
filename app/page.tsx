"use client";

import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";

export default function Home() {
  const disclosure = useDisclosure();

  return (
    <>
      <Button onPress={disclosure.onOpen}>Click me</Button>
      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>Modal Title</ModalBody>
          <ModalHeader>Modal Title</ModalHeader>
        </ModalContent>
      </Modal>
    </>
  );
}
