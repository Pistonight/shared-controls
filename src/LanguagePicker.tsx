import {
    Menu,
    MenuButton,
    MenuItemRadio,
    MenuList,
    MenuPopover,
    MenuTrigger,
} from "@fluentui/react-components";
import { Globe20Regular } from "@fluentui/react-icons";
import {
    getLocalizedLanguageName,
    getSupportedLocales,
    setLocale,
} from "@pistonite/pure/pref";
import { useLocale } from "@pistonite/pure-react";

/**
 * Pick the language for Pure locale system
 */
export const LanguagePicker: React.FC = () => {
    const locale = useLocale();
    return (
        <Menu
            checkedValues={{ locale: [locale] }}
            onCheckedValueChange={async (_, { checkedItems }) => {
                setLocale(checkedItems[0]);
            }}
        >
            <MenuTrigger disableButtonEnhancement>
                <MenuButton appearance="subtle" icon={<Globe20Regular />} />
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
