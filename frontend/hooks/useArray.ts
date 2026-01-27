import { useState, useCallback } from 'react';
import { unique, shuffle as shuffleArray } from '@/lib/arrays';

/**
 * Hook to manage array state with utility methods
 */
export function useArray<T>(initialValue: T[] = []) {
  const [value, setValue] = useState(initialValue);

  const push = useCallback((element: T) => {
    setValue((old) => [...old, element]);
  }, []);

  const removeIndex = useCallback((index: number) => {
    setValue((old) => old.filter((_, i) => i !== index));
  }, []);
  
  const remove = useCallback((element: T) => {
    setValue((old) => old.filter((val) => val !== element));
  }, []);

  const clear = useCallback(() => {
    setValue([]);
  }, []);

  const uniqueItems = useCallback(() => {
    setValue((old) => unique(old));
  }, []);
  
  const shuffle = useCallback(() => {
    setValue((old) => shuffleArray(old));
  }, []);
  
  const filter = useCallback((callback: (value: T, index: number, array: T[]) => boolean) => {
    setValue((old) => old.filter(callback));
  }, []);
  
  const update = useCallback((index: number, newElement: T) => {
    setValue((old) => {
      const newArray = [...old];
      newArray[index] = newElement;
      return newArray;
    });
  }, []);

  return { 
    value, 
    setValue, 
    push, 
    removeIndex, 
    remove, 
    clear, 
    unique: uniqueItems, 
    shuffle, 
    filter, 
    update 
  };
}
