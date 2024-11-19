import type { LabelProps } from '@fluentui/react-components';
import { Label } from '@fluentui/react-components';
import { translateMessage } from '../../../utils/translate-messages';

interface LabelMessage {
  message: string
}
export const NoResultsFoundV9 = (props: LabelProps & LabelMessage ) => (
  <Label {...props}>{translateMessage(props.message)}</Label>
);