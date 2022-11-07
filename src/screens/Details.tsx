import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from "react";
import { Share } from "react-native";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { Option } from "../components/Option";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { Guesses } from "../components/Guesses";
import { api } from "../services/api";

interface RouteParams {
  id: string;
}

export function Details() {
  const [optionSelected, setOptionSelected] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const [isLoading, setIsloading] = useState(true);
  const toast = useToast();

  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code,
    });
  }

  async function fetchPoolDetails() {
    try {
      setIsloading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);
    } catch (error) {
      console.log(error);
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsloading(false);
    }
  }

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />
      {poolDetails._count.participants > 0 ? (
        <VStack flex={1} px={5}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus Palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do Grupo"
              isSelected={optionSelected === "ranking"}
              onPress={() => setOptionSelected("ranking")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code}/>
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
