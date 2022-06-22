import { useState, useEffect } from "react";
import axios from "axios";

export const usePeopleFetch = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    fetchUsers();
  }, []);

  // function that will fetch more users from the API when the user scrolls to the bottom of the page
  // every time the user scrolls to the bottom of the page, the page number will be increased by 1
  async function fetchMoreUsers() {
    setIsLoading(true);
    const { data } = await axios.get(
      `https://randomuser.me/api/?results=25&page=${page + 1}`
    );
    setPage(page + 1);
    setUsers([...users, ...data.results]);
    setIsLoading(false);
  }

  async function fetchUsers() {
    setIsLoading(true);
    const response = await axios.get(
      `https://randomuser.me/api/?results=25&page=${page}`
    );
    setIsLoading(false);
    setUsers(response.data.results);
  }

  return { users, isLoading, fetchUsers, fetchMoreUsers };
};
