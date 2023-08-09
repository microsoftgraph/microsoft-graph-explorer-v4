import {
  DefaultButton, DialogFooter, FontSizes, FontWeights, Link,
  PrimaryButton,
  Spinner,
  VerticalDivider, getTheme, mergeStyleSets
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '../../../../../store';
import { componentNames } from '../../../../../telemetry';
import { APIManifest } from '../../../../../types/api-manifest';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { API_MANIFEST_SPEC_PAGE, PERMS_SCOPE } from '../../../../services/graph-constants';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { downloadToLocal, trackDownload } from '../../../common/download';
import { generateAPIManifest } from './api-manifest.util';


const ManifestDescription: React.FC<PopupsComponent<null>> = (props) => {
  const { getPermissions, permissions, isFetching } = useCollectionPermissions();
  const [manifest, setManifest] = useState<APIManifest>();
  const manifestStyle = mergeStyleSets(
    {
      root: {
        lineHeight: 'normal', width: '100%',
        h3: {
          fontSize: FontSizes.size16,
          fontWeight: FontWeights.semibold
        }
      },
      steps: {
        background: getTheme().palette.neutralLighter,
        margin: 5,
        padding: 5,
        ul: {
          listStyleType: 'circle',
          marginLeft: 18
        },
        code: {
          background: getTheme().palette.neutralLight,
          marginLeft: 2,
          FontStyle: 'italic'
        }
      },
      actionButtons: {
        display: 'flex',
        gap: '8px'
      },
      spinner: {
        marginRight: '4px',
        marginLeft: '4px'
      }
    }
  );
  const { collections } = useAppSelector(
    (state) => state
  );
  const items = collections ? collections.find(k => k.isDefault)!.paths : [];

  const downloadManifest = () => {
    if (!manifest) { return; }
    const filename = `${manifest.publisher.name}-API-Manifest.json`;
    downloadToLocal(manifest, filename);
    trackDownload(filename, componentNames.DOWNLOAD_API_MANIFEST_BUTTON);
  }

  const openManifestInVisualStudio = () => {
    const base64UrlEncodedManifest = btoa(JSON.stringify(manifest));
    const manifestContentUrl = `vscode://ms-graph.kiota/OpenManifest?manifestContent=${base64UrlEncodedManifest}`;
    window.open(manifestContentUrl, '_blank');
  }

  const renderManifestButtons = () : JSX.Element => {
    return(
      <div className={manifestStyle.actionButtons}>
        <PrimaryButton disabled={!!isFetching} onClick={downloadManifest}>
          <FormattedMessage id='Download API Manifest' />
        </PrimaryButton>
        <PrimaryButton disabled={!!isFetching} onClick={openManifestInVisualStudio}>
          <FormattedMessage id='Open in VS Code' />
        </PrimaryButton>
      </div>
    )
  }

  const getFilteredPermissions = (scopeType: string) => {
    if(scopeType === `${PERMS_SCOPE.APPLICATION}_${PERMS_SCOPE.WORK}`){
      return permissions;
    }
    return permissions.filter(k => k.scopeType === scopeType);
  }

  useEffect(() => {
    getPermissions(items);
  }, [])

  useEffect(() => {
    let generatedManifest = {} as APIManifest;
    if(props && props.data){
      const { selectedScopeType } = props.data;
      if(selectedScopeType){
        const filteredPermissions = getFilteredPermissions(selectedScopeType);
        generatedManifest = generateAPIManifest(items, filteredPermissions);
        setManifest(generatedManifest);
        return;
      }
    }
    generatedManifest = generateAPIManifest(items, permissions);
    setManifest(generatedManifest);
  }, [permissions]);

  return (
    <div className={manifestStyle.root}>
      To generate an API client, you need to
      download the API Manifest and use it with the Kiota VS code extenstion / Kiota CLI

      <VerticalDivider />

      <h3>Using VS Code</h3>
      <div className={manifestStyle.steps}>
        Steps:
        <ul>
          <li>Download the API Manifest</li>
          <li>Install the Kiota VS Code extension</li>
          <li>Open the API Manifest in VS Code</li>
          <li>Right click on the API Manifest and select "Generate client code"</li>
          <li>Choose the language you want to generate the code for</li>
          <li>Choose the output folder</li>
        </ul>
      </div>

      <VerticalDivider />

      <h3>Using the CLI</h3>
      <div className={manifestStyle.steps}>
        Steps:
        <ul>
          <li>Download the API Manifest</li>
          <li>Install the Kiota CLI</li>
          <li>Run the command "kiota generate -i
            <code>path-to-manifest</code> -o
            <code>output-folder</code> -l
            <code>language</code>"
          </li>
        </ul>
      </div>
      <VerticalDivider />
      To learn more about the API Manifest,
      visit the <Link href={API_MANIFEST_SPEC_PAGE} target='_blank' >API Manifest specification</Link> page.

      <DialogFooter styles={{ actionsRight: { justifyContent: 'start' } }}>
        {!isFetching ? renderManifestButtons() : <Spinner className={manifestStyle.spinner} />}
        <DefaultButton onClick={() => props.dismissPopup()}>
          <FormattedMessage id='Close' />
        </DefaultButton>
      </DialogFooter>
    </div>
  )
}

export default ManifestDescription