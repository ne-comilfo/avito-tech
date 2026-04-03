import ItemsPage from './pages/ItemsPage/ItemsPage';
import ItemCard from './pages/ItemCard/ItemCard';
import ItemEdit from './pages/ItemEdit/ItemEdit';
import NotFound from './pages/NotFound/NotFound';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ItemsPage />} />
                <Route path="/ads/:id" element={<ItemCard />} />
                <Route path="/ads/:id/edit" element={<ItemEdit />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
