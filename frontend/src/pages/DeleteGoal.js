import React, {useState} from "react";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import Cookies from "js-cookie";
import axios from "axios";

export const OpenDeleteConfirmation = (goalId, goalTitle) => {
        const [goalToDelete, setGoalToDelete] = useState(null);
        const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
        setGoalToDelete({ id: goalId, title: goalTitle });
        setShowDeleteConfirmation(true);

        const deleteGoal = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            await axios.delete(`http://127.0.0.1:8000/api/goals/${goalToDelete.id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });


            // Закройте модальное окно подтверждения после удаления
            closeDeleteConfirmation();
        } catch (error) {
            console.error('Ошибка при удалении цели:', error);
        }
    };

        const closeDeleteConfirmation = () => {
        setGoalToDelete(null);
        setShowDeleteConfirmation(false);
    };

        return (
            <DeleteConfirmationModal
                show={showDeleteConfirmation}
                onClose={closeDeleteConfirmation}
                onConfirm={deleteGoal}
                goalTitle={goalToDelete ? goalToDelete.title : ''}
            />
        )
    };