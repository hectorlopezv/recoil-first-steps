import { Container, Heading, Text } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
import axios from "axios";
import { Suspense, useState } from "react";
import {
  atom,
  useRecoilState,
  selector,
  useRecoilValue,
  selectorFamily,
} from "recoil";

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
      return userData;
    },
});
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
      </Select>
      {userId !== undefined && (
        <Suspense fallback={<div>...Loading 2</div>}>
          <UserData userId={userId} />
        </Suspense>
      )}
    </Container>
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
        </div>
      )}
    </>
  );
};
