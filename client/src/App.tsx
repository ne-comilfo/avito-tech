import ItemsPage from './pages/ItemsPage/ItemsPage';
import ItemCard from './components/ItemCard/ItemCard';
import ItemEdit from './components/ItemEdit/ItemEdit';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ItemsPage />} />
        <Route path="/ads/:id" element={<ItemCard />} />
        <Route path="/ads/:id/edit" element={<ItemEdit />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
