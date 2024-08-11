import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";
export default function Results({ isOpen, onClose, onPlay, result }) {
  const hanldeConfirm = () => {
    onPlay();
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onClose}>
        <ModalContent>
          <>
            <ModalHeader className="flex flex-col gap-1">
              Quiz Results
            </ModalHeader>
            <ModalBody>
              <span>
                You have got:{result.score}/{result.limit}
              </span>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={hanldeConfirm}>
                Play Again
              </Button>
            </ModalFooter>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
