import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {ActivityIndicator, View} from 'react-native';

import { Container, Header, Avatar, Name, Bio, Stars, Starred, OwnerAvatar, Title, Info, Author, Loading  } from './styles';

export default class User extends Component {
  static navigationOptions = ({navigation}) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = { 
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    })
   };

  state = {
    stars: [],
    loading: true,
    page: 1,
    refreshing: false
   };

  async componentDidMount(){
    this.load();
  }

  load = async (page = 1) => {
    const {stars} = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user'); 

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        page
      }
    });

    this.setState({ 
      stars: page >= 2 ? [...stars, ...response.data ] : response.data , 
      loading: false,
      page,
      refreshing: false
    });
  }

  loadMore = () => {
    const {page} = this.state;

    const nextPage = page + 1;

    this.load(nextPage)
  }

  refreshList = async () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  }
  
  handleNavigation = (repository) => {
    const { navigation } = this.props;

    navigation.navigate('Repository', {repository});
  }

  render(){ 
    const { navigation } = this.props;
    const { stars, loading } = this.state;
    const user  = navigation.getParam('user');

    return (
       <Container>
         <Header>
          <Avatar source={{uri: user.avatar}}/>
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
         </Header>
          {
            loading 
            ? <Loading />
            : (          
         <Stars 
         onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
         refreshing={this.state.refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
         onEndReachedThreshold={0.2} // Carrega mais itens quando chegar em 20% do fim
         onEndReached={this.loadMore} // Função que carrega mais itens
         data={stars}
         keyExtractor={star => String(star.id)}
         renderItem={({item}) => (
            <Starred onPress={() => this.handleNavigation(item)}>
              <OwnerAvatar source={{uri: item.owner.avatar_url}} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
         )}
         />
         )}
       </Container>
    )
  }
}