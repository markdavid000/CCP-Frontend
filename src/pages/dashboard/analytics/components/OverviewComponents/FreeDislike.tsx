import { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  queryContentUrl,
  GET_ALL_FREE_DISLIKE,
} from "../../../../../constants/graphQueries";
import { Box, Text } from "@chakra-ui/react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";

const FreeDislike = () => {
  const { address } = useWeb3ModalAccount();

  const [freeDislikedCount, setFreeDislikedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const contentClient = new ApolloClient({
      uri: queryContentUrl,
      cache: new InMemoryCache(),
    });

    const fetchFreeDislikedCount = async () => {
      setIsLoading(true);
      try {
        const currentYear = new Date().getFullYear();
        const januaryFirst = new Date(currentYear, 0, 1);

        const startTimeInMilliseconds = Math.floor(januaryFirst.getTime());
        const endTimeInMilliseconds = Date.now();

        const nowInSeconds = Math.floor(Date.now() / 1000);
        const startTimestamp = Math.floor(startTimeInMilliseconds / 1000);
        const endTimestamp = Math.floor(endTimeInMilliseconds / 1000);

        const { data } = await contentClient.query({
          query: GET_ALL_FREE_DISLIKE,
          variables: {
            startTimestamp,
            endTimestamp,
            nowInSeconds,
            creator: address,
          },
        });
        const createdContentDislikedCount = data.FreeContentDisliked.length;
        setFreeDislikedCount(createdContentDislikedCount);
      } catch (error) {
        console.error("Error fetching free disliked count:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFreeDislikedCount();
  }, [address]);

  return (
    <div>
      <Box
        bgGradient="linear(to-r, #1d1d1e, #252528)"
        color="#fff"
        boxShadow="lg"
        transition={"all .5s ease-in-out"}
        py={"1.5rem"}
        px={"1rem"}
      >
        <Text className="font" fontWeight={"500"} fontSize={"1rem"} mb={"1rem"}>
          All Free Disliked Content
        </Text>
        {isLoading ? (
          <Text className="font" fontWeight={"600"} fontSize={"1rem"}>
            Loading...
          </Text>
        ) : (
          <Text className="font" fontWeight={"600"} fontSize={"1.5rem"}>
            {freeDislikedCount}
          </Text>
        )}
      </Box>
    </div>
  );
};

export default FreeDislike;
