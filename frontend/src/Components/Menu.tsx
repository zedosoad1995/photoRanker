import { Menu as HMenu, Transition } from "@headlessui/react";

interface IMenu {
  children?: React.ReactNode;
  items: { id: string; label: string }[];
  onSelectItem: (id: string) => () => void;
}

export default function Menu({ children, items, onSelectItem: handleSelectItem }: IMenu) {
  return (
    <HMenu>
      <HMenu.Button>{children}</HMenu.Button>
      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <HMenu.Items className="absolute bg-white rounded-md right-0 origin-top-right w-max shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
          {items.map((item) => (
            <HMenu.Item as="div" onClick={handleSelectItem(item.id)} className="text-sm">
              {({ active }) => (
                <div className={`${active ? "bg-light-contour" : ""} px-4 py-2`}>{item.label}</div>
              )}
            </HMenu.Item>
          ))}
        </HMenu.Items>
      </Transition>
    </HMenu>
  );
}
