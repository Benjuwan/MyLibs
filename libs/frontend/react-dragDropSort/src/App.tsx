import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { DragDropSort } from "./components/dragdropsort/DragDropSort";

function App() {
  return (
    <>
      <Header />
      <main>
        <DragDropSort />
      </main>
      <Footer />
    </>
  );
}

export default App
