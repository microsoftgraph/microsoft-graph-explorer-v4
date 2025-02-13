
// import {
//   FontSizes, getTheme, IStyle, ITheme, Label, Link,
//   MessageBar, MessageBarType, Pivot, PivotItem, styled
// } from '@fluentui/react';
// import * as AdaptiveCardsAPI from 'adaptivecards';
// import { useEffect, useState } from 'react';

// import { useAppSelector } from '../../../../store';
// import { componentNames, telemetry } from '../../../../telemetry';
// import { IAdaptiveCardContent } from '../../../../types/adaptivecard';
// import { IQuery } from '../../../../types/query-runner';
// import { translateMessage } from '../../../utils/translate-messages';
// import { classNames } from '../../classnames';
// import { Monaco } from '../../common';
// import { trackedGenericCopy } from '../../common/copy';
// import {
//   convertVhToPx, getResponseEditorHeight,
//   getResponseHeight
// } from '../../common/dimensions/dimensions-adjustment';
// import { CopyButton } from '../../common/lazy-loader/component-registry';
// import { queryResponseStyles } from './../queryResponse.styles';
// import { getAdaptiveCard } from './adaptive-cards.util';
// import MarkdownIt from 'markdown-it';

// export interface AdaptiveCardResponse {
//   data?: IAdaptiveCardContent;
//   error?: string;
// }

// const AdaptiveCard = (props: any) => {
//   let adaptiveCard: AdaptiveCardsAPI.AdaptiveCard | null = new AdaptiveCardsAPI.AdaptiveCard();
//   const [cardContent, setCardContent] = useState<AdaptiveCardResponse | undefined>(undefined);

//   const { body, hostConfig } = props;
//   const { dimensions: { response }, responseAreaExpanded,
//     sampleQuery, queryRunnerStatus: queryStatus, theme } = useAppSelector((state) => state);

//   const classes = classNames(props);
//   const currentTheme: ITheme = getTheme();
//   const textStyle = queryResponseStyles(currentTheme).queryResponseText.root as IStyle;

//   const defaultHeight = convertVhToPx(getResponseHeight(response.height, responseAreaExpanded), 220);
//   const monacoHeight = getResponseEditorHeight(190);

//   useEffect(() => {
//     try {
//       const content = getAdaptiveCard(body, sampleQuery);
//       setCardContent({
//         data: content
//       })
//     } catch (err: unknown) {
//       const error = err as Error;
//       setCardContent({
//         error: error.message
//       })
//     }

//     if (!adaptiveCard) {
//       adaptiveCard = new AdaptiveCardsAPI.AdaptiveCard();
//     }

//     if (hostConfig) {
//       adaptiveCard.hostConfig = new AdaptiveCardsAPI.HostConfig(
//         hostConfig
//       );
//     }

//     return () => {
//       adaptiveCard = null;
//     }
//   }, [body])

//   const onPivotItemClick = (query: IQuery | undefined, item?: PivotItem) => {
//     if (!item) { return; }
//     const key = item.props.itemKey;
//     if (key) {
//       telemetry.trackTabClickEvent(key, query);
//     }
//   }

//   if (!body) {
//     return <div />;
//   }

//   if (body) {
//     if (!cardContent?.data || (queryStatus && !queryStatus.ok)) {
//       return (
//         <Label styles={{ root: textStyle }}>
//           {translateMessage('The Adaptive Card for this response is not available')}
//           &nbsp;
//           <Link
//             href={'https://adaptivecards.io/designer/'}
//             tabIndex={0}
//             target='_blank'
//             rel='noopener noreferrer'
//             underline
//           >
//             {translateMessage('Adaptive Cards designer')}
//           </Link>
//         </Label>
//       );
//     }

//     try {
//       // markdown support
//       AdaptiveCardsAPI.AdaptiveCard.onProcessMarkdown =
//         (text: string, result: AdaptiveCardsAPI.IMarkdownProcessingResult) => {
//           const md = new MarkdownIt();
//           result.outputHtml = md.render(text);
//           result.didProcess = true;
//         };
//       adaptiveCard.parse(cardContent!.data.card);
//       const renderedCard = adaptiveCard.render();

