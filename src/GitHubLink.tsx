import { Button, MenuItem } from "@fluentui/react-components";
import { useDark } from "@pistonite/pure-react";

import githubMark from "./github-mark.svg";
import githubMarkWhite from "./github-mark-white.svg";

export type GitHubLinkProps = {
    /**
     * The URL to link to
     */
    href: string;

    as?: "button" | "submenu";
};

/**
 * Button with GitHub icon that links to the GitHub repository
 */
export const GitHubLink: React.FC<GitHubLinkProps> = ({
    href,
    as = "button",
}) => {
    const dark = useDark();
    const $Icon = (
        <img src={dark ? githubMarkWhite : githubMark} width="16px" />
    );
    if (as === "button") {
        return (
            <Button
                as="a"
                appearance="subtle"
                icon={$Icon}
                href={href}
                target="_blank"
            />
        );
    }

    return (
        <MenuItem icon={$Icon} onClick={() => window.open(href, "_blank")}>
            GitHub
        </MenuItem>
    );
};
