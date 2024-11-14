import { Persona, PersonaProps, Tooltip } from '@fluentui/react-components';
import { translateMessage } from '../../utils/translate-messages';

export const AuthenticationV9 = (props: Partial<PersonaProps>) => {
  return (
    <Tooltip content={translateMessage('sign in')} relationship="description">
      <Persona {...props}/>
    </Tooltip>
  );
};
