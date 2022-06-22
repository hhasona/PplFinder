import React, { useEffect, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";
import {useInView} from "react-cool-inview";

const UserList = ({ users, isLoading, refreshUsers, fetchMoreUsers }) => {
  const [checked, setChecked] = useState([]);
  const [hoveredUserId, setHoveredUserId] = useState();
  const [favoriteUsers, setFavoriteUsers] = useState(
    localStorage.getItem("favoriteUsers")
      ? JSON.parse(localStorage.getItem("favoriteUsers"))
      : []
  );

  const { observe } = useInView({
    threshold: 0.5,
    onEnter: ({ unobserve }) => {
      unobserve();
      fetchMoreUsers && fetchMoreUsers();
    },
  });

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  const onCheckboxChange = (value) => {
    // [CA, US, FR]
    // checking if the value is already in the array
    if (checked.includes(value)) {
      setChecked(checked.filter((item) => item !== value));
    } else {
      setChecked([...checked, value]);
    }
  };

  const onFavoriteClick = (user) => {
    // checking if the user is already in the favorite list
    if (favoriteUsers.some((item) => item.email === user.email)) {
      setFavoriteUsers(favoriteUsers.filter((item) => item.email !== user.email));
    } else {
      setFavoriteUsers([...favoriteUsers, user]);
    }
  };

  useEffect(() => {
    // saving the favorite users in local storage
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsers));
    refreshUsers && refreshUsers(favoriteUsers);
  }, [favoriteUsers]);

  return (
    <S.UserList>
      <S.Filters>
        <CheckBox onChange={onCheckboxChange} value="BR" label="Brazil" />
        <CheckBox onChange={onCheckboxChange} value="AU" label="Australia" />
        <CheckBox onChange={onCheckboxChange} value="CA" label="Canada" />
        <CheckBox onChange={onCheckboxChange} value="DE" label="Germany" />
        <CheckBox onChange={onCheckboxChange} value="ES" label="Spain" />
        {/* adding Spain as a new checkbox to the list */}
      </S.Filters>
      <S.List>
        {users
          .filter((user) => checked.includes(user.nat) || !checked.length)
          .map((user, index) => {
            return (
              <S.User
                key={index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                ref={index === users.length - 1 ? observe : null}
              >
                <S.UserPicture src={user?.picture.large} alt="" />
                <S.UserInfo>
                  <Text size="22px" bold>
                    {user?.name.title} {user?.name.first} {user?.name.last}
                  </Text>
                  <Text size="14px">{user?.email}</Text>
                  <Text size="14px">
                    {user?.location.street.number} {user?.location.street.name}
                  </Text>
                  <Text size="14px">
                    {user?.location.city} {user?.location.country}
                  </Text>
                </S.UserInfo>
                <S.IconButtonWrapper
                  onClick={() => {
                    onFavoriteClick(user);
                  }}
                  isVisible={
                    index === hoveredUserId ||
                    favoriteUsers.some((item) => item.email === user.email)
                  }
                >
                  <IconButton>
                    <FavoriteIcon color="error" />
                  </IconButton>
                </S.IconButtonWrapper>
              </S.User>
            );
          })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>
  );
};

export default UserList;
