import { useEffect, useState } from "react";

export default function useNestedModalState({ nestedModalRef }) {
  const [isNestedModalVisible, setIsNestedModalVisible] = useState(false);
  const [nestedOpenedModalId, setNestedOpenedModalId] = useState(null);

  useEffect(() => {
    if (isNestedModalVisible) console.log(nestedModalRef);
  }, [nestedModalRef]);
  // Show the nested modal with the specified modalId
  const showNestedModal = (modalId) => {
    setIsNestedModalVisible(true);
    setNestedOpenedModalId(modalId);
    // Adjust the nested modal position based on the click event
    // adjustModalPosition();
  };
  // Hide the nested modal
  const hideNestedModal = () => {
    setIsNestedModalVisible(false);
    setNestedOpenedModalId(null);
  };
  return {
    showNestedModal,
    hideNestedModal,
    isNestedModalVisible,
    nestedOpenedModalId,
    setNestedOpenedModalId,
    setIsNestedModalVisible,
  };
}
