import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';

export interface iAdvertisement {
  id: string;
  brand: string;
  model: string;
  year: number;
  fuel: string;
  color: string;
  kilometers: number;
  price: number;
  description: string;
  image: string;
}

export interface iAdvertiser {
  id: string;
  name: string;
  is_advertiser: boolean;
  profile_img: string;
  description: string;
}

interface iFilter {
  brand: string;
  model: string;
  color: string;
  fuel: string;
  year: number;
  minKm: string;
  maxKm: string;
  minPrice: string;
  maxPrice: string;
}

interface iAdvertisementContext {
  advertiserData: iAdvertiser;
  setAdvertiserData: Dispatch<SetStateAction<iAdvertiser>>;
  advertisements: iAdvertisement[] | undefined;
  setAdvertisements: Dispatch<SetStateAction<iAdvertisement[] | undefined>>;
  brands: string[];
  filter: iFilter;
  addFilter(filterObj: Partial<iFilter>): void;
  filterIsActive: boolean;
  toggleFilter(): void;
}

interface iAdvertisementProviderProps {
  children: React.ReactNode;
}

const AdvertisementContext = createContext({} as iAdvertisementContext);

export const AdvertisementProvider = ({
  children,
}: iAdvertisementProviderProps) => {
  const [advertisements, setAdvertisements] = useState<iAdvertisement[]>();
  const [filterIsActive, setFilterIsActive] = useState(false);
  const [advertiserData, setAdvertiserData] = useState({} as iAdvertiser);
  const [filter, setFilter] = useState<iFilter>({
    brand: '',
    model: '',
    color: '',
    fuel: '',
    year: NaN,
    minKm: '',
    maxKm: '',
    minPrice: '',
    maxPrice: '',
  });
  const brands: string[] = [
    'chevrolet',
    'citroën',
    'fiat',
    'ford',
    'honda',
    'hyundai',
    'nissan',
    'peugeot',
    'renault',
    'toyota',
    'volkswagen',
  ];

  const addFilter = (filterObj: Partial<iFilter>): void => {
    const filters: string[] = Object.keys(filter);

    filters.forEach((e) => {
      if (e === Object.keys(filterObj)[0]) {
        setFilter({
          ...filter,
          ...filterObj,
        });
      }
    });
  };

  const toggleFilter = () => {
    if (filterIsActive) {
      setFilter({
        brand: '',
        model: '',
        color: '',
        fuel: '',
        year: NaN,
        minKm: '',
        maxKm: '',
        minPrice: '',
        maxPrice: '',
      });
    }

    setFilterIsActive(!filterIsActive);
  };

  return (
    <AdvertisementContext.Provider
      value={{
        advertiserData,
        setAdvertiserData,
        advertisements,
        setAdvertisements,
        brands,
        filter,
        addFilter,
        filterIsActive,
        toggleFilter,
      }}
    >
      {children}
    </AdvertisementContext.Provider>
  );
};

export const useAdvertisementContext = () => useContext(AdvertisementContext);
