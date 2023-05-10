import api from '@/services';
import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react';
import nookies from 'nookies';

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
  is_available: boolean;
  user: {
    id: string;
    name: string;
    profile_img: string;
    description: string;
  };
  comments: {
    id: string;
    comment: string;
    created_at: string;
    user: {
      id: string;
      name: string;
      profile_img: string;
    };
  }[];
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
  userAds: iAdvertisement[] | undefined;
  setUserAds: Dispatch<SetStateAction<iAdvertisement[] | undefined>>;
  advertisements: iAdvertisement[] | undefined;
  filteredAdvertisements: iAdvertisement[] | undefined;
  setAdvertisements: Dispatch<SetStateAction<iAdvertisement[] | undefined>>;
  brands: string[];
  filter: iFilter;
  addFilter(filterObj: Partial<iFilter>): void;
  filterIsActive: boolean;
  toggleFilter(): void;
  currentAdvertisement: iAdvertisement | undefined;
  setCurrentAdvertisement: Dispatch<SetStateAction<iAdvertisement | undefined>>;
  addCommentAd(
    comment: string,
    adId: string | string[] | undefined
  ): Promise<void>;
  editComment(
    adId: string | undefined,
    commentId: string,
    newComment: string
  ): Promise<void>;
  deleteComment(adId: string | undefined, commentId: string): Promise<void>;
}

interface iAdvertisementProviderProps {
  children: React.ReactNode;
}

const AdvertisementContext = createContext({} as iAdvertisementContext);

export const AdvertisementProvider = ({
  children,
}: iAdvertisementProviderProps) => {
  const [advertisements, setAdvertisements] = useState<iAdvertisement[]>();
  const [currentAdvertisement, setCurrentAdvertisement] =
    useState<iAdvertisement>();
  const [userAds, setUserAds] = useState<iAdvertisement[]>();
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

  const filteredAdvertisements = advertisements?.filter((ad) => {
    let match = true;

    if (filter.brand && ad.brand.toLowerCase() !== filter.brand.toLowerCase()) {
      match = false;
    }

    if (filter.model && ad.model.toLowerCase() !== filter.model.toLowerCase()) {
      match = false;
    }

    if (filter.color && ad.color.toLowerCase() !== filter.color.toLowerCase()) {
      match = false;
    }

    if (filter.fuel && ad.fuel.toLowerCase() !== filter.fuel.toLowerCase()) {
      match = false;
    }

    if (filter.year && ad.year !== filter.year) {
      match = false;
    }

    if (filter.minKm && ad.kilometers < Number(filter.minKm)) {
      match = false;
    }

    if (filter.maxKm && ad.kilometers > Number(filter.maxKm)) {
      match = false;
    }

    if (filter.minPrice && ad.price < Number(filter.minPrice)) {
      match = false;
    }

    if (filter.maxPrice && ad.price > Number(filter.maxPrice)) {
      match = false;
    }

    if (!filterIsActive) {
      match = true;
    }

    return match;
  });

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

  const addCommentAd = async (
    comment: string,
    adId: string | string[] | undefined
  ) => {
    try {
      const token = nookies.get()['car.token'];

      await api.post(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `advertisements/${adId}/comments`,
        {
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const { data } = await api.get<iAdvertisement>(`/advertisements/${adId}`);

      setCurrentAdvertisement(data);
    } catch (error) {
      console.log(error);
    }
  };

  const editComment = async (
    adId: string | undefined,
    commentId: string,
    newComment: string
  ) => {
    try {
      const token = nookies.get()['car.token'];

      await api.patch(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `advertisements/${adId}/comments/${commentId}`,
        {
          comment: newComment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const { data } = await api.get<iAdvertisement>(`/advertisements/${adId}`);

      setCurrentAdvertisement(data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteComment = async (adId: string, commentId: string) => {
    try {
      const token = nookies.get()['car.token'];

      await api.delete(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `advertisements/${adId}/comments/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const { data } = await api.get<iAdvertisement>(`/advertisements/${adId}`);

      setCurrentAdvertisement(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AdvertisementContext.Provider
      value={{
        advertiserData,
        setAdvertiserData,
        userAds,
        setUserAds,
        advertisements,
        setAdvertisements,
        brands,
        filter,
        addFilter,
        filterIsActive,
        toggleFilter,
        currentAdvertisement,
        setCurrentAdvertisement,
        addCommentAd,
        filteredAdvertisements,
        editComment,
        deleteComment,
      }}
    >
      {children}
    </AdvertisementContext.Provider>
  );
};

export const useAdvertisementContext = () => useContext(AdvertisementContext);
