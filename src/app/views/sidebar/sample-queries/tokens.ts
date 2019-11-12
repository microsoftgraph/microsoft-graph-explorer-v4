import { IQuery } from '../../../../types/query-runner';
import { IToken } from '../../../../types/sidebar';

/**
 * For more information on Tokens, see the IToken interface definition
 * This is an unordered list of all tokens that can supply
 * values for POST body templates and URL endpoints for both the demo
 * tenant and authenticated users. The demoTenantValue and
 * authenticatedUserValue fields are checked first, and then the
 * defaultValue fields.
 */

export const Tokens: IToken[] = [
  {
    placeholder: 'group-id',
    demoTenantValue: '02bd9fd6-8f93-4758-87c3-1fb73740a315',
  },
  {
    placeholder: 'drive-item-id',
    demoTenantValue: '01BYE5RZZ5OJSCSRM6BZDY7ZEFZ3NJ2QAY',
  },
  {
    placeholder: 'section-id',
    demoTenantValue: '1-fb22b2f1-379f-4da4-bf7b-be5dcca7b99a',
  },
  {
    placeholder: 'notebook-id',
    demoTenantValue: '1-fb22b2f1-379f-4da4-bf7b-be5dcca7b99a',
  },
  {
    placeholder: 'group-id-with-plan',
    demoTenantValue: '1e770bc2-3c5f-487f-871f-16fbdf1c8ed8',
  },
  {
    placeholder: 'plan-id',
    demoTenantValue: 'CONGZUWfGUu4msTgNP66e2UAAySi',
  },
  {
    placeholder: '{bucket-id}',
    demoTenantValue: '1m6FwcAAZ0eW5J1Abe7ndWUAJ1ca',
  },
  {
    placeholder: '{bucket-name}',
    demoTenantValue: 'New Bucket',
  },
  {
    placeholder: 'task-id',
    demoTenantValue: 'oIx3zN98jEmVOM-4mUJzSGUANeje',
  },
  {
    placeholder: 'task-title',
    defaultValue: 'New Task',
  },
  {
    placeholder: 'extension-id',
    demoTenantValue: 'com.contoso.roamingSettings',
  },
  {
    placeholder: 'host-name',
    demoTenantValue: 'M365x214355.sharepoint.com',
  },
  {
    placeholder: 'server-relative-path',
    demoTenantValue: 'sites/contoso/Departments/SM/MarketingDocuments',
  },
  {
    placeholder: 'group-id-for-teams',
    demoTenantValue: '02bd9fd6-8f93-4758-87c3-1fb73740a315',
  },
  {
    placeholder: 'team-id',
    demoTenantValue: '02bd9fd6-8f93-4758-87c3-1fb73740a315',
  },
  {
    placeholder: 'channel-id',
    demoTenantValue: '19:d0bba23c2fc8413991125a43a54cc30e@thread.skype',
  },
  {
    placeholder: 'message-id',
    demoTenantValue: '1501527481624',
  },
  {
    placeholder: 'reply-id',
    demoTenantValue: '1501527483334',
  },
  {
    placeholder: 'application-id',
    demoTenantValue: '03c2bc3d-adaf-45b9-86e2-e95bddc6ad3d',
  },
  {
    placeholder: 'destination-address',
    demoTenantValue: '1.2.3.5',
  },
  {
    placeholder: 'today',
    defaultValueFn: () => {
      return (new Date()).toISOString();
    },
  },
  {
    placeholder: 'todayMinusHour',
    defaultValueFn: () => {
      const todayMinusHour = new Date();
      todayMinusHour.setHours(new Date().getHours() - 1);
      return todayMinusHour.toISOString();
    },
  },
  {
    placeholder: 'coworker-mail',
    demoTenantValue: 'meganb@M365x214355.onmicrosoft.com',
    authenticatedUserValueFn: () => {
      // return AppComponent.explorerValues.authentication.user.emailAddress;
    },
  },
  {
    placeholder: 'next-week',
    defaultValueFn: () => {
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);
      return nextWeek.toISOString();
    },
  },
  {
    placeholder: 'user-mail',
    demoTenantValue: 'MiriamG@M365x214355.onmicrosoft.com',
    authenticatedUserValueFn: () => {
      // return AppComponent.explorerValues.authentication.user.emailAddress;
    },
  },
  {
    placeholder: 'domain',
    defaultValueFn: () => {
      return 'contoso.com';
    },
    authenticatedUserValueFn: () => {
      // return AppComponent.explorerValues.authentication.user.emailAddress.split('@')[1];
    },
  },
  {
    placeholder: 'list-id',
    defaultValue: 'd7689e2b-941a-4cd3-bb24-55cddee54294',
  },
  {
    placeholder: 'list-title',
    defaultValue: 'Contoso Home',
  },
];


/*
 * Given a token, go through each of the possible replacement scenarios and find which value to
 * replace the token with.
 * Order: Authenticated user values, demo tenant replacament values, default replacement values.
 */
export function getTokenSubstituteValue(token: IToken) {
  const priorityOrder = []; // Desc

  const isAuthenticated = false; // isAuthenticated();
  if (isAuthenticated) {
    priorityOrder.push(token.authenticatedUserValueFn);
    priorityOrder.push(token.authenticatedUserValue);
  } else {
    priorityOrder.push(token.demoTenantValueFn);
    priorityOrder.push(token.demoTenantValue);
  }

  priorityOrder.push(token.defaultValueFn);
  priorityOrder.push(token.defaultValue);

  for (const tokenVal of priorityOrder) {
    if (!tokenVal) {
      continue;
    }
    if (typeof tokenVal === 'string') {
      return tokenVal;
    } else if (typeof tokenVal === 'function') {
      return tokenVal();
    }
  }

}

/**
 * Given a query, replace all tokens in the request URL and the POST body with thier
 * values.  When a token is found, use getTokenSubstituteValue() to find the right
 * value to substitute based on the session.
 */

export function substituteTokens(query: IQuery) {
  type QueryFields = keyof IQuery;

  for (const token of Tokens) {
    const queryFieldsToCheck: QueryFields[] = ['sampleBody', 'sampleUrl'];

    for (const queryField of queryFieldsToCheck) {
      if (!query[queryField]) { // If the sample doesn't have a post body, don't search for tokens in it
        continue;
      }

      if ((query[queryField] as string).indexOf(`{${token.placeholder}}`) !== -1) {
        const substitutedValue = getTokenSubstituteValue(token);
        if (!substitutedValue) {
          continue;
        }
        query[queryField] = (query[queryField] as string).replace(`{${token.placeholder}}`, substitutedValue);
      }
    }
  }
}