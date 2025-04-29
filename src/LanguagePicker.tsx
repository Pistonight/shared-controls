import { useTranslation } from "react-i18next";
import {
    Menu,
    MenuButton,
    MenuItem,
    MenuItemRadio,
    MenuList,
    MenuPopover,
    MenuTrigger,
    Tooltip,
} from "@fluentui/react-components";
import { Globe20Regular } from "@fluentui/react-icons";
import {
    getLocalizedLanguageName,
    getSupportedLocales,
    setLocale,
} from "@pistonite/pure/pref";
import { useLocale } from "@pistonite/pure-react";

import type { CommonProps } from "./types.ts";
import { namespace } from "./loader.ts";

/**
 * Pick the language for Pure locale system
 */
export const LanguagePicker: React.FC<CommonProps> = ({ as = "button" }) => {
    const locale = useLocale();
    const { t } = useTranslation(namespace);
    return (
        <Menu
            checkedValues={{ locale: [locale] }}
            onCheckedValueChange={async (_, { checkedItems }) => {
                setLocale(checkedItems[0]);
            }}
        >
            <MenuTrigger disableButtonEnhancement>
                {as === "button" ? (
                    <Tooltip relationship="label" content={t("menu.language")}>
                        <MenuButton
                            appearance="subtle"
                            icon={<Globe20Regular />}
                        />
                    </Tooltip>
                ) : as === "menu" ? (
                    <MenuButton appearance="subtle" icon={<Globe20Regular />}>
                        {t("menu.language")}
                    </MenuButton>
                ) : (
                    <MenuItem icon={<Globe20Regular />}>
                        {t("menu.language")}
                    </MenuItem>
                )}
            </MenuTrigger>
            <MenuPopover>
                <MenuList>
                    {getSupportedLocales().map((lang) => (
                        <MenuItemRadio key={lang} name="locale" value={lang}>
                            {getLocalizedLanguageName(lang)}
                        </MenuItemRadio>
                    ))}
                </MenuList>
            </MenuPopover>
        </Menu>
    );
};
