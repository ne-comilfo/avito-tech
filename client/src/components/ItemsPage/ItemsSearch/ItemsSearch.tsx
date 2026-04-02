import { Search } from 'lucide-react';
import './ItemsSearch.scss';

interface ItemsSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ItemsSearch({ value, onChange }: ItemsSearchProps) {
    return (
        <div className="search">
            <input
                className="search__input"
                placeholder="Найти объявление..."
                type="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <button className="search__btn">
                <Search size={14} />
            </button>
        </div>
    );
}