import { useTranslation } from "react-i18next";
import { Button, Tooltip } from "@fluentui/react-components";
import {
    WeatherMoon20Regular,
    WeatherSunny20Regular,
} from "@fluentui/react-icons";
import { useDark } from "@pistonite/pure-react";
import { setDark } from "@pistonite/pure/pref";

import { namespace } from "./loader.ts";
import { MenuSwitch } from "./MenuSwitch.tsx";

export type DarkToggleProps = {
    as?: "button" | "submenu";
};

/**
 * Toggle the Pure dark mode system
 */
export const DarkToggle: React.FC<DarkToggleProps> = ({ as = "button" }) => {
    const dark = useDark();
    const { t } = useTranslation(namespace);
    if (as === "button") {
        return (
            <Tooltip relationship="label" content={t("menu.dark")}>
                <Button
                    appearance="subtle"
                    icon={
                        dark ? (
                            <WeatherSunny20Regular />
                        ) : (
                            <WeatherMoon20Regular />
                        )
                    }
                    onClick={() => setDark(!dark)}
                />
            </Tooltip>
        );
    }
    return (
        <MenuSwitch
            checked={dark}
            onChange={() => setDark(!dark)}
            icon={<WeatherMoon20Regular />}
        >
            {t("menu.dark")}
        </MenuSwitch>
    );
};
