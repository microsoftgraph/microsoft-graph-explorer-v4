export function getSample() {

  return `{
    "openapi": "3.0.1",
    "info": {
      "title": "Partial Graph API",
      "version": "v1.0"
    },
    "servers": [
      {
        "url": "https://graph.microsoft.com/v1.0/",
        "description": "Core"
      }
    ],
    "paths": {
      "/me": {
        "get": {
          "tags": [
            "me.user"
          ],
          "summary": "Get me",
          "operationId": "me.user.GetUser",
          "parameters": [
            {
              "name": "$select",
              "in": "query",
              "description": "Select properties to be returned",
              "style": "form",
              "explode": false,
              "schema": {
                "uniqueItems": true,
                "type": "array",
                "items": {
                  "enum": [
                    "id",
                    "deletedDateTime",
                    "accountEnabled",
                    "ageGroup",
                    "assignedLicenses",
                    "assignedPlans",
                    "businessPhones",
                    "city",
                    "companyName",
                    "consentProvidedForMinor",
                    "country",
                    "creationType",
                    "department",
                    "displayName",
                    "employeeId",
                    "externalUserState",
                    "externalUserStateChangeDateTime",
                    "faxNumber",
                    "givenName",
                    "identities",
                    "imAddresses",
                    "isResourceAccount",
                    "jobTitle",
                    "lastPasswordChangeDateTime",
                    "legalAgeGroupClassification",
                    "licenseAssignmentStates",
                    "mail",
                    "mailNickname",
                    "mobilePhone",
                    "onPremisesDistinguishedName",
                    "onPremisesExtensionAttributes",
                    "onPremisesImmutableId",
                    "onPremisesLastSyncDateTime",
                    "onPremisesProvisioningErrors",
                    "onPremisesSecurityIdentifier",
                    "onPremisesSyncEnabled",
                    "onPremisesDomainName",
                    "onPremisesSamAccountName",
                    "onPremisesUserPrincipalName",
                    "otherMails",
                    "passwordPolicies",
                    "passwordProfile",
                    "officeLocation",
                    "postalCode",
                    "preferredLanguage",
                    "provisionedPlans",
                    "proxyAddresses",
                    "showInAddressList",
                    "signInSessionsValidFromDateTime",
                    "state",
                    "streetAddress",
                    "surname",
                    "usageLocation",
                    "userPrincipalName",
                    "userType",
                    "mailboxSettings",
                    "deviceEnrollmentLimit",
                    "aboutMe",
                    "birthday",
                    "hireDate",
                    "interests",
                    "mySite",
                    "pastProjects",
                    "preferredName",
                    "responsibilities",
                    "schools",
                    "skills",
                    "appRoleAssignments",
                    "ownedDevices",
                    "registeredDevices",
                    "manager",
                    "directReports",
                    "memberOf",
                    "createdObjects",
                    "oauth2PermissionGrants",
                    "ownedObjects",
                    "licenseDetails",
                    "transitiveMemberOf",
                    "outlook",
                    "messages",
                    "mailFolders",
                    "calendar",
                    "calendars",
                    "calendarGroups",
                    "calendarView",
                    "events",
                    "people",
                    "contacts",
                    "contactFolders",
                    "inferenceClassification",
                    "photo",
                    "photos",
                    "drive",
                    "drives",
                    "followedSites",
                    "extensions",
                    "managedDevices",
                    "managedAppRegistrations",
                    "deviceManagementTroubleshootingEvents",
                    "planner",
                    "insights",
                    "settings",
                    "onenote",
                    "activities",
                    "onlineMeetings",
                    "joinedTeams"
                  ],
                  "type": "string"
                }
              }
            },
            {
              "name": "$expand",
              "in": "query",
              "description": "Expand related entities",
              "style": "form",
              "explode": false,
              "schema": {
                "uniqueItems": true,
                "type": "array",
                "items": {
                  "enum": [
                    "*",
                    "appRoleAssignments",
                    "ownedDevices",
                    "registeredDevices",
                    "manager",
                    "directReports",
                    "memberOf",
                    "createdObjects",
                    "oauth2PermissionGrants",
                    "ownedObjects",
                    "licenseDetails",
                    "transitiveMemberOf",
                    "outlook",
                    "messages",
                    "mailFolders",
                    "calendar",
                    "calendars",
                    "calendarGroups",
                    "calendarView",
                    "events",
                    "people",
                    "contacts",
                    "contactFolders",
                    "inferenceClassification",
                    "photo",
                    "photos",
                    "drive",
                    "drives",
                    "followedSites",
                    "extensions",
                    "managedDevices",
                    "managedAppRegistrations",
                    "deviceManagementTroubleshootingEvents",
                    "planner",
                    "insights",
                    "settings",
                    "onenote",
                    "activities",
                    "onlineMeetings",
                    "joinedTeams"
                  ],
                  "type": "string"
                }
              }
            }
          ],
          "responses": {
            "200": {
              "description": "Retrieved entity",
              "links": {
                "appRoleAssignments": {
                  "operationId": "me.GetAppRoleAssignments",
                  "parameters": {
                    "appRoleAssignment-id": "$response.body#/id"
                  }
                },
                "ownedDevices": {
                  "operationId": "me.GetOwnedDevices",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "registeredDevices": {
                  "operationId": "me.GetRegisteredDevices",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "manager": {
                  "operationId": "me.GetManager",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "directReports": {
                  "operationId": "me.GetDirectReports",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "memberOf": {
                  "operationId": "me.GetMemberOf",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "createdObjects": {
                  "operationId": "me.GetCreatedObjects",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "oauth2PermissionGrants": {
                  "operationId": "me.GetOauth2PermissionGrants",
                  "parameters": {
                    "oAuth2PermissionGrant-id": "$response.body#/id"
                  }
                },
                "ownedObjects": {
                  "operationId": "me.GetOwnedObjects",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "licenseDetails": {
                  "operationId": "me.GetLicenseDetails",
                  "parameters": {
                    "licenseDetails-id": "$response.body#/id"
                  }
                },
                "transitiveMemberOf": {
                  "operationId": "me.GetTransitiveMemberOf",
                  "parameters": {
                    "directoryObject-id": "$response.body#/id"
                  }
                },
                "outlook": {
                  "operationId": "me.GetOutlook",
                  "parameters": {
                    "outlookUser-id": "$response.body#/id"
                  }
                },
                "messages": {
                  "operationId": "me.GetMessages",
                  "parameters": {
                    "message-id": "$response.body#/id"
                  }
                },
                "mailFolders": {
                  "operationId": "me.GetMailFolders",
                  "parameters": {
                    "mailFolder-id": "$response.body#/id"
                  }
                },
                "calendar": {
                  "operationId": "me.GetCalendar",
                  "parameters": {
                    "calendar-id": "$response.body#/id"
                  }
                },
                "calendars": {
                  "operationId": "me.GetCalendars",
                  "parameters": {
                    "calendar-id": "$response.body#/id"
                  }
                },
                "calendarGroups": {
                  "operationId": "me.GetCalendarGroups",
                  "parameters": {
                    "calendarGroup-id": "$response.body#/id"
                  }
                },
                "calendarView": {
                  "operationId": "me.GetCalendarView",
                  "parameters": {
                    "event-id": "$response.body#/id"
                  }
                },
                "events": {
                  "operationId": "me.GetEvents",
                  "parameters": {
                    "event-id": "$response.body#/id"
                  }
                },
                "people": {
                  "operationId": "me.GetPeople",
                  "parameters": {
                    "person-id": "$response.body#/id"
                  }
                },
                "contacts": {
                  "operationId": "me.GetContacts",
                  "parameters": {
                    "contact-id": "$response.body#/id"
                  }
                },
                "contactFolders": {
                  "operationId": "me.GetContactFolders",
                  "parameters": {
                    "contactFolder-id": "$response.body#/id"
                  }
                },
                "inferenceClassification": {
                  "operationId": "me.GetInferenceClassification",
                  "parameters": {
                    "inferenceClassification-id": "$response.body#/id"
                  }
                },
                "photo": {
                  "operationId": "me.GetPhoto",
                  "parameters": {
                    "profilePhoto-id": "$response.body#/id"
                  }
                },
                "photos": {
                  "operationId": "me.GetPhotos",
                  "parameters": {
                    "profilePhoto-id": "$response.body#/id"
                  }
                },
                "drive": {
                  "operationId": "me.GetDrive",
                  "parameters": {
                    "drive-id": "$response.body#/id"
                  }
                },
                "drives": {
                  "operationId": "me.GetDrives",
                  "parameters": {
                    "drive-id": "$response.body#/id"
                  }
                },
                "followedSites": {
                  "operationId": "me.GetFollowedSites",
                  "parameters": {
                    "site-id": "$response.body#/id"
                  }
                },
                "extensions": {
                  "operationId": "me.GetExtensions",
                  "parameters": {
                    "extension-id": "$response.body#/id"
                  }
                },
                "managedDevices": {
                  "operationId": "me.GetManagedDevices",
                  "parameters": {
                    "managedDevice-id": "$response.body#/id"
                  }
                },
                "managedAppRegistrations": {
                  "operationId": "me.GetManagedAppRegistrations",
                  "parameters": {
                    "managedAppRegistration-id": "$response.body#/id"
                  }
                },
                "deviceManagementTroubleshootingEvents": {
                  "operationId": "me.GetDeviceManagementTroubleshootingEvents",
                  "parameters": {
                    "deviceManagementTroubleshootingEvent-id": "$response.body#/id"
                  }
                },
                "planner": {
                  "operationId": "me.GetPlanner",
                  "parameters": {
                    "plannerUser-id": "$response.body#/id"
                  }
                },
                "insights": {
                  "operationId": "me.GetInsights",
                  "parameters": {
                    "officeGraphInsights-id": "$response.body#/id"
                  }
                },
                "settings": {
                  "operationId": "me.GetSettings",
                  "parameters": {
                    "userSettings-id": "$response.body#/id"
                  }
                },
                "onenote": {
                  "operationId": "me.GetOnenote",
                  "parameters": {
                    "onenote-id": "$response.body#/id"
                  }
                },
                "activities": {
                  "operationId": "me.GetActivities",
                  "parameters": {
                    "userActivity-id": "$response.body#/id"
                  }
                },
                "onlineMeetings": {
                  "operationId": "me.GetOnlineMeetings",
                  "parameters": {
                    "onlineMeeting-id": "$response.body#/id"
                  }
                },
                "joinedTeams": {
                  "operationId": "me.GetJoinedTeams",
                  "parameters": {
                    "team-id": "$response.body#/id"
                  }
                }
              }
            },
            "default": {
              "description": "error",
              "content": {
                "application/json": {
                  "schema": {
                    "required": [
                      "error"
                    ],
                    "type": "object",
                    "properties": {
                      "error": {
                        "required": [
                          "code",
                          "message"
                        ],
                        "type": "object",
                        "properties": {
                          "code": {
                            "type": "string"
                          },
                          "message": {
                            "type": "string"
                          },
                          "target": {
                            "type": "string"
                          },
                          "details": {
                            "type": "array",
                            "items": {
                              "required": [
                                "code",
                                "message"
                              ],
                              "type": "object",
                              "properties": {
                                "code": {
                                  "type": "string"
                                },
                                "message": {
                                  "type": "string"
                                },
                                "target": {
                                  "type": "string"
                                }
                              }
                            }
                          },
                          "innererror": {
                            "type": "object",
                            "description": "The structure of this object is service-specific"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "x-ms-docs-operation-type": "operation"
        },
        "patch": {
          "tags": [
            "me.user"
          ],
          "summary": "Update me",
          "operationId": "me.user.UpdateUser",
          "requestBody": {
            "description": "New property values",
            "content": { },
            "required": true
          },
          "responses": {
            "204": {
              "description": "Success"
            },
            "default": {
              "description": "error",
              "content": {
                "application/json": {
                  "schema": {
                    "required": [
                      "error"
                    ],
                    "type": "object",
                    "properties": {
                      "error": {
                        "required": [
                          "code",
                          "message"
                        ],
                        "type": "object",
                        "properties": {
                          "code": {
                            "type": "string"
                          },
                          "message": {
                            "type": "string"
                          },
                          "target": {
                            "type": "string"
                          },
                          "details": {
                            "type": "array",
                            "items": {
                              "required": [
                                "code",
                                "message"
                              ],
                              "type": "object",
                              "properties": {
                                "code": {
                                  "type": "string"
                                },
                                "message": {
                                  "type": "string"
                                },
                                "target": {
                                  "type": "string"
                                }
                              }
                            }
                          },
                          "innererror": {
                            "type": "object",
                            "description": "The structure of this object is service-specific"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "x-ms-docs-operation-type": "operation"
        }
      }
    },
    "components": { },
    "security": [
      {
        "azureaadv2": [ ]
      }
    ]
  }`;
}