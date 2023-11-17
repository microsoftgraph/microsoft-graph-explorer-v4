import {
  FontSizes, FontWeights,
  Link,
  PrimaryButton,
  Spinner,
  Stack,
  VerticalDivider, getTheme, mergeStyleSets
} from '@fluentui/react';
import { FC, useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useAppSelector } from '../../../../../store';
import { componentNames, eventTypes, telemetry } from '../../../../../telemetry';
import { APIManifest } from '../../../../../types/api-manifest';
import { PopupsComponent } from '../../../../services/context/popups-context';
import { useCollectionPermissions } from '../../../../services/hooks/useCollectionPermissions';
import { Monaco } from '../../../common';
import { genericCopy, trackedGenericCopy } from '../../../common/copy';
import CopyButton from '../../../common/copy-button';
import { downloadToLocal, trackDownload } from '../../../common/download';
import { generateAPIManifest } from './api-manifest.util';

const ManifestDescription: FC<PopupsComponent<null>> = () => {
  const { permissions, isFetching, getPermissions } = useCollectionPermissions();
  const [manifest, setManifest] = useState<APIManifest>();
  const [isGeneratingManifest, setIsGeneratingManifest] = useState<boolean>(false);

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

  const { collections } = useAppSelector(
    (state) => state
  );
  const paths = collections ? collections.find(k => k.isDefault)!.paths : [];

  useEffect(() => {
    if (paths.length > 0) {
      getPermissions(paths);
    }
  }, [paths]);

  useEffect(() => {
    if (permissions && paths.length > 0) {
      setIsGeneratingManifest(true);
      const generatedManifest = generateAPIManifest({ paths, permissions });
      if (Object.keys(generatedManifest).length > 0) {
        setIsGeneratingManifest(false);
      }
      setManifest(generatedManifest);
    }
  }, [permissions]);

  const downloadManifest = () => {
    if (!manifest) { return; }
    const now = new Date();
    const timestamp = now.toISOString().replace(/:/g, '-').replace(/\./g, '-');
    const filename = `${manifest.publisher.name}-API-Manifest-${timestamp}.json`;
    downloadToLocal(manifest, filename);
    trackDownload(filename, componentNames.DOWNLOAD_API_MANIFEST_BUTTON);
  }

  const openManifestInVisualStudio = () => {
    if (!manifest) { return; }
    const base64UrlEncodedManifest = btoa(JSON.stringify(manifest));
    genericCopy(base64UrlEncodedManifest);

    const identifierKeys = Object.keys(manifest.apiDependencies);
    const apiIdentifier = identifierKeys.length === 1 ? Object.keys(manifest.apiDependencies)[0] : null;
    const manifestContentUrl
      // eslint-disable-next-line max-len
      = `vscode://ms-graph.kiota/OpenManifest?fromclipboard=true${apiIdentifier ? `&apiIdentifier=${apiIdentifier}` : ''}`;
    window.open(manifestContentUrl, '_blank');
    trackVSCodeButtonClick();
  }

  const copyManifestToClipboard = () => {
    if (!manifest) { return; }
    try {
      trackedGenericCopy(JSON.stringify(manifest, null, 2), componentNames.COPY_API_MANIFEST_BUTTON);
    }
    catch {
      telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
        ComponentName: componentNames.COPY_API_MANIFEST_BUTTON,
        Error: 'Failed to copy manifest to clipboard'
      });
    }
  }

  const trackVSCodeButtonClick = () => {
    telemetry.trackEvent(eventTypes.BUTTON_CLICK_EVENT, {
      ComponentName: componentNames.OPEN_MANIFEST_IN_VISUAL_STUDIO_CODE_BUTTON
    });
  }

  return (
    <div className={manifestStyle.root}>
      <FormattedMessage id='API manifest description' />
      <br />
      <br />
      <VerticalDivider />

      <FormattedMessage id='To generate client' />
      <br />
      <FormattedMessage id='Use VS Code' />
      <Link href='https://learn.microsoft.com/en-us/openapi/kiota/overview'
        target='_blank'
      >
        &nbsp;Kiota
      </Link>
      &nbsp;
      <FormattedMessage id='VS Code extension' />
      <br />

      <VerticalDivider />
      <br />
      <FormattedMessage id='Use Kiota CLI' />
      <Link
        href='https://aka.ms/get/kiota'
        target='_blank'
      >
        &nbsp;Kiota CLI
      </Link>
      <br />
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
      <br />
      {isGeneratingManifest || isFetching ? <>
        <Stack horizontal className={manifestStyle.actionButtons}> Fetching permissions<Spinner /></Stack>
        <br />
      </> : <>
        <CopyButton isIconButton={true} style={{ float: 'right', zIndex: 1 }} handleOnClick={copyManifestToClipboard} />
        <Monaco
          height='60vh'
          body={manifest}
          language={'json'}
          readOnly={true}
        />
        <Stack horizontal className={manifestStyle.actionButtons}>
          <PrimaryButton disabled={isGeneratingManifest || isFetching}
            onClick={openManifestInVisualStudio}>
            {!isGeneratingManifest && <FormattedMessage id='Open in VS Code' />}
          </PrimaryButton>

          <PrimaryButton disabled={isGeneratingManifest || isFetching}
            onClick={downloadManifest}>
            {!isGeneratingManifest && <FormattedMessage id='Download API Manifest' />}
          </PrimaryButton>
        </Stack>
      </>
      }
    </div>
  )
}

export default ManifestDescription