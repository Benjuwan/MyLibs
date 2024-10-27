import { useState, type FC, type SyntheticEvent, ChangeEvent } from 'react';
import {
    Box,
    Button,
    ButtonGroup,
    Checkbox,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';

import { genderCode } from './RegistrationForm';
import { regFormSchema } from '../schamas/registrationForm'; // 定義したスキーマオブジェクト
import type { RegFormSchema } from '../schamas/registrationForm'; // 定義したスキーマオブジェクト（regFormSchema）から型を推論


/* npm add yup @hookform/resolvers */


export const ValidRegistrationForm: FC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }, // src/schamas/registrationForm.ts で指定した入力値のバリデーションエラー情報が入る
    } = useForm<RegFormSchema>({
        defaultValues: {
            username: '',
            isAgreed: false,
        },
        resolver: yupResolver(regFormSchema), // resolver：外部バリデーションライブラリを利用するためのカスタムリゾルバを設定する（Yupを指定）
    });

    /**
     * フォーム送信時にその内容をコンソールにダンプする処理を onSubmit 関数として用意
     * 受け取った handleSubmit 関数にその onSubmit 関数を実行させる処理をフォームの onSubmit イベントに仕込む
    */
    const onSubmit: SubmitHandler<RegFormSchema> = (data) => console.log(data);

    /* リセットボタンの onClick イベント（reset 関数を実行）*/
    const onReset = (e: SyntheticEvent) => {
        e.stopPropagation(); // 親・祖先要素のクリックイベント発生を防止
        reset();
    };


    const [isInputTxt, setInputTxt] = useState<string>('');
    const inputTxt = (inputEl: HTMLInputElement) => {
        setInputTxt((_prevInputTxt) => inputEl.value);
    }
    const inputStyle: object = {
        "display": "block",
        "width": "100%",
        "border": '1px solid #333',
        "borderRadius": "4px",
        "margin": "1em auto",
        "paddingLeft": ".25em"
    }

    /**
     * Chakra UI を併用するときに気をつけないといけないのはフォーム項目を <FormControl> で囲み、エラーがあるときはその isInvalid 属性を true にしておくこと。そうしないとエラーメッセージの表示や自動フォーカスの機能がうまく働かない
    */

    return (
        <Box p={5} w="md" borderWidth="1px" borderRadius="lg" boxShadow="base">
            <form onSubmit={handleSubmit(onSubmit)} action="/hoge">

                <FormControl isInvalid={errors.username !== undefined} isRequired>
                    {/* mt={2}, my={6} などは chakra-ui による余白のスタイル指定 */}
                    <FormLabel htmlFor="username" mt={2}>
                        ユーザー名
                    </FormLabel>
                    <Input size="md" {...register('username')} />
                    <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
                </FormControl>

                <input style={inputStyle} type="text" value={isInputTxt} onInput={(inputEl: ChangeEvent<HTMLInputElement>) => {
                    inputTxt(inputEl.currentTarget);
                }} placeholder='noValidate_Dammy_EntryForm' />
                {isInputTxt.length >= 0 && <p>{isInputTxt}</p>}

                <FormControl isInvalid={errors.zipcode !== undefined}>
                    <FormLabel htmlFor="zipcode" mt={4}>
                        郵便番号
                    </FormLabel>
                    <Input size="md" maxLength={7} {...register('zipcode')} />
                    <FormErrorMessage>{errors.zipcode?.message}</FormErrorMessage>
                </FormControl>

                <Select my={6} placeholder="性別を選択…" {...register('gender')}>
                    {Object.entries(genderCode).map(([code, name]) => (
                        <option value={code} key={code}>
                            {name}
                        </option>
                    ))}
                </Select>

                <FormControl isInvalid={errors.isAgreed !== undefined}>
                    <Checkbox {...register('isAgreed')}>規約に同意する</Checkbox>
                    <FormErrorMessage justifyContent="center">
                        {errors.isAgreed?.message}
                    </FormErrorMessage>
                </FormControl>

                <ButtonGroup my={3} w="xs">
                    <Button w="30%" colorScheme="orange" variant="solid" onClick={onReset} >
                        リセット
                    </Button>

                    <Button w="70%" colorScheme="blue" variant="solid" type="submit">
                        送信
                    </Button>
                </ButtonGroup>
            </form>
        </Box>
    );
};