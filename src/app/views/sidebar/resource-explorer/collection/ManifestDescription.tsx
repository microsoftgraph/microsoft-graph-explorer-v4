import {
  ChoiceGroup,
  FontSizes, FontWeights, IChoiceGroupOption, Link,
  PrimaryButton,
  VerticalDivider, getTheme, mergeStyleSets
} from '@fluentui/react';
import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '../../../../../store';
import { componentNames } from '../../../../../telemetry';
import { APIManifest } from '../../../../../types/api-manifest';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { API_MANIFEST_SPEC_PAGE, PERMS_SCOPE } from '../../../../services/graph-constants';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { downloadToLocal, trackDownload } from '../../../common/download';
import { generateAPIManifest } from './api-manifest.util';
import { translateMessage } from '../../../../utils/translate-messages';


const ManifestDescription: React.FC<PopupsComponent<null>> = (props) => {
  const { getPermissions, permissions, isFetching } = useCollectionPermissions();
  const [manifest, setManifest] = useState<APIManifest>();
  const [isGeneratingManifest, setIsGeneratingManifest] = useState<boolean>(false);
  const [selectedScope, setSelectedScope] = useState<string>('');

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
      },
      permissionsButtons: {
        display: 'flex',
        flexDirection: 'row',
        gap: '50px',
        paddingTop: '15px',
        paddingBottom: '15px'
      }
    }
  );

  const options: IChoiceGroupOption[] = [
    {
      key: `${PERMS_SCOPE.WORK}`,
      text: translateMessage('Delegated work'),
      disabled: isGeneratingManifest
    },
    {
      key: `${PERMS_SCOPE.APPLICATION}`,
      text: translateMessage('Application permissions'),
      disabled: isGeneratingManifest
    },
    {
      key: `${PERMS_SCOPE.APPLICATION}_${PERMS_SCOPE.WORK}`,
      text: translateMessage('Delegated & application permissions'),
      disabled: isGeneratingManifest
    }
  ];

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

  const getFilteredPermissions = (scopeType: string) => {
    if(scopeType === `${PERMS_SCOPE.APPLICATION}_${PERMS_SCOPE.WORK}`){
      return permissions;
    }
    return permissions.filter(k => k.scopeType === scopeType);
  }

  useEffect(() => {
    getPermissions(items);
  }, []);

  const onSelectionChange = useCallback((ev: FormEvent<HTMLElement | HTMLInputElement> | undefined,
    option: IChoiceGroupOption | undefined) => {
    console.log('Selected ', option!.key)
    setSelectedScope(option!.key);
    setIsGeneratingManifest(true);
    do{
      console.log('Still fetching ', isFetching);
      //
    }while(isFetching);
    const filteredPermissions = getFilteredPermissions(option!.key);
    const generatedManifest = generateAPIManifest(items, filteredPermissions);
    if(Object.keys(generatedManifest).length > 0){
      setIsGeneratingManifest(false);
    }
    console.log('Generated manifest ', generatedManifest);
    setManifest(generatedManifest);
  }, []);

  return (
    <div className={manifestStyle.root}>
      <FormattedMessage id='API manifest description' />
      <br />
      <br/>
      <VerticalDivider />

      <FormattedMessage id='Permissions choice' />
      <ChoiceGroup options={options}
        onChange={onSelectionChange} label=''
        styles={{flexContainer: manifestStyle.permissionsButtons}}
      />

      <VerticalDivider />

      <FormattedMessage id='To generate client'/>
      <br/>
      <FormattedMessage id='Use VS Code'/>
      <Link>kiota documentation link</Link>
      <FormattedMessage id='VS Code extension'/>
      <br/>
      <br/>

      <PrimaryButton disabled={selectedScope === '' || isGeneratingManifest || isFetching}
        onClick={openManifestInVisualStudio}>
        {isGeneratingManifest && <FormattedMessage id='Hold on, we are creating the manifest' />}
        {!isGeneratingManifest && <FormattedMessage id='Open in VS Code' />}
      </PrimaryButton>

      <VerticalDivider />
      <br />
      <br />
      <FormattedMessage id='Use Kiota CLI' />
      <br/>
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
      <br/>
      <PrimaryButton disabled={selectedScope === '' || isGeneratingManifest || isFetching}
        onClick={downloadManifest}>
        {isGeneratingManifest && <FormattedMessage id='Hold on, we are creating the manifest' />}
        {!isGeneratingManifest && <FormattedMessage id='Download API Manifest' />}
      </PrimaryButton>
      <br/>
      To learn more about the API Manifest,
      visit the <Link href={API_MANIFEST_SPEC_PAGE} target='_blank' >API Manifest specification</Link> page.
    </div>
  )
}

export default ManifestDescription