import { useEffect, useState } from 'react';
import { ScreenResolution } from './util/resolution-types';

interface IResolution {
  device: string;
  width: {
    minimumWidth: number;
    maximumWidth: number;
  },
  currentScreenWidth: number
}
export const resolution = [
  {
    name: ScreenResolution.MOBILE,
    dimensions: {
      minimumWidth: 100,
      maximumWidth: 424
    }
  },
  {
    name: ScreenResolution.TABLET,
    dimensions: {
      minimumWidth: 425,
      maximumWidth: 510
    }
  },
  {
    name: ScreenResolution.TABLET_MEDIUM,
    dimensions: {
      minimumWidth: 511,
      maximumWidth: 582
    }
  },
  {
    name: ScreenResolution.TABLET_LARGE,
    dimensions: {
      minimumWidth: 583,
      maximumWidth: 992
    }
  },
  {
    name: ScreenResolution.LAPTOP_SMALL,
    dimensions: {
      minimumWidth: 993,
      maximumWidth: 1024
    }
  },
  {
    name: ScreenResolution.LAPTOP_MEDIUM,
    dimensions: {
      minimumWidth: 1025,
      maximumWidth: 1280
    }
  },
  {
    name: ScreenResolution.LAPTOP_LARGE,
    dimensions: {
      minimumWidth: 1281,
      maximumWidth: 1440
    }
  },
  {
    name: ScreenResolution.DESKTOP,
    dimensions: {
      minimumWidth: 1441,
      maximumWidth: 1920
    }
  },
  {
    name: ScreenResolution.DESKTOP_LARGE,
    dimensions: {
      minimumWidth: 1921,
      maximumWidth: 2560
    }
  },
  {
    name: ScreenResolution.DESKTOP_XLARGE,
    dimensions: {
      minimumWidth: 2561,
      maximumWidth: 3840
    }
  },
  {
    name: ScreenResolution.DESKTOP_XXLARGE,
    dimensions: {
      minimumWidth: 3841,
      maximumWidth: 5120
    }
  }
]

export const textOverflowWidthRange = [
  {
    key: ScreenResolution.MOBILE,
    range: {
      minumumOverflowWidth: 200,
      maximumOverflowWidth: 210
    }
  },
  {
    key: ScreenResolution.TABLET,
    range: {
      minimumOverflowWidth: 265,
      maximumOverflowWidth: 320
    }
  },
  {
    key: ScreenResolution.TABLET_MEDIUM,
    range: {
      minimumOverflowWidth: 410,
      maximumOverflowWidth: 450
    }
  },
  {
    key: ScreenResolution.TABLET_LARGE,
    range: {
      minimumOverflowWidth: 485,
      maximumOverflowWidth: 700
    }
  },
  {
    key: ScreenResolution.LAPTOP_SMALL,
    range: {
      minimumOverflowWidth: 130,
      maximumOverflowWidth: 132
    }
  },
  {
    key: ScreenResolution.LAPTOP_MEDIUM,
    range: {
      minimumOverflowWidth: 135,
      maximumOverflowWidth: 150
    }
  },
  {
    key: ScreenResolution.LAPTOP_LARGE,
    range: {
      minimumOverflowWidth: 180,
      maximumOverflowWidth: 220
    }
  },
  {
    key: ScreenResolution.DESKTOP,
    range: {
      minimumOverflowWidth: 220,
      maximumOverflowWidth: 310
    }
  },
  {
    key: ScreenResolution.DESKTOP_LARGE,
    range: {
      minimumOverflowWidth: 390,
      maximumOverflowWidth: 500
    }
  },
  {
    key: ScreenResolution.DESKTOP_XLARGE,
    range: {
      minimumOverflowWidth: 500,
      maximumOverflowWidth: 800
    }
  }
]

export const getScreenResolution = (): IResolution => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize);

    return () => removeEventListener('resize', handleResize)
  }, []);

  const screenResolution = resolution.find((item: any) =>
    windowWidth >= item?.dimensions.minimumWidth && windowWidth <= item?.dimensions.maximumWidth);
  return {
    device: screenResolution ? screenResolution.name : '',
    width: screenResolution?.dimensions ?? { minimumWidth: 0, maximumWidth: 0 },
    currentScreenWidth: windowWidth
  }
}