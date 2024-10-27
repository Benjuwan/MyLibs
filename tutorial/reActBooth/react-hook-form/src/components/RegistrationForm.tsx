import type { FC, SyntheticEvent } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormLabel,
  Input,
  Select,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';


// const genderCode = {
/* src/schamas/registrationForm.ts で使用するため export */
export const genderCode = {
  f: '女性',
  m: '男性',
  n: 'それ以外',
} as const;
// as const を付けるとプロパティが readonly になる

type FormData = {
  username: string;
  zipcode?: string;
  gender?: keyof typeof genderCode;
  isAgreed: boolean;
}



/* npm install react-hook-form */



export const NoValidateRegistrationForm: FC = () => {
  /* ---------【React Hook Form】を使わない場合の記述 --------- */
  // const [formData, setFormData] = useState<FormData>({
  //   username: '',
  //   isAgreed: false,
  // });

  const {
    register,
    handleSubmit,
    reset
  } = useForm<FormData>({
    defaultValues: {
      username: '',
      isAgreed: false
    }
  });

  /* ---------【React Hook Form】を使わない場合の記述 --------- */
  // const handleSubmit = (event: SyntheticEvent) => {
  //   event.preventDefault();
  //   console.log(formData);
  // };

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  }

  const onReset = (event: SyntheticEvent) => {
    event.stopPropagation(); // onClickイベント実行時のバブリングに伴う親のイベント発火を防止
    reset();
  }

  /* ---------【React Hook Form】を使わない場合の記述 --------- */
  // const handleChange = (
  //   event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  // ) => {
  //   const { name } = event.target;
  //   const value =
  //     event.target.type === 'checkbox'
  //       ? (event.target as HTMLInputElement).checked
  //       : event.target.value;
  //   setFormData((state) => ({ ...state, [name]: value }));
  // };

  return (
    <Box p={3} w="md" borderWidth="1px" borderRadius="lg" boxShadow="base">
      {/* ---------【React Hook Form】を使わない場合の記述 --------- */}
      {/* <form onSubmit={handleSubmit}> */}

      <form onSubmit={handleSubmit(onSubmit)} action='/hoge'>
        <FormLabel htmlFor="username" mt={2}>
          ユーザー名
        </FormLabel>

        {/* ---------【React Hook Form】を使わない場合の記述 --------- */}
        {/* <Input
          name="username"
          size="md"
          value={formData.username}
          onChange={handleChange}
        /> */}

        <Input size="md" {...register('username')} />

        <FormLabel htmlFor="zipcode" mt={4}>
          郵便番号
        </FormLabel>
        <Input size="md" maxLength={7} {...register('zipcode')} />

        {/* ---------【React Hook Form】を使わない場合の記述 --------- */}
        {/* <Select
          name="gender"
          my={6}
          placeholder="性別を選択…"
          value={formData.gender}
          onChange={handleChange}
        > */}

        <Select my={6} placeholder="性別を選択…" {...register('gender')}>

          {Object.entries(genderCode).map(([code, name]) => (
            <option value={code} key={code}>
              {name}
            </option>
          ))}
        </Select>

        {/* ---------【React Hook Form】を使わない場合の記述 --------- */}
        {/* <Checkbox
          name="isAgreed"
          isChecked={formData.isAgreed}
          onChange={handleChange}
        > */}

        <Checkbox {...register('isAgreed')}>規約に同意する</Checkbox>
        <ButtonGroup my={3} w="xs">

          {/* ---------【React Hook Form】を使わない場合の記述 --------- */}
          {/* <Button w="30%" colorScheme="orange" variant="solid" type="reset"> */}

          <Button w="30%" colorScheme="orange" variant="solid" onClick={onReset}>リセット</Button>
          <Button w="70%" colorScheme="blue" variant="solid" type="submit">送信</Button>
        </ButtonGroup>
      </form>
    </Box>
  );
};