// /* eslint-disable max-len */
// import { ITheme, Label, Link, PivotItem, getTheme } from '@fluentui/react';
// import { useEffect, useState } from 'react';

// import { useAppDispatch, useAppSelector } from '../../../../store';
// import { componentNames, telemetry } from '../../../../telemetry';
// import { CODE_SNIPPETS_COPY_BUTTON } from '../../../../telemetry/component-names';
// import { getSnippet } from '../../../services/slices/snippet.slice';
// import { translateMessage } from '../../../utils/translate-messages';
// import { Monaco } from '../../common';
// import { trackedGenericCopy } from '../../common/copy';
// import {
//   convertVhToPx, getResponseEditorHeight,
//   getResponseHeight
// } from '../../common/dimensions/dimensions-adjustment';
// import { CopyButton } from '../../common/lazy-loader/component-registry';
// import { getSnippetStyles } from './Snippets.styles';

// interface ISnippetProps {
//   language: string;
//   snippetInfo: ISupportedLanguages;
// }

// interface ISupportedLanguages {
//   [language: string]: {
//     sdkDownloadLink: string;
//     sdkDocLink: string;
//   };
// }

// export function renderSnippets(supportedLanguages: ISupportedLanguages) {
//   const sortedSupportedLanguages: ISupportedLanguages = {};
//   const sortedKeys = Object.keys(supportedLanguages).sort((lang1, lang2) => {
//     if (lang1 === 'CSharp') {
//       return -1;
//     }
//     if (lang2 === 'CSharp') {
//       return 1;
//     }
//     if (lang1 < lang2) {
//       return -1;
//     } else if (lang1 > lang2) {
//       return 1;
//     }
//     return 0;
//   });

//   sortedKeys.forEach(key => {
//     sortedSupportedLanguages[key] = supportedLanguages[key];
//   });


//   return Object.keys(sortedSupportedLanguages).
//     map((language: string) => (
//       <PivotItem
//         key={language}
//         headerText={language === 'CSharp' ? 'C#' : language}
//         headerButtonProps={{
//           'aria-controls': `${language}-tab`
//         }}
//         itemKey={language}
//         tabIndex={0}
//         id={`${language}-tab`}
//       >
//         <Snippet language={language} snippetInfo={supportedLanguages} />
//       </PivotItem>
//     ));
// }

// function Snippet(props: ISnippetProps) {
//   let { language } = props;
//   const { sdkDownloadLink, sdkDocLink } = props.snippetInfo[language];
//   const unformattedLanguage = language;

//   /**
//    * Converting language lowercase so that we won't have to call toLowerCase() in multiple places.
//    *
//    * Ie the monaco component expects a lowercase string for the language prop and the graphexplorerapi expects
//    * a lowercase string for the param value.
//    */

//   language = language.toLowerCase();

//   const { dimensions: { response }, snippets,
//     responseAreaExpanded, sampleQuery } = useAppSelector((state) => state);
//   const { data, pending: loadingState, error } = snippets;
//   const snippet = (!loadingState && data) ? data[language] : null;
//   const responseHeight = getResponseHeight(response.height, responseAreaExpanded);
//   const defaultHeight = convertVhToPx(responseHeight, 220);
//   const [snippetError, setSnippetError] = useState(error);

//   const monacoHeight = getResponseEditorHeight(235);

//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     setSnippetError(error?.error ? error.error : error);
//   }, [error])

//   const handleCopy = async () => {
//     trackedGenericCopy(snippet, CODE_SNIPPETS_COPY_BUTTON, sampleQuery, { Language: language });
//   }

//   useEffect(() => {
//     dispatch(getSnippet(language));
//   }, [sampleQuery.sampleUrl]);

//   const setCommentSymbol = (): string => {
//     return (language.trim() === 'powershell' || language.trim() === 'python') ? '#' : '//';
//   }

//   const trackLinkClickedEvent = (link: string, e:any) => {
//     const isDocumentationLink : boolean = link.includes('doc')
//     const componentName = getLanguageComponentName(isDocumentationLink, componentNames.CODE_SNIPPET_LANGUAGES);
//     telemetry.trackLinkClickEvent(e.currentTarget.href, componentName);
//   }
//   const getLanguageComponentName = (isDocumentationLink: boolean, snippetComponentNames: object) : string => {
//     const snippetComponentEntries = Object.entries(snippetComponentNames);
//     const snippetLanguageEntry = snippetComponentEntries.find(
//       ([key]) => language.toLocaleLowerCase() === key.toLocaleLowerCase()
//     );
//     const componentName = isDocumentationLink ? snippetLanguageEntry?.[1].doc : snippetLanguageEntry?.[1].sdk;
//     return componentName || '' ;
//   }

//   const addExtraSnippetInformation = () : JSX.Element => {
//     const currentTheme: ITheme = getTheme();
//     const snippetLinkStyles = getSnippetStyles(currentTheme);
//     const snippetCommentStyles = getSnippetStyles(currentTheme).snippetComments;
//     return (
//       <div style={snippetCommentStyles}>

//         {setCommentSymbol()} {translateMessage('Leverage libraries')} {unformattedLanguage} {translateMessage('Client library')}

//         <Link href={sdkDownloadLink} underline styles={snippetLinkStyles}
//           onClick={(e) => trackLinkClickedEvent(sdkDownloadLink, e)} target={'_blank'} rel='noreferrer noopener'>
//           {sdkDownloadLink}
//         </Link>
//         <br />

//         {setCommentSymbol()} {translateMessage('SDKs documentation')}

//         <Link href={sdkDocLink} underline styles={snippetLinkStyles}
//           onClick={(e) => trackLinkClickedEvent(sdkDocLink, e)} target={'_blank'} rel='noreferrer noopener'>
//           {sdkDocLink}
//         </Link>
//       </div>
//     );
//   }

//   const displayError = (): JSX.Element | null => {
//     if((!loadingState && snippet) || (!loadingState && !snippetError)){
//       return null;
//     }
//     if(
//       (snippetError?.status && snippetError.status === 404) ||
//       (snippetError?.status && snippetError.status === 400)
//     ){
//       return(
//         <Label style={{ padding: 10 }}>
//           {translateMessage('Snippet not available' )}
//         </Label>
//       )
//     }
//     else{
//       return (
//         <>
//           {!loadingState &&
//             <Label style={{ padding: 10 }}>
//               {translateMessage('Fetching code snippet failing' )}
//             </Label>
//           }
//         </>
//       )
//     }
//   }

//   return (
//     <div style={{ display: 'block' }} id={`${language}-tab`}>
//       {loadingState &&
//         <Label style={{ padding: 10 }}>
//           {translateMessage('Fetching code snippet' )}...
//         </Label>
//       }
//       {!loadingState && snippet &&
//         <>
//           <CopyButton isIconButton={true} style={{ float: 'right', zIndex: 1 }} handleOnClick={handleCopy} />
//           <Monaco
//             body={snippet}
//             language={language}
//             readOnly={true}
//             height={responseAreaExpanded ? defaultHeight : monacoHeight}
//             extraInfoElement={addExtraSnippetInformation()}
//           />
//         </>
//       }
//       {displayError()}
//     </div>
//   );
// }