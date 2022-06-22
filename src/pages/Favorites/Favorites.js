import React from "react";
import UserList from "components/UserList";
import * as S from "./style";

// Adding the UserList component to the Favorites page
function Favorites() {
  const [users, setUsers] = React.useState(
    localStorage.getItem("favoriteUsers")
      ? JSON.parse(localStorage.getItem("favoriteUsers"))
      : []
  );

  React.useEffect(() => {
    localStorage.setItem("favoriteUsers", JSON.stringify(users));
  }, [users]);

  const refreshUsers = (newUsers) => {
    setUsers(newUsers);
  };
  return (
    <S.Home>
      <S.Content>
        <UserList users={users} refreshUsers={refreshUsers} />
      </S.Content>
    </S.Home>
  );
}

export default Favorites;