//       if (renderedCard) {
//         renderedCard.style.backgroundColor = currentTheme.palette.neutralLighter;

//         const applyTheme = (child: HTMLElement) => {
//           if (!child) { return; }
//           if (child && child.tagName === 'BUTTON') { return; }

//           child.style.color = currentTheme.palette.black;
//           if (child.children.length > 0) {
//             // eslint-disable-next-line @typescript-eslint/prefer-for-of
//             for (let i = 0; i < child.children.length; i++) {
//               applyTheme(child.children[i] as HTMLElement);
//             }
//           }
//         }

//         if (theme !== 'light') {
//           applyTheme(renderedCard);
//         }
//       }

//       const handleCopy = async () => {
//         trackedGenericCopy(JSON.stringify(cardContent!.data?.template, null, 4),
//           componentNames.JSON_SCHEMA_COPY_BUTTON, sampleQuery);
//       }

//       return (
//         <Pivot className='adaptive-pivot'
//           onLinkClick={(pivotItem: PivotItem | undefined) => onPivotItemClick(sampleQuery, pivotItem)}
//           styles={{ text: { fontSize: FontSizes.size14 } }}>
//           <PivotItem
//             itemKey='card'
//             ariaLabel={translateMessage('card')}
//             headerText={translateMessage('card')}
//             className={classes.card}
//             headerButtonProps={{
//               'aria-controls': 'card-tab'
//             }}
//           >
//             <div id={'card-tab'}
//               ref={(n) => {
//                 if (n && !n.firstChild) {
//                   n.appendChild(renderedCard as HTMLElement as HTMLElement);
//                 } else {
//                   if (n && n.firstChild) {
//                     n.replaceChild(renderedCard as HTMLElement as HTMLElement, n.firstChild);
//                   }
//                 }
//               }}
//             />
//           </PivotItem>
//           <PivotItem
//             itemKey='JSON-schema'
//             ariaLabel={translateMessage('JSON Schema')}
//             headerText={translateMessage('JSON Schema')}
//             headerButtonProps={{
//               'aria-controls': 'json-schema-tab'
//             }}
//           >
//             <div id={'JSON-schema-tab'} tabIndex={0}>
//               <MessageBar messageBarType={MessageBarType.info}>
//                 {translateMessage('Get started with adaptive cards on')}
//                 <Link href={'https://learn.microsoft.com/en-us/adaptive-cards/templating/sdk'}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   tabIndex={0}
//                   underline
//                 >
//                   {translateMessage('Adaptive Cards Templating SDK')}
//                 </Link>
//                 {translateMessage('and experiment on')}
//                 <Link href={'https://adaptivecards.io/designer/'}
//                   target='_blank'
//                   rel='noopener noreferrer'
//                   tabIndex={0}
//                   underline
//                 >
//                   {translateMessage('Adaptive Cards designer')}
//                 </Link>
//               </MessageBar>
//               <CopyButton
//                 className={classes.copyIcon}
//                 handleOnClick={handleCopy}
//                 isIconButton={true}
//                 style={{ float: 'right', zIndex: 1 }}
//               />
//               <Monaco
//                 language='json'
//                 body={cardContent!.data?.template}
//                 height={responseAreaExpanded ? defaultHeight : monacoHeight}
//               />
//             </div>
//           </PivotItem>
//         </Pivot>
//       );
//     } catch (err: unknown) {
//       const error = err as Error;
//       return <div style={{ color: 'red' }}>{error.message}</div>;
//     }
//   }
// }

// // @ts-ignore
// const styledAdaptiveCard = styled(AdaptiveCard, queryResponseStyles);
// const trackedComponent = telemetry.trackReactComponent(styledAdaptiveCard, componentNames.ADAPTIVE_CARDS_TAB);
// export default trackedComponent;
