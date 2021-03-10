import { AuthenticationWrapper } from './AuthenticationWrapper';
import { GraphAuthenticationProvider } from "./GraphAuthenticationProvider";

const authProvider = new GraphAuthenticationProvider();
const authenticationWrapper = AuthenticationWrapper.getInstance();

export { authProvider, authenticationWrapper }
