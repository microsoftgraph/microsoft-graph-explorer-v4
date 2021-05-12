import {
  ChoiceGroup, DefaultButton, Dialog,
  DialogFooter, DialogType, MessageBarType
} from 'office-ui-fabric-react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getCloudProperties, getCurrentCloud, globalCloud,
  replaceBaseUrl, storeCloudValue
} from '../../../../modules/cloud-resolver';
import { IRootState } from '../../../../types/root';
import { setActiveCloud } from '../../../services/actions/cloud-action-creator';
import { setSampleQuery } from '../../../services/actions/query-input-action-creators';
import { setQueryResponseStatus } from '../../../services/actions/query-status-action-creator';
import { translateMessage } from '../../../utils/translate-messages';
import { Sovereign } from './cloud-options';

export const SovereignClouds = ({ cloudSelectorOpen, toggleCloudSelector }: any) => {
  const dispatch = useDispatch();
  const { sampleQuery, profile } = useSelector((state: IRootState) => state);

  const cloudOptions = new Sovereign(profile).getOptions();
  const currentCloud = (getCurrentCloud() !== undefined) ? getCurrentCloud() : globalCloud;

  const handleCloudSelection = (cloud: any) => {
    setSelectedCloud(cloud);

    dispatch(setQueryResponseStatus({
      statusText: translateMessage('Cloud selected'),
      status: cloud.key,
      ok: true,
      messageType: MessageBarType.success
    }));
  }

  const setSelectedCloud = (cloud: any) => {
    let activeCloud = getCloudProperties(cloud.key) || null;
    activeCloud = (activeCloud) ? activeCloud : globalCloud;
    storeCloudValue(activeCloud.name);
    dispatch(setActiveCloud(activeCloud));

    const query = { ...sampleQuery };
    query.sampleUrl = replaceBaseUrl(query.sampleUrl);
    dispatch(setSampleQuery(query));
  }

  return (
    <Dialog
      hidden={!cloudSelectorOpen}
      onDismiss={() => toggleCloudSelector()}
      dialogContentProps={{
        type: DialogType.largeHeader,
        title: translateMessage('You have access to sovereign clouds'),
        isMultiline: false,
      }}
    >
      <ChoiceGroup
        label='Pick the cloud'
        defaultSelectedKey={currentCloud?.name}
        options={cloudOptions}
        onChange={(event, selectedTheme) => handleCloudSelection(selectedTheme)}
      />
      <DialogFooter>
        <DefaultButton
          text={translateMessage('Close')}
          onClick={() => toggleCloudSelector()} />
      </DialogFooter>
    </Dialog>
  )
}
