import './ItemsPageCard.scss';

type Props = {
    imgPath: string;
    category: string;
    title: string;
    price: number | string;
    badge?: boolean;
};

function ItemsPageCard({ imgPath, category, title, price, badge }: Props) {
    return (
        <div className="card">
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
