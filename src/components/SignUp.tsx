import React, {useState} from "react";
import {
  Text,
  Box,
  Button,
  Center,
  PasswordInput,
  TextInput,
  Popover,
  Progress,
} from "@mantine/core";
import { IconCheck, IconX, IconAt } from "@tabler/icons";

const PasswordRequirement = ({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) => {
  return (
    <Text
      color={meets ? "teal" : "red"}
      sx={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
};

const styles = {
  formWrapper: {
    height: 400,
    width: 400,
  },
  inputSpacer: {
    marginTop: 10,
  },
  buttonStyle: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 10,
  },
};

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

const SignUp = () => {
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [password, setPassword] = useState("");
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(password)}
    />
  ));

  const getPassStrength = (password: string) => {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  };

  const strength = getPassStrength(password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  return (
    <Center>
      <div style={styles.formWrapper}>
        <TextInput label="First Name" style={styles.inputSpacer} />
        <TextInput label="Last Name" style={styles.inputSpacer} />
        <TextInput label="Email" style={styles.inputSpacer} icon={<IconAt size={14} />} />
        <Popover
          opened={popoverOpened}
          position="bottom"
          width="target"
          transition="pop"
        >
          <Popover.Target>
            <div
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
            >
              <PasswordInput
                required
                label="Your password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Progress
              color={color}
              value={strength}
              size={5}
              style={{ marginBottom: 10 }}
            />
            <PasswordRequirement
              label="Includes at least 6 characters"
              meets={password.length > 5}
            />
            {checks}
          </Popover.Dropdown>
        </Popover>
        <div style={styles.buttonStyle}>
          <Button>Sign Up</Button>
        </div>
      </div>
    </Center>
  );
};

export default SignUp;
