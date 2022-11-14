import {
  DirectionalHint,
  IconButton,
  IIconProps,
  TooltipHost
} from '@fluentui/react';
import React from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../../../store';
import { IResource, IResourceLink } from '../../../../../types/resources';
import { addResourcePaths } from '../../../../services/actions/resource-explorer-action-creators';
import { sanitizeQueryUrl } from '../../../../utils/query-url-sanitization';
import { getResourcesSupportedByVersion } from '../../../../utils/resources/resources-filter';
import { translateMessage } from '../../../../utils/translate-messages';
import {
  createResourcesList,
  getResourcePaths
} from '../../../sidebar/resource-explorer/resource-explorer.utils';
import { addToCartStyles } from './AddToCart.styles';

export const AddToCart = () => {
  const { sampleQuery, resources } = useAppSelector((state) => state);
  const dispatch: AppDispatch = useDispatch();
  const iconProps: IIconProps = {
    iconName: 'ShoppingCart'
  };
  const calloutProps = {
    gapSpace: 0
  };
  const content = (
    <div style={{ padding: '3px' }}>{translateMessage('Add to cart')}</div>
  );
  const getDeeperMostResource = (
    resourcesToMatch: IResource[],
    pathSegments: string[]
  ): IResource | undefined => {
    if (pathSegments.length === 0) {
      return undefined;
    }
    const pathSegmentToMatch = decodeURIComponent(pathSegments[0]);
    for (const resource of resourcesToMatch) {
      if (
        resource.segment === pathSegmentToMatch ||
        (resource.segment.endsWith('}') &&
          resource.segment.startsWith('{') &&
          pathSegmentToMatch.startsWith('{') &&
          pathSegmentToMatch.endsWith('}'))
      ) {
        // workaround for when the segment is a parameter and the parameter name doesn't match
        const result = getDeeperMostResource(
          resource.children,
          pathSegments.slice(1)
        );
        if (result) {
          return result;
        } else if (pathSegments.length === 1) {
          return resource;
        }
      }
    }
    return undefined;
  };
  const addToCart = () => {
    const query = { ...sampleQuery };
    const sanitizedQueryUrl = sanitizeQueryUrl(query.sampleUrl);
    const pathSegments = new URL(sanitizedQueryUrl).pathname
      .split('/')
      .slice(2);
    const filteredPayload = getResourcesSupportedByVersion(
      resources.data.children,
      query.selectedVersion
    );
    let resource = getDeeperMostResource(filteredPayload, pathSegments);
    if (resource) {
      resource = { ...resource, children: [] };
      const navigationGroup = createResourcesList(
        [resource],
        query.selectedVersion
      );
      dispatch(
        addResourcePaths(
          getResourcePaths(
            navigationGroup[0].links[0] as IResourceLink,
            query.selectedVersion
          )
        )
      );
    }
  };
  const shareButtonStyles = addToCartStyles().iconButton;
  return (
    <div>
      <TooltipHost
        content={content}
        calloutProps={calloutProps}
        directionalHint={DirectionalHint.leftBottomEdge}
      >
        <IconButton
          onClick={addToCart}
          iconProps={iconProps}
          styles={shareButtonStyles}
          role={'button'}
          ariaLabel={translateMessage('Add to cart')}
        />
      </TooltipHost>
    </div>
  );
};
