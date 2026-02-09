"use client";

import { useSession } from "@/hooks/use-session";
import { Badge, Button, cn, Spinner, useDisclosure } from "@heroui/react";
import { Bell, Notes } from "@solar-icons/react";
import { Dialogue } from "../dialogue";
import { ModalBody, ModalFooter, ModalHeader } from "../modal";

export const UserNotificationButton: React.FC = () => {
  const disclosure = useDisclosure();
  const { user } = useSession();

  if (!user) {
    return <LazyUserNotificationMenu />;
  }

  const notifications: string[] = [];

  return (
    <>
      <Badge
        color="default"
        content={notifications.length}
        isInvisible={notifications.length === 0}
      >
        <Button
          radius="md"
          className="bg-default-100 text-default-700 shadow-sm duration-100 hover:bg-default-200"
          onPress={disclosure.onOpen}
          isIconOnly
        >
          <Bell weight="LineDuotone" />
        </Button>
      </Badge>
      <Dialogue disclosure={disclosure} size="lg">
        <ModalHeader>Notificações</ModalHeader>
        <ModalBody className="min-h-24 pr-2">
          {notifications.length !== 0 ? (
            <div className="max-h-52 overflow-y-auto pr-2">
              <NotificationsRenderer messages={notifications} />
            </div>
          ) : (
            <p className="mt-8 size-full text-center">
              Você não tem nenhuma notificação.
            </p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={disclosure.onClose}>
            Fechar
          </Button>
        </ModalFooter>
      </Dialogue>
    </>
  );
};

export interface NotificationProps {
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Notification: React.FC<NotificationProps> = ({
  className,
  icon,
  children,
}) => {
  return (
    <div className="flex flex-row items-start gap-2">
      <div className="flex h-6 w-6 items-center align-middle">
        {icon || <Notes weight="LineDuotone" />}
      </div>
      <p className={cn("text-sm", className)}>{children}</p>
    </div>
  );
};

export interface NotificationsRendererProps {
  messages?: React.ReactNode[];
  children?: React.ReactNode;
}

export const NotificationsRenderer: React.FC<NotificationsRendererProps> = ({
  messages,
  children,
}) => {
  if (!messages && !children) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Notification className="text-default-500">
          Você não tem nenhuma mensagem!
        </Notification>
      </div>
    );
  }
  return (
    <>
      {children}
      {messages?.map((msg, idx) => (
        <Notification key={idx}>{msg}</Notification>
      ))}
    </>
  );
};

export const LazyUserNotificationMenu: React.FC = () => {
  return (
    <Button isIconOnly>
      <Spinner color="current" className="scale-80 text-default-500" />
    </Button>
  );
};
