import React, { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  ThemeIcon,
  Text,
  Title,
  MediaQuery,
  Burger,
  useMantineTheme,
} from "@mantine/core";
import { Link } from "react-router-dom";
import { Home, Track, Tallymarks} from "tabler-icons-react";

type ShellProps = {
  content: React.ReactNode;
};

const Shell = ({ content }: ShellProps) => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      fixed
      //the nav items can be a dumb component that takes link, label and icon as props
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="xl"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <div style={{display: "flex", alignItems: "center"}}>
          <ThemeIcon mr={10}>
            <Home />
          </ThemeIcon>
          <Text<typeof Link> component={Link} to="/">
            Home
          </Text>
          </div>
          <div style={{display: "flex", alignItems: "center", marginTop: 10}}>
          <ThemeIcon mr={10}>
            <Track />
          </ThemeIcon>
          <Text<typeof Link> component={Link} to="/tracker">
            Tracker
          </Text>
          </div>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <ThemeIcon mr={10} size="xl" variant="gradient" gradient={{from: 'purple', to: "cyan"}}>
              <Tallymarks />
            </ThemeIcon>
            <Title order={3}>Choku</Title>
          </div>
        </Header>
      }
    >
      {content}
    </AppShell>
  );
};

export default Shell;
