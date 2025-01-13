import type {
  DropdownProps,
  OptionOnSelectData,
  SelectionEvents
} from '@fluentui/react-components';
import {
  Button,
  Dropdown,
  Input,
  makeStyles,
  Option,
  useId
} from '@fluentui/react-components';
import { useState } from 'react';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
const VERSIONS = ['v1.0', 'beta'];

const useStyles = makeStyles({
  container: {
    display: 'flex',
    gap: '4px'
  },
  dropdown: {
    minWidth: 'unset'
  },
  input: {
    width: '-webkit-fill-available'
  }
});

const QueryInputV9 = (props: Partial<DropdownProps>) => {
  const styles = useStyles();
  const dropdownId = useId('dropdown-default');
  const [httpMethod, setHttpMethod] = useState('GET');
  const [selectHttpMethodOpts, setSelectHttpMethodOpts] = useState(['GET']);

  const [version, setVersion] = useState('v1.0');
  const [selectVersionOpts, setSelectVersionOpts] = useState(['v1.0']);

  const onHttpMethodSelect = (
    event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    setHttpMethod(data.optionValue ?? 'GET');
    setSelectHttpMethodOpts([data.optionValue ?? 'GET']);
  };

  const onVersionSelect = (
    event: SelectionEvents,
    data: OptionOnSelectData
  ) => {
    setVersion(data.optionValue ?? 'v1.0');
    setSelectVersionOpts([data.optionValue ?? 'v1.0']);
  };

  return (
    <div className={styles.container}>
      <Dropdown
        aria-labelledby={dropdownId}
        defaultValue={httpMethod}
        onOptionSelect={onHttpMethodSelect}
        defaultSelectedOptions={selectHttpMethodOpts}
        className={styles.dropdown}
      >
        {HTTP_METHODS.map((option) => (
          <Option key={option} defaultValue={httpMethod}>
            {option}
          </Option>
        ))}
      </Dropdown>
      <Dropdown
        aria-labelledby={dropdownId}
        defaultValue={version}
        onOptionSelect={onVersionSelect}
        defaultSelectedOptions={selectVersionOpts}
        className={styles.dropdown}
      >
        {VERSIONS.map((option) => (
          <Option key={option} defaultValue={'v1.0'}>
            {option}
          </Option>
        ))}
      </Dropdown>
      <InputArea />
      <Button>Send</Button>
    </div>
  );
};

const InputArea = () => {
  const styles = useStyles();
  const inputId = useId('input');

  return (
    <div className={styles.input}>
      <Input className={styles.input} id={inputId} />
    </div>
  );
};

export { QueryInputV9 };
