import React, { useState } from "react";
import { AppShell, Footer, useMantineTheme, Center } from "@mantine/core";
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
      navbar={showNavbar ? <Sidebar opened={opened} /> : undefined}
      header={
        showHeader ? (
          <Topbar opened={opened} setOpened={setOpened} />
        ) : undefined
      }
      footer={
        showFooter ? (
          <Footer height={60} p="md">
            <Center>
              <a href="https://ko-fi.com/F1F8DOB6D" target="_blank">
                <img
                  height="36"
                  style={{ border: "0px", height: "36px" }}
                  src="https://cdn.ko-fi.com/cdn/kofi2.png?v=3"
                  alt="Buy Me a Coffee at ko-fi.com"
                />
              </a>
            </Center>
          </Footer>
        ) : undefined
      }
    >
      {content}
    </AppShell>
  );
};

export default Shell;
