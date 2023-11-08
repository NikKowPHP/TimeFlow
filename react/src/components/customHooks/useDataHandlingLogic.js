import { toast } from 'react-toastify';
export function useDataHandlingLogic({hideModal, clickCell, dispatch}) {
	// const {hideModal} = useModalState();

	  /**
   * Handles data received from a child component (newTaskHandler)
   * @param {Object} data - Data received from the child component
   * @returns {any}
   */
		function handleDataFromChild(data) {
			if (data) {
				hideModal();
				dispatch(clickCell(null));
				toast.success(`The task '${data.title}' was successfully created`);
			}
		}
		return {
			handleDataFromChild,
		}
}
