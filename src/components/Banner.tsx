import {
  createStyles,
  Title,
  Text,
  Button,
  Container,
  rem,
} from "@mantine/core";
import { useAuth0 } from "@auth0/auth0-react";

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: "relative",
    paddingTop: rem(120),
    paddingBottom: rem(80),

    [theme.fn.smallerThan("sm")]: {
      paddingTop: rem(80),
      paddingBottom: rem(60),
    },
  },

  inner: {
    position: "relative",
    zIndex: 1,
  },

  title: {
    textAlign: "center",
    fontWeight: 800,
    fontSize: rem(40),
    letterSpacing: -1,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    marginBottom: theme.spacing.xs,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      textAlign: "left",
    },
  },

  highlight: {
    color:
      theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6],
  },

  description: {
    textAlign: "center",

    [theme.fn.smallerThan("xs")]: {
      textAlign: "left",
      fontSize: theme.fontSizes.md,
    },
  },

  controls: {
    marginTop: theme.spacing.lg,
    display: "flex",
    justifyContent: "center",

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
    },
  },

  control: {
    "&:not(:first-of-type)": {
      marginLeft: theme.spacing.md,
    },

    [theme.fn.smallerThan("xs")]: {
      height: rem(42),
      fontSize: theme.fontSizes.md,

      "&:not(:first-of-type)": {
        marginTop: theme.spacing.md,
        marginLeft: 0,
      },
    },
  },
}));

const Banner = () => {
  const { classes } = useStyles();
  const { loginWithRedirect } = useAuth0();

  return (
    <Container className={classes.wrapper} size={1400}>
      <div className={classes.inner}>
        <Title className={classes.title}>
          A simple{" "}
          <Text component="span" className={classes.highlight} inherit>
            progress tracker
          </Text>{" "}
          for medical students
        </Title>

        <Container p={0} size={600}>
          <Text size="lg" color="dimmed" className={classes.description}>
            Stop using excel sheets and start tracking your progress with Choku
          </Text>
        </Container>

        <div className={classes.controls}>
          <Button
            className={classes.control}
            size="lg"
            variant="default"
            color="gray"
          >
            Learn more
          </Button>
          <Button
            onClick={() => loginWithRedirect()}
            className={classes.control}
            size="lg"
          >
            Login or Sign Up
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Banner;
