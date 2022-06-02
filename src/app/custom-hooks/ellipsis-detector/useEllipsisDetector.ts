import { useEffect, useState } from 'react';

export const useEllipsisDetector = (className: string): boolean => {
  const [isEllipsisActive, setIsEllipsisActive] = useState<boolean>(false);
  useEffect(() => {

    const ellipsisCheck = (collection: any) => {
      if (collection?.length === 0) {
        return;
      }
      if (collection[0].offsetWidth < collection[0].scrollWidth) {
        setIsEllipsisActive(true);
      }
    }

    ellipsisCheck(document.getElementsByClassName(className));
  });

  return isEllipsisActive;
}