import { useEffect, useState } from 'react';

import { Header } from '../../components/Header';
import api from '../../services/api';
import { Food } from '../../components/Food';
import { ModalAddFood } from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import { DataItens, FoodItens } from '../../models/interfaces/food';

export function Dashboard() {
  const [foods, setFoods] = useState<FoodItens[]>([]);
  const [editingFood, setEditingFood] = useState<FoodItens>();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    listingFoods()
  }, []);

  async function listingFoods() {
    const { data } = await api.get('/foods');
    setFoods(data);
  }

  async function handleAddFood(food: DataItens) {
    try {
      const { data } = await api.post('/foods', {
        ...food,
        available: true,
      });
      setFoods(prevState => [...prevState, data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: DataItens) {
    try {
      const { data } = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food
      });
      setFoods(prevState => [...prevState.map(foodElement => foodElement.id === data.id ? data : foodElement)]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);
      setFoods(prevState => [...prevState.filter(food => food.id !== id)]);
    } catch (err) {
      console.log(err);
    }
  }

  function toggleModal() {
    debugger
    setModalOpen(prevState => !prevState);
  }

  function toggleEditModal() {
    setEditModalOpen(prevState => !prevState);
  }

  function handleEditFood(food: FoodItens) {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}