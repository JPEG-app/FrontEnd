import React from 'react';
import StickyBox from 'react-sticky-box';

import List from '../List';
import FollowSuggestion from '../FollowSuggestion';
import News from '../News';

import {
  Container,
  SearchWrapper,
  SearchInput,
  SearchIcon,
  Body,
} from './styles';

const SideBar: React.FC = () => {
  return (
    <Container>
      <SearchWrapper>
        <SearchInput placeholder="Search JPEG" />
        <SearchIcon />
      </SearchWrapper>

      <StickyBox>
        <Body>
          <List
            title="You might like"
            elements={[
              <FollowSuggestion name="Wuldku Kizon" nickname="@wkizon" />,
              <FollowSuggestion name="Oriny Figash" nickname="@OrinyFi22" />,
              <FollowSuggestion name="Maxe Nenial" nickname="@maxe_nenial" />,
            ]}
          />

          <List
            title="What’s trending"
            elements={[
              <News
                header="News"
                topic="News Example 1"
              />,
              <News
                header="News"
                topic="News Example 2"
              />,
              <News 
                header="News" 
                topic="News Example 3" 
              />,
            ]}
          />
        </Body>
      </StickyBox>
    </Container>
  );
};

export default SideBar;
