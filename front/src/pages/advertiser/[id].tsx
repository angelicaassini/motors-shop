import LayoutPage from '@/components/LayoutPage';
import CardList from '@/components/CardList';
import { Box, Flex, Heading, useDisclosure } from '@chakra-ui/react';
import UserInfoCard from '@/components/profilePage/UserInfoCard';
import ControlPagination from '@/components/controlPagination';
import api from '@/services';
import { useRouter } from 'next/router';
import { iAdvertiserWithAds } from '@/contexts/advertisementContext';
import { ModalRegisterAd } from '@/components/modalAd/modalRegisterAd';
import { GetStaticProps, GetStaticPaths } from 'next';
import { EmptyList } from '@/components/EmptyList';

interface iAdvertiserPage {
  advertiserData: iAdvertiserWithAds;
}

const AdvertiserPage = ({ advertiserData }: iAdvertiserPage) => {
  const router = useRouter();

  const { isOpen, onOpen, onClose } = useDisclosure();

  if (router.isFallback) {
    return <div>Carregando ...</div>;
  }

  return (
    <>
      <LayoutPage>
        <Flex
          p={0}
          position={'relative'}
          bg={'grey.50'}
          w={'100%'}
          flexDirection={'column'}
          alignItems={'center'}
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            bottom="0"
            w="100%"
            bgColor="#4529E6"
            maxH={{ base: '331px', sm: '357px' }}
          />
          <UserInfoCard advertiserData={advertiserData} onOpen={onOpen} />
          <Heading
            alignSelf={{ base: 'flex-start', md: 'center' }}
            marginLeft={{ base: '60px', md: 0 }}
            variant={'Heading-5-600'}
          >
            Anúncios
          </Heading>
          <CardList
            maxW="1392px"
            listAdvertisement={advertiserData.advertisements}
            advertiser={advertiserData}
          />

          {advertiserData.advertisements.length === 0 && (
            <EmptyList message="Este anunciante não possui anúncios." />
          )}
          <ControlPagination />
        </Flex>
      </LayoutPage>
      <ModalRegisterAd isOpen={isOpen} onClose={onClose} onOpen={onOpen} />
    </>
  );
};

// eslint-disable-next-line @typescript-eslint/require-await
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const id = ctx.params?.id as string;

  const { data: advertiserData } = await api.get<iAdvertiserWithAds>(
    `/users/${id}/advertisements`
  );
  return {
    props: {
      advertiserData,
    },

    revalidate: 1800,
  };
};

export default AdvertiserPage;
