import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Text,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { feedbackService } from "../services/FeedbackService";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
    validateForm();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value);
    validateForm();
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedback(e.currentTarget.value);
    validateForm();
  };

  const validateForm = () => {
    if (name.trim() !== " " && email.trim() !== " " && feedback.trim() !== " ") {
      setIsFormValid(true);
    }
    else {
      setIsFormValid(false);
    }
  }

  const submitFeedback = async () => {
    setIsSubmitted(true);
    await feedbackService.sendFeedback({ name, email, feedback });
  };

  return (
    <Center>
      <Stack>
        <Box w={600}>
          <Text>Give us feedback!</Text>
          <TextInput
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
            disabled={isSubmitted}
            required
            label="Name"
          ></TextInput>
          <TextInput
            mt={10}
            placeholder="email@gmail.com"
            value={email}
            onChange={handleEmailChange}
            disabled={isSubmitted}
            required
            label="Email"
          ></TextInput>
          <TextInput
            mt={10}
            placeholder="Your feedback is important to us!"
            value={feedback}
            onChange={handleFeedbackChange}
            disabled={isSubmitted}
            required
            label="Feedback"
          ></TextInput>
          <Button mt={10} onClick={submitFeedback} disabled={!isFormValid || isSubmitted}>
            {isSubmitted ? "Thank you for your feedback!" : "Submit"}
          </Button>
        </Box>
      </Stack>
    </Center>
  );
};

export default Feedback;
