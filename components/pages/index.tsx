"use client";

import {Input} from "@/components/form/input";
import {TextArea} from "@/components/form/textarea";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import {DatePicker} from "../form/date-picker";
import {Section} from "../layout/section";
import {SelectMultiple} from "../form/select-multiple";
import {Select, SelectOption} from "../form/select";

const selectItems: SelectOption[] = [
  {label: "Item 1", description: "Description 1", key: 1},
  {label: "Item 2", description: "Description 2", key: 2},
  {label: "Item 3", description: "Description 3", key: 3},
];

export default function Home() {
  const disclosure = useDisclosure();

  return (
    <Section className="flex flex-col gap-4 max-w-md">
      <Input placeholder="Enter your name" label="Name" />
      <TextArea placeholder="Enter your name" label="Name" />

      <Select label="Select" items={selectItems} />
      <SelectMultiple label="Select Multiple" items={selectItems} />

      <DatePicker label="Date" />

      <Button onPress={disclosure.onOpen}>Click me</Button>
      <Modal isOpen={disclosure.isOpen} onOpenChange={disclosure.onOpenChange}>
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>Modal Title</ModalBody>
          <ModalFooter>Modal Title</ModalFooter>
        </ModalContent>
      </Modal>
    </Section>
  );
}
