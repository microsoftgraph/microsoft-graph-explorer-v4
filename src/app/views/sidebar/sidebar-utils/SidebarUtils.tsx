import type { LabelProps } from '@fluentui/react-components';
import { Label } from '@fluentui/react-components';
import { translateMessage } from '../../../utils/translate-messages';

interface LabelMessage {
  message: string
}
export const NoResultsFound = (props: LabelProps & LabelMessage ) => (
  <Label {...props}>{translateMessage(props.message)}</Label>
);

export type BadgeColors =
  | 'brand'
  | 'danger'
  | 'important'
  | 'informative'
  | 'severe'
  | 'subtle'
  | 'success'
  | 'warning';

export const METHOD_COLORS: Record<string, BadgeColors> = {
  GET: 'brand',
  POST: 'success',
  PATCH: 'severe',
  DELETE: 'danger',
  PUT: 'warning'
};