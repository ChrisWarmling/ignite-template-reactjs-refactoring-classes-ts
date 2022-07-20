import { useState } from 'react';
import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { FoodItens } from '../../models/interfaces/food';

interface FoodProps {
    food: FoodItens,
    handleEditFood: (food: FoodItens) => void,
    handleDelete: (id: number) => void
}

export function Food({ food, handleEditFood, handleDelete }: FoodProps) {
    const { id, name, description, price, available, image } = food

    const [isAvailable, setIsAvailable] = useState<boolean>(available);

    async function toggleAvailable() {
        await api.put(`/foods/${id}`, {
            ...food,
            available: !isAvailable,
        });

        setIsAvailable(prevState => !prevState);
    }

    return (
        <Container available={isAvailable}>
            <header>
                <img src={image} alt={name} />
            </header>
            <section className="body">
                <h2>{name}</h2>
                <p>{description}</p>
                <p className="price">
                    R$ <b>{price}</b>
                </p>
            </section>
            <section className="footer">
                <div className="icon-container">
                    <button
                        type="button"
                        className="icon"
                        onClick={() => handleEditFood(food)}
                        data-testid={`edit-food-${id}`}
                    >
                        <FiEdit3 size={20} />
                    </button>

                    <button
                        type="button"
                        className="icon"
                        onClick={() => handleDelete(id)}
                        data-testid={`remove-food-${id}`}
                    >
                        <FiTrash size={20} />
                    </button>
                </div>

                <div className="availability-container">
                    <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

                    <label htmlFor={`available-switch-${id}`} className="switch">
                        <input
                            id={`available-switch-${id}`}
                            type="checkbox"
                            checked={isAvailable}
                            onChange={toggleAvailable}
                            data-testid={`change-status-food-${id}`}
                        />
                        <span className="slider" />
                    </label>
                </div>
            </section>
        </Container>
    )
}