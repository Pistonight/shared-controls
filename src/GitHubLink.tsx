import githubMark from "./github-mark.svg";
import githubMarkWhite from "./github-mark-white.svg";
import { Button } from "@fluentui/react-components";
import { useDark } from "@pistonite/pure-react";

export type GitHubLinkProps = {
    /**
     * The URL to link to
     */
    href: string;
};

/**
 * Button with GitHub icon that links to the GitHub repository
 */
export const GitHubLink: React.FC<GitHubLinkProps> = ({ href }) => {
    const dark = useDark();
    return (
        <Button
            as="a"
            appearance="subtle"
            icon={
                <img src={dark ? githubMarkWhite : githubMark} width="16px" />
            }
            href={href}
            target="_blank"
        />
    );
};
