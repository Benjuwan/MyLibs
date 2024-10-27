import type { FC } from 'react';
import { Heading } from '@chakra-ui/react';
import './App.css';
import { NoValidateRegistrationForm } from 'components/RegistrationForm';
import { ValidRegistrationForm } from 'components/ValidRegistrationForm';

const App: FC = () => (
  <>
    <Heading size="lg" as="h1" my={8}>
      {import.meta.env.VITE_APP_TITLE}
    </Heading>
    {/* <NoValidateRegistrationForm /> */}
    <ValidRegistrationForm />
  </>
);

export default App;
