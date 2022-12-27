import React from "react";
import {
  Burger,
  Header,
  MediaQuery,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { IconTallymarks } from "@tabler/icons";
import ChokuDots from "../choku_dots.svg";
// import ChokuDots from "../ChokuDots";

type TopbarProps = {
  opened: boolean;
  setOpened: (value: boolean | ((prev: boolean) => boolean)) => void;
};

const Topbar = ({ opened, setOpened }: TopbarProps) => {
  const theme = useMantineTheme();
  return (
    <Header height={70} p="md">
      <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
        <MediaQuery largerThan="sm" styles={{ display: "none" }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        {/* <ThemeIcon
          mr={10}
          size="xl"
          variant="gradient"
          gradient={{ from: "purple", to: "cyan" }}
        >
          <IconTallymarks />
        </ThemeIcon>
        <Title order={3}>Choku</Title> */}
        {/* <ChokuDots width="30" height="30" /> */}
        <img src={ChokuDots} width={100} alt="website logo" />
        {/* <ChokuDots width="288" height="288" /> */}
      </div>
    </Header>
  );
};

export default Topbar;
