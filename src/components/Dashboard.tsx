import React, { useEffect } from "react";
import { Box, Center, Progress, Stack, Title } from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";
import { useTotalProgressPercentage } from "../common/queries";

const Dashboard = () => {
  const { getAccessTokenSilently, isLoading, isAuthenticated } = useAuth0();

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently();
        localStorage.setItem("token", token);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [isLoading, getAccessTokenSilently]);

  const { data: totalProgressPercentage } =
    useTotalProgressPercentage(isAuthenticated);
  console.log(totalProgressPercentage);

  return (
    <Center>
      <Stack>
        {totalProgressPercentage && (
          <Box w={800}>
            <Title order={5}>Total progression for selected materials:</Title>
            <Progress
              size={24}
              sections={[
                {
                  value: totalProgressPercentage,
                  color: "cyan",
                  label: "Done",
                },
                {
                  value: 100 - totalProgressPercentage,
                  color: "blue",
                  label: "Remaining",
                },
              ]}
            />
          </Box>
        )}
      </Stack>
    </Center>
  );
};

export default Dashboard;
