import { useState } from "react";
import { createStyles, Navbar } from "@mantine/core";
import {
  IconLogout,
  IconHome,
  IconNotebook,
  IconChartBar,
} from "@tabler/icons";
import { useLocation } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef("icon");
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: "flex",
      alignItems: "center",
      textDecoration: "none",
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      "&:hover": {
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === "dark" ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === "dark" ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === "dark"
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      "&, &:hover": {
        backgroundColor: theme.fn.variant({
          variant: "light",
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: "light", color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: "light",
            color: theme.primaryColor,
          }).color,
        },
      },
    },
  };
});

const data = [
  { link: "", label: "Home", icon: IconHome },
  { link: "", label: "Tracker", icon: IconNotebook },
  { link: "", label: "Overview", icon: IconChartBar },
];

type TestbarProps = {
  opened: boolean;
};

export function Testbar({ opened }: TestbarProps) {
  const { isAuthenticated, logout } = useAuth0();
  const location = useLocation();
  const { classes, cx } = useStyles();
  const [active, setActive] = useState(
    location.pathname === "/"
      ? "Home"
      : location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2)
  );

  const links = data.map((item) => (
    <a
      className={cx(classes.link, {
        [classes.linkActive]: item.label === active,
      })}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <Navbar hidden={!opened} height={840} width={{ sm: 300 }} p="md">
      <Navbar.Section grow>{links}</Navbar.Section>

      {isAuthenticated && (
        <Navbar.Section className={classes.footer}>
          <div
            className={classes.link}
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </div>
        </Navbar.Section>
      )}
    </Navbar>
  );
}
