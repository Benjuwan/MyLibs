import { Provider } from 'jotai'
// import { AtomComponent } from "./components/basic/AtomComponent";
import { UseAtomComponent } from "./components/basic/UseAtomComponent";
import { TodoList } from './components/practice/TodoList';
import { DefaultTodoList } from './components/DefaultTodoList';
import { BaseComponent } from './components/application/BaseComponent';

export const App = () => {
  return (
    <Provider>
      {/* <AtomComponent /> */}
      <div style={{ 'marginBottom': '5em' }}>
        <TodoList />
      </div>
      <div style={{ 'marginBottom': '5em' }}>
        <p style={{ 'margin': '0' }}>DefaultTodoList</p>
        <DefaultTodoList />
      </div>
      <div style={{ 'marginBottom': '5em' }}>
        <UseAtomComponent />
      </div>
      <BaseComponent />
    </Provider>
  );
}