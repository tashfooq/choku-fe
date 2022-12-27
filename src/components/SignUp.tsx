import React, { useState } from "react";
import {
  Text,
  Box,
  Button,
  Center,
  PasswordInput,
  TextInput,
  Popover,
  Progress,
  Notification,
} from "@mantine/core";
import { IconCheck, IconX, IconAt } from "@tabler/icons";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/AuthService";

export type SignUpInput = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

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
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const getPassStrength = (password: string) => {
    let multiplier = password.length > 5 ? 0 : 1;

    requirements.forEach((requirement) => {
      if (!requirement.re.test(password)) {
        multiplier += 1;
      }
    });

    return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
  };

  const form = useForm<SignUpInput>({
    initialValues: { firstName: "", lastName: "", email: "", password: "" },
    // add validation for email here
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        getPassStrength(value) === 100 ? null : "Invalid Password",
    },
  });

  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(form.values.password)}
    />
  ));

  const strength = getPassStrength(form.values.password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";

  const register = async (formValues: SignUpInput) => {
    const test = await authService.register(formValues);
    if (test?.status === 201) {
      navigate("/login");
    } else {
      setErrorMsg("Email already exists!");
      setShowErrorNotification(true);
    }
  };

  return (
    <>
      {showErrorNotification && (
        <Notification
          icon={<IconX size={18} />}
          color="red"
          onClose={() => setShowErrorNotification(false)}
        >
          {errorMsg}
        </Notification>
      )}
      <Center>
        <div style={styles.formWrapper}>
          <form onSubmit={form.onSubmit((values) => register(values))}>
            <TextInput
              required
              label="First Name"
              style={styles.inputSpacer}
              {...form.getInputProps("firstName")}
            />
            <TextInput
              required
              label="Last Name"
              style={styles.inputSpacer}
              {...form.getInputProps("lastName")}
            />
            <TextInput
              required
              label="Email"
              style={styles.inputSpacer}
              icon={<IconAt size={14} />}
              {...form.getInputProps("email")}
            />
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
                    {...form.getInputProps("password")}
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
                  meets={form.values.password.length > 5}
                />
                {checks}
              </Popover.Dropdown>
            </Popover>
            <div style={styles.buttonStyle}>
              <Button type="submit">Sign Up</Button>
            </div>
          </form>
        </div>
      </Center>
    </>
  );
};

export default SignUp;
