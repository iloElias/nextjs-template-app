import { inputTheme } from "@/lib/heroui";
import {
  TimeInput as HerouiTimeInput,
  TimeInputProps as HerouiTimeInputProps,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { ClockCircle } from "@solar-icons/react";
import { useCallback, useId, useMemo, useState } from "react";
import { Button } from "../button";
import { useForm } from "./form";
import { NumberInput } from "./number-input";

export interface TimeInputProps extends HerouiTimeInputProps {
  label?: string;
  expandable?: boolean;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  expandable = false,
  ...props
}) => {
  const { initialData } = useForm();

  const id = useId();

  const name = useMemo(() => {
    if (props.name) return props.name;
    return id;
  }, [props.name, id]);

  const defaultValue = useMemo(() => {
    const date = initialData?.[name as string]
      ? new Date(initialData[name as string])
      : new Date();
    return new Time(date.getHours(), date.getMinutes(), date.getSeconds());
  }, [initialData, name]);

  const [value, setValue] = useState<Time | undefined>(defaultValue);

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleChange = useCallback(
    (hour?: number, minute?: number, second?: number) => {
      setValue(
        new Time(
          hour ?? value?.hour,
          minute ?? value?.minute,
          second ?? value?.second,
        ),
      );
    },
    [value],
  );

  const Component = (
    <HerouiTimeInput
      aria-label="time input"
      hideTimeZone
      value={value}
      onChange={(e) => handleChange(e?.hour, e?.minute, e?.second)}
      hourCycle={24}
      granularity="second"
      endContent={
        expandable ? (
          <Button
            size="sm"
            radius="full"
            className="translate-x-2 text-lg"
            onPress={() => setIsPopoverOpen(!isPopoverOpen)}
            isDisabled={props.isReadOnly}
            isIconOnly
            isControl
          >
            <ClockCircle weight="Bold" />
          </Button>
        ) : undefined
      }
      {...(inputTheme as TimeInputProps)}
      {...props}
    />
  );

  return !expandable ? (
    Component
  ) : (
    <Popover
      placement="bottom"
      offset={12}
      isOpen={isPopoverOpen}
      onOpenChange={setIsPopoverOpen}
    >
      <PopoverTrigger>{Component}</PopoverTrigger>
      <PopoverContent>
        <div className="flex max-w-52 items-center py-1">
          <NumberInput
            min={0}
            max={23}
            formatOptions={{ minimumIntegerDigits: 2 }}
            value={value?.hour ?? 0}
            onValueChange={(hour) => {
              handleChange(hour, undefined, undefined);
            }}
          />
          <span className="mx-1 text-2xl font-normal text-default-500">:</span>
          <NumberInput
            min={0}
            max={59}
            formatOptions={{ minimumIntegerDigits: 2 }}
            value={value?.minute ?? 0}
            onValueChange={(minute) =>
              handleChange(undefined, minute, undefined)
            }
          />
          <span className="mx-1 text-2xl font-normal text-default-500">:</span>
          <NumberInput
            min={0}
            max={59}
            formatOptions={{ minimumIntegerDigits: 2 }}
            value={value?.second ?? 0}
            onValueChange={(second) =>
              handleChange(undefined, undefined, second)
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
