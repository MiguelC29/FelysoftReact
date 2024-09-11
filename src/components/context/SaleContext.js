import { createContext, useState, useContext } from 'react';

const SaleContext = createContext();

export function SaleProvider({ children }) {
    const [saleConfirmed, setSaleConfirmed] = useState(false);

    return (
        <SaleContext.Provider value={{ saleConfirmed, setSaleConfirmed }}>
            {children}
        </SaleContext.Provider>
    );
}

export const useSale = () => {
    return useContext(SaleContext);
};
