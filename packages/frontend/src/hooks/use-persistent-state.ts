import {useState} from "react"

export default function usePersistentState<T>(key: string, initialValue: T) {
    const [state, setState] = useState<T>(() => {
        const value = localStorage.getItem(key)
        if (value) {
            return JSON.parse(value)
        }
        return initialValue
    })
    function setPersistentState(value: T | ((value: T) => T)) {
        setState(value)
        localStorage.setItem(key, JSON.stringify(value))
    }
    return [state, setPersistentState] as const
}
