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
import { API_MANIFEST_SPEC_PAGE } from '../../../../services/graph-constants';
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

  useEffect(() => {
    getPermissions(items);
  }, [])

  useEffect(() => {
    const generatedManifest = generateAPIManifest(items, permissions);
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
        <PrimaryButton disabled={!!isFetching} onClick={downloadManifest}>
          {!isFetching ? <FormattedMessage id='Download API Manifest' /> : <Spinner />}
        </PrimaryButton>
        <DefaultButton onClick={() => props.dismissPopup()}>
          <FormattedMessage id='Close' />
        </DefaultButton>
      </DialogFooter>
    </div>
  )
}

export default ManifestDescription