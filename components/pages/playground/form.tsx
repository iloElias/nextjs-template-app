"use client";

import { Input } from "@/components/form/input";
import { TextArea } from "@/components/form/textarea";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { DatePicker } from "../../form/date-picker";
import { Section } from "../../layout/section";
import { SelectMultiple } from "../../form/select-multiple";
import { Select, SelectOption } from "../../form/select";
import { Form } from "../../form/form";

const selectItems: SelectOption[] = [
  { label: "Item 1", description: "Description 1", key: 1 },
  { label: "Item 2", description: "Description 2", key: 2 },
  { label: "Item 3", description: "Description 3", key: 3 },
];

export default function FormPage() {
  const disclosure = useDisclosure();

  return (
    <Section className="flex flex-col gap-4 max-w-md">
      <Form
        initialData={{
          name: "piece of shit",
        }}
        action=""
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          console.log(Object.fromEntries(new FormData(e.currentTarget)));
        }}
      >
        <Input name="name" label="Name" placeholder="Enter your name" />
        <TextArea
          name="description"
          label="Description"
          placeholder="Write a description"
        />
        <Select name="item" label="Select" items={selectItems} />
        <SelectMultiple
          name="items"
          label="Select Multiple"
          items={selectItems}
        />
        <DatePicker name="date" label="Date" />
        <Button type="submit">Submit</Button>
      </Form>
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
