import { useState } from "react";
import {
  Box,
  Button,
  Center,
  Text,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { feedbackService } from "../hooks/services/FeedbackService";

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitFeedback = async () => {
    setIsSubmitted(true);
    await feedbackService.sendFeedback({ name, email, feedback });
  };

  return (
    <Center>
      <Stack>
        <Box w={600}>
          <Text>Give us Feedback!</Text>
          <TextInput
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            disabled={isSubmitted}
            required
            label="Name"
          ></TextInput>
          <TextInput
            mt={10}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            disabled={isSubmitted}
            required
            label="Email"
          ></TextInput>
          <Textarea
            mt={10}
            label="Feedback"
            placeholder="Your feedback is important to us!"
            value={feedback}
            onChange={(e) => setFeedback(e.currentTarget.value)}
            disabled={isSubmitted}
            required
          ></Textarea>
          <Button mt={10} onClick={submitFeedback} disabled={isSubmitted}>
            {isSubmitted ? "Thank you for your feedback!" : "Submit"}
          </Button>
        </Box>
      </Stack>
    </Center>
  );
};

export default Feedback;
