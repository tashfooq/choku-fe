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
  const [feedback, setFeedback] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitFeedback = async () => {
    setIsSubmitted(true);
    await feedbackService.sendFeedback(feedback);
  };

  return (
    <Center>
      <Stack>
        <form onSubmit={submitFeedback}>
          <Box w={600}>
            <Text>Give us Feedback!</Text>
            <TextInput disabled={isSubmitted} required label="Name"></TextInput>
            <TextInput
              disabled={isSubmitted}
              required
              label="Email"
            ></TextInput>
            <Textarea
              placeholder="Your feedback is important to us!"
              value={feedback}
              onChange={(e) => setFeedback(e.currentTarget.value)}
              disabled={isSubmitted}
              required
            ></Textarea>
            <Button mt={10} type="submit" disabled={isSubmitted}>
              {isSubmitted ? "Thank you for your feedback!" : "Submit"}
            </Button>
          </Box>
        </form>
      </Stack>
    </Center>
  );
};

export default Feedback;
