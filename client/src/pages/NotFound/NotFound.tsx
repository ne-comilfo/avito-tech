import './NotFound.scss';
import { useNavigate } from 'react-router-dom';

function NotFound() {
    const navigate = useNavigate();
    return (
        <div className="wrapper-404">
            <h1>Страница не найдена</h1>
            <button onClick={() => navigate(-1)}>Вернуться назад</button>
        </div>
    );
}

export default NotFound;
