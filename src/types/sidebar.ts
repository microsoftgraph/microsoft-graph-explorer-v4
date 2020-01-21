export interface ISidebarProps {
  showSidebar: boolean;
  mobileScreen: boolean;
}

export interface IBanner {
  optOut: Function;
  intl: {
    message: object;
  };
}

/**
 * Tokens are used as placeholder values in sample queries to cover many scenarios:
 * - ID tokens for sample tenant nodes like user IDs, file IDs and other string constants
 * - Tokens that must be determined at runtime like the current date
 * - Tokens that are determined from the authenticated users session
 * - Tokens can be in the POST body or part of the URL
 *
 * The token fields are split into default, demo and authenticated. If neither the demo or
 * auth values are supplied, the token falls back to the default value.
 *
 * Tokens are maintained in tokens.ts.
 */

export interface IToken {
  placeholder: string;

  // Base defaults to replace the placeholder with. Not used if any of the below are defined
  defaultValue?: string;
  defaultValueFn?: Function;

  // When the user is not authenticated, use these values for the demo tenant
  demoTenantValue?: string;
  demoTenantValueFn?: Function;

  // When the user is authenticated with MSA or AAD, replace token with these values
  authenticatedUserValue?: string;
  authenticatedUserValueFn?: Function;
}