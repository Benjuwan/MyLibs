import { CardComponents } from "./CardComponents";

export const App = () => {
  // 型指定（: object）が必要
  const headingStyle: object = {
    textAlign: 'center',
    fontSize: '40px',
    letterSpacing: '.25em',
    margin: '1em auto'
  }

  return (
    <>
      <h1 style={headingStyle}>-神経衰弱-</h1>
      <CardComponents />
    </>
  );
}