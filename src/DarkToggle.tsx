import { Button } from "@fluentui/react-components";
import {
    WeatherMoon20Regular,
    WeatherSunny20Regular,
} from "@fluentui/react-icons";
import { useDark } from "@pistonite/pure-react";
import { setDark } from "@pistonite/pure/pref";

/**
 * Toggle the Pure dark mode system
 */
export const DarkToggle: React.FC = () => {
    const dark = useDark();
    return (
        <Button
            appearance="subtle"
            icon={dark ? <WeatherSunny20Regular /> : <WeatherMoon20Regular />}
            onClick={() => setDark(!dark)}
        />
    );
};
