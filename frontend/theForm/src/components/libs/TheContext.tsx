import { createContext, FC, ReactNode, useState } from "react";

type ContextType = {
    isPersonal: boolean,
    setPersonal: React.Dispatch<React.SetStateAction<boolean>>
    isPayment: boolean,
    setPayment: React.Dispatch<React.SetStateAction<boolean>>
    isConfirm: boolean,
    setConfirm: React.Dispatch<React.SetStateAction<boolean>>
    isSwitcher: boolean,
    setSwitcher: React.Dispatch<React.SetStateAction<boolean>>
}
export const TheContext = createContext({} as ContextType);

type DefaultType = {
    children: ReactNode
}
export const ContextFlagment: FC<DefaultType> = (props) => {
    const [isPersonal, setPersonal] = useState<boolean>(true);
    const [isPayment, setPayment] = useState<boolean>(false);
    const [isConfirm, setConfirm] = useState<boolean>(false);
    const [isSwitcher, setSwitcher] = useState<boolean>(false);

    return (
        <TheContext.Provider value={{
            isPersonal,
            setPersonal,
            isPayment,
            setPayment,
            isConfirm,
            setConfirm,
            isSwitcher,
            setSwitcher
        }}>
            {props.children}
        </TheContext.Provider>
    );
}