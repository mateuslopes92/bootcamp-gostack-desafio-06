import React, { Component } from 'react';

import { WebView } from 'react-native-webview';


  export default function Repository({ navigation }) {
    const repository = navigation.getParam('repository');
    
    return <WebView source={{ uri: repository.html_url }} />;
  }
  
  Repository.navigationOptions = ({navigation}) => ({
    title: navigation.getParam('repository').name,
  });