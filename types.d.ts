/**
 * Master global types for the website/app
 */

type Option<T> = T | null;

type SimpleComponentProps = {
  children?: React.ReactNode;
  className?: string;
};

type ImageSize = {
  width: number;
  height: number;
};

/**
 * Define simple type definitions of the env variables
 */
declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * General variables and settings
     */

    /**
     * Auth related variables
     */
    TWITTER_CLIENT_ID: string;
    TWITTER_CLIENT_SECRET: string;
    GITHUB_ID: string;
    GITHUB_SECRET: string;

    /**
     * Assorted service API keys
     */
    UNDERDOG_API_KEY: string;
  }
}
