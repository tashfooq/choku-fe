import React from "react";
import { Navbar, ThemeIcon, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconHome, IconTrack } from "@tabler/icons";

type NavbarProps = {
  opened: boolean;
};

const Sidebar = ({ opened }: NavbarProps) => {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="xl"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <ThemeIcon mr={10}>
          <IconHome />
        </ThemeIcon>
        <Text<typeof Link> component={Link} to="/">
          Home
        </Text>
      </div>
      <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
        <ThemeIcon mr={10}>
          <IconTrack />
        </ThemeIcon>
        <Text<typeof Link> component={Link} to="/tracker">
          Tracker
        </Text>
      </div>
    </Navbar>
  );
};

export default Sidebar;
