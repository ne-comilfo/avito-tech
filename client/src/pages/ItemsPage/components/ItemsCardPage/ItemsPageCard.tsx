import './ItemsPageCard.scss';

import { useNavigate } from 'react-router-dom';

type Props = {
    id: number,
    imgPath: string;
    category: string;
    title: string;
    price: number | string;
    badge?: boolean;
};

function ItemsPageCard({ id, imgPath, category, title, price, badge }: Props) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`ads/${id}`);
    }
    return (
        <div className="card" onClick={() => handleClick()}>
            <div className="card__image-wrapper">
                <img src={imgPath} className="card__image" />
                <span className="card__category">{category}</span>
            </div>

            <div className="card__body">

                <div className="card__title">{title}</div>
                <div className="card__price">{price} ₽</div>

                {!badge ? (
                    ''
                ) : (
                    <div className="status">
                        <span className="status__dot" />
                        Требует доработок
                    </div>
                )}
            </div>
        </div>
    );
}

export default ItemsPageCard;
