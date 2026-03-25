"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/form/input";
import { Select } from "@/components/form/select";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/modal";
import { useScopedI18n } from "@/locales/client";
import {
  DEFAULT_PRINT_SETTINGS,
  type ColorMode,
  type PageOrientation,
  type PageSize,
  type PrintSettings,
} from "@/types/print";
import { Checkbox } from "@heroui/react";
import { useLocalStorage } from "ilias-use-storage";
import { useState } from "react";

interface PrintSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAGE_SIZES: PageSize[] = ["A4", "Letter", "Legal", "A3", "A5"];

export function PrintSettingsModal({
  isOpen,
  onClose,
}: PrintSettingsModalProps) {
  const t = useScopedI18n("markdown-projects");
  const [settings, setSettings] = useLocalStorage<PrintSettings>(
    "print-settings",
    DEFAULT_PRINT_SETTINGS,
  );
  const [localSettings, setLocalSettings] = useState<PrintSettings>(settings);
  const [useUniformMargins, setUseUniformMargins] = useState(
    settings.marginTop === settings.marginRight &&
      settings.marginRight === settings.marginBottom &&
      settings.marginBottom === settings.marginLeft,
  );

  function handleSave() {
    setSettings(localSettings);
    onClose();
  }

  function handleReset() {
    setLocalSettings(DEFAULT_PRINT_SETTINGS);
    setUseUniformMargins(true);
  }

  function handleMarginChange(side: string, value: string) {
    if (useUniformMargins) {
      setLocalSettings({
        ...localSettings,
        marginTop: value,
        marginRight: value,
        marginBottom: value,
        marginLeft: value,
      });
    } else {
      setLocalSettings({
        ...localSettings,
        [`margin${side}`]: value,
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>
          <div>
            <h2 className="text-xl font-semibold">{t("printSettings")}</h2>
            <p className="text-sm font-normal text-default-500">
              {t("printSettingsDescription")}
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="gap-2">
          {/* Page Setup */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <Select
                label={t("pageSize")}
                selectedKeys={[localSettings.pageSize]}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    pageSize: e.target.value as PageSize,
                  })
                }
                items={PAGE_SIZES.map((size) => ({ key: size, label: size }))}
              />

              <Select
                label={t("pageOrientation")}
                selectedKeys={[localSettings.orientation]}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    orientation: e.target.value as PageOrientation,
                  })
                }
                items={[
                  { key: "portrait", label: t("portrait") },
                  { key: "landscape", label: t("landscape") },
                ]}
              />
            </div>
          </div>

          {/* Margins */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t("margins")}</label>
              <Checkbox
                size="sm"
                isSelected={useUniformMargins}
                onValueChange={(checked) => {
                  setUseUniformMargins(checked);
                  if (checked) {
                    const margin = localSettings.marginTop;
                    setLocalSettings({
                      ...localSettings,
                      marginTop: margin,
                      marginRight: margin,
                      marginBottom: margin,
                      marginLeft: margin,
                    });
                  }
                }}
              >
                {t("uniformMargins")}
              </Checkbox>
            </div>

            {useUniformMargins ? (
              <Input
                value={localSettings.marginTop}
                onChange={(e) => handleMarginChange("Top", e.target.value)}
                placeholder="20mm"
                description="Examples: 20mm, 1in, 1.5cm"
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label={t("marginTop")}
                  value={localSettings.marginTop}
                  onChange={(e) => handleMarginChange("Top", e.target.value)}
                  placeholder="20mm"
                />
                <Input
                  label={t("marginRight")}
                  value={localSettings.marginRight}
                  onChange={(e) => handleMarginChange("Right", e.target.value)}
                  placeholder="20mm"
                />
                <Input
                  label={t("marginBottom")}
                  value={localSettings.marginBottom}
                  onChange={(e) => handleMarginChange("Bottom", e.target.value)}
                  placeholder="20mm"
                />
                <Input
                  label={t("marginLeft")}
                  value={localSettings.marginLeft}
                  onChange={(e) => handleMarginChange("Left", e.target.value)}
                  placeholder="20mm"
                />
              </div>
            )}
          </div>

          {/* Header & Footer */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("headerFooter")}</label>
            <div className="pt1 flex flex-col gap-1 pl-2">
              <Checkbox
                isSelected={localSettings.showTitle}
                onValueChange={(checked) =>
                  setLocalSettings({ ...localSettings, showTitle: checked })
                }
              >
                {t("showTitle")}
              </Checkbox>
              <Checkbox
                isSelected={localSettings.showPageNumbers}
                onValueChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    showPageNumbers: checked,
                  })
                }
              >
                {t("showPageNumbers")}
              </Checkbox>
              <Checkbox
                isSelected={localSettings.showDate}
                onValueChange={(checked) =>
                  setLocalSettings({ ...localSettings, showDate: checked })
                }
              >
                {t("showDate")}
              </Checkbox>
            </div>
          </div>

          {/* Appearance */}
          <div className="space-y-2">
            <label className="text-sm font-medium">{t("appearance")}</label>
            <div className="py-1">
              <Select
                aria-label="color mode"
                description={t("colorMode")}
                selectedKeys={[localSettings.colorMode]}
                onChange={(e) =>
                  setLocalSettings({
                    ...localSettings,
                    colorMode: e.target.value as ColorMode,
                  })
                }
                items={[
                  { key: "color", label: t("color") },
                  { key: "grayscale", label: t("grayscale") },
                ]}
              />
              <Checkbox
                className="ml-2 pl-0"
                isSelected={localSettings.printBackgrounds}
                onValueChange={(checked) =>
                  setLocalSettings({
                    ...localSettings,
                    printBackgrounds: checked,
                  })
                }
              >
                {t("printBackgrounds")}
              </Checkbox>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="gap-2">
          <Button variant="flat" onPress={handleReset}>
            {t("resetDefaults")}
          </Button>
          <div className="flex-1" />
          <Button variant="flat" onPress={onClose}>
            {t("cancel")}
          </Button>
          <Button color="primary" onPress={handleSave}>
            {t("edit")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
