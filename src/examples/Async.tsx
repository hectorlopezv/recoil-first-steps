import { Container, Heading, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import axios from "axios";
import { Suspense, useState } from "react";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import {
  atom,
  useRecoilState,
  selector,
  useRecoilValue,
  selectorFamily,
  atomFamily,
  useSetRecoilState,
} from "recoil";
import { getWeather } from "../fakeApi";

interface response {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}
export const endPoint = (userId: number) =>
  `https://jsonplaceholder.typicode.com/users/${userId}`;

const userstate = selectorFamily({
  key: "userdata",
  get:
    (userId: number) =>
    async ({}) => {
      //caching selectors responses! with async
      //no refetching
      //async selector makes the component suspense
      const userData = await axios.get<response>(endPoint(userId));
      if (userId === 4) throw new Error("User does not exists");
      return userData;
    },
});

const weatherState = selectorFamily({
  key: "weatherdata",
  get:
    (userId: number) =>
    async ({ get }) => {
      get(weatherRequestIdState(userId));
      const user = get(userstate(userId));
      const weather = await getWeather(user.data.address.city);
      return weather;
    },
});
//refetch techinque

const weatherRequestIdState = atomFamily({
  key: "weatherRequestId",
  default: 0,
});

const useRefetchWeather = (userId: number) => {
  const setRequestId = useSetRecoilState(weatherRequestIdState(userId));
  return () => setRequestId((id) => id + 1);
};
export const Async = () => {
  const [userId, setUserId] = useState<undefined | number>(undefined);

  return (
    <Container py={10}>
      <Heading as="h1" mb={4}>
        View Profile
      </Heading>
      <Heading as="h2" size="md" mb={1}>
        Choose a user:
      </Heading>
      <Select
        placeholder="Choose a user"
        mb={4}
        value={userId}
        onChange={(event) => {
          const value = event.target.value;
          setUserId(value ? parseInt(value) : undefined);
        }}
      >
        <option value="1">User 1</option>
        <option value="2">User 2</option>
        <option value="3">User 3</option>
        <option value="4">User 4</option>
      </Select>
      {userId !== undefined && (
        <ErrorBoundary
          FallbackComponent={ErrorFallBack}
          onReset={() => {
            setUserId(undefined);
          }}
        >
          <Suspense fallback={<div>...Loading 2</div>}>
            <UserData userId={userId} />
          </Suspense>
        </ErrorBoundary>
      )}
    </Container>
  );
};
const ErrorFallBack = ({ error, resetErrorBoundary }: FallbackProps) => {
  return (
    <>
      return (
      <div role="alert">
        <p>Something went wrong:</p>
        <pre>{error.message}</pre>
        <button onClick={resetErrorBoundary}>Try again</button>
      </div>
    </>
  );
};
const UserData = ({ userId }: { userId: number }) => {
  const user = useRecoilValue(userstate(userId));

  return (
    <>
      {userId !== undefined && user !== undefined && (
        <div>
          <Heading as="h2" size="md" mb={1}>
            User data:
          </Heading>
          <Text>
            <b>Name:</b> {user?.data.name}
          </Text>
          <Text>
            <b>Phone:</b> {user?.data.phone}
          </Text>
          <Suspense fallback={<div>Loading 2.....</div>}>
            <Weather userId={userId} />
          </Suspense>
        </div>
      )}
    </>
  );
};
const Weather = ({ userId }: { userId: number }) => {
  const user = useRecoilValue(userstate(userId));
  const weather = useRecoilValue(weatherState(userId));
  const refresh = useRefetchWeather(userId);
  return (
    <>
      <Text>
        <b>Weather for {user.data.address.city}</b>
        {weather} C
      </Text>
      <button onClick={refresh}>refresh weather</button>
    </>
  );
};
