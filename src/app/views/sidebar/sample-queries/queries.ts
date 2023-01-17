/* eslint-disable max-len */
import { ISampleQuery } from '../../../../types/query-runner';

export const queries: ISampleQuery[] = [
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'my profile',
    requestUrl: '/v1.0/me',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-get',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'my profile (beta)',
    requestUrl: '/beta/me/profile',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/profile-get?view=graph-rest-beta&tabs=http',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'my photo',
    requestUrl: '/v1.0/me/photo/$value',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'my mail',
    requestUrl: '/v1.0/me/messages',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'list items in my drive',
    requestUrl: '/v1.0/me/drive/root/children',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'items trending around me',
    requestUrl: '/beta/me/insights/trending',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/insights-list-trending?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'my manager',
    requestUrl: '/v1.0/me/manager',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-manager?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Getting Started',
    method: 'GET',
    humanName: 'my To Do task lists',
    requestUrl: '/v1.0/me/todo/lists',
    tip: 'This query requires the Tasks.ReadWrite permission',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/todo-list-lists?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'count the users in your tenant excluding guests (raw count)',
    requestUrl: '/v1.0/users/$count?$filter=userType ne \'guest\'',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-beta&tabs=http#example-6-get-only-a-count-of-users',
    tip: 'You are using the advanced query capabilities for Directory Objects, please send us feedback here: https://aka.ms/aadmgs',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'my direct reports',
    requestUrl: '/v1.0/me/directReports',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-directreports?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'all users in the organization',
    requestUrl: '/v1.0/users',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/users?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'all guest users in the organization',
    requestUrl: '/v1.0/users/?$filter=userType eq \'guest\'',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/users?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'count the guest users in your organization',
    requestUrl: '/v1.0/users/$count?$filter=userType eq \'guest\'',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list?view=graph-rest-beta&tabs=http#example-6-get-only-a-count-of-users',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'all users in the Finance department sorted by name with count',
    requestUrl: '/v1.0/users?$count=true&$filter=Department eq \'Finance\'&$orderBy=displayName&$select=id,displayName,department',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/users?view=graph-rest-1.0',
    tip: 'You are using the advanced query capabilities for Directory Objects, please send us feedback here: https://aka.ms/aadmgs',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'users with displayName containing "room", mail ending with "microsoft.com", and sorted by name',
    requestUrl: '/v1.0/users?$count=true&$search="displayName:room"&$filter=endsWith(mail,\'microsoft.com\')&$orderBy=displayName&$select=id,displayName,mail',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/users?view=graph-rest-1.0',
    tip: 'You are using the advanced query capabilities for Directory Objects, please send us feedback here: https://aka.ms/aadmgs',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'me',
    requestUrl: '/v1.0/me',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'PATCH',
    humanName: 'me',
    requestUrl: '/v1.0/me',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "department": "Sales & Marketing"\r\n    }',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'my skills',
    requestUrl: '/v1.0/me/?$select=displayName,skills',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'user by email',
    requestUrl: '/v1.0/users/{user-mail}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'user identities',
    requestUrl: '/v1.0/users/{id}/identities',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/user?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback. You can also use \'userPrincipalName\' in place of \'id\'',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'all my Planner tasks',
    requestUrl: '/beta/me/planner/tasks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/planner-overview?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'POST',
    humanName: 'create user',
    requestUrl: '/v1.0/users',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-post-users?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "accountEnabled": true,\r\n        "city": "Seattle",\r\n        "country": "United States",\r\n        "department": "Sales & Marketing",\r\n        "displayName": "Melissa Darrow",\r\n        "givenName": "Melissa",\r\n        "jobTitle": "Marketing Director",\r\n        "mailNickname": "MelissaD",\r\n        "passwordPolicies": "DisablePasswordExpiration",\r\n        "passwordProfile": {\r\n            "password": "{Placeholder Password}",\r\n            "forceChangePasswordNextSignIn": false\r\n        },\r\n        "officeLocation": "131/1105",\r\n        "postalCode": "98052",\r\n        "preferredLanguage": "en-US",\r\n        "state": "WA",\r\n        "streetAddress": "9256 Towne Center Dr., Suite 400",\r\n        "surname": "Darrow",\r\n        "mobilePhone": "+1 206 555 0110",\r\n        "usageLocation": "US",\r\n        "userPrincipalName": "MelissaD@{domain}"\r\n    }',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'PATCH',
    humanName: 'update user',
    requestUrl: '/v1.0/users/{id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "department": "Sales & Marketing"\r\n    }',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback. You can also use \'userPrincipalName\' in place of \'id\'',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'track user changes',
    requestUrl: '/v1.0/users/delta?$select=displayName,givenName,surname',
    docLink: 'https://learn.microsoft.com/en-us/graph/delta-query-users',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'get my presence ',
    requestUrl: '/beta/me/presence',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/presence-get?view=graph-rest-beta&tabs=http',
    tip: 'This query requires Presence.Read permissions',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'GET',
    humanName: 'get a user\'s presence ',
    requestUrl: '/beta/users/{user-id}/presence',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/cloudcommunications-getpresencesbyuserid?view=graph-rest-beta&tabs=http',
    tip: 'This query requires a user ID and the Presence.Read.All permission. Use the following call to get a user ID:  GET https://graph.microsoft.com/v1.0/users',
    skipTest: false
  },
  {
    category: 'Users',
    method: 'DELETE',
    humanName: 'delete user',
    requestUrl: '/v1.0/users/{id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-delete?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/UsersAPIFeedback. You can also use \'userPrincipalName\' in place of \'id\'',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'list all groups in my organization',
    requestUrl: '/v1.0/groups',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-list?view=graph-rest-1.0&tabs=http',
    tip: 'Please provide us with feedback on the groups API here: https://aka.ms/GroupsAPIFeedback',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'get properties and relationships of group',
    requestUrl: '/v1.0/groups/{group-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-get?view=graph-rest-1.0&tabs=http',
    tip: 'Please provide us with feedback on the groups API here: https://aka.ms/GroupsAPIFeedback. To get group-id run https://graph.microsoft.com/v1.0/groups/',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'POST',
    humanName: 'create a new group',
    requestUrl: '/v1.0/groups',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-post-groups?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'Please provide us with feedback on the groups API here: https://aka.ms/GroupsAPIFeedback',
    postBody: '{\r\n  "displayName": "Library Assist",\r\n  "mailEnabled": true,\r\n  "mailNickname": "library",\r\n  "securityEnabled": true\r\n}',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'POST',
    humanName: 'add member to group',
    requestUrl: '/v1.0/groups/{group-id}/members/$ref',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-post-members?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'Please provide us with feedback on the groups API here: https://aka.ms/GroupsAPIFeedback. To get group-id run https://graph.microsoft.com/v1.0/groups/',
    postBody: '{\r\n  "@odata.id":"https://graph.microsoft.com/v1.0/directoryObjects/{id}"\r\n}',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'DELETE',
    humanName: 'remove member from group',
    requestUrl: '/v1.0/groups/{group-id}/members/{member-id}/$ref',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-delete-members?view=graph-rest-1.0&tabs=http',
    tip: 'Please provide us with feedback on the groups API here: https://aka.ms/GroupsAPIFeedback. To get group-id run https://graph.microsoft.com/v1.0/groups/. To get member-id https://graph.microsoft.com/v1.0/groups/{id}/members',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'DELETE',
    humanName: 'delete group',
    requestUrl: '/v1.0/groups/{group-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-delete?view=graph-rest-1.0&tabs=http',
    tip: 'Please provide us with feedback on the groups API here: https://aka.ms/GroupsAPIFeedback. To get group-id run https://graph.microsoft.com/v1.0/groups/',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'all groups I belong to (direct or indirect membership) with count',
    requestUrl: '/v1.0/me/transitiveMemberOf/microsoft.graph.group?$count=true',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-memberof?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'direct members of a group with count',
    requestUrl: '/v1.0/groups/{group-id}/members?$count=true',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-list-members?view=graph-rest-1.0',
    tip: 'This query requires a group id.  To find the ID of a group you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/memberOf',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'group\'s conversations',
    requestUrl: '/v1.0/groups/{group-id}/conversations',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-list-conversations?view=graph-rest-1.0',
    tip: 'This query requires a group id.  To find the ID of a group you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/memberOf',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'group\'s events',
    requestUrl: '/v1.0/groups/{group-id}/events',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-list-events?view=graph-rest-1.0',
    tip: 'This query requires a group id.  To find the ID of a group you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/memberOf',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'POST',
    humanName: 'add favorite group',
    requestUrl: '/v1.0/groups/{group-id}/addFavorite',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-addfavorite?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'This query requires a group id.  To find the ID of a group you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/memberOf',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'items in a group drive',
    requestUrl: '/v1.0/groups/{group-id}/drive/items/root/children',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0&tabs=http',
    tip: 'This query requires a group id.  To find the ID of a group you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/memberOf',
    skipTest: false
  },
  {
    category: 'Groups',
    method: 'GET',
    humanName: 'track group changes',
    requestUrl: '/v1.0/groups/delta?$select=displayName,description',
    docLink: 'https://learn.microsoft.com/en-us/graph/delta-query-groups',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'my high important mail',
    requestUrl: '/v1.0/me/messages?$filter=importance eq \'high\'',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'my mails from an address',
    requestUrl: '/v1.0/me/messages?$filter=(from/emailAddress/address) eq \'{user-mail}\'',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'my mail that has \'Hello World\'',
    requestUrl: '/v1.0/me/messages?$search="hello world"',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'POST',
    humanName: 'send an email',
    requestUrl: '/v1.0/me/sendMail',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-sendmail?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "message": {\r\n            "subject": "Meet for lunch?",\r\n            "body": {\r\n                "contentType": "Text",\r\n                "content": "The new cafeteria is open."\r\n            },\r\n            "toRecipients": [\r\n                {\r\n                    "emailAddress": {\r\n                    "address": "garthf@contoso.com"\r\n                    }\r\n                }\r\n            ]\r\n        }}',
    tip: 'Update the Request Body and select Run Query.',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'POST',
    humanName: 'forward mail',
    requestUrl: '/v1.0/me/messages/{message-id}/forward',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/message-forward?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "comment": "FYI",\r\n  "toRecipients": [\r\n    {\r\n      "emailAddress": {\r\n        "address": "{user-mail}",\r\n        "name": "Alex Darrow"\r\n      }\r\n    }\r\n  ]\r\n}',
    tip: 'This query requires a message id. To get the ID, run the following query, find the message in the response and use its ID property: GET https://graph.microsoft.com/v1.0/me/messages',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'track email changes',
    requestUrl: '/v1.0/me/mailFolders/Inbox/messages/delta',
    docLink: 'https://learn.microsoft.com/en-us/graph/delta-query-messages',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'my inbox rules',
    requestUrl: '/beta/me/mailFolders/inbox/messagerules',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/messagerule?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'my outlook categories',
    requestUrl: '/beta/me/outlook/masterCategories',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/outlookuser-list-mastercategories?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'get email headers',
    requestUrl: '/beta/me/messages?$select=internetMessageHeaders&$top=1',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/message?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Outlook Mail',
    method: 'GET',
    humanName: 'list conference rooms',
    requestUrl: '/beta/me/findRooms',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-findrooms?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Outlook Mail (beta)',
    method: 'GET',
    humanName: 'email I\'m @ mentioned',
    requestUrl: '/beta/me/messages?$filter=mentionsPreview/isMentioned eq true&$select=subject,sender,receivedDateTime',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'GET',
    humanName: 'my events for the next week',
    requestUrl: '/v1.0/me/calendarview?startdatetime={today}&enddatetime={next-week}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-calendarview?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'GET',
    humanName: 'all events in my calendar',
    requestUrl: '/v1.0/me/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-events?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'GET',
    humanName: 'all my calendars',
    requestUrl: '/v1.0/me/calendars',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-calendars?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'POST',
    humanName: 'find meeting time',
    requestUrl: '/v1.0/me/findMeetingTimes',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-findmeetingtimes?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "attendees": [\r\n            {\r\n            "emailAddress": {\r\n                "address": "{user-mail}",\r\n                "name": "Alex Darrow"\r\n            },\r\n            "type": "Required"\r\n            }\r\n        ],\r\n        "timeConstraint": {\r\n            "timeslots": [\r\n            {\r\n            "start": {\r\n                "dateTime": "{today}",\r\n                "timeZone": "Pacific Standard Time"\r\n                },\r\n                "end": {\r\n                "dateTime": "{next-week}",\r\n                "timeZone": "Pacific Standard Time"\r\n                }\r\n            }\r\n            ]\r\n        },\r\n        "locationConstraint": {\r\n        "isRequired": "false",\r\n        "suggestLocation": "true",\r\n        "locations": [\r\n            {\r\n            "displayName": "Conf Room 32/1368",\r\n            "locationEmailAddress": "conf32room1368@imgeek.onmicrosoft.com"\r\n            }\r\n        ]\r\n        },\r\n        "meetingDuration": "PT1H"\r\n        }',
    tip: 'Update the Request Body and select Run Query.',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'POST',
    humanName: 'schedule a meeting',
    requestUrl: '/v1.0/me/events',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-post-events?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "subject": "My event",\r\n        "start": {\r\n            "dateTime": "{today}",\r\n            "timeZone": "UTC"\r\n        },\r\n        "end": {\r\n            "dateTime": "{next-week}",\r\n            "timeZone": "UTC"\r\n        }\r\n    }',
    tip: 'Update the Request Body and select Run Query.',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'POST',
    humanName: 'add graph community call',
    requestUrl: '/v1.0/me/events',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-post-events?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "subject": "Microsoft Graph Community call",\r\n  "body": {\r\n    "contentType": "HTML",\r\n    "content": "Call link: https://aka.ms/mmkv1b Submit a question: https://aka.ms/ybuw2i"\r\n  },\r\n  "start": {\r\n      "dateTime": "2018-09-04T08:00:00",\r\n      "timeZone": "Pacific Standard Time"\r\n  },\r\n  "end": {\r\n      "dateTime": "2018-09-04T09:00:00",\r\n      "timeZone": "Pacific Standard Time"\r\n  },\r\n  "location":{\r\n      "displayName":"Skype for Business"\r\n  },\r\n    "recurrence": {\r\n      "pattern": {\r\n      "type": "relativeMonthly",\r\n      "interval": 1,\r\n      "daysOfWeek": [ "Tuesday" ],\r\n      "index": "first"\r\n    },\r\n      "range": {\r\n        "type": "noEnd",\r\n        "startDate": "2017-08-29"\r\n      }\r\n    }\r\n}',
    tip: 'Creates the monthly Microsoft Graph community call on your calendar.',
    skipTest: false
  },
  {
    category: 'Outlook Calendar',
    method: 'GET',
    humanName: 'track changes on my events for the next week',
    requestUrl: '/v1.0/me/calendarView/delta?startDateTime={today}&endDateTime={next-week}',
    docLink: 'https://learn.microsoft.com/en-us/graph/delta-query-events',
    tip: 'This query uses date and time parameters. Use an ISO 8601 format. For example, "2017-04-30T19:00:00.0000000".',
    skipTest: false
  },
  {
    category: 'Personal Contacts',
    method: 'GET',
    humanName: 'my contacts',
    requestUrl: '/v1.0/me/contacts',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-contacts?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Personal Contacts',
    method: 'POST',
    humanName: 'add contact',
    requestUrl: '/v1.0/me/contacts',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-post-contacts?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "givenName": "Pavel",\r\n    "surname": "Bansky",\r\n    "emailAddresses": [\r\n        {\r\n        "address": "pavelb@fabrikam.onmicrosoft.com",\r\n        "name": "Pavel Bansky"\r\n        }\r\n    ],\r\n    "businessPhones": [\r\n        "+1 732 555 0102"\r\n    ]\r\n}',
    tip: 'Update the Request Body and select Run Query.',
    skipTest: false
  },
  {
    category: 'OneDrive',
    method: 'GET',
    humanName: 'list items in my drive',
    requestUrl: '/v1.0/me/drive/root/children',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'OneDrive',
    method: 'GET',
    humanName: 'my recent files',
    requestUrl: '/v1.0/me/drive/recent',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/drive-recent?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'OneDrive',
    method: 'GET',
    humanName: 'files shared with me',
    requestUrl: '/v1.0/me/drive/sharedWithMe',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/drive-sharedwithme?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'OneDrive',
    method: 'GET',
    humanName: 'search my OneDrive',
    requestUrl: '/v1.0/me/drive/root/search(q=\'finance\')?select=name,id,webUrl',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/driveitem-search?view=graph-rest-1.0&tabs=http',
    skipTest: false
  },
  {
    category: 'OneDrive',
    method: 'POST',
    humanName: 'create a folder',
    requestUrl: '/v1.0/me/drive/root/children',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/driveitem-post-children?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "name": "New Folder",\r\n  "folder": { }\r\n}',
    tip: 'Update the Request Body and select Run Query.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'POST',
    humanName: 'create session',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/createSession',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/excel?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{ "persistChanges": true }',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'GET',
    humanName: 'worksheets in a workbook',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/worksheets',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/workbook-list-worksheets?view=graph-rest-1.0',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'POST',
    humanName: 'add a new worksheet',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/worksheets',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/worksheetcollection-add?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "name": "My New Sheet"\r\n}',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'POST',
    humanName: 'calculate loan payment',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/functions/pmt',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/workbook#functions?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n "rate": 0.035,\r\n "nper": 20,\r\n "pv": -2000\r\n}',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'GET',
    humanName: 'used range in worksheet',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/worksheets(\'Sheet1\')/usedRange',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/worksheet-usedrange?view=graph-rest-1.0',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'GET',
    humanName: 'tables in worksheet',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/worksheets/Sheet1/tables',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/worksheet-list-tables?view=graph-rest-1.0',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Excel',
    method: 'GET',
    humanName: 'charts in worksheet',
    requestUrl: '/v1.0/me/drive/items/{drive-item-id}/workbook/worksheets(\'Sheet1\')/charts',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/worksheet-list-charts?view=graph-rest-1.0',
    tip: 'This query requires a driveItem id.  To find the ID of the driveItem that corresponds to an Excel Workbook, you can run: GET https://graph.microsoft.com/v1.0/me/drive/root/search(q=\'.xlsx\')?select=name,id,webUrl.',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'all Planner plans associated with a group',
    requestUrl: '/v1.0/groups/{group-id-with-plan}/planner/plans',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannergroup-list-plans?view=graph-rest-1.0',
    tip: 'This query requires a group id.  To find the ID of a group you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/memberOf',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'get Planner plan',
    requestUrl: '/v1.0/planner/plans/{plan-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannerplan-get?view=graph-rest-1.0',
    tip: 'This query requires a plan id.  To find the ID of the plan you can run: GET https://graph.microsoft.com/v1.0/me/groups/{group-id}/plans.',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'PATCH',
    humanName: 'update a Planner plan',
    requestUrl: '/v1.0/planner/plans/{plan-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannerplan-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'If-Match',
        'value': '{if-match}'
      }
    ],
    postBody: '{\r\n    "title": "Updated plan title"\r\n}',
    tip: 'This query requires a Plan ID and value of @odata.etag for a selected task. To find the ID of the Plan, you can run: GET https://graph.microsoft.com/v1.0/me/planner/tasks. To get the @odata.etag, run: GET https://graph.microsoft.com/v1.0/planner/plans/{plan-id}',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'all buckets in Planner plan',
    requestUrl: '/v1.0/planner/plans/{plan-id}/buckets',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannerplan-list-buckets?view=graph-rest-1.0',
    tip: 'This query requires a plan id.  To find the ID of the plan you can run: GET https://graph.microsoft.com/v1.0/me/groups/{group-id}/plans.',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'POST',
    humanName: 'create a bucket in Planner plan',
    requestUrl: '/v1.0/planner/buckets',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/planner-post-buckets?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "name": "{bucket-name}",\r\n  "planId": "{plan-id}",\r\n  "orderHint": " !"\r\n}',
    tip: 'This query requires a Plan id.  To find the ID of the Plan you can run: GET https://graph.microsoft.com/v1.0/me/planner/plans',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'PATCH',
    humanName: 'update a bucket in Planner plan',
    requestUrl: '/v1.0/planner/buckets/{bucket-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannerbucket-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'If-Match',
        'value': '{if-match}'
      }
    ],
    postBody: '{\r\n    "name": "Updated bucket name"\r\n}',
    tip: 'This query requires a bucket id and value of @odata.etag for a selected bucket.  To find the ID of the bucket run: GET https://graph.microsoft.com/v1.0/planner/plans/{plan-id}/buckets and then run: GET https://graph.microsoft.com/v1.0/planner/buckets/{bucket-id} to discover @odata.etag',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'all Planner tasks for a plan',
    requestUrl: '/v1.0/planner/plans/{plan-id}/tasks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannerplan-list-tasks?view=graph-rest-1.0',
    tip: 'This query requires a plan id.  To find the ID of the plan you can run: GET https://graph.microsoft.com/v1.0/me/groups/{group-id}/plans.',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'all my Planner tasks',
    requestUrl: '/v1.0/me/planner/tasks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/planneruser-list-tasks',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'all Planner tasks for user',
    requestUrl: '/v1.0/users/{coworker-mail}/planner/tasks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/planneruser-list-tasks?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'get Planner task by id',
    requestUrl: '/v1.0/planner/tasks/{task-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannertask-get?view=graph-rest-1.0',
    tip: 'This query requires a task id.  To find the ID of the task you can run: GET https://graph.microsoft.com/v1.0/me/planner/tasks',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'POST',
    humanName: 'create a Planner task',
    requestUrl: '/v1.0/planner/tasks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/planner-post-tasks?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "planId": "{plan-id}",\r\n  "title": "{task-title}",\r\n  "assignments": {}\r\n}',
    tip: 'This query requires a Plan id.  To find the ID of the Plan you can run: GET https://graph.microsoft.com/v1.0/me/planner/tasks',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'PATCH',
    humanName: 'update a Planner task',
    requestUrl: '/v1.0/planner/tasks/{task-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannertask-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "title": "Updated task title"\r\n}',
    tip: 'This query requires a task id and value of @odata.etag for a selected task.  To find the ID of the task and @odata.etag you can run: GET https://graph.microsoft.com/v1.0/me/planner/tasks',
    skipTest: false
  },
  {
    category: 'Planner',
    method: 'GET',
    humanName: 'details for Planner task',
    requestUrl: '/v1.0/planner/tasks/{task-id}/details',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/plannertaskdetails-get?view=graph-rest-1.0',
    tip: 'This query requires a task id.  To find the ID of the task you can run: GET https://graph.microsoft.com/v1.0/me/planner/tasks',
    skipTest: false
  },
  {
    category: 'Insights',
    method: 'GET',
    humanName: 'my recent files',
    requestUrl: '/v1.0/me/drive/recent',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/drive-recent?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Insights',
    method: 'GET',
    humanName: 'items trending around me',
    requestUrl: '/v1.0/me/insights/trending',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/insights-list-trending?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Insights',
    method: 'GET',
    humanName: 'items shared with me',
    requestUrl: '/v1.0/me/insights/shared',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/insights-list-shared?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Insights',
    method: 'GET',
    humanName: 'items viewed and modified by me',
    requestUrl: '/v1.0/me/insights/used',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/insights-list-used?view=graph-rest-1.0&tabs=http',
    skipTest: false
  },
  {
    category: 'People',
    method: 'GET',
    humanName: 'people I work with',
    requestUrl: '/v1.0/me/people',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-people?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'People',
    method: 'GET',
    humanName: 'people whose name starts with J',
    requestUrl: '/v1.0/me/people/?$search=j',
    docLink: 'https://learn.microsoft.com/en-us/graph/people-example',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'GET',
    humanName: 'get an open extension',
    requestUrl: '/v1.0/me?$select=id,displayName,mail,mobilePhone&$expand=extensions',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/opentypeextension?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'POST',
    humanName: 'create an open extension',
    requestUrl: '/v1.0/me/extensions',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/opentypeextension-post-opentypeextension?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "@odata.type":"microsoft.graph.openTypeExtension",    "extensionName":"com.contoso.roamingSettings",\r\n    "theme":"dark",\r\n    "color":"purple",\r\n    "lang":"Japanese"\r\n}',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'PATCH',
    humanName: 'update an open extension',
    requestUrl: '/v1.0/me/extensions/{extension-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/opentypeextension-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "theme":"light",\r\n    "color":"yellow",\r\n    "lang":"Swahili"\r\n}',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'GET',
    humanName: 'get available schema extensions',
    requestUrl: '/v1.0/schemaExtensions',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/schemaextension-get?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'GET',
    humanName: 'filter groups by extension property value',
    requestUrl: '/v1.0/groups?$filter=adatumisv_courses/id eq \'123\'&$select=id,displayName,adatumisv_courses',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/schemaextension-post-schemaextensions?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'POST',
    humanName: 'create a group with extension data',
    requestUrl: '/v1.0/groups',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/schemaextension-post-schemaextensions?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "displayName": "Extensions sample group",\r\n    "description": "Extensions sample group",\r\n    "groupTypes": ["Unified"],\r\n    "mailEnabled": true,\r\n    "mailNickname": "extSample123",\r\n    "securityEnabled": false,\r\n    "adatumisv_courses": {\r\n        "id":"123",\r\n        "name":"New Managers",\r\n        "type":"Online"\r\n    }\r\n}',
    skipTest: false
  },
  {
    category: 'Extensions',
    method: 'PATCH',
    humanName: 'update a group with extension data',
    requestUrl: '/v1.0/groups/{group-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/schemaextension-post-schemaextensions?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n   "adatumisv_courses": {\r\n        "id":"123",\r\n        "name":"New Managers",\r\n        "type":"Online"\r\n    }\r\n}',
    skipTest: false
  },
  {
    category: 'OneNote',
    method: 'GET',
    humanName: 'my notebooks',
    requestUrl: '/v1.0/me/onenote/notebooks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/onenote?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'OneNote',
    method: 'GET',
    humanName: 'my sections',
    requestUrl: '/v1.0/me/onenote/sections',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/section?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'OneNote',
    method: 'GET',
    humanName: 'my pages',
    requestUrl: '/v1.0/me/onenote/pages',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/section-list-pages?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'OneNote',
    method: 'POST',
    humanName: 'create notebook',
    requestUrl: '/v1.0/me/onenote/notebooks',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/onenote-post-notebooks?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "displayName": "My Notebook"\r\n}',
    tip: 'Update the Request Body and select Run Query.',
    skipTest: false
  },
  {
    category: 'OneNote',
    method: 'POST',
    humanName: 'create section',
    requestUrl: '/v1.0/me/onenote/notebooks/{notebook-id}/sections',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/notebook-post-sections?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "displayName": "Section 1"\r\n}',
    tip: 'This query requires a notebook id.  To find the ID, you can run: GET https://graph.microsoft.com/v1.0/me/onenote/notebooks. ',
    skipTest: false
  },
  {
    category: 'OneNote',
    method: 'POST',
    humanName: 'create page',
    requestUrl: '/v1.0/me/onenote/sections/{section-id}/pages',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/section-post-pages?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/xhtml+xml'
      }
    ],
    postBody: '\r\n<!DOCTYPE html>\r\n<html>\r\n  <head>\r\n    <title>A page with a block of HTML</title>\r\n  </head>\r\n  <body>\r\n    <p>This page contains some <i>formatted</i> <b>text</b>.</p>\r\n  </body>\r\n</html>',
    tip: 'This query requires a section id.  To find the ID, you can run: GET https://graph.microsoft.com/v1.0/me/onenote/sections.',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'my organization\'s default SharePoint site',
    requestUrl: '/v1.0/sites/root',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/site-get?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'enumerate the document libraries under the root site',
    requestUrl: '/v1.0/sites/root/drives',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/drive-list#list-a-sites-drives?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'get SharePoint site based on relative path of the site',
    requestUrl: '/v1.0/sites/{host-name}:/{server-relative-path}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/site-getbypath?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'search for a SharePoint site by keyword',
    requestUrl: '/v1.0/sites?search=contoso',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/site-search?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'enumerate subsites of the root site',
    requestUrl: '/v1.0/sites/root/sites',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/site-list-subsites?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'enumerate site columns of the root site',
    requestUrl: '/v1.0/sites/root/columns',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/site?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Sites',
    method: 'GET',
    humanName: 'enumerate site content types of the root site',
    requestUrl: '/v1.0/sites/root/contentTypes',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/site?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Lists',
    method: 'GET',
    humanName: 'enumerate the lists in the root site',
    requestUrl: '/v1.0/sites/root/lists',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/list-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Lists',
    method: 'GET',
    humanName: 'enumerate list columns',
    requestUrl: '/v1.0/sites/root/lists/{list-id}/columns',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/listitem?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Lists',
    method: 'GET',
    humanName: 'enumerate list content types',
    requestUrl: '/v1.0/sites/root/lists/{list-id}/contentTypes',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/listitem?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Lists',
    method: 'GET',
    humanName: 'enumerate the list items in a list',
    requestUrl: '/v1.0/sites/root/lists/{list-id}/items',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/listitem-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'SharePoint Lists',
    method: 'GET',
    humanName: 'enumerate list items with specific column values',
    requestUrl: '/v1.0/sites/root/lists/{list-id}/items?$filter=fields/Title eq \'{list-title}\'',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/listitem-list?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Prefer',
        'value': 'allowthrottleablequeries'
      }
    ],
    skipTest: false
  },
  {
    category: 'Batching',
    method: 'POST',
    humanName: 'perform parallel GETs',
    requestUrl: '/v1.0/$batch',
    docLink: 'https://learn.microsoft.com/en-us/graph/json-batching',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{"requests" : [{"url" : "/me?$select=displayName,jobTitle,userPrincipalName", "method" : "GET", "id" : "1"}, {"url" : "/me/messages?$filter=importance eq \'high\'&$select=from,subject,receivedDateTime,bodyPreview", "method" : "GET", "id" : "2"}, {"url" : "/me/events", "method" : "GET", "id" : "3"}]  }',
    tip: 'This query shows you how to use batching to get your user information, your messages, and your events.',
    skipTest: false
  },
  {
    category: 'Batching',
    method: 'POST',
    humanName: 'combine a POST and a GET',
    requestUrl: '/v1.0/$batch',
    docLink: 'https://learn.microsoft.com/en-us/graph/json-batching',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n "requests": [{\r\n   "url": "/me/drive/root/children",\r\n   "method": "POST",\r\n   "id": "1",\r\n   "body": {\r\n    "name": "TestBatchingFolder",\r\n    "folder": {}\r\n   },\r\n   "headers": {\r\n    "Content-Type": "application/json"\r\n   }\r\n  }, {\r\n   "url": "/me/drive/root/children/TestBatchingFolder ",\r\n   "method": "GET",\r\n   "id": "2",\r\n   "DependsOn": ["1"]\r\n  }\r\n ]\r\n} ',
    tip: 'This query will create a folder called TestBatchingFolder in your OneDrive and return it back to you via a GET.',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'POST',
    humanName: 'create team',
    requestUrl: '/v1.0/teams',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/team-post?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n   "template@odata.bind": "https://graph.microsoft.com/v1.0/teamsTemplates(\'standard\')",\r\n   "displayName": "Architecture Team",\r\n   "description": "The team for those in architecture design."\r\n}',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'my joined teams',
    requestUrl: '/v1.0/me/joinedTeams',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-list-joinedteams?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'members of a team',
    requestUrl: '/v1.0/groups/{group-id-for-teams}/members',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/group-list-memberof?view=graph-rest-1.0',
    tip: 'This query requires a group id of the Team.  To find the group id of teams you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/joinedTeams',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'channels of a team which I am member of',
    requestUrl: '/v1.0/teams/{team-id}/channels',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/channel-list?view=graph-rest-1.0',
    tip: 'This query requires a team id.  To find the team id of teams you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/joinedTeams',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'channel info',
    requestUrl: '/v1.0/teams/{team-id}/channels/{channel-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/channel-get?view=graph-rest-1.0',
    tip: 'This query requires a team id and a channel id from that team. To find the team id  & channel id, you can run: 1) GET https://graph.microsoft.com/v1.0/me/joinedTeams 2) GET https://graph.microsoft.com/v1.0/teams/{team-id}/channels',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'POST',
    humanName: 'create channel',
    requestUrl: '/v1.0/teams/{team-id}/channels',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/channel-post?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n   "displayName": "Architecture Discussion",\r\n   "description": "This channel is where we debate all future architecture plans"\r\n }',
    tip: 'This query requires a team id.  To find the team id of teams you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/joinedTeams.',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'apps in a team',
    requestUrl: '/v1.0/teams/{team-id}/installedApps?$expand=teamsAppDefinition',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/team-list-installedapps?view=graph-rest-1.0',
    tip: 'This query requires a team id. To find the team id, you can run: GET https://graph.microsoft.com/v1.0/me/joinedTeams',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'tabs in a channel',
    requestUrl: '/v1.0/teams/{team-id}/channels/{channel-id}/tabs?$expand=teamsApp',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/channel-list-tabs?view=graph-rest-1.0',
    tip: 'This query requires a team id and a channel id from that team. To find the team id  & channel id, you can run: 1) GET https://graph.microsoft.com/v1.0/me/joinedTeams 2) GET https://graph.microsoft.com/v1.0/teams/{team-id}/channels',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'GET',
    humanName: 'items in a team drive',
    requestUrl: '/v1.0/groups/{group-id-for-teams}/drive/items/root/children',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/driveitem-list-children?view=graph-rest-1.0&tabs=http',
    tip: 'This query requires a group id of the Team.  To find the group id of Teams you belong to, you can run: GET https://graph.microsoft.com/v1.0/me/joinedTeams',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'POST',
    humanName: 'create chat',
    requestUrl: '/v1.0/chats',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/chat-post?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "chatType": "oneOnOne",\r\n    "members": [\r\n    {\r\n    "@odata.type": "#microsoft.graph.aadUserConversationMember",\r\n    "roles": ["owner"],\r\n    "user@odata.bind": "https://graph.microsoft.com/v1.0/users(\'{your-user-id}\')"\r\n    },\r\n    {\r\n    "@odata.type": "#microsoft.graph.aadUserConversationMember",\r\n    "roles": ["owner"],\r\n    "user@odata.bind": "https://graph.microsoft.com/v1.0/users(\'{user-id}\')"\r\n    }\r\n    ]\r\n    }',
    tip: 'This query requires your user ID and another user\'s ID. Use the following calls to get the user IDs: 1) GET https://graph.microsoft.com/v1.0/me/ 2) GET https://graph.microsoft.com/v1.0/users',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'messages (without replies) in a channel',
    requestUrl: '/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/channel-list-messages?view=graph-rest-beta',
    tip: 'This query requires a group id of the Team and channel id of the corresponding channel of that Team. To find the group id  & channel id, you can run: 1) GET https://graph.microsoft.com/beta/me/joinedTeams 2) GET https://graph.microsoft.com/beta/groups/{group-id-for-teams}/channels',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'message in a channel',
    requestUrl: '/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages/{message-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/chatmessage-get?view=graph-rest-beta',
    tip: 'This query requires a group id of the Team, channel id of the corresponding channel of that Team and message id of the message you want to retrieve. To find the group id, channel id and message-id you can run: 1) GET https://graph.microsoft.com/beta/me/joinedTeams 2) GET https://graph.microsoft.com/beta/groups/{group-id-for-teams}/channels 3) GET https://graph.microsoft.com/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'replies to a message in channel',
    requestUrl: '/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages/{message-id}/replies',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/chatmessage-get?view=graph-rest-beta',
    tip: 'This query requires a group id of the Team, channel id of the corresponding channel of that Team and message id of the message of which you need the replies. To find the group id, channel id and message-id you can run: 1) GET https://graph.microsoft.com/beta/me/joinedTeams 2) GET https://graph.microsoft.com/beta/groups/{group-id-for-teams}/channels 3) GET https://graph.microsoft.com/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'reply of a message',
    requestUrl: '/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages/{message-id}/replies/{reply-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/chatmessage-get?view=graph-rest-beta',
    tip: 'This query requires a group id of the Team, channel id of the corresponding channel of that Team, message id of the message of which you need the reply and the id of the specific reply. To find the group id, channel id, message-id and reply-id you can run: 1) GET https://graph.microsoft.com/beta/me/joinedTeams 2) GET https://graph.microsoft.com/beta/groups/{group-id-for-teams}/channels 3) GET https://graph.microsoft.com/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages 4) GET https://graph.microsoft.com/beta/teams/{group-id-for-teams}/channels/{channel-id}/messages/{message-id}/replies',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'apps installed for user',
    requestUrl: '/beta/me/teamwork/installedApps?$expand=teamsApp',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/userteamwork-list-installedapps?view=graph-rest-beta&tabs=http',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'list members of a chat',
    requestUrl: '/beta/chats/{chat-id}/members',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/chat-list-members?view=graph-rest-beta',
    tip: 'This query requires a chat ID. Use the following call to find a list of chats and their corresponding IDs: GET https://graph.microsoft.com/beta/me/chats/',
    skipTest: false
  },
  {
    category: 'Microsoft Teams (beta)',
    method: 'GET',
    humanName: 'member in a chat',
    requestUrl: '/beta/chats/{chat-id}/members/{membership-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/chat-get-members?view=graph-rest-beta',
    tip: 'This query requires a chat ID and a membership ID. Use the following calls to get the IDs: 1) GET https://graph.microsoft.com/beta/me/chats/ and 2) GET https://graph.microsoft.com/beta/me/chats/{chat-id}/members/',
    skipTest: false
  },
  {
    category: 'Microsoft Teams',
    method: 'POST',
    humanName: 'send channel message',
    requestUrl: '/v1.0/teams/{team-id}/channels/{channel-id}/messages',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/channel-post-messages?view=graph-rest-beta&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n       "body": {\r\n         "content": "Hello world"\r\n       }\r\n }',
    tip: 'This query requires a team id and a channel id from that team. To find the team id  & channel id, you can run: 1) GET https://graph.microsoft.com/beta/me/joinedTeams 2) GET https://graph.microsoft.com/beta/teams/{team-id}/channels',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'alerts',
    requestUrl: '/v1.0/security/alerts?$top=1',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'alerts with \'High\' severity',
    requestUrl: '/v1.0/security/alerts?$filter=Severity eq \'High\'&$top=5',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'alerts from \'Azure Security Center\'',
    requestUrl: '/v1.0/security/alerts?$filter=vendorInformation/provider eq \'ASC\'&$top=5',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'alerts filter by \'Category\'',
    requestUrl: '/v1.0/security/alerts?$filter=Category eq \'ransomware\'&$top=5',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'alerts filter by destination address',
    requestUrl: '/v1.0/security/alerts?$filter=networkConnections/any(d:d/destinationAddress eq \'{destination-address}\')',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-list?view=graph-rest-1.0',
    tip: 'This query requires a destination address. Run https://graph.microsoft.com/v1.0/security/alerts?$top=1 and search the results for a destinationAddress property.',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'alerts filter by \'Status\'',
    requestUrl: '/v1.0/security/alerts?$filter=Status eq \'NewAlert\'&$top=1',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-list?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'secure scores (beta)',
    requestUrl: '/beta/security/secureScores?$top=5',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/securescores-list?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'secure score control profiles (beta)',
    requestUrl: '/beta/security/secureScoreControlProfiles?$top=5',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/securescorecontrolprofiles-list?view=graph-rest-beta',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'list TI indicators (beta)',
    requestUrl: '/beta/security/tiIndicators',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicators-list',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'security actions (beta)',
    requestUrl: '/beta/security/securityActions',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/securityactions-list',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'get all Conditional Access policies',
    requestUrl: '/v1.0/identity/conditionalAccess/policies',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/conditionalaccessroot-list-policies?view=graph-rest-1.0&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on Conditional Access API here: https://aka.ms/caapifeedback',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'get all Named Locations',
    requestUrl: '/v1.0/identity/conditionalAccess/namedLocations',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/conditionalaccessroot-list-namedlocations?view=graph-rest-1.0&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on Conditional Access API here: https://aka.ms/caapifeedback',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'get all Conditional Access policies (beta)',
    requestUrl: '/beta/identity/conditionalAccess/policies',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/conditionalaccessroot-list-policies?view=graph-rest-beta&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on Conditional Access API here: https://aka.ms/caapifeedback',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'GET',
    humanName: 'get all Named Locations (beta)',
    requestUrl: '/beta/identity/conditionalAccess/namedLocations',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/conditionalaccessroot-list-namedlocations?view=graph-rest-beta&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on Conditional Access API here: https://aka.ms/caapifeedback',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'PATCH',
    humanName: 'update alert',
    requestUrl: '/v1.0/security/alerts/{alert-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/alert-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "assignedTo": "test@contoso.com",\r\n  "comments": ["Comment 0", "Comment 1"],\r\n  "tags": ["Tag 0", "Tag 1"],\r\n  "feedback": "truePositive",\r\n  "status": "newAlert",\r\n  "vendorInformation": {\r\n    "provider": "provider",\r\n    "providerVersion": "3.0",\r\n    "subProvider": null,\r\n    "vendor": "vendor"\r\n  }\r\n}',
    tip: 'This query requires an alert id. To find the ID of the alert, you can run: GET https://graph.microsoft.com/v1.0/security/alerts?$top=1',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'POST',
    humanName: 'create TI indicator (beta)',
    requestUrl: '/beta/security/tiIndicators',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicators-post',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "activityGroupNames": [\r\n      "activityGroupNames-value"\r\n    ],\r\n  "confidence": 90,\r\n  "description": "This is a test indicator for demo purpose.",\r\n  "expirationDateTime": "{next-week}",\r\n  "externalId": "Test-8586502158541347997MS342",\r\n  "fileHashType": "sha256",\r\n  "fileHashValue": "289a8e8c330c27ab893fb769db38046feaca9d0b11e0aaa416ba70b0a51d58a4",\r\n  "targetProduct": "Azure ATP",\r\n  "threatType": "WatchList",\r\n  "tlpLevel": "green"\r\n}',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'POST',
    humanName: 'create multiple TI indicators (beta)',
    requestUrl: '/beta/security/tiIndicators/microsoft.graph.submitTiIndicators',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicator-submittiindicators',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "value": [\r\n    {\r\n      "activityGroupNames": [],\r\n      "confidence": 0,\r\n      "description": "This is a test indicator for demo purpose. Take no action on any observables set in this indicator.",\r\n      "externalId": "Test-8586502120486653922MS812-0",\r\n      "fileHashType": "sha256",\r\n      "fileHashValue": "0c0ebb4c90fa39785745bcc5e5cb40e3db7791be030061e2818684bc128b8f97",\r\n      "killChain": [],\r\n      "malwareFamilyNames": [],\r\n      "severity": 0,\r\n      "tags": [],\r\n      "targetProduct": "Azure ATP",\r\n      "threatType": "WatchList",\r\n      "tlpLevel": "green"\r\n    },\r\n    {\r\n      "activityGroupNames": [],\r\n      "confidence": 0,\r\n      "description": "This is a test indicator for demo purpose. Take no action on any observables set in this indicator.",\r\n      "externalId": "Test-8586502120486653922MS812-1",\r\n      "fileHashType": "sha256",\r\n      "fileHashValue": "86267de22dbad234ecf97870fdcf1a0e31149ee7a5fb595c050f69ca00f3529e",\r\n      "killChain": [],\r\n      "malwareFamilyNames": [],\r\n      "severity": 0,\r\n      "tags": [],\r\n      "targetProduct": "Azure ATP",\r\n      "threatType": "WatchList",\r\n      "tlpLevel": "green"\r\n    }\r\n  ]\r\n}',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'PATCH',
    humanName: 'update a TI indicator (beta)',
    requestUrl: '/beta/security/tiIndicators/{id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicator-update',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: ' {\r\n      "additionalInformation": "Testing"\r\n    }',
    tip: 'This query requires the TI indicator id. To find the ID, you can run: GET https://graph.microsoft.com/beta/security/tiIndicators?$top=1',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'POST',
    humanName: 'update multiple TI indicators (beta)',
    requestUrl: '/beta/security/tiIndicators/microsoft.graph.updateTiIndicators',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicator-updatetiindicators',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "value": [\r\n    {\r\n      "id": "tiindicator-id-1",\r\n      "additionalInformation": "Testing"\r\n    },\r\n    {\r\n      "id": "tiindicator-id-2",\r\n      "additionalInformation": "Testing 2"\r\n    }\r\n  ]\r\n}',
    tip: 'This query requires the TI indicator id. To find the ID, you can run: GET https://graph.microsoft.com/beta/security/tiIndicators?$top=5\r\n\r\n ',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'POST',
    humanName: 'create security action (beta)',
    requestUrl: '/beta/security/securityActions',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/securityactions-post',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "name": "blockIp",\r\n     "vendorInformation" :\r\n     {  "provider": "Windows Defender ATP",\r\n          "vendor": "Microsoft"\r\n      },\r\n    "parameters" : [\r\n      {"name": "IP", "value":"1.2.3.4" }\r\n    ]\r\n}',
    tip: 'Change the provider, vendor and parameters are needed',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'DELETE',
    humanName: 'delete TI indicator (beta)',
    requestUrl: '/beta/security/tiIndicators/{id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicator-delete',
    tip: 'This query requires the TI indicator id. To find the ID, you can run: GET https://graph.microsoft.com/beta/security/tiIndicators?$top=1',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'POST',
    humanName: 'delete multiple TI indicators (beta)',
    requestUrl: '/beta/security/tiIndicators/microsoft.graph.deleteTiIndicators',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicator-deletetiindicators',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "value": [\r\n    "tiindicatorid-value1",\r\n    "tiindicatorid-value2"\r\n  ]\r\n}',
    tip: 'This query requires the TI indicator id. To find the ID, you can run: GET https://graph.microsoft.com/beta/security/tiIndicators?$top=5',
    skipTest: false
  },
  {
    category: 'Security',
    method: 'POST',
    humanName: 'delete multiple TI indicators by external Id (beta)',
    requestUrl: '/beta/security/tiIndicators/microsoft.graph.deleteTiIndicatorsByExternalId',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/tiindicator-deletetiindicatorsbyexternalid',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "value": [\r\n    "tiindicator-externalId-value1",\r\n     "tiindicator-externalId-value2"\r\n  ]\r\n}',
    tip: 'This query requires the TI indicator external id. To find the ID, you can run: GET https://graph.microsoft.com/beta/security/tiIndicators?$top=5',
    skipTest: false
  },
  {
    category: 'User Activities',
    method: 'PUT',
    humanName: 'create a user activity and history item',
    requestUrl: '/v1.0/me/activities/uniqueIdInAppContext',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/projectrome-put-activity#example-2---deep-insert?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "appActivityId": "uniqueIdInAppContext",\r\n    "activitySourceHost": "https://graphexplorer.blob.core.windows.net",\r\n    "userTimezone": "America/Los Angeles",\r\n    "appDisplayName": "Graph Explorer",\r\n    "activationUrl": "https://developer.microsoft.com/en-us/graph/graph-explorer",\r\n    "fallbackUrl": "https://developer.microsoft.com/en-us/graph/graph-explorer",\r\n    "contentInfo": {\r\n        "@context": "http://schema.org",\r\n        "@type": "CreativeWork",\r\n        "author": "Jennifer Booth",\r\n        "name": "Graph Explorer User Activity"\r\n    },\r\n    "visualElements": {\r\n        "attribution": {\r\n            "iconUrl": "https://graphexplorer.blob.core.windows.net/explorerIcon.png",\r\n            "alternateText": "Microsoft Graph Explorer",\r\n            "addImageQuery": "false"\r\n        },\r\n        "description": "A user activity made through the Microsoft Graph Explorer",\r\n        "backgroundColor": "#008272",\r\n        "displayText": "Graph Explorer Sample User Activity",\r\n        "content": {\r\n            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",\r\n            "type": "AdaptiveCard",\r\n            "body":\r\n            [{\r\n                "type": "TextBlock",\r\n                "text": "With activities, developers have a way to capture the unique tasks for users of their app which flow seamlessly across any platform and device, allowing them to quickly resume working on their preferred screen. Using the Activity Feed, developers can create a human-centric view of the tasks most important to users helping reduce friction when switching from web to mobile to PC and beyond."\r\n            }]\r\n        }\r\n    },\r\n    "historyItems":[\r\n        {\r\n            "userTimezone": "America/Los Angeles",\r\n            "startedDateTime": "{todayMinusHour}",\r\n            "lastActiveDateTime": "{today}"\r\n        }\r\n    ]\r\n}',
    skipTest: false
  },
  {
    category: 'User Activities',
    method: 'GET',
    humanName: 'get recent user activities',
    requestUrl: '/v1.0/me/activities/recent',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/projectrome-get-recent-activities?view=graph-rest-1.0',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'GET',
    humanName: 'list all applications with count',
    requestUrl: '/v1.0/applications?$count=true',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-list?view=graph-rest-1.0&tabs=http',
    tip: 'You are using the advanced query capabilities for Directory Objects, please send us feedback here: https://aka.ms/aadmgs',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'GET',
    humanName: 'search and count Service Principals with "teams" in the displayName',
    requestUrl: '/v1.0/servicePrincipals?$count=true&$search="displayName:teams"&$select=id,displayName',
    headers: [
      {
        'name': 'ConsistencyLevel',
        'value': 'eventual'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/serviceprincipal-list?view=graph-rest-1.0&tabs=http',
    tip: 'You are using the advanced query capabilities for Directory Objects, please send us feedback here: https://aka.ms/aadmgs',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'POST',
    humanName: 'create a new application',
    requestUrl: '/v1.0/applications',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-post-applications?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "displayName": "My App"\r\n    }',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'GET',
    humanName: 'retrieve application properties',
    requestUrl: '/v1.0/applications/{application-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-get?view=graph-rest-1.0&tabs=http',
    tip: 'This query requires an application id. To find the ID of an application&#44; you can run: GET https://graph.microsoft.com/v1.0/applications',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'PATCH',
    humanName: 'update application properties',
    requestUrl: '/v1.0/applications/{application-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-update?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "signInAudience": "AzureADMyOrg"\r\n    }',
    tip: 'This query requires an application id. To find the ID of an application; you can run: GET https://graph.microsoft.com/v1.0/applications',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'DELETE',
    humanName: 'delete an application',
    requestUrl: '/v1.0/applications/{application-id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-delete?view=graph-rest-1.0&tabs=http',
    tip: 'This query requires an application id. To find the ID of an application; you can run: GET https://graph.microsoft.com/v1.0/applications',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'GET',
    humanName: 'retrieve a list of owners',
    requestUrl: '/v1.0/applications/{application-id}/owners',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-list-owners?view=graph-rest-1.0&tabs=http',
    tip: 'This query requires an application id. To find the ID of an application; you can run: GET https://graph.microsoft.com/beta/applications',
    skipTest: false
  },
  {
    category: 'Applications',
    method: 'POST',
    humanName: 'create a new owner',
    requestUrl: '/v1.0/applications/{application-id}/owners',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/application-post-owners?view=graph-rest-1.0&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n        "directoryObject": {\r\n        }\r\n    }',
    tip: 'This query requires an application id. To find the ID of an application; you can run: GET https://graph.microsoft.com/v1.0/applications. In the request body supply a JSON representation of directoryObject object',
    skipTest: false
  },
  {
    category: 'Notifications (beta)',
    method: 'POST',
    humanName: 'create a raw notification',
    requestUrl: '/beta/me/notifications',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-post-notifications?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "targetHostName": "graphnotifications.sample.windows.com",\r\n  "appNotificationId": "sampleRawNotification",\r\n  "payload": {\r\n    "rawContent": "Hello World!"\r\n  },\r\n  "targetPolicy": {\r\n    "platformTypes": [\r\n      "windows",\r\n      "ios",\r\n      "android"\r\n    ]\r\n  },\r\n  "priority": "High",\r\n  "displayTimeToLive": "60"\r\n}',
    tip: 'Please enable the Notifications.ReadWrite.CreatedByApp permission in order to use this query.  A raw notification is a notification that is received by the application and processed in an application specific manner.  A raw notification may or may not include UI/UX for the user. Note - This query will only work with a sample application by default. See https://aka.ms/projectRomeSamples/ for additional info.',
    skipTest: false
  },
  {
    category: 'Notifications (beta)',
    method: 'POST',
    humanName: 'create a visual notification',
    requestUrl: '/beta/me/notifications',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/user-post-notifications?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "targetHostName": "graphnotifications.sample.windows.com",\r\n  "appNotificationId": "sampleDirectToastNotification",\r\n  "payload": {\r\n    "visualContent": {\r\n      "title": "Hello World!",\r\n      "body": "Notifications are Great!"\r\n    }\r\n  },\r\n  "targetPolicy": {\r\n    "platformTypes": [\r\n      "windows",\r\n      "ios",\r\n      "android"\r\n    ]\r\n  },\r\n  "priority": "High",\r\n  "displayTimeToLive": "60"\r\n}',
    tip: 'Please enable the Notifications.ReadWrite.CreatedByApp permission in order to use this query.  A visual notification is a notification that a user can see by default within the notification center of the target platform. Note - This query will only work with a sample application by default. See https://aka.ms/projectRomeSamples/ for additional info.',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search messages',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "message"\n            ],\n            "query": {\n                "queryString": "contoso"\n            }\n        }\n    ]\n}',
    tip: 'enable Mail.Read',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: '(beta) search Teams message',
    requestUrl: '/beta/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "chatMessage"\n            ],\n            "query": {\n                "queryString": "contoso"\n            }\n        }\n    ]\n}',
    tip: 'enable (Chat.Read or Chat.ReadWrite) and ChannelMessage.Read.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search events',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "event"\n            ],\n            "query": {\n                "queryString": "contoso"\n            }\n        }\n    ]\n}',
    tip: 'enable Calendars.Read',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search driveitems',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "requests": [\r\n        {\r\n            "entityTypes": [\r\n                "driveItem"\r\n            ],\r\n            "query": {\r\n                "queryString": "contoso"                            \r\n            }\r\n        }\r\n    ]\r\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: '(beta) search people',
    requestUrl: '/beta/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "person"\n            ],\n            "query": {\n                "queryString": "contoso"\n            }\n        }\n    ]\n}',
    tip: 'enable People.Read',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search lists',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "list"\n            ],\n            "query": {\n                "queryString": "*"\n            }\n        }\n    ]\n}',
    tip: 'enable Sites.Read.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search listItems',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "listItem"\n            ],\n            "query": {\n                "queryString": "issue"\n            },\n            "fields": [\n                "id",\n                "name",                \n                "contentclass",\n                "title",\n                "fooCustomProperty"\n            ]\n        }\n    ]\n}',
    tip: 'enable Sites.Read.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search sites',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "site"\n            ],\n            "query": {\n                "queryString": "contoso"\n            }\n        }\n    ]\n}',
    tip: 'enable Sites.Read.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'search external items',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "requests": [\r\n        {\r\n            "entityTypes": [\r\n                "externalItem"\r\n            ],\r\n            "contentSources": [\r\n                "/external/connections/azuresqlconnector",\r\n                "/external/connections/azuresqlconnector2"\r\n            ],\r\n            "query": {\r\n                "queryString": "*"\r\n            },\r\n            "from": 0,\r\n            "size": 100,\r\n            "fields": [\r\n                "FirstName"\r\n            ]\r\n        }\r\n    ]\r\n}',
    tip: 'enable ExternalItem.Read.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'page search results',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0#page-search-results',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "driveItem"\n            ],\n            "query": {\n                "queryString": "contoso"\n            },\n            "from": 0,\n            "size": 15\n        }\n    ]\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'sort search results',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-v1.0#sort-search-results',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "requests": [\r\n        {\r\n            "entityTypes": [\r\n                "driveItem"\r\n            ],\r\n            "query": {\r\n                "queryString": "contoso"\r\n            },\r\n            "sortProperties": [\r\n                {\r\n                    "name": "lastModifiedDateTime",\r\n                    "isDescending": "true"\r\n                }\r\n            ]\r\n        }\r\n    ]\r\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'refine results with string aggregations',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-v1.0#refine-results-using-aggregations',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "listItem"\n            ],\n            "query": {\n                "queryString": "contoso"\n            },\n            "aggregations": [\n                {\n                    "field": "FileType",\n                    "size": 20,\n                    "bucketDefinition": {\n                        "sortBy": "count",\n                        "isDescending": "true",\n                        "minimumCount": 0\n                    }\n                },\n                {\n                    "field": "contentclass",\n                    "size": 20,\n                    "bucketDefinition": {\n                        "sortBy": "keyAsString",\n                        "isDescending": "true",\n                        "minimumCount": 0\n                    }\n                }\n            ]\n        }\n    ]\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'refine results with numeric aggregations',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-v1.0#refine-results-using-aggregationsw',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "Requests": [\n        {\n            "entityTypes": [\n                "listItem"\n            ],\n            "query": {\n                "queryString": "contoso"\n            },\n            "aggregations": [\n                {\n                    "field": "Size",\n                    "size": 15,\n                    "bucketDefinition": {\n                        "sortBy": "keyAsNumber",\n                        "isDescending": "true",\n                        "minimumCount": 0,\n                        "ranges": [\n                            {\n                                "to": "100"\n                            },\n                            {\n                                "from": "100",\n                                "to": "1000"\n                            },\n                            {\n                                "from": "1000"\n                            }\n                        ]\n                    }\n                }\n            ]\n        }\n    ]\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'apply refined query passing the aggregationToken',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-v1.0#refine-results-using-aggregations',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "Requests": [\n        {\n            "entityTypes": [\n                "driveItem"\n            ],\n            "query": {\n                "queryString": "contoso"\n            },\n            "aggregationFilters": [\n                "contentclass:\\"ǂǂ5354535f4c6973744974656d5f446f63756d656e744c696272617279\\"",\n                "FileType:\\"ǂǂ646f6378\\""                \n            ],\n            "aggregations": [\n                {\n                    "field": "FileType",\n                    "size": 20,\n                    "bucketDefinition": {\n                        "sortBy": "count",\n                        "isDescending": "true",\n                        "minimumCount": 0\n                    }\n                },\n                {\n                    "field": "contentclass",\n                    "size": 15,\n                    "bucketDefinition": {\n                        "sortBy": "keyAsString",\n                        "isDescending": "true",\n                        "minimumCount": 0\n                    }\n                }\n            ]\n        }\n    ]\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'request spelling correction',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0#request-spelling-correction',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "requests": [\r\n    {\r\n      "entityTypes": [\r\n        "message"\r\n      ],\r\n      "query": {\r\n        "queryString": "informatino"\r\n      },\r\n      "from": 0,\r\n      "size": 5,\r\n      "queryAlterationOptions": {\r\n        "enableSuggestion": true,\r\n        "enableModification": true\r\n      }\r\n    }\r\n  ]  \r\n}',
    tip: 'enable Calendars.Read, Mail.Read, Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All, ExternalItem.Read.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: '(beta) Trim Duplicated SharePoint Search Results',
    requestUrl: '/beta/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "driveItem"\n            ],\n            "query": {\n                "queryString": "contoso"\n            },\n            "trimDuplicates": true,\n            "from": 0,\n            "size": 15\n        }\n    ]\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: '(beta) Search with queryTemplate',
    requestUrl: '/beta/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\n    "requests": [\n        {\n            "entityTypes": [\n                "driveItem"\n            ],\n            "query": {\n                "queryString": "contoso",\n                "queryTemplate": "({searchTerms})"\n            },\n            "from": 0,\n            "size": 15\n        }\n    ]\n}',
    tip: 'enable Files.Read.All, Sites.Read.All, Files.ReadWrite.All, Sites.ReadWrite.All',
    skipTest: false
  },
  {
    category: 'Search',
    method: 'POST',
    humanName: 'request result template',
    requestUrl: '/v1.0/search/query',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/resources/search-api-overview?view=graph-rest-1.0#search-display-layout',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n    "requests": [\r\n        {\r\n            "entityTypes": [\r\n                "externalItem"\r\n            ],\r\n            "contentSources": [\r\n                "/external/connections/azuresqlconnector",\r\n                "/external/connections/azuresqlconnector2"\r\n            ],\r\n            "query": {\r\n                "queryString": "*"\r\n            },\r\n            "resultTemplateOptions": {\r\n  "enableResultTemplate": true \r\n}\r\n}\r\n]\r\n}',
    tip: 'enable ExternalItem.Read.All',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'GET',
    humanName: 'list ediscovery cases',
    requestUrl: '/beta/compliance/ediscovery/cases',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-list?view=graph-rest-beta&tabs=http',
    tip: 'Go to Modify Permissions tab and consent to eDiscovery.Read.All or eDiscovery.ReadWrite.All permission to run this query',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'GET',
    humanName: 'get ediscovery case',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-get?view=graph-rest-beta&tabs=http',
    tip: 'Go to Modify Permissions tab and consent to eDiscovery.Read.All or eDiscovery.ReadWrite.All permission to run this query. This query requires a case id. To find the id of a case; you can run: GET https://graph.microsoft.com/beta/compliance/ediscovery/cases.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'POST',
    humanName: 'create ediscovery case',
    requestUrl: '/beta/compliance/ediscovery/cases',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-post?view=graph-rest-beta&tabs=http',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "displayName": "eDiscovery case created from Graph Explorer"\r\n}',
    tip: 'Go to Modify Permissions tab and consent to eDiscovery.ReadWrite.All permission to run this query',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'GET',
    humanName: 'list review sets',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/reviewSets',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-list-reviewsets?view=graph-rest-beta&tabs=http',
    tip: 'Go to Modify Permissions tab and consent to eDiscovery.Read.All or eDiscovery.ReadWrite.All permission to run this query. To find the id of a case; you can run: GET https://graph.microsoft.com/beta/compliance/ediscovery/cases.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'GET',
    humanName: 'list review set queries',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/reviewSets/{reviewSetId}/queries',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-reviewsetquery-list?view=graph-rest-beta',
    tip: 'Replace {caseId} with the ID from an eDiscovery Case (https://graph.microsoft.com/beta/compliance/ediscovery/cases) and {reviewSetId} with the ID from a review set that exists in that case (https://graph.microsoft.com/beta/compliance/ediscovery/cases/{caseid}/reviewSets). Then go to Modify Permissions tab and consent to eDiscovery.Read.All or eDiscovery.ReadWrite.All permission to run this query.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'POST',
    humanName: 'create review set query',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/reviewSets/{reviewSetId}/queries',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-reviewsetquery-post?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "displayName": "reviewSet Query created from Graph Explorer",\r\n  "query": "(subject:\'Quartely Financials\')"\r\n}',
    tip: 'Replace {caseId} with the ID from an eDiscovery Case (https://graph.microsoft.com/beta/compliance/ediscovery/cases) and {reviewSetId} with the ID from a review set that exists in that case (https://graph.microsoft.com/beta/compliance/ediscovery/cases/{caseid}/reviewSets).  Then go to Modify Permissions tab and consent to eDiscovery.ReadWrite.All permission to run this query.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'GET',
    humanName: 'get a list of custodians for a case',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/custodians',
    docLink: 'https://learn.microsoft.com/graph/api/resources/ediscovery-custodian?view=graph-rest-beta',
    tip: 'Replace {caseId} with the ID from an eDiscovery Case (https://graph.microsoft.com/beta/compliance/ediscovery/cases). Then go to Modify Permissions tab and consent to eDiscovery.Read.All or eDiscovery.ReadWrite.All permission to run this query.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'POST',
    humanName: 'add custodian',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/custodians',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-post-custodians?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "email": "custodian email",\r\n  "applyHoldToSources": "true"\r\n}',
    tip: 'Replace {caseId} with the ID from an eDiscovery Case (https://graph.microsoft.com/beta/compliance/ediscovery/cases) and {custodian email} with the ID email address of a user in your tenant.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'GET',
    humanName: 'get a list of source collections for a case',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/sourceCollections',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-list-sourcecollections?view=graph-rest-beta',
    tip: 'Replace {caseId} with the ID from an eDiscovery Case (https://graph.microsoft.com/beta/compliance/ediscovery/cases). Then go to Modify Permissions tab and consent to eDiscovery.Read.All or eDiscovery.ReadWrite.All permission to run this query.',
    skipTest: false
  },
  {
    category: 'Compliance (beta)',
    method: 'POST',
    humanName: 'add source collection',
    requestUrl: '/beta/compliance/ediscovery/cases/{caseId}/sourceCollections',
    docLink: 'https://learn.microsoft.com/graph/api/ediscovery-case-post-sourcecollections?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "displayName": "Quarterly Financials search",\r\n  "contentQuery": "subject:\'Quarterly Financials\'",\r\n "custodianSources@odata.bind": "user source url"\r\n}',
    tip: 'Replace {caseId} with the ID from an eDiscovery Case (https://graph.microsoft.com/beta/compliance/ediscovery/cases) and {user source url} odata url for the user source - see [Create sourceCollection](https://learn.microsoft.com/graph/api/ediscovery-case-post-sourcecollections?view=graph-rest-beta) for more details.',
    skipTest: false
  },
  {
    category: 'Microsoft To Do',
    method: 'GET',
    humanName: 'get To Do task lists',
    requestUrl: '/v1.0/me/todo/lists',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/todo-list-lists?view=graph-rest-1.0',
    tip: 'This query requires the Tasks.ReadWrite permission',
    skipTest: false
  },
  {
    category: 'Microsoft To Do',
    method: 'POST',
    humanName: 'create To Do task list',
    requestUrl: '/v1.0/me/todo/lists',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "displayName": "List created from Microsoft Graph Explorer"\r\n}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/todo-post-lists?view=graph-rest-1.0',
    tip: 'This query requires the Tasks.ReadWrite permission and a value for the displayName parameter',
    skipTest: false
  },
  {
    category: 'Microsoft To Do',
    method: 'POST',
    humanName: 'create To Do task',
    requestUrl: '/v1.0/me/todo/lists/{taskListId}/tasks',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n  "title": "Task created from Microsoft Graph Explorer"\r\n}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/todotasklist-post-tasks?view=graph-rest-1.0',
    tip: 'This query requires the Tasks.ReadWrite permission. To find a value for the taskListId parameter, you can run: GET https://graph.microsoft.com/beta/me/todo/lists',
    skipTest: false
  },
  {
    category: 'Microsoft To Do',
    method: 'POST',
    humanName: 'create LinkedResource in a To Do task',
    requestUrl: '/v1.0/me/todo/lists/{taskListId}/tasks/{taskId}/linkedResources',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/en-us/graph/api/todotask-post-linkedresources?view=graph-rest-1.0',
    postBody: '{\r\n  "applicationName": "LinkedResource created from Microsoft Graph Explorer"\r\n}',
    tip: 'This query requires the Tasks.ReadWrite permission. To find a value for the taskListId parameter, you can run: GET https://graph.microsoft.com/beta/me/todo/lists. to find a value for the taskId, you can run: GET https://graph.microsoft.com/beta/me/todo/lists/{taskListId}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'list Azure AD gallery apps',
    requestUrl: '/beta/applicationTemplates',
    docLink: 'https://learn.microsoft.com/graph/api/applicationtemplate-list?view=graph-rest-beta',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'POST',
    humanName: 'instantiate an Azure AD gallery app',
    requestUrl: '/beta/applicationTemplates/{id}/instantiate',
    docLink: 'https://learn.microsoft.com/graph/api/applicationtemplate-instantiate?view=graph-rest-beta',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appTemplateAPISurvey',
    postBody: '{\r\n "displayName": "appDisplayName"\r\n}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'PATCH',
    humanName: 'update properties on the servicePrincipal',
    requestUrl: '/v1.0/servicePrincipals/{id}',
    docLink: 'https://learn.microsoft.com/graph/api/serviceprincipal-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/servicePrincipalAPISurvey',
    postBody: '{\r\n  "appRoleAssignmentRequired": true\r\n}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'PATCH',
    humanName: 'update properties on the application',
    requestUrl: '/v1.0/applications/{id}',
    docLink: 'https://learn.microsoft.com/graph/api/application-update?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/applicationsAPISurvey',
    postBody: '{\r\n  "displayName": "New display name"\r\n}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'POST',
    humanName: 'create a claim mapping policy',
    requestUrl: '/v1.0/policies/claimsMappingPolicies',
    docLink: 'https://learn.microsoft.com/graph/api/claimsmappingpolicy-post-claimsmappingpolicies?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/claimsMappingPolicyAPISurvey',
    postBody: '{\r\n  "definition": [\r\n    "definition-value"\r\n  ],\r\n  "displayName": "displayName-value",\r\n  "isOrganizationDefault": true\r\n}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'POST',
    humanName: 'assign a claims mapping policy to a serviceprincipal',
    requestUrl: '/v1.0/servicePrincipals/{id}/claimsMappingPolicies/$ref',
    docLink: 'https://learn.microsoft.com/graph/api/serviceprincipal-post-claimsmappingpolicies?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/claimsMappingPolicyAPISurvey',
    postBody: '{\r\n  "@odata.id":"https://graph.microsoft.com/v1.0/policies/claimsMappingPolicies/cd3d9b57-0aee-4f25-8ee3-ac74ef5986a9"\r\n}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'POST',
    humanName: 'assign an appRoleAssignment to a serviceprincipal',
    requestUrl: '/v1.0/servicePrincipals/{id}/appRoleAssignments',
    docLink: 'https://learn.microsoft.com/graph/api/serviceprincipal-post-approleassignments?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/appRoleAssignmentAPISurvey',
    postBody: '{\r\n  "principalId": "principalId-value",\r\n  "resourceId": "resourceId-value",\r\n  "appRoleId": "appRoleId-value"\r\n}',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'list azure ad application proxy connectors',
    requestUrl: '/beta/onPremisesPublishingProfiles/applicationProxy/connectors',
    docLink: 'https://learn.microsoft.com/graph/api/connector-get?view=graph-rest-beta&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/msgraphaadsurveyconnectors',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'list azure ad application proxy connector groups',
    requestUrl: '/beta/onPremisesPublishingProfiles/applicationProxy/connectorgroups',
    docLink: 'https://learn.microsoft.com/graph/api/connectorgroup-get?view=graph-rest-beta&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/msgraphaadsurveyconnectorgroups',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'list azure ad devices',
    requestUrl: '/v1.0/devices',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/device-list?view=graph-rest-1.0&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/deviceAPIFeedback',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'get a specified azure ad device',
    requestUrl: '/v1.0/devices/{id}',
    docLink: 'https://learn.microsoft.com/en-us/graph/api/device-get?view=graph-rest-1.0&tabs=http',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/deviceAPIFeedback',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'get high risk users',
    requestUrl: '/v1.0/identityProtection/riskyUsers?$filter=riskLevel eq \'high\'',
    docLink: 'https://learn.microsoft.com/graph/api/riskyuser-get?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/IdentityProtectionAPIFeedback',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'POST',
    humanName: 'confirm a user as compromised',
    requestUrl: '/v1.0/identityProtection/riskyUsers/confirmCompromised',
    docLink: 'https://learn.microsoft.com/graph/api/riskyuser-confirmcompromised?view=graph-rest-1.0',
    headers: [
      {
        'name': 'Content-type',
        'value': 'application/json'
      }
    ],
    postBody: '{\r\n "userIds": [\r\n    "targeted-userId-1",\r\n     "targeted-userId-2"\r\n  ]\r\n}',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/IdentityProtectionAPIFeedback',
    skipTest: false
  },
  {
    category: 'Identity and Access',
    method: 'GET',
    humanName: 'get risk detections',
    requestUrl: '/v1.0/identityProtection/riskDetections',
    docLink: 'https://learn.microsoft.com/graph/api/riskdetection-get?view=graph-rest-1.0',
    tip: 'We’d like to hear from you. Please leave your feedback on this API here: https://aka.ms/IdentityProtectionAPIFeedback',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'list catalog entries',
    requestUrl: '/beta/admin/windows/updates/catalog/entries',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-catalog-list-entries?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'list deployments',
    requestUrl: '/beta/admin/windows/updates/deployments',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-list-deployments?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'create deployment (feature update)',
    requestUrl: '/beta/admin/windows/updates/deployments',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-post-deployments?view=graph-rest-beta',
    postBody: '{\r\n    "content": {\r\n        "@odata.type": "#microsoft.graph.windowsUpdates.featureUpdateReference",\r\n        "version": "{featureUpdateVersion}"\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the featureUpdateVersion parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/catalog/entries.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'create deployment (expedited security update)',
    requestUrl: '/beta/admin/windows/updates/deployments',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-post-deployments?view=graph-rest-beta',
    postBody: '{\r\n    "content": {\r\n        "@odata.type": "microsoft.graph.windowsUpdates.expeditedQualityUpdateReference",\r\n        "releaseDate": "{qualityUpdateReleaseDate}"\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the qualityUpdateReleaseDate parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/catalog/entries.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'create deployment (rate-based gradual rollout)',
    requestUrl: '/beta/admin/windows/updates/deployments',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-post-deployments?view=graph-rest-beta',
    postBody: '{\r\n    "content": {\r\n        "@odata.type": "#microsoft.graph.windowsUpdates.featureUpdateReference",\r\n        "version": "{featureUpdateVersion}"\r\n    },\r\n    "settings": {\r\n        "@odata.type": "microsoft.graph.windowsUpdates.windowsDeploymentSettings",\r\n        "rollout": {\r\n            "devicesPerOffer": 100,\r\n            "durationBetweenOffers": "P7D"\r\n        },\r\n        "monitoring": {\r\n            "monitoringRules": [\r\n                {\r\n                    "@odata.type": "#microsoft.graph.windowsUpdates.monitoringRule",\r\n                    "signal": "rollback",\r\n                    "threshold": 5,\r\n                    "action": "pauseDeployment"\r\n                }\r\n            ]\r\n        }\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the featureUpdateVersion parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/catalog/entries.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'create deployment (date-based gradual rollout)',
    requestUrl: '/beta/admin/windows/updates/deployments',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-post-deployments?view=graph-rest-beta',
    postBody: '{\r\n    "content": {\r\n        "@odata.type": "#microsoft.graph.windowsUpdates.featureUpdateReference",\r\n        "version": "{featureUpdateVersion}"\r\n    },\r\n    "settings": {\r\n        "@odata.type": "microsoft.graph.windowsUpdates.windowsDeploymentSettings",\r\n        "rollout": {\r\n            "startDateTime": "{deploymentStartDateTime}",\r\n            "endDateTime": "{deploymentEndDateTime}",\r\n            "durationBetweenOffers": "P7D"\r\n        },\r\n        "monitoring": {\r\n            "monitoringRules": [\r\n                {\r\n                    "@odata.type": "#microsoft.graph.windowsUpdates.monitoringRule",\r\n                    "signal": "rollback",\r\n                    "threshold": 5,\r\n                    "action": "pauseDeployment"\r\n                }\r\n            ]\r\n        }\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the featureUpdateVersion parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/catalog/entries.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'get deployment',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deployment-get?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'PATCH',
    humanName: 'update deployment (replace monitoring rules)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deployment-update?view=graph-rest-beta',
    postBody: '{\r\n    "settings": {\r\n        "@odata.type": "microsoft.graph.windowsUpdates.windowsDeploymentSettings",\r\n        "monitoring": {\r\n            "monitoringRules": [\r\n                {\r\n                    "signal": "rollback",\r\n                    "threshold": 5,\r\n                    "action": "pauseDeployment"\r\n                }\r\n            ]\r\n        }\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'PATCH',
    humanName: 'update deployment (request paused state)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deployment-update?view=graph-rest-beta',
    postBody: '{\r\n    "state": {\r\n        "@odata.type": "#microsoft.graph.windowsUpdates.deploymentState",\r\n        "requestedValue": "paused"\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'PATCH',
    humanName: 'update deployment (clear requested state)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deployment-update?view=graph-rest-beta',
    postBody: '{\r\n    "state": {\r\n        "@odata.type": "#microsoft.graph.windowsUpdates.deploymentState",\r\n        "requestedValue": "none"\r\n    }\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'DELETE',
    humanName: 'delete deployment',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deployment-delete?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'list deployment audience members',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}/audience/members',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deploymentaudience-list-members?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'list deployment audience exclusions',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}/audience/exclusions',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deploymentaudience-list-exclusions?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'update deployment audience (add members)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}/audience/updateAudience',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deploymentaudience-updateaudience?view=graph-rest-beta',
    postBody: '{\r\n    "addMembers": [\r\n        {\r\n            "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",\r\n            "id": "{azureAdDeviceId}"\r\n        }\r\n    ]\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'update deployment audience (add exclusions)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}/audience/updateAudience',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deploymentaudience-updateaudience?view=graph-rest-beta',
    postBody: '{\r\n    "addExclusions": [\r\n        {\r\n            "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",\r\n            "id": "{azureAdDeviceId}"\r\n        }\r\n    ]\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'update deployment audience (remove members)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}/audience/updateAudience',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deploymentaudience-updateaudience?view=graph-rest-beta',
    postBody: '{\r\n    "removeMembers": [\r\n        {\r\n            "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",\r\n            "id": "{azureAdDeviceId}"\r\n        }\r\n    ]\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'update deployment audience (remove exclusions)',
    requestUrl: '/beta/admin/windows/updates/deployments/{deploymentId}/audience/updateAudience',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-deploymentaudience-updateaudience?view=graph-rest-beta',
    postBody: '{\r\n    "removeExclusions": [\r\n        {\r\n            "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",\r\n            "id": "{azureAdDeviceId}"\r\n        }\r\n    ]\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the deploymentId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updates/deployments.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'list updatable assets',
    requestUrl: '/beta/admin/windows/updates/updatableAssets',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-list-updatableassets?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'get updatable asset',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/{updatableAssetId}',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updatableasset-get?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the updatableAssetId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updatableAssets.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'DELETE',
    humanName: 'delete updatable asset',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/{updatableAssetId}',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updatableasset-delete?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the updatableAssetId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updatableAssets.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'list Azure AD devices',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/?$filter=isof(\'microsoft.graph.windowsUpdates.azureADDevice\')',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updates-list-updatableassets-azureaddevice?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'GET',
    humanName: 'get Azure AD device',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/{updatableAssetId}',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-azureaddevice-get?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the updatableAssetId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updatableAssets.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'DELETE',
    humanName: 'delete Azure AD device',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/{updatableAssetId}',
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-azureaddevice-delete?view=graph-rest-beta',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query. To find a value for the updatableAssetId parameter, you can run: GET https://graph.microsoft.com/beta/admin/windows/updatableAssets.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'enroll in feature update management',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/enrollAssets',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updatableasset-enrollassets?view=graph-rest-beta',
    postBody: '{\r\n    "updateCategory": "feature",\r\n    "assets": [\r\n        {\r\n            "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",\r\n            "id": "{azureAdDeviceId}"\r\n        }\r\n    ]\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query.',
    skipTest: false
  },
  {
    category: 'Windows Updates',
    method: 'POST',
    humanName: 'unenroll from feature update management',
    requestUrl: '/beta/admin/windows/updates/updatableAssets/unenrollAssets',
    headers: [
      {
        'name': 'Content-Type',
        'value': 'application/json'
      }
    ],
    docLink: 'https://learn.microsoft.com/graph/api/windowsupdates-updatableasset-unenrollassets?view=graph-rest-beta',
    postBody: '{\r\n    "updateCategory": "feature",\r\n    "assets": [\r\n        {\r\n            "@odata.type": "#microsoft.graph.windowsUpdates.azureADDevice",\r\n            "id": "{azureAdDeviceId}"\r\n        }\r\n    ]\r\n}',
    tip: 'Please enable the WindowsUpdates.ReadWrite.All permission to use this query.',
    skipTest: false
  }
]
