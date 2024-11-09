import { ReactNode } from "react";
import "../styles/Modal.css"
import { IoIosClose } from "react-icons/io";

interface Props {
	onClose: () => void;
	children: ReactNode;
}


function Modal({onClose, children}: Props) {

	return (
		<div className="modal">
			<div className="modal-content">
				<button className="close-button" onClick={onClose}><IoIosClose /></button>
				<div>
					{children}
				</div>
			</div>
		</div>
	)

}

export default Modal;