import React, {useState, useCallback, Dispatch, SetStateAction} from 'react';

// custom hooks
const useChange = <T>(initial : T) : [T, (e:any) => void, Dispatch<SetStateAction<T>>] => {
    const [state, setState] = useState(initial);
    const handler = useCallback((e) => {
        setState(e.target.value)

    }, []);

    return [state, handler, setState];
};

export default useChange;