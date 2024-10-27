import type { FC } from 'react';
import { useCallback, useEffect } from 'react';
import { Avatar, Box, Text, Wrap, WrapItem } from '@chakra-ui/react';
import hash from 'object-hash';

type Props = { username: string; count: number };

const Users: FC<Props> = ({ username, count = 0 }) => {
  const genHash = useCallback(
    /* 各ユーザーの # xxxxx の文字列の長さを制御（substring(始点, 終点)：始点から終点までの文字列を抜粋）*/
    (text: string, id = 0) => String(hash({ [id]: text })).substring(0, 6),
    []
  );

  const detectColor = useCallback((text: string, id = 0) => {
    const colors = [
      'red',
      'orange',
      'yellow',
      'green',
      'teal',
      'blue',
      'cyan',
      'purple',
      'pink',
      'gray',
    ];

    const hashVal = String(hash({ [id]: text }));
    // console.log(hashVal);

    /* hashVal の文字列を（1単語区切りの）配列に変換して「文字列内の（0～9までの）数値のみ」を抽出 */
    const strArr = hashVal.split('').filter((c) => c.match(/[0-9]/));
    // console.log(strArr);

    const num = Number(strArr[0]) || 0;

    // console.log(`${colors[num]}.400`);
    return colors[num] + '.400';
  }, []);

  // useEffect(() => {
  //   console.log([...Array(count)]);
  //   console.log([...Array(count).keys()]); // count に指定した数値分のイテレーター（繰り返し要素）
  //   console.log([...Array(count).values()]);
  // }, []);

  return (
    <Wrap mt={10} w="5xl">
      {/* count に指定した数値分のイテレーター（繰り返し要素）を用意 */}
      {[...Array(count).keys()].map((id) => (
        <WrapItem key={id}>
          <Box p={4} w="15rem" borderWidth={1} margin={1}>
            {/* 属性={`${colors[num]}.400`}（例：属性="pink.400"）*/}
            <Avatar size="md" mb={3} bg={detectColor(username, id)} />
            <Text
              fontWeight="bold"
              fontSize="lg"
              casing="uppercase"
              letterSpacing="wide"
              /* 属性={`${colors[num]}.400`}（例：属性="pink.400"）*/
              color={detectColor(username, id)}
            >
              {username || '---'}
            </Text>
            <Text color="gray.400">
              {/* username が true の場合 substring で指定した長さのハッシュ数値が入る */}
              # {username ? genHash(username, id) : '******************'}
            </Text>
          </Box>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default Users;
