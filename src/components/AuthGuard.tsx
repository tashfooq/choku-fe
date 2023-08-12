import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType } from "react";
import { Loader } from "@mantine/core";

export const AuthenticationGuard = ({
  component,
}: {
  component: ComponentType;
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>
        <Loader />
      </div>
    ),
  });

  return <Component />;
};
