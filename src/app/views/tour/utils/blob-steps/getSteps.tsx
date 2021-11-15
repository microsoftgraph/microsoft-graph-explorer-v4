import { ITourSteps } from '../types'
import React from 'react';
import { Link } from '@fluentui/react';
import { translateMessage } from '../../../../utils/translate-messages';

export const getTourSteps = (steps: any, beginnerTour: boolean): ITourSteps[] => {
  const beginnerSteps: ITourSteps[] = [];
  const advancedSteps: ITourSteps[] = [];

  const { TourSteps } = steps;

  for (const step of TourSteps) {
    const {content, advanced, docsLink } = step;
    let tourContent = <div>{content}</div>;
    if(!!docsLink){
      tourContent = <div>{content} {' '}
        <Link href={docsLink} target='_blank' underline style={{color: 'white'}}>
          {translateMessage('Click here to learn more')}
        </Link>
      </div>
    }

    let actualStep: ITourSteps = {
      ...step,
      content: tourContent
    }

    actualStep = deleteEmptyQueryObject(actualStep);

    if (advanced) {
      advancedSteps.push(actualStep);
    }
    else {
      beginnerSteps.push(actualStep);
    }
  }

  return (beginnerTour ? beginnerSteps : advancedSteps);
}

const deleteEmptyQueryObject = (tourSteps: ITourSteps) : ITourSteps => {
  const { query } = tourSteps;
  if(!!query){
    const objectCount = Object.keys(query).length;
    if(objectCount === 0) {
      delete tourSteps.query;
    }
  }
  return tourSteps;
}