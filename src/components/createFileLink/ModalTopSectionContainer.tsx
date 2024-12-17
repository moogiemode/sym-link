import { FC, PropsWithChildren } from 'react';

interface ModalTopSectionContainerProps {
  title: string;
  description: string;
}

export const ModalTopSectionContainer: FC<PropsWithChildren<ModalTopSectionContainerProps>> = ({ title, description, children }) => {
  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center flex-1 overflow-auto max-h-full">
        <h3 className="font-bold text-lg prose">{title}</h3>
        <p className="prose">{description}</p>

        {children}
      </div>
    </>
  );
};
