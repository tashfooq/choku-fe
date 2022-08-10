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
import { IconHome, IconTrack, IconTallymarks } from "@tabler/icons";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type ShellProps = {
  content: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  showNavbar?: boolean;
};

const Shell = ({
  content,
  showHeader = true,
  showFooter = true,
  showNavbar = true,
}: ShellProps) => {
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
      navbar={showNavbar ? <Sidebar opened={opened} /> : undefined}
      footer={
        <Footer height={60} p="md">
          Application footer
        </Footer>
      }
      header={
        showHeader ? (
          <Topbar opened={opened} setOpened={setOpened} />
        ) : undefined
      }
    >
      {content}
    </AppShell>
  );
};

export default Shell;
