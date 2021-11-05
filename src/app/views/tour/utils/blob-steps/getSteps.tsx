import { ITourSteps } from '../types'
import React from 'react';
import { Link } from '@fluentui/react';
import { translateMessage } from '../../../../utils/translate-messages';

export const getTourSteps = (steps: any, beginnerTour: boolean): ITourSteps[] => {
  const beginnerSteps: ITourSteps[] = [];
  const advancedSteps: ITourSteps[] = [];

  const { TourSteps } = steps;

  for (const step of TourSteps) {
    const { target, content, directionalHint, spotlightClicks, hideCloseButton,
      autoNext, disableBeacon, title, expectedActionType, advanced, docsLink, query } = step;
    let tourContent = <div>{content}</div>;
    if(!!docsLink){
      tourContent = <div>{content} {' '}
        <Link href={docsLink} target='_blank' underline style={{color: 'white'}}>
          {translateMessage('Click here to learn more')}
        </Link>
      </div>
    }

    const actualStep: ITourSteps = {
      target,
      content: tourContent,
      disableBeacon,
      directionalHint,
      autoNext,
      title,
      hideCloseButton,
      expectedActionType,
      spotlightClicks,
      query
    }


    if(!!query){
      const objectCount = Object.keys(query).length;
      if(objectCount === 0) {
        delete actualStep.query
      }

    }

    if (advanced === true) {
      advancedSteps.push(actualStep);
    }
    else {
      beginnerSteps.push(actualStep);
    }
  }

  return (beginnerTour === true ? beginnerSteps : advancedSteps);
}