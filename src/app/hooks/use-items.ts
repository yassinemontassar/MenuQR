import {  create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware';


type Item = {
    title: string;
    type: string;
    imageUrl: string;
  };
  
  type State = {
    items: Item[];
    replaceItem: (property: string, value: string) => void;
  };
  
  const useStore = create<State>()(
    devtools(
      persist(
        (set) => ({
          items: [
            {
              title: '',
              type: '',
              imageUrl: '',
            },
          ],
          replaceItem: (property, value) =>
          set((state) => ({
            items: state.items.map((item) =>
              item === state.items[0]
                ? { ...item, [property]: value }
                : item
            ),
          })),
      }),
        {
          name: 'my-storage-key',
          storage: createJSONStorage(() => localStorage),
        }
      )
    )
  );
  
  export default useStore;
  