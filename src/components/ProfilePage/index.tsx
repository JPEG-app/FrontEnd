import React from 'react';

import Feed from '../Feed';

import {
  Container,
  Banner,
  Avatar,
  ProfileData,
  EditButton,
  LocationIcon,
  CakeIcon,
  Followage,
} from './styles';

const ProfilePage: React.FC = () => {
  return (
    <Container>
      <Banner>
        <Avatar>
          <img
            src="public/pfp.jpg"
            alt="Dimitar Georgiev"
          />
        </Avatar>
      </Banner>

      <ProfileData>
        <EditButton outlined>Settings</EditButton>

        <h1>Dimitar Georgiev</h1>
        <h2>@gushtera</h2>

        <p>
          Student at{' '}
          {/* eslint-disable-next-line react/jsx-no-target-blank */}
          <a href="https://youtu.be/ftaXMKV3ffE?si=SkR4UDGP6gIz6vN8" target="_blank">
            @Fontys
          </a>
        </p>

        <ul>
          <li>
            <LocationIcon />
            Eindhoven, Netherlands
          </li>
          <li>
            <CakeIcon />
            Born on August 3, 2003
          </li>
        </ul>

        <Followage>
          <span>
            <strong>69 </strong>
            Following
          </span>
          <span>
            <strong>420 </strong>Followers
          </span>
        </Followage>
      </ProfileData>

      <Feed />
    </Container>
  );
};

export default ProfilePage;
