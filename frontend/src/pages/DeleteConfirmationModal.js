import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import EditGoalModal from "./EditGoalForm";

const DeleteConfirmationModal = ({ show, onClose, onConfirm, goalTitle }) => {
    return (
        <Modal show={show} onHide={onClose} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Удаление цели</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Вы действительно хотите удалить цель: "{goalTitle}"?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Отмена
                </Button>
                <Button variant="danger" onClick={onConfirm} className="btn-delete">
                    Удалить
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteConfirmationModal;