"use client";

import { Dialog, Transition } from "@headlessui/react";
import {
  AdjustmentsHorizontalIcon,
  ArrowLeftOnRectangleIcon,
  PhotoIcon,
  RectangleStackIcon,
} from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../Logo";

interface ISidebar {
  open: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const navbarOptions = [
  {
    label: "Vote",
    url: "/vote",
    Icon: RectangleStackIcon,
  },
  {
    label: "My Photos",
    url: "/photos",
    Icon: PhotoIcon,
  },
  {
    label: "Settings",
    url: "/settings",
    Icon: AdjustmentsHorizontalIcon,
  },
];

export default function Sidebar({
  open,
  onClose: handleClose,
  onLogout: handleLogout,
}: ISidebar) {
  return (
    <Transition show={open}>
      <Dialog onClose={handleClose} className="fixed inset-0 z-40">
        <Dialog.Panel as={Fragment}>
          <Transition.Child
            className="z-10 relative bg-white h-full w-60 min-[320px]:w-72 border-r border-light-contour px-8 py-8"
            enter="trasition ease-in-out duration-200"
            enterFrom="transform -translate-x-full"
            enterTo="transform translate-x-0"
            leave="trasition ease-in-out duration-200"
            leaveFrom="transform translate-x-0"
            leaveTo="transform -translate-x-full"
          >
            <Logo />
            <div className="mt-7">
              {navbarOptions.map(({ label, url, Icon }) => {
                return (
                  <NavLink
                    key={label}
                    to={url}
                    onClick={handleClose}
                    className={({ isActive }) =>
                      `flex items-center gap-4 py-3 hover:text-primary cursor-pointer ${
                        isActive ? "text-primary" : ""
                      }`
                    }
                  >
                    <Icon className="h-6 w-6" />
                    <div className="text-xl font-semibold cursor-pointer">
                      {label}
                    </div>
                  </NavLink>
                );
              })}
              <div
                onClick={handleLogout}
                className="flex items-center gap-4 py-3 hover:text-primary cursor-pointer"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
                <div className="text-xl font-semibold cursor-pointer">
                  Logout
                </div>
              </div>
            </div>
          </Transition.Child>
        </Dialog.Panel>
        <Transition.Child
          enter="trasition-opacity ease-linear duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="trasition-opacity ease-linear duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-600 opacity-50 cursor-pointer" />
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
