import { SelectYear } from "./components/SelectYear";
import { SelectMonth } from "./components/SelectMonth";
import { SelectDate } from "./components/SelectDate";

export const App = () => {
  return (
    <div className="flex gap-1 w-1/2 my-[8em] mx-auto justify-center">
      <SelectYear />
      <SelectMonth />
      <SelectDate />
    </div>
  );
}