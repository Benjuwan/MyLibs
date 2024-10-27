import * as yup from 'yup';
import { genderCode } from '../components/RegistrationForm';
import type { InferType } from 'yup'; // InferType：定義したスキーマオブジェクトから型を推論してくれる

 /* regFormSchema：定義したスキーマオブジェクト */
export const regFormSchema = yup.object({
    username: yup.string().required('必須項目です'),
    zipcode: yup.string().max(7).matches(/\d{7}/, '7 桁の数字で入力してください'),
    gender: yup.mixed().oneOf(Object.keys(genderCode)),
    isAgreed: yup.boolean().oneOf([true], '同意が必要です').required(),
});

/* RegFormSchema：定義したスキーマオブジェクト（regFormSchema）から型を推論 */
export type RegFormSchema = InferType<typeof regFormSchema>;
