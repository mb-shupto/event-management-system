"use client";

import { Button, Modal, ModalBody } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useState } from "react";
import { Event } from "@/types/events";

interface DeleteEventModalProps {
    event: Event;
  eventId: number;
  onClose: () => void;
  onDelete: (id: number) => Promise<void>;
}

export default function DeleteEventModal({ eventId, onClose, onDelete }: DeleteEventModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(eventId);
      onClose();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal show={true} size="md" onClose={onClose} popup className="dark:bg-black dark:bg-opacity-40">
      <ModalBody>
        <div className="text-center">
          <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-black dark:text-black" />
          <h3 className="mb-5 text-lg font-normal text-black dark:text-black">
            Are you sure you want to delete this event?
          </h3>
          <div className="flex justify-center gap-4">
            <div className="flex items-center bg-red-600">           <Button
              color="red"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, I'm sure"}
            </Button>
            </div>
            <div className="flex items-center bg-gray-600 rounded-100 border-black"><Button
              color="green"
              onClick={onClose}
              disabled={isDeleting}
            >
              No, cancel
            </Button></div>

          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}