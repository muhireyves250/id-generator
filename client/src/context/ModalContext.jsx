import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalProvider = ({ children }) => {
    const [modalConfig, setModalConfig] = useState(null);

    const confirm = useCallback((config) => {
        return new Promise((resolve) => {
            setModalConfig({
                ...config,
                onConfirm: () => {
                    setModalConfig(null);
                    resolve(true);
                },
                onCancel: () => {
                    setModalConfig(null);
                    resolve(false);
                }
            });
        });
    }, []);

    return (
        <ModalContext.Provider value={{ confirm }}>
            {children}
            {modalConfig && (
                <div className="modal-overlay">
                    <div className="confirm-modal">
                        <div className="modal-icon">{modalConfig.icon || '❓'}</div>
                        <h3>{modalConfig.title || 'Are you sure?'}</h3>
                        <p>{modalConfig.message}</p>
                        <div className="modal-actions">
                            <button className="modal-btn cancel" onClick={modalConfig.onCancel}>
                                {modalConfig.cancelText || 'Cancel'}
                            </button>
                            <button className="modal-btn confirm" onClick={modalConfig.onConfirm}>
                                {modalConfig.confirmText || 'Yes, Proceed'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};
