import React from 'react';
import PropTypes from 'prop-types';
import classesModal from './modal.module.scss';

const Modal = ({active, setActive, children}) => (
              <div className={active ? `${classesModal.modal} ${classesModal.active}` : classesModal.modal} onClick={() => setActive(false)} role="presentation">
            <div className={active ? `${classesModal.modal__content} ${classesModal.active}` : classesModal.modal__content} onClick={(event) => event.stopPropagation()} role="presentation">
            {children}
            </div>
        </div>  
    )  

Modal.defaultProps = {
    children: []
}

Modal.propTypes = {
    active: PropTypes.bool.isRequired,
    setActive: PropTypes.func.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape({
        $$typeof: PropTypes.symbol,
    })),
}

export default Modal;